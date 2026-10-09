import { profile } from "../src/data.js";

// The letter's relay: the page posts here, on its own domain, and this passes
// the letter on to Web3Forms from Vercel's servers. Some networks can't reach
// Web3Forms at all (a block on its shared Cloudflare addresses), but anyone
// who can load the site can reach this.
//
// It takes JSON from src/page.js and answers in JSON, or an ordinary form
// post (no JavaScript) and answers by sending the visitor back to /#sent, or
// to /#unsent if the letter couldn't go.

const KEY = process.env.WEB3FORMS_KEY || profile.letterKey;
const ORIGINS = [/^https:\/\/kauswhynot(-[\w-]+)?\.vercel\.app$/, /^http:\/\/localhost(:\d+)?$/];

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

async function read(request) {
  const type = request.headers.get("content-type") || "";
  if (type.includes("application/json")) return { form: false, data: await request.json() };
  return { form: true, data: Object.fromEntries(await request.formData()) };
}

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

  const name = String(data.name || "").trim().slice(0, 100);
  const email = String(data.email || "").trim().slice(0, 200);
  const message = String(data.message || "").trim().slice(0, 4000);
  const regarding = String(data.regarding || "A letter").trim().slice(0, 40);
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || message.length < 10) {
    return reply(false, "Please write a few words, your name and an address to reply to.", 422);
  }

  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: KEY,
        subject: `${regarding}: a letter from ${name}`,
        from_name: name,
        name,
        email,
        replyto: email,
        regarding,
        message,
      }),
      signal: AbortSignal.timeout(10000),
    });
    const body = await res.json().catch(() => null);
    if (body?.success) return reply(true, "Sent.", 200);
    return reply(false, body?.message || `Web3Forms answered ${res.status}.`, 502);
  } catch {
    return reply(false, "Web3Forms couldn’t be reached.", 504);
  }
}
