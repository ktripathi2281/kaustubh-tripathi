import { ja } from "../ja.js";

// The Japanese on the site is decorative or glossed in English beside it, so
// screen readers skip it and read the English.

// A label set vertically, top to bottom.
export function VerticalLabel({ text }) {
  return (
    <span className="ja-label" lang="ja" aria-hidden="true">
      {text}
    </span>
  );
}

// A big title that turns to katakana: on hover, or once as it scrolls into
// view on a phone. The katakana sits over the English, sized to fit on one
// line, so nothing around it moves.
export function Title({ as: Tag, ja: kana, children, className = "", ...props }) {
  return (
    <Tag className={`bi ${className}`} {...props}>
      <span className="bi-en">{children}</span>
      <span className="bi-ja" lang="ja" aria-hidden="true" style={{ "--n": [...kana].length }}>
        {kana}
      </span>
    </Tag>
  );
}

// A small square seal holding one kanji numeral.
export function NumeralSeal({ numeral }) {
  return (
    <span className="seal seal--numeral" lang="ja" aria-hidden="true">
      {numeral}
    </span>
  );
}

// The name in katakana, in two vertical columns read right to left.
export function NameSeal() {
  return (
    <span className="seal seal--name" lang="ja" aria-hidden="true">
      {ja.seal.slice(0, 3)}
      <br />
      {ja.seal.slice(3)}
    </span>
  );
}
