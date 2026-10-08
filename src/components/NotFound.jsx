import Header from "./Header.jsx";
import { Horizon } from "./InkLine.jsx";

// Vercel serves 404.html for any address that isn't one: a single empty
// scene, the ink line running across it, and the way back.
export default function NotFound() {
  return (
    <>
      <Header home={false} />
      <main className="scene scene--lost">
        <div className="above">
          <p className="label">404</p>
          <h1 className="title">Not found</h1>
        </div>
        <Horizon seed={404} />
        <div className="below">
          <ul className="links">
            <li>
              <a href="/">Back to the works</a>
            </li>
          </ul>
        </div>
      </main>
    </>
  );
}
