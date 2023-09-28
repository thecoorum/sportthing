import { NextRequest, NextResponse } from "next/server";

import { verifyInitData } from "@/utils";
import { supabase } from "@/supabase";

export const GET = async (req: NextRequest) => {
  const tgWebAppData = req.headers.get("Web-App-Data");

  // const { location_id } = await req.json();

  const { success } = verifyInitData(tgWebAppData);

  if (success) {
    try {
      let query = supabase.from("locations").select("*");

      // if (location_id) {
      //   query = query.eq("id", location_id);
      // }

      const { data: locations, error } = await query;

      if (error) {
        return NextResponse.json({ error }, { status: 400 });
      }

      return NextResponse.json({ locations }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error }, { status: 400 });
    }
  }
};

export const POST = async (req: NextRequest) => {
  const tgWebAppData = req.headers.get("Web-App-Data");

  const { success } = verifyInitData(tgWebAppData);

  const data = await req.json()

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
  } else {
    return NextResponse.json(
      { message: "Invalid data provided" },
      { status: 400 }
    );
  }
};
