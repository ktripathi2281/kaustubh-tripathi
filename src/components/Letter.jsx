import { useEffect, useRef, useState } from "react";
import { profile } from "../data.js";

// Web3Forms delivers the letter to the inbox behind this public access key.
// Without one, "Seal and send" hands the finished letter to the visitor's own
// mail app instead, so the letter works either way.
const KEY = import.meta.env.VITE_WEB3FORMS_KEY || profile.letterKey || "";
const TOPICS = ["A role", "A collaboration", "A conversation"];
const BLANK = { message: "", name: "", email: "" };

const today = () => new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

// A letter to Kaustubh. Any link marked data-letter opens it in place of the
// mail app; the address itself stays on the page, visible and copyable.
export default function Letter() {
  const [open, setOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [state, setState] = useState("writing"); // writing | sending | sent | handed-off | error
  const [topic, setTopic] = useState(TOPICS[0]);
  const [form, setForm] = useState(BLANK);
  const [copied, setCopied] = useState(false);
  const [sentTo, setSentTo] = useState(BLANK);
  const dialog = useRef(null);
  const first = useRef(null);
  const returnTo = useRef(null);
  const leaveTimer = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      const link = e.target.closest?.("a[data-letter]");
      if (!link || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      returnTo.current = link;
      clearTimeout(leaveTimer.current);
      setLeaving(false);
      setCopied(false);
      setState((s) => (s === "writing" || s === "error" ? s : "writing"));
      setOpen(true);
    };
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      clearTimeout(leaveTimer.current);
    };
  }, []);

  function close() {
    clearTimeout(leaveTimer.current);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOpen(false);
      return;
    }
    setLeaving(true);
    leaveTimer.current = setTimeout(() => {
      setOpen(false);
      setLeaving(false);
    }, 240);
  }

  // While open: hold the page still, keep Tab inside the letter, close on Escape.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    root.classList.add("letter-open");
    const focus = setTimeout(() => (first.current ?? dialog.current)?.focus({ preventScroll: true }), 60);
    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key !== "Tab" || !dialog.current) return;
      const items = [...dialog.current.querySelectorAll("a[href], button:not([disabled]), input:not([tabindex='-1']), textarea")];
      if (!items.length) return;
      const [head, tail] = [items[0], items[items.length - 1]];
      if (e.shiftKey && document.activeElement === head) {
        e.preventDefault();
        tail.focus();
      } else if (!e.shiftKey && document.activeElement === tail) {
        e.preventDefault();
        head.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    const back = returnTo.current;
    return () => {
      clearTimeout(focus);
      root.classList.remove("letter-open");
      window.removeEventListener("keydown", onKey);
      back?.focus({ preventScroll: true });
    };
  }, [open]);

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

  if (!open) return null;

  return (
    <div
      className={`letter-backdrop${leaving ? " is-leaving" : ""}`}
      onMouseDown={(e) => e.target === e.currentTarget && close()}
    >
      <div className="letter" role="dialog" aria-modal="true" aria-labelledby="letter-title" ref={dialog} tabIndex={-1}>
        <button type="button" className="letter-close" onClick={close}>
          Close
        </button>

        {state === "sent" ? (
          <div className="letter-done" aria-live="polite">
            <svg className="envelope" viewBox="0 0 160 110" aria-hidden="true">
              <rect x="8" y="12" width="144" height="88" rx="3" pathLength="1" />
              <path d="M8 15 L80 66 L152 15" pathLength="1" />
              <path d="M8 97 L62 54 M152 97 L98 54" pathLength="1" />
              <circle className="envelope-seal" cx="80" cy="66" r="11" />
            </svg>
            <h2 id="letter-title" className="letter-dear">
              Sealed and sent.
            </h2>
            <p className="letter-note">
              Thank you{sentTo.name.trim() ? `, ${sentTo.name.trim()}` : ""}. I’ll write back
              {sentTo.email.trim() ? ` to ${sentTo.email.trim()}` : ""} soon.
            </p>
            <button type="button" className="letter-link" onClick={close}>
              Return to the catalogue
            </button>
          </div>
        ) : state === "handed-off" ? (
          <div className="letter-done" aria-live="polite">
            <h2 id="letter-title" className="letter-dear">
              Over to your mail app.
            </h2>
            <p className="letter-note">
              Your letter should now be open there, addressed and ready to send. If nothing opened, the address is{" "}
              <strong>{profile.email}</strong>.
            </p>
            <p className="letter-alt">
              <button type="button" className="letter-link" onClick={copyAddress}>
                {copied ? "Address copied" : "Copy the address"}
              </button>
              <span aria-hidden="true">·</span>
              <button type="button" className="letter-link" onClick={() => setState("writing")}>
                Back to the letter
              </button>
            </p>
          </div>
        ) : (
          <form className="letter-form" onSubmit={send}>
            <p className="letter-date mono">Correspondence · {today()}</p>
            <h2 id="letter-title" className="letter-dear">
              Dear Kaustubh,
            </h2>

            <fieldset className="letter-topics">
              <legend className="mono">Regarding</legend>
              {TOPICS.map((t) => (
                <label key={t} className={`letter-topic${topic === t ? " is-on" : ""}`}>
                  <input type="radio" name="topic" value={t} checked={topic === t} onChange={() => setTopic(t)} />
                  {t}
                </label>
              ))}
            </fieldset>

            <label className="visually-hidden" htmlFor="letter-message">
              Your letter
            </label>
            <textarea
              id="letter-message"
              ref={first}
              className="letter-body"
              rows={7}
              required
              minLength={10}
              maxLength={4000}
              placeholder="Write as much or as little as you like…"
              {...field("message")}
            />

            <p className="letter-closing">Yours,</p>
            <label className="letter-sign">
              <span className="visually-hidden">Your name</span>
              <input type="text" required maxLength={100} autoComplete="name" placeholder="Your name" {...field("name")} />
            </label>
            <label className="letter-reply">
              <span className="mono">Reply to</span>
              <input type="email" required maxLength={200} autoComplete="email" placeholder="you@example.com" {...field("email")} />
            </label>

            <input type="checkbox" name="botcheck" className="letter-trap" tabIndex={-1} autoComplete="off" aria-hidden="true" />

            {state === "error" && (
              <p className="letter-error" role="alert">
                The letter couldn’t be sent just now. Your words are still here: try again, or use your own mail below.
              </p>
            )}

            <div className="letter-foot">
              <button type="submit" className="letter-seal" disabled={state === "sending"}>
                <span className="letter-wax" aria-hidden="true">
                  K<span>·</span>T
                </span>
                <span className="letter-seal-label">{state === "sending" ? "Sending…" : "Seal and send"}</span>
              </button>
              <p className="letter-alt">
                <a href={`mailto:${profile.email}`}>Use your own mail</a>
                <span aria-hidden="true">·</span>
                <button type="button" className="letter-link" onClick={copyAddress}>
                  {copied ? "Address copied" : "Copy the address"}
                </button>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
