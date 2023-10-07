import { NextRequest, NextResponse } from "next/server";

import { verifyInitData } from "@/utils";
import { supabase } from "@/supabase";

export const POST = async (req: NextRequest) => {
  const tgWebAppData = req.headers.get("Web-App-Data");

  const { success, user } = verifyInitData(tgWebAppData);

  if (success && user) {
    const { data, error } = await supabase.rpc("get_or_create_user", {
      requestor_id: user.id,
      name: [user.first_name, user.last_name].filter(Boolean).join(" "),
      username: user.username
    });

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ user: data }, { status: 200 });
  }

  return NextResponse.json(
    { message: "Invalid data provided" },
    { status: 400 }
  );
};
