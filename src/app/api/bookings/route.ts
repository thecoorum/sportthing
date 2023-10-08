import { NextRequest, NextResponse } from 'next/server';

import { verifyInitData } from "@/utils";
import { supabase } from "@/supabase";

export const GET = async (req: NextRequest) => {
  const tgWebAppData = req.headers.get("Web-App-Data");

  const { success, user } = verifyInitData(tgWebAppData);

  const data = await req.json();
}