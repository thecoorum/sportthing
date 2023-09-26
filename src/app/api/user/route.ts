import { NextRequest, NextResponse } from "next/server";

import { verifyInitData } from "@/utils";
import { supabase } from "@/supabase";

export const POST = async (req: NextRequest) => {
  const tgWebAppData = req.headers.get('Web-App-Data');

  const { success, user } = verifyInitData(tgWebAppData);

  if (success && user) {
    const { data: serverUser } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    // No user found in the database, create one and return
    if (!serverUser) {
      const { data: newUser, error } = await supabase
        .from("users")
        .insert({
          id: user.id,
          name: [user.first_name, user.last_name].filter(Boolean).join(" "),
          username: user.username,
          role: "user",
        })
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error }, { status: 400 });
      }

      return NextResponse.json({ success, user: newUser }, { status: 200 });
    }

    // User found in the database, return it
    return NextResponse.json({ success, user: serverUser }, { status: 200 });
  }

  return NextResponse.json(
    { message: "Invalid data provided" },
    { status: 400 }
  );
};
