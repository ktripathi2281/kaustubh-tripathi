import { useEffect, useState } from "react";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import { Label, NotesList, WorksTable } from "./Sheet.jsx";
import { projects } from "../data.js";

// Vercel serves this page for any address that isn't one. It says so plainly,
// and lists everything that is on the sheet.
export default function NotFoundPage() {
  // Prerendered once for every address, so the address itself fills in later.
  const [path, setPath] = useState(null);

  useEffect(() => {
    let p = window.location.pathname;
    try {
      p = decodeURI(p);
    } catch {
      /* a malformed address: show it as typed */
    }
    setPath(p);
  }, []);

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div className="page">
        <div className="sheet">
          <Header home={false} />

          <main id="main" className="grid">
            <section className="cell span-12 lost" aria-labelledby="lost-title">
              <Label n="404" as="p">
                Not found
              </Label>
              <h1 id="lost-title">Nothing at this address</h1>
              <p className="prose">
                {path ? (
                  <>
                    There’s nothing at <code className="lost-path">{path}</code>.
                  </>
                ) : (
                  "There’s nothing here."
                )}{" "}
                The link may be old or mistyped. <a href="/">Return to the datasheet</a>, or go straight to one of the
                pages below.
              </p>
            </section>

            <section className="cell span-6" aria-labelledby="lost-works">
              <Label n={1} id="lost-works">
                Selected works
              </Label>
              <WorksTable projects={projects} first={3} base="/" />
            </section>

            <section className="cell span-6" aria-labelledby="lost-notes">
              <Label n={2} id="lost-notes">
                Application notes
              </Label>
              <NotesList />
            </section>
          </main>

          <Footer />
        </div>
      </div>
    </>
  );
}
