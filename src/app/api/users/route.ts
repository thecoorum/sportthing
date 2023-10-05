import { NextRequest, NextResponse } from "next/server";

import { verifyInitData } from "@/utils";
import { supabase } from "@/supabase";

export const GET = async (req: NextRequest) => {
  const tgWebAppData = req.headers.get("Web-App-Data");

  const { success, user } = verifyInitData(tgWebAppData);

  if (success && user) {
    const { data: users, error } = await supabase.rpc("get_users", {
      requestor_id: user.id,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ users }, { status: 200 });
  }

  return NextResponse.json(
    { message: "Invalid data provided" },
    { status: 400 }
  );
};
