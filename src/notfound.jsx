import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Letter from "./components/Letter.jsx";
import { profile, projects } from "./data.js";
import "./styles.css";

// Vercel serves this page for any address that isn't one. It says so plainly,
// and the footer below lists everything that is on show.
function NotFound() {
  let path = window.location.pathname;
  try {
    path = decodeURI(path);
  } catch {
    /* a malformed address: show it as typed */
  }

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header plates={projects} email={profile.email} home={false} />

      <main id="main" className="lost">
        <header className="essay-head">
          <p className="mono essay-kicker">404 · Not found</p>
          <h1>Not in the catalogue</h1>
          <p className="essay-sub">
            There’s nothing at <code className="lost-path">{path}</code>. The link may be old or mistyped; everything
            on show is listed below.
          </p>
          <p className="lost-links">
            <a href="/">
              Return to the catalogue
              <span className="arrow" aria-hidden="true">
                →
              </span>
            </a>
          </p>
        </header>
      </main>

      <Footer home={false} />
      <Letter />
    </>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <NotFound />
  </StrictMode>
);
