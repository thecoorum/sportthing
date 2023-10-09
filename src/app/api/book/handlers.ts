import { NextResponse } from "next/server";

import { supabase } from "@/supabase";

import { format } from "date-fns";

import { Tables } from "@/database.extensions";

type Props = {
  booking: Tables<"bookings"> & {
    user_name: string;
    activity_name: string;
  };
  userId: number;
  employeeId: number;
  activityId: number;
};

export const handleSendBookingMessage = async (props: Props) => {
  const body = new FormData();

  body.append("chat_id", String(props.employeeId));
  body.append(
    "text",
    `${props.booking.user_name} booked "${
      props.booking.activity_name
    }" on ${format(new Date(props.booking.booking_date), "MMMM do, yyyy")} at ${
      props.booking.start_time
    }`
  );

  const messageRequest = await fetch(
    `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      body,
    }
  );

  if (!messageRequest.ok) {
    return NextResponse.json({ error: messageRequest }, { status: 500 });
  }
};

export const handleConfirmBooking = async (props: Props) => {
  const { error } = await supabase
    .from("bookings")
    .update({ status: "confirmed" })
    .eq("id", props.booking.id);

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  const body = new FormData();

  body.append("chat_id", String(props.booking.user_id));
  body.append(
    "text",
    `You successfully booked "${props.booking.activity_name}" on ${format(
      new Date(props.booking.booking_date),
      "MMMM do, yyyy"
    )} at ${props.booking.start_time}. We will be waiting for you!`
  );

  const messageRequest = await fetch(
    `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      body,
    }
  );

  if (!messageRequest.ok) {
    return NextResponse.json({ error: messageRequest }, { status: 500 });
  }
};

export const handleSendPaymentMessage = async (
  props: Props & {
    paymentToken: string;
  }
) => {
  const { data, error } = await supabase
    .from("activities")
    .select("name, price")
    .eq("id", props.activityId)
    .single();

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  const body = new FormData();

  body.append("chat_id", String(props.booking.user_id));
  body.append("title", "Payment for booking");
  body.append(
    "description",
    "You need to pay for your booking in order to confirm it. You have 15 minutes to pay. If you don't pay in time, your booking will be cancelled. To proceed with payment, enter the following card credentials: 4242 4242 4242 4242"
  );
  body.append("payload", `booking_id=${props.booking.id}`);
  body.append("provider_token", props.paymentToken);
  body.append("currency", "USD");
  body.append(
    "prices",
    JSON.stringify([
      {
        label: data.name,
        amount: data.price,
      },
    ])
  );

  const messageRequest = await fetch(
    `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendInvoice`,
    {
      method: "POST",
      body,
    }
  );

  if (!messageRequest.ok) {
    return NextResponse.json({ error: messageRequest }, { status: 500 });
  }
};
