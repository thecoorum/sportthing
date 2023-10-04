import { NextRequest, NextResponse } from "next/server";

import { parse } from "url";

import { verifyInitData } from "@/utils";
import { supabase } from "@/supabase";

export const GET = async (req: NextRequest) => {
  const tgWebAppData = req.headers.get("Web-App-Data");

  const { query } = parse(req.url, true);

  const { success } = verifyInitData(tgWebAppData);

  if (success) {
    try {
      let queryBuilder = supabase
        .from("activities")
        .select("*, coach:coaches(*), location:locations(*)");

      if (query.location_id) {
        queryBuilder = queryBuilder.eq("location_id", query.location_id);
      }

      if (query.coach_id) {
        queryBuilder = queryBuilder.eq("coach_id", query.coach_id);
      }

      const { data: activities, error } = await queryBuilder;

      if (error) {
        return NextResponse.json({ error }, { status: 400 });
      }

      return NextResponse.json({ activities }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error }, { status: 400 });
    }
  }

  return NextResponse.json(
    { message: "Invalid data provided" },
    { status: 400 }
  );
};

export const POST = async (req: NextRequest) => {
  const tgWebAppData = req.headers.get("Web-App-Data");

  const { name, description, location_id, coach_id, duration, price } =
    await req.json();

  const { success, user } = verifyInitData(tgWebAppData);

  if (success) {
    try {
      const { data: activity, error } = await supabase.rpc("create_activity", {
        user_id: user?.id,
        activity_name: name,
        activity_description: description,
        location_id: location_id,
        activity_duration: duration,
        activity_price: price,
        coach_id: coach_id,
      });

      if (error) {
        return NextResponse.json({ error }, { status: 400 });
      }

      return NextResponse.json({ activity }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error }, { status: 400 });
    }
  }

  return NextResponse.json(
    { message: "Invalid data provided" },
    { status: 400 }
  );
};
