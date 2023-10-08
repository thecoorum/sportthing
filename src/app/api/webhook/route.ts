import { NextRequest, NextResponse } from "next/server";

import { supabase } from "@/supabase";

import { Bot } from "grammy";
import { format } from "date-fns";

export const POST = async (req: NextRequest) => {
  try {
    const bot = new Bot(process.env.BOT_TOKEN!);

    bot.on(":successful_payment", async (ctx) => {
      const params = new URLSearchParams(
        ctx.update.message?.successful_payment.invoice_payload
      );

      const bookingId = params.get("booking_id");

      if (bookingId) {
        try {
          const { data, error } = await supabase
            .from("bookings")
            .update({ status: "confirmed" })
            .eq("id", bookingId)
            .select("*, activity:activities(name)")
            .single();

          if (error) {
            await ctx.reply("Something went wrong, please try again later.");
          }

          await ctx.reply(
            `We received your payment for "${data.activity.name}" on ${format(
              new Date(data.booking_date),
              "MMMM do, yyyy"
            )} at ${data.start_time}. We will be waiting for you!`
          );
        } catch (error) {
          console.error(error);
        }
      }
    });

    bot.on("pre_checkout_query", async (ctx) => {
      try {
        await ctx.answerPreCheckoutQuery(true);
      } catch (error) {
        console.error(error);
      }
    });

    bot.start();

    return NextResponse.json({ message: "Hello World!" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};
