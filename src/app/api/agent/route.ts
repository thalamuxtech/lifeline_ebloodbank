import { NextResponse } from "next/server";
import { z } from "zod";

const Schema = z.object({
  text: z.string().min(1),
  locale: z.enum(["en", "ha", "yo", "ig", "pcm"]).default("en"),
});

// Lightweight rule-based agent for the local demo.
// Swap with Anthropic Claude / OpenAI tool-calling in production via fetch.
export async function POST(req: Request) {
  const parsed = Schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const { text, locale } = parsed.data;
  const lower = text.toLowerCase();

  const greet: Record<string, string> = {
    en: "Hi! ", ha: "Sannu! ", yo: "Bawo! ", ig: "Ndewo! ", pcm: "How far! ",
  };

  let reply = "";
  if (/(donate|donor|funni|nye|bayar)/i.test(lower)) {
    reply =
      greet[locale] +
      "Great — head to /donate to register. Takes 60 seconds, phone-only. After that we'll only call when your blood type is needed nearby.";
  } else if (/(request|need|find|choo|beere|nemo|find blood)/i.test(lower)) {
    reply =
      "To request blood, open /request and submit the patient's blood group, hospital and urgency. We match donors within 8 km in under a minute.";
  } else if (/(eligible|eligibility|can i|inwere|fit donate)/i.test(lower)) {
    reply =
      "Most healthy adults 18–65, weighing 50 kg+, who haven't donated in the last 3 months are eligible. Try the eligibility quiz at /eligibility.";
  } else if (/(hospital|inventory|stock|unit)/i.test(lower)) {
    reply = "Hospitals can view live stock at /hospital — including ABO×Rh×expiry heat-map and request kanban.";
  } else if (/(sms|ussd|call|phone|voice)/i.test(lower)) {
    reply =
      "No internet? Text BLOOD to 5050, dial *565*5050#, or call 0800-LIFELINE. We speak English, Hausa, Yoruba, Igbo, and Pidgin.";
  } else if (/(thanks|thank|na gode|e se|daalu)/i.test(lower)) {
    reply = "Anytime. Every drop is a lifeline. ❤";
  } else {
    reply =
      greet[locale] +
      "I'm LifeLine's assistant. Ask me about donating, requesting blood, eligibility, or reaching us by SMS/call.";
  }

  // Simulate latency
  await new Promise((r) => setTimeout(r, 350));
  return NextResponse.json({ reply });
}
