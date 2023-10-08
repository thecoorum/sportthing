import { NextRequest, NextResponse } from "next/server";

import { verifyInitData } from "@/utils";
import { supabase } from "@/supabase";

import {
  handleSendBookingMessage,
  handleSendConfirmationMessage,
  handleSendPaymentMessage,
} from "./handlers";

export const POST = async (req: NextRequest) => {
  const tgWebAppData = req.headers.get("Web-App-Data");

  const { success, user } = verifyInitData(tgWebAppData);

  const data = await req.json();

  if (success && user) {
    try {
      const { data: booking, error } = await supabase.rpc("book_activity", {
        requestor_id: user.id,
        p_employee_id: data.employee_id,
        p_activity_id: data.activity_id,
        p_date: data.date,
        p_start_time: data.timeslot,
      });

      if (error) {
        return NextResponse.json({ error }, { status: 400 });
      }

      const handlersPayload = {
        booking,
        employeeId: data.employee_id,
        userId: user.id,
        activityId: data.activity_id,
      };

      await Promise.all([
        handleSendBookingMessage(handlersPayload),
        // handleSendConfirmationMessage(handlersPayload),
      ]);

      await handleSendPaymentMessage({
        ...handlersPayload,
        paymentToken: process.env.BOT_PAYMENT_TOKEN,
      });

      return NextResponse.json({ booking }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error }, { status: 400 });
    }
  }

  return NextResponse.json(
    { message: "Invalid data provided" },
    { status: 400 }
  );
};
