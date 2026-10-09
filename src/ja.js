// Every Japanese string on the site, and nothing else. Each one is decorative
// or shown with its English beside it, so Japanese never carries information
// on its own. scripts/subset-fonts.mjs builds the Japanese font from exactly
// these characters, so a string added here needs `npm run fonts` afterwards.

export const ja = {
  works: "作品集", // sakuhinshū, "Selected works"
  worksShort: "作品", // sakuhin, "Works": the header
  inProgress: "開発中", // kaihatsu-chū, "In progress"
  background: "経歴", // keireki, "Background"
  contact: "連絡先", // renrakusaki, "Contact"
  reading: "読み物", // yomimono, "Reading"
  seal: "カウストゥブ", // Kausutubu, the name seal
  send: "送", // okuru, "send": the seal on the letter's send button, beside "Seal and send"
};

// The big titles, in katakana: how Japanese writes names, by their sound.
// Each one shows on hover, or once as it scrolls into view on a phone.
export const titles = {
  name: "カウストゥブ・トリパティ", // Kausutubu Toripati
  kavach: "カヴァチ", // Kavachi
  deepresearch: "ディープリサーチ", // Dīpu Risāchi
  loopdetector: "ループディテクター", // Rūpu Ditekutā
  leetcode: "リートコード・エージェント・トラッカー", // Rītokōdo Ējento Torakkā
  tollgate: "トールゲート", // Tōrugēto
  rideradar: "ライドレーダー", // Raido Rēdā
  skillbarter: "スキルバーター", // Sukiru Bātā
};

// The numeral seals on the seven project scenes, in order.
export const numerals = ["一", "二", "三", "四", "五", "六", "七"];
