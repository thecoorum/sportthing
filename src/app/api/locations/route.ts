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
        .from("locations")
        .select("*", { count: "exact" });

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

      const { data: locations, count, error } = await queryBuilder;

      if (error) {
        return NextResponse.json({ error }, { status: 400 });
      }

      return NextResponse.json({ locations, count }, { status: 200 });
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

  const { success } = verifyInitData(tgWebAppData);

  const data = await req.json();

  if (success) {
    try {
      const { data: location, error } = await supabase
        .from("locations")
        .insert(data)
        .select("*")
        .single();

      if (error) {
        return NextResponse.json({ error }, { status: 400 });
      }

      return NextResponse.json({ location }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error }, { status: 400 });
    }
  }

  return NextResponse.json(
    { message: "Invalid data provided" },
    { status: 400 }
  );
};
