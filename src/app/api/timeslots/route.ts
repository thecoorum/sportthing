import { NextRequest, NextResponse } from "next/server";

import { verifyInitData } from "@/utils";
import { supabase } from "@/supabase";

export const POST = async (req: NextRequest) => {
  const tgWebAppData = req.headers.get("Web-App-Data");

  const { success } = verifyInitData(tgWebAppData);

  const data = await req.json();

  console.log(data.date)

  if (success) {
    try {
      const { data: timeslots, error } = await supabase.rpc("get_timeslots", {
        p_activity_id: data.activity_id,
        p_employee_id: data.employee_id,
        p_date: data.date,
      });

      if (error) {
        return NextResponse.json({ error }, { status: 400 });
      }

      return NextResponse.json({ timeslots }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error }, { status: 400 });
    }
  }

  return NextResponse.json(
    { message: "Invalid data provided" },
    { status: 400 }
  );
};
