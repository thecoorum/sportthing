import { NextRequest, NextResponse } from "next/server";

import { parse } from "url";

import { verifyInitData } from "@/utils";
import { supabase } from "@/supabase";

export const GET = async (req: NextRequest) => {
  const tgWebAppData = req.headers.get("Web-App-Data");

  const { query } = parse(req.url, true);

  const { success, user } = verifyInitData(tgWebAppData);

  if (success && user) {
    try {
      let queryBuilder = supabase
        .from("bookings")
        .select("*, activity:activities(*)")
        .eq("user_id", user.id)
        .order("booking_date", { ascending: true });

      if (query.page && query.per) {
        const from = (Number(query.page) - 1) * Number(query.per);
        const to = from + Number(query.per);

        queryBuilder = queryBuilder.range(from, to);
      } else if (query.per) {
        queryBuilder = queryBuilder.limit(Number(query.per));
      } else if (query.page) {
        const from = (Number(query.page) - 1) * 10;
        const to = from + 10;

        queryBuilder = queryBuilder.range(from, to);
      }

      if (query.from) {
        queryBuilder = queryBuilder
          .gte("booking_date", query.from)
          .gt("start_time", query.from);
      }

      if (query["status[]"] && Array.isArray(query["status[]"])) {
        queryBuilder = queryBuilder.in("status", query["status[]"]);
      }

      if (query.status) {
        queryBuilder = queryBuilder.eq("status", query.status);
      }

      const { data: bookings, error } = await queryBuilder;

      if (error) {
        return NextResponse.json({ error }, { status: 400 });
      }

      return NextResponse.json({ bookings });
    } catch (error) {
      return NextResponse.json({ error }, { status: 400 });
    }
  }

  return NextResponse.json(
    {
      message: "Invalid data provided",
    },
    { status: 400 }
  );
};
