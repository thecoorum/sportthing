import { NextRequest, NextResponse } from "next/server";

import { verifyInitData } from "@/utils";
import { supabase } from "@/supabase";

export const GET = async (req: NextRequest) => {
  const tgWebAppData = req.headers.get("Web-App-Data");

  const id = req.url.split("/").at(-1);

  const { success, user } = verifyInitData(tgWebAppData);

  if (success && user) {
    try {
      const { data: serverUser, error } = await supabase.rpc("get_user", {
        requestor_id: user.id,
        user_id: id,
      });

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

export const POST = async (req: NextRequest) => {
  const tgWebAppData = req.headers.get("Web-App-Data");

  const id = req.url.split("/").at(-1);

  const { success } = verifyInitData(tgWebAppData);

  const data = await req.json();

  if (success) {
    try {
      const { data: serverUser, error } = await supabase.rpc("update_user", {
        requestor_id: id,
        requestor_name: data.name,
        requestor_username: data.username,
        requestor_description: data.description,
        operating_rules: data.operating_rules,
      });

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
