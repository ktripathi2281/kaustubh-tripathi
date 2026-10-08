import { useState } from "react";
import { profile } from "../data.js";

// Web3Forms delivers the letter to the inbox behind this public access key.
// Without one, "Send" hands the finished letter to the visitor's own mail app
// instead, so the letter works either way.
const KEY = import.meta.env.VITE_WEB3FORMS_KEY || profile.letterKey || "";
const TOPICS = ["A role", "A collaboration", "A conversation"];
const BLANK = { message: "", name: "", email: "" };

// A letter to Kaustubh, set in the Contact section. Without JavaScript the
// form posts straight to Web3Forms, so it still sends.
export default function Letter() {
  const [state, setState] = useState("writing"); // writing | sending | sent | handed-off | error
  const [topic, setTopic] = useState(TOPICS[0]);
  const [form, setForm] = useState(BLANK);
  const [copied, setCopied] = useState(false);
  const [sentTo, setSentTo] = useState(BLANK);

  const field = (name) => ({
    name,
    value: form[name],
    onChange: (e) => setForm((f) => ({ ...f, [name]: e.target.value })),
  });

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  async function send(e) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    // Bots fill in the hidden box; people never see it.
    if (data.get("botcheck")) {
      setSentTo(form);
      setState("sent");
      return;
    }
    const subject = `${topic}: a letter from ${form.name.trim()}`;

    if (!KEY) {
      const body = `${form.message.trim()}\n\n${form.name.trim()}\n${form.email.trim()}`;
      window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setState("handed-off");
      return;
    }

    setState("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: KEY,
          subject,
          from_name: form.name.trim(),
          name: form.name.trim(),
          email: form.email.trim(),
          replyto: form.email.trim(),
          regarding: topic,
          message: form.message.trim(),
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.success) throw new Error(json.message || `HTTP ${res.status}`);
      setSentTo(form);
      setForm(BLANK);
      setState("sent");
    } catch {
      setState("error");
    }
  }

  const copy = (
    <button type="button" className="text-button" onClick={copyAddress}>
      {copied ? "Address copied" : "Copy the address"}
    </button>
  );

  if (state === "sent") {
    return (
      <div className="letter-done" aria-live="polite">
        <p className="letter-dear">Sent.</p>
        <p>
          Thank you{sentTo.name.trim() ? `, ${sentTo.name.trim()}` : ""}. I’ll write back
          {sentTo.email.trim() ? ` to ${sentTo.email.trim()}` : ""} soon.
        </p>
        <p>
          <button type="button" className="text-button" onClick={() => setState("writing")}>
            Write another letter
          </button>
        </p>
      </div>
    );
  }

  if (state === "handed-off") {
    return (
      <div className="letter-done" aria-live="polite">
        <p className="letter-dear">Over to your mail app.</p>
        <p>
          Your letter should now be open there, addressed and ready to send. If nothing opened, the address is{" "}
          <strong>{profile.email}</strong>.
        </p>
        <p className="letter-alt">
          {copy}
          <button type="button" className="text-button" onClick={() => setState("writing")}>
            Back to the letter
          </button>
        </p>
      </div>
    );
  }

  return (
    <form
      className="letter"
      onSubmit={send}
      action={KEY ? "https://api.web3forms.com/submit" : undefined}
      method="post"
    >
      {KEY && <input type="hidden" name="access_key" value={KEY} />}
      <p className="letter-dear">Dear Kaustubh,</p>

      <fieldset className="letter-row letter-topics">
        <legend className="letter-key">Regarding</legend>
        <div className="letter-choices">
          {TOPICS.map((t) => (
            <label key={t} className="letter-topic">
              <input type="radio" name="topic" value={t} checked={topic === t} onChange={() => setTopic(t)} />
              <span>{t}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="letter-row">
        <label className="letter-key" htmlFor="letter-message">
          Letter
        </label>
        <textarea
          id="letter-message"
          rows={7}
          required
          minLength={10}
          maxLength={4000}
          placeholder="Write as much or as little as you like…"
          {...field("message")}
        />
      </div>

      <div className="letter-row">
        <label className="letter-key" htmlFor="letter-name">
          Yours,
        </label>
        <input
          id="letter-name"
          type="text"
          required
          maxLength={100}
          autoComplete="name"
          placeholder="Your name"
          {...field("name")}
        />
      </div>

      <div className="letter-row">
        <label className="letter-key" htmlFor="letter-email">
          Reply to
        </label>
        <input
          id="letter-email"
          type="email"
          required
          maxLength={200}
          autoComplete="email"
          placeholder="you@example.com"
          {...field("email")}
        />
      </div>

      <input type="checkbox" name="botcheck" className="letter-trap" tabIndex={-1} autoComplete="off" aria-hidden="true" />

      {state === "error" && (
        <p className="letter-error" role="alert">
          The letter couldn’t be sent just now. Your words are still here: try again, or use your own mail below.
        </p>
      )}

      <div className="letter-foot">
        <button type="submit" className="letter-send" disabled={state === "sending"}>
          {state === "sending" ? "Sending…" : "Send"}
        </button>
        <p className="letter-alt">
          <a href={`mailto:${profile.email}`}>Use your own mail</a>
          {copy}
        </p>
      </div>
    </form>
  );
}
