import fs from 'fs';
import pw from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pw;

const data = JSON.parse(fs.readFileSync(new URL('./ideas.json', import.meta.url)));
// evals.json（61要素の文字列配列・カード番号順）があれば「Claude評価付き」版として出力する
let evals = null;
try { evals = JSON.parse(fs.readFileSync(new URL('./evals.json', import.meta.url))); } catch {}

// flatten to a single list, carrying category
const flat = [];
for (const g of data.groups) for (const it of g.ideas) flat.push({ ...it, cat: g.name });

// chunk into pairs (2 per A4 page)
const pages = [];
for (let i = 0; i < flat.length; i += 2) pages.push(flat.slice(i, i + 2));

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const catColor = {
  '1': '#1d6fb8', '2': '#7a3aa8', '3': '#0f8a6a',
  '4': '#b8791d', '5': '#b83a5a', '6': '#3a5ab8', '7': '#5a6a2a'
};
const cText = c => catColor[c.trim()[0]] || '#444';

let n = 0;
const cardHtml = it => {
  n++;
  const ev = evals ? evals[n - 1] : null;
  return `
  <div class="card">
    <div class="cat" style="color:${cText(it.cat)};border-color:${cText(it.cat)}">${esc(it.cat)}</div>
    <div class="title"><span class="num">${String(n).padStart(2,'0')}</span>${esc(it.title)}</div>
    <div class="desc">${esc(it.desc)}</div>
    <div class="src"><span class="srclbl">同一と判断し統合した案</span>${esc(it.src)}</div>
    ${ev ? `<div class="eval"><span class="evlbl">Claude評価</span>${esc(ev)}</div>` : ''}
  </div>`;
};

const total = flat.length;
const pageHtml = (cards, idx) => `
  <section class="page">
    <div class="phead">
      <div class="pt">廃棄物処理ボイラ 腐食対策アイデア 統合版${evals ? '（Claude評価付き）' : ''}</div>
      <div class="pn">${idx + 1} / ${pages.length}</div>
    </div>
    ${cards.map(cardHtml).join('')}
    ${cards.length === 1 ? '<div class="card empty"></div>' : ''}
  </section>`;

const cover = `
  <section class="page cover">
    <div class="cov-wrap">
      <div class="cov-kicker">TECHNICAL MEMO ／ アイデア統合資料${evals ? '（Claude評価付き）' : ''}</div>
      <h1>廃棄物処理ボイラ<br>腐食対策アイデア 統合版</h1>
      <div class="cov-sub">4つの提案書（ChatGPT 50案・Fable 18案・Gemini 20案・Opus 30案）を<br>内容の同一性のみで突き合わせ、かぶりを一つに統一</div>
      <div class="cov-box">
        <div class="cov-row"><span>統合前</span><b>合計 118 案</b><i>ChatGPT 50 ／ Fable 18 ／ Gemini 20 ／ Opus 30</i></div>
        <div class="cov-row"><span>統合後</span><b>${total} 案</b><i>重複を統一（A4 1枚あたり2案・全 ${pages.length} ページ）</i></div>
      </div>
      <div class="cov-note">
        本資料は「内容の是非・優劣は評価せず、記述している対象が同一かどうか」だけを基準に、
        4資料をまたいで重複する案を1つのカードに統合したものです。各カード末尾の
        「同一と判断し統合した案」に、統合元の出典を明記しています。技術の呼称・原理の説明は
        統合元の記述を合成しており、数値等は各案の代表値です。
      </div>
      ${evals ? `<div class="cov-eval"><b>本版について：</b>各カード末尾に、この色（赤字）で統一した「Claude評価」ブロックを追記しています。元の統合文・出典表記には一切手を加えていません。評価は実現性・費用対効果・優先度に関するAIの参考意見であり、最終判断は実機条件での検証を前提としてください。</div>` : ''}
      <div class="cov-cats">
        <div>分類：</div>
        <span style="color:${catColor['1']}">■ 計測</span>
        <span style="color:${catColor['2']}">■ AI・データ解析</span>
        <span style="color:${catColor['3']}">■ 化学・添加剤</span>
        <span style="color:${catColor['4']}">■ クリーニング</span>
        <span style="color:${catColor['5']}">■ 燃焼・運転</span>
        <span style="color:${catColor['6']}">■ 材料・コーティング</span>
        <span style="color:${catColor['7']}">■ 構造・システム</span>
      </div>
    </div>
  </section>`;

const html = `<!doctype html><html lang="ja"><head><meta charset="utf-8">
<style>
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; font-family: "IPAGothic", "IPAPGothic", sans-serif; color: #1a1a1a; }
  @page { size: A4; margin: 0; }
  .page {
    width: 210mm; height: 297mm; padding: 14mm 15mm 12mm;
    display: flex; flex-direction: column; page-break-after: always; position: relative;
  }
  .phead { display: flex; justify-content: space-between; align-items: baseline;
    border-bottom: 1.5px solid #333; padding-bottom: 3mm; margin-bottom: 5mm; }
  .pt { font-size: 10.5pt; font-weight: bold; letter-spacing: .5px; color: #333; }
  .pn { font-size: 9pt; color: #888; }
  .card {
    flex: 1; border: 1px solid #d5d5d5; border-radius: 3mm; padding: 7mm 7mm;
    margin-bottom: 5mm; display: flex; flex-direction: column; justify-content: center;
    overflow: hidden; background: #fdfdfd;
  }
  .card:last-child { margin-bottom: 0; }
  .card.empty { border: 1px dashed #e2e2e2; background: transparent; }
  .cat { align-self: flex-start; font-size: 8pt; font-weight: bold; border: 1px solid;
    border-radius: 2mm; padding: 1mm 2.5mm; margin-bottom: 3.5mm; }
  .title { font-size: 13.5pt; font-weight: bold; line-height: 1.4; margin-bottom: 3.5mm; color: #111; }
  .num { display: inline-block; color: #bbb; font-size: 11pt; margin-right: 2.5mm; }
  .desc { font-size: 10pt; line-height: 1.72; text-align: justify; color: #2a2a2a; }
  .src { margin-top: 5mm; padding-top: 3mm; border-top: 1px dotted #ccc;
    font-size: 8.5pt; color: #666; line-height: 1.5; }
  .srclbl { display: inline-block; background: #eee; color: #555; font-weight: bold;
    border-radius: 1.5mm; padding: .5mm 2mm; margin-right: 2.5mm; font-size: 8pt; }
  .eval { margin-top: 3.5mm; padding: 3mm 3.5mm; background: #fbf0f0;
    border-left: 1.2mm solid #c62828; border-radius: 1mm;
    font-size: 9.5pt; line-height: 1.65; color: #c62828; text-align: justify; }
  .evlbl { display: inline-block; font-weight: bold; border: 1px solid #c62828;
    border-radius: 1.5mm; padding: .3mm 2mm; margin-right: 2.5mm; font-size: 8pt; }

  .cover { justify-content: center; }
  .cov-wrap { padding: 0 6mm; }
  .cov-kicker { font-size: 10pt; letter-spacing: 3px; color: #1d6fb8; font-weight: bold; margin-bottom: 6mm; }
  .cover h1 { font-size: 30pt; line-height: 1.35; margin: 0 0 8mm; color: #111; letter-spacing: 1px; }
  .cov-sub { font-size: 12pt; line-height: 1.7; color: #555; margin-bottom: 10mm; }
  .cov-box { border: 1.5px solid #333; border-radius: 3mm; padding: 6mm 7mm; margin-bottom: 8mm; }
  .cov-row { display: flex; align-items: baseline; gap: 5mm; padding: 2.5mm 0; }
  .cov-row + .cov-row { border-top: 1px solid #e0e0e0; }
  .cov-row span { width: 20mm; font-size: 10pt; color: #888; }
  .cov-row b { font-size: 16pt; width: 40mm; }
  .cov-row i { font-size: 9.5pt; color: #777; font-style: normal; }
  .cov-note { font-size: 9.5pt; line-height: 1.85; color: #555; text-align: justify;
    background: #f6f6f6; border-radius: 2mm; padding: 5mm 6mm; margin-bottom: 7mm; }
  .cov-eval { font-size: 9.5pt; line-height: 1.8; color: #c62828; text-align: justify;
    border: 1px solid #c62828; border-radius: 2mm; padding: 4mm 5mm; margin-bottom: 7mm; }
  .cov-cats { font-size: 9.5pt; display: flex; flex-wrap: wrap; gap: 4mm; align-items: center; }
  .cov-cats div { color: #333; font-weight: bold; }
  .cov-cats span { font-weight: bold; }
</style></head><body>
${cover}
${pages.map(pageHtml).join('')}
</body></html>`;

const outHtml = new URL('./out.html', import.meta.url).pathname;
fs.writeFileSync(outHtml, html);

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('file://' + outHtml, { waitUntil: 'networkidle' });
await page.pdf({
  path: new URL('./out.pdf', import.meta.url).pathname,
  format: 'A4', printBackground: true,
  margin: { top: 0, bottom: 0, left: 0, right: 0 }
});
await browser.close();
console.log('done. ideas=' + total + ' pages(content)=' + pages.length + ' +cover, evals=' + (evals ? 'yes' : 'no'));
