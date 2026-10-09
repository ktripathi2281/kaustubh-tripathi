import { profile } from "../data.js";
import { ja } from "../ja.js";

const TOPICS = ["A role", "A collaboration", "A conversation"];

// A letter to Kaustubh, written on the page and emailed to him by the site's
// own relay, api/letter.js, through Resend. With JavaScript, src/page.js sends
// it in place, falling back to Web3Forms (the public key in data.js) and then
// to the visitor's mail app; without, the form posts to the relay, which
// returns the visitor to /#sent or /#unsent.
export default function Letter() {
  return (
    <>
      <form className="letter" action="/api/letter" method="POST" aria-labelledby="letter-title" data-letter data-key={profile.letterKey} data-to={profile.email}>
        {/* Bots fill in the hidden box; people never see it. */}
        <input type="checkbox" name="botcheck" className="letter-trap" tabIndex={-1} autoComplete="off" aria-hidden="true" />

        <p className="label">Or write to me here</p>
        <p className="letter-dear" id="letter-title">
          Dear Kaustubh,
        </p>

        <fieldset className="letter-topics">
          <legend className="label">Regarding</legend>
          <div>
            {TOPICS.map((topic, i) => (
              <label key={topic} className="letter-topic">
                <input type="radio" name="regarding" value={topic} defaultChecked={i === 0} />
                {topic}
              </label>
            ))}
          </div>
        </fieldset>

        <label className="visually-hidden" htmlFor="letter-message">
          Your letter
        </label>
        <textarea
          id="letter-message"
          name="message"
          rows={6}
          required
          minLength={10}
          maxLength={4000}
          placeholder="Write as much or as little as you like…"
        />

        <p className="letter-closing">Yours,</p>
        <div className="letter-from">
          <label className="letter-field">
            <span className="label">Your name</span>
            <input type="text" name="name" required maxLength={100} autoComplete="name" />
          </label>
          <label className="letter-field">
            <span className="label">Reply to</span>
            <input type="email" name="email" required maxLength={200} autoComplete="email" placeholder="you@example.com" />
          </label>
        </div>

        <button type="submit" className="letter-send">
          <span className="send-seal" lang="ja" aria-hidden="true">
            {ja.send}
          </span>
          <span className="letter-send-label">Seal and send</span>
        </button>
        <p className="letter-status" role="status" aria-live="polite" />

        {/* Shown in place of the letter once it is sent (src/page.js). */}
        <div className="letter-done" tabIndex={-1}>
          <span className="send-seal" lang="ja" aria-hidden="true">
            {ja.send}
          </span>
          <div>
            <p className="letter-dear">Sealed and sent.</p>
            <p className="letter-note" />
          </div>
        </div>
      </form>

      {/* Without JavaScript, the relay returns the visitor to one of these. */}
      <p className="letter-sent" id="sent">
        Sealed and sent. Thank you; I’ll write back soon.
      </p>
      <p className="letter-sent" id="unsent">
        The letter couldn’t be sent just now. Please write to me at <a href={`mailto:${profile.email}`}>{profile.email}</a>.
      </p>
    </>
  );
}
