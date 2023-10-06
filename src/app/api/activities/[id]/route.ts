import { NextRequest, NextResponse } from "next/server";

import { verifyInitData } from "@/utils";
import { supabase } from "@/supabase";

export const GET = async (req: NextRequest) => {
  const tgWebAppData = req.headers.get("Web-App-Data");

  const id = req.url.split("/").at(-1);

  const { success } = verifyInitData(tgWebAppData);

  if (success) {
    try {
      const { data: activity, error } = await supabase
        .from("activities")
        .select("*, coach:employees(*), location:locations(*)")
        .eq("id", id)
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

export const POST = async (req: NextRequest) => {
  const tgWebAppData = req.headers.get("Web-App-Data");

  const { success } = verifyInitData(tgWebAppData);

  const data = await req.json();

  if (success) {
    try {
      const { data: activity, error } = await supabase
        .from("activities")
        .update(data)
        .eq("id", data.id)
        .select("*, coach:employees(*), location:locations(*)")
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

export const DELETE = async (req: NextRequest) => {
  const tgWebAppData = req.headers.get("Web-App-Data");

  const id = req.url.split("/").at(-1);

  const { success } = verifyInitData(tgWebAppData);

  if (success) {
    try {
      const { data: activity, error } = await supabase
        .from("activities")
        .delete()
        .eq("id", id);

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
