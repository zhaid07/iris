// Server-only — do not import in client components

import twilio from "twilio";

const MAX_SMS_LENGTH = 1600;

function getTwilioConfig(): {
  accountSid: string;
  authToken: string;
  fromNumber: string;
} | null {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;

  if (
    !accountSid ||
    accountSid === "YOUR_VALUE_HERE" ||
    !authToken ||
    authToken === "YOUR_VALUE_HERE" ||
    !fromNumber ||
    fromNumber === "YOUR_VALUE_HERE"
  ) {
    return null;
  }

  return { accountSid, authToken, fromNumber };
}

export async function sendBriefing(
  phoneNumber: string,
  briefingText: string,
): Promise<void> {
  const trimmedPhone = phoneNumber?.trim();

  if (!trimmedPhone) {
    console.error("SMS send skipped: phone number is missing or empty");
    return;
  }

  const config = getTwilioConfig();

  if (!config) {
    console.error("SMS send skipped: Twilio credentials not configured");
    return;
  }

  const body = briefingText.slice(0, MAX_SMS_LENGTH);

  try {
    const client = twilio(config.accountSid, config.authToken);

    await client.messages.create({
      body,
      from: config.fromNumber,
      to: trimmedPhone,
    });

    console.log("Briefing SMS sent successfully");
  } catch (error) {
    console.error("Failed to send briefing SMS:", error);
  }
}
