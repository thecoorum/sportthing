import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import crypto from "crypto";

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
