import { profile } from "../src/data.js";

// The letter's relay: the page posts here, on its own domain, and this sends
// the letter on as an email through Resend, from Vercel's servers. Anyone who
// can load the site can reach this, whatever their network blocks.
//
// It needs a Resend API key in the project's environment (RESEND_API_KEY).
// Sent from Resend's shared address, letters can only go to the inbox of the
// Resend account itself, which is the point: they all come to Kaustubh.
// (Web3Forms, which the page tries next, refuses letters sent from a server.)
//
// It takes JSON from src/page.js and answers in JSON, or an ordinary form
// post (no JavaScript) and answers by sending the visitor back to /#sent, or
// to /#unsent if the letter couldn't go.

const KEY = process.env.RESEND_API_KEY;
const TO = process.env.LETTER_TO || profile.email;
const FROM = process.env.LETTER_FROM || "Letters from the site <onboarding@resend.dev>";
const ORIGINS = [/^https:\/\/kauswhynot(-[\w-]+)?\.vercel\.app$/, /^http:\/\/localhost(:\d+)?$/];

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

async function read(request) {
  const type = request.headers.get("content-type") || "";
  if (type.includes("application/json")) return { form: false, data: await request.json() };
  return { form: true, data: Object.fromEntries(await request.formData()) };
}

// One line, at most `max` long: no line breaks can reach the subject.
const line = (value, max) => String(value || "").replace(/\s+/g, " ").trim().slice(0, max);

export async function POST(request) {
  const origin = request.headers.get("origin");
  if (origin && !ORIGINS.some((allowed) => allowed.test(origin))) return json({ success: false, message: "Not from this site." }, 403);

  let form = false;
  let data;
  try {
    ({ form, data } = await read(request));
  } catch {
    return json({ success: false, message: "That letter couldn’t be read." }, 400);
  }
  const reply = (ok, message, status) =>
    form ? Response.redirect(new URL(ok ? "/#sent" : "/#unsent", request.url), 303) : json({ success: ok, message }, status);

  // Bots fill in the hidden box; they are told it went.
  if (data.botcheck) return reply(true, "Sent.", 200);

  const name = line(data.name, 100);
  const email = line(data.email, 200);
  const regarding = line(data.regarding || "A letter", 40);
  const message = String(data.message || "").trim().slice(0, 4000);
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || message.length < 10) {
    return reply(false, "Please write a few words, your name and an address to reply to.", 422);
  }
  if (!KEY) return reply(false, "The letter box isn’t set up yet.", 503);

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: FROM,
        to: [TO],
        reply_to: email,
        subject: `${regarding}: a letter from ${name}`,
        text: `${message}\n\n${name}\n${email}`,
      }),
      signal: AbortSignal.timeout(10000),
    });
    const body = await res.json().catch(() => null);
    if (res.ok && body?.id) return reply(true, "Sent.", 200);
    return reply(false, body?.message || `Resend answered ${res.status}.`, 502);
  } catch {
    return reply(false, "Resend couldn’t be reached.", 504);
  }
}
