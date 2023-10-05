import { NextRequest, NextResponse } from "next/server";

import { verifyInitData } from "@/utils";
import { supabase } from "@/supabase";

export const POST = async (req: NextRequest) => {
  const tgWebAppData = req.headers.get("Web-App-Data");

  const id = req.url.split("/").at(-1);

  const { success } = verifyInitData(tgWebAppData);

  const data = await req.json();

  if (success) {
    try {
      const { data: serverUser, error } = await supabase
        .from('users')
        .update(data)
        .eq("id", id)
        .single();

      if (error) {
        return NextResponse.json({ error }, { status: 400 });
      }

      return NextResponse.json({ user: serverUser }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error }, { status: 400 });
    }
  }

  return NextResponse.json(
    { message: "Invalid data provided" },
    { status: 400 }
  );
};
