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
        const { data, error } = await supabase
          .from("bookings")
          .update({ status: "confirmed" })
          .eq("id", bookingId)
          .select("*, activity:activities(name)")
          .single();

        if (error) {
          console.log(error);

          ctx.reply("Something went wrong, please try again later.");
        }

        ctx.reply(
          `We received your payment for "${data.activity.name}" on ${format(
            new Date(data.booking_date),
            "MMMM do, yyyy"
          )} at ${data.start_time}. We will be waiting for you!`
        );
      }
    });

    bot.on("pre_checkout_query", async (ctx) => {
      const params = new URLSearchParams(ctx.preCheckoutQuery.invoice_payload);

      const bookingId = params.get("booking_id");

      if (bookingId) {
        const { data, error } = await supabase
          .from("bookings")
          .select("status")
          .eq("id", bookingId)
          .single();

        if (error) {
          console.log(error);

          ctx.reply(
            "We were unable to fetch your booking, please try again later"
          );
        }

        if (data?.status !== "pending") {
          let message = "";

          switch (data?.status) {
            case "confirmed":
              message = "Booking already confirmed";
              break;
            case "cancelled":
              message = "You booking was cancelled";
              break;
          }

          ctx.answerPreCheckoutQuery(false, {
            error_message: message,
          });

          return;
        }

        ctx.answerPreCheckoutQuery(true);
      }

      ctx.answerPreCheckoutQuery(
        false,
        "Something went wrong, please try again later."
      );
    });

    bot.on("message", (ctx) => {
      ctx.reply(
        "Hey! I'm just a bot with a set of predefined commands, so I can't really talk with you at the moment. Please use the the mini app button at the bottom left to book your next activity."
      );
    });

    bot.start();

    return NextResponse.json({ message: "Hello World!" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};
