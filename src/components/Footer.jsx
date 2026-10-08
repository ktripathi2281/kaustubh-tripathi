import { profile } from "../data.js";
import { BUILD_DATE, Ext } from "./Sheet.jsx";

export default function Footer() {
  return (
    <footer className="cell footer">
      <p>
        © {BUILD_DATE.slice(0, 4)} {profile.name}
      </p>
      <p className="footer-meta">
        <Ext href={profile.source}>Source</Ext>
        <span>
          Built <time dateTime={BUILD_DATE}>{BUILD_DATE}</time>
        </span>
      </p>
    </footer>
  );
}
