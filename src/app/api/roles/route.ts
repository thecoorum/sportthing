import { NextRequest, NextResponse } from "next/server";

import { verifyInitData } from "@/utils";
import { supabase } from "@/supabase";

export const POST = async (req: NextRequest) => {
  const tgWebAppData = req.headers.get("Web-App-Data");

  const { success, user } = verifyInitData(tgWebAppData);

  const data = await req.json();

  if (success) {
    try {
      const { data: role, error } = await supabase
        .rpc("update_role", {
          requestor_id: user?.id,
          ...data,
        })
        .select("*")
        .single();

      if (error) {
        return NextResponse.json({ error }, { status: 400 });
      }

      return NextResponse.json({ user: role }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error }, { status: 400 });
    }
  }

  return NextResponse.json(
    { message: "Invalid data provided" },
    { status: 400 }
  );
}