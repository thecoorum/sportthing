import { NextRequest, NextResponse } from "next/server";

import { verifyInitData } from "@/utils";
import { supabase } from "@/supabase";

export const GET = async (req: NextRequest) => {
  const tgWebAppData = req.headers.get("Web-App-Data");

  const id = req.url.split("/").at(-1);

  const { success } = verifyInitData(tgWebAppData);

  if (success) {
    try {
      const { data: employee, error } = await supabase
        .from("employees")
        .select("*, activities(*), location:locations(*), user:users!inner(*)")
        .eq("id", id)
        .single();

      if (error) {
        return NextResponse.json({ error }, { status: 400 });
      }

      return NextResponse.json({ employee }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error }, { status: 400 });
    }
  }

  return NextResponse.json(
    { message: "Invalid data provided" },
    { status: 400 }
  );
};
