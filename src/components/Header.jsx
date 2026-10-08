import { profile } from "../data.js";
import { ja } from "../ja.js";

const nav = [
  { href: "#kavach", en: "Works", ja: ja.worksShort },
  { href: "#about", en: "About", ja: ja.background },
  { href: "#contact", en: "Contact", ja: ja.contact },
];

// The top of the page, mounted like the top of a hanging scroll: the name, the
// three ways in, each with its Japanese above it, and a double rule beneath.
export default function Header({ home = true }) {
  const base = home ? "" : "/";
  return (
    <header className="site-header">
      <a className="header-name" href={home ? "#opening" : "/"}>
        {profile.name}
      </a>
      <nav className="header-nav" aria-label="Primary">
        {nav.map((item) => (
          <a key={item.en} href={`${base}${item.href}`}>
            <span className="nav-ja" lang="ja" aria-hidden="true">
              {item.ja}
            </span>
            <span className="nav-en">{item.en}</span>
          </a>
        ))}
      </nav>
    </header>
  );
}
