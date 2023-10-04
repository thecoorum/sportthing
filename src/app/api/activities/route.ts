import { NextRequest, NextResponse } from "next/server";

import { verifyInitData } from "@/utils";
import { supabase } from "@/supabase";

export const GET = async (req: NextRequest) => {
  const tgWebAppData = req.headers.get("Web-App-Data");

  const { success } = verifyInitData(tgWebAppData);

  if (success) {
    try {
      const { data: activities, error } = await supabase
        .from("activities")
        .select('*, coach:coaches(*), location:locations(*)');

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
  const user = req.headers.get("User");

  const { success } = verifyInitData(tgWebAppData);

  if (success) {
    try {
      const { role } = JSON.parse(user || "");

      if (role !== "admin") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }

      const { data: activity, error } = await supabase
        .from("activities")
        .insert(req.body)
        .select("*")
        .single();

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
