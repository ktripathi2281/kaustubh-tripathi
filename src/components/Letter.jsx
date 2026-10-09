import { profile } from "../data.js";
import { ja } from "../ja.js";

const TOPICS = ["A role", "A collaboration", "A conversation"];

// A letter to Kaustubh, written on the page. Web3Forms delivers it to the
// inbox behind the public key in data.js. With JavaScript, src/page.js sends
// it in place and shows the reply; without, the form posts as an ordinary
// form and Web3Forms returns the visitor to /#sent, which shows the note.
export default function Letter() {
  return (
    <>
      <form className="letter" action="https://api.web3forms.com/submit" method="POST" aria-labelledby="letter-title" data-letter>
        <input type="hidden" name="access_key" value={profile.letterKey} />
        <input type="hidden" name="subject" value="A letter from your portfolio" />
        <input type="hidden" name="from_name" value={profile.site.replace(/^https?:\/\//, "")} />
        <input type="hidden" name="redirect" value={`${profile.site}/#sent`} />
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

      {/* Without JavaScript, Web3Forms returns the visitor here. */}
      <p className="letter-sent" id="sent">
        Sealed and sent. Thank you; I’ll write back soon.
      </p>
    </>
  );
}
