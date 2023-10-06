import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import crypto from "crypto";
import { FilterFn } from "@tanstack/react-table";
import { rankItem } from "@tanstack/match-sorter-utils";

type User = {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  photo_url: string;
  is_premium: boolean;
} | null;

type VerifyResponse = {
  success: boolean;
  user: User;
};

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const verifyInitData = (
  telegramInitData: string | null
): VerifyResponse => {
  if (!telegramInitData) return { success: false, user: null };

  const urlParams = new URLSearchParams(telegramInitData);

  const hash = urlParams.get("hash");
  urlParams.delete("hash");
  urlParams.sort();

  let dataCheckString = "";

  for (const [key, value] of urlParams.entries()) {
    dataCheckString += `${key}=${value}\n`;
  }

  dataCheckString = dataCheckString.slice(0, -1);

  const secret = crypto
    .createHmac("sha256", "WebAppData")
    .update(process.env.BOT_TOKEN || "");
  const calculatedHash = crypto
    .createHmac("sha256", secret.digest())
    .update(dataCheckString)
    .digest("hex");

  if (calculatedHash === hash) {
    return { success: true, user: JSON.parse(urlParams.get("user") || "") };
  }

  return { success: false, user: null };
};

export const generateTimes = ({
  from,
  till,
}: { from?: string; till?: string } = {}) => {
  const times = [];
  const [fromHour, fromMinute] = !!from ? from.split(":").map(Number) : [0, 0];
  const [tillHour, tillMinute] = !!till ? till.split(":").map(Number) : [24, 0];

  for (let i = fromHour; i <= tillHour; i++) {
    const startMinute = i === fromHour ? fromMinute + 30 : 0;
    const endMinute = i === tillHour ? tillMinute : 60;

    for (let j = startMinute; j < endMinute; j += 30) {
      const hour = i < 10 ? `0${i}` : `${i}`;
      const minute = j === 0 ? "00" : `${j}`;

      times.push(`${hour}:${minute}`);
    }
  }

  return times;
};

export const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);

  addMeta({
    itemRank,
  });

  return itemRank.passed;
};
