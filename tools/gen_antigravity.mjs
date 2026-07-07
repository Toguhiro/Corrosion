import fs from 'fs';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);

function loadPlaywright() {
  const candidates = [
    'playwright',
    process.env.PLAYWRIGHT_CJS,
    process.env.USERPROFILE
      ? `${process.env.USERPROFILE}/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/.pnpm/playwright@1.60.0/node_modules/playwright/index.js`
      : null,
    '/opt/node22/lib/node_modules/playwright/index.js',
  ].filter(Boolean);

  for (const candidate of candidates) {
    try {
      return require(candidate);
    } catch {}
  }
  throw new Error('Playwright was not found. Install it with npm i playwright or set PLAYWRIGHT_CJS.');
}

const { chromium } = loadPlaywright();

const here = new URL('.', import.meta.url);
const pathOf = relative => fileURLToPath(new URL(relative, here));

const data = JSON.parse(fs.readFileSync(pathOf('./ideas.json'), 'utf8'));
const claudeEvals = JSON.parse(fs.readFileSync(pathOf('./evals.json'), 'utf8'));
const chatgptEvals = JSON.parse(fs.readFileSync(pathOf('./chatgpt_evals.json'), 'utf8'));
const antigravityEvals = JSON.parse(fs.readFileSync(pathOf('./antigravity_evals.json'), 'utf8'));

const flat = [];
for (const group of data.groups) {
  for (const idea of group.ideas) flat.push({ ...idea, cat: group.name });
}

if (claudeEvals.length !== flat.length) {
  throw new Error(`Claude eval count mismatch: ${claudeEvals.length} for ${flat.length} ideas`);
}
if (chatgptEvals.length !== flat.length) {
  throw new Error(`ChatGPT eval count mismatch: ${chatgptEvals.length} for ${flat.length} ideas`);
}
if (antigravityEvals.length !== flat.length) {
  throw new Error(`Antigravity eval count mismatch: ${antigravityEvals.length} for ${flat.length} ideas`);
}

const pages = [];
for (let i = 0; i < flat.length; i += 2) pages.push(flat.slice(i, i + 2));

const esc = s => String(s)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');

const catColor = {
  '1': '#1d6fb8',
  '2': '#7a3aa8',
  '3': '#0f8a6a',
  '4': '#b8791d',
  '5': '#b83a5a',
  '6': '#3a5ab8',
  '7': '#5a6a2a',
};

const cText = category => catColor[category.trim()[0]] || '#444';

let n = 0;
const cardHtml = idea => {
  n += 1;
  const claudeEval = claudeEvals[n - 1];
  const chatgptEval = chatgptEvals[n - 1];
  const antigravityEval = antigravityEvals[n - 1];
  return `
  <div class="card">
    <div class="cat" style="color:${cText(idea.cat)};border-color:${cText(idea.cat)}">${esc(idea.cat)}</div>
    <div class="title"><span class="num">${String(n).padStart(2, '0')}</span>${esc(idea.title)}</div>
    <div class="desc">${esc(idea.desc)}</div>
    <div class="src"><span class="srclbl">同一と判断し統合した案</span>${esc(idea.src)}</div>
    <div class="eval claude"><span class="evlbl">Claude評価</span>${esc(claudeEval)}</div>
    <div class="eval chatgpt"><span class="evlbl">ChatGPT評価</span>${esc(chatgptEval)}</div>
    <div class="eval antigravity"><span class="evlbl">Antigravity評価</span>${esc(antigravityEval)}</div>
  </div>`;
};

const total = flat.length;
const pageHtml = (cards, idx) => `
  <section class="page">
    <div class="phead">
      <div class="pt">廃棄物処理ボイラ 腐食対策アイデア 統合版（Claude＋ChatGPT＋Antigravity評価付き）</div>
      <div class="pn">${idx + 1} / ${pages.length}</div>
    </div>
    ${cards.map(cardHtml).join('')}
    ${cards.length === 1 ? '<div class="card empty"></div>' : ''}
  </section>`;

const cover = `
  <section class="page cover">
    <div class="cov-wrap">
      <div class="cov-kicker">TECHNICAL MEMO ・ アイデア統合資料</div>
      <h1>廃棄物処理ボイラ<br>腐食対策アイデア 統合版</h1>
      <div class="cov-sub">4つの提案資料（ChatGPT 50案・Fable 18案・Gemini 20案・Opus 30案）を<br>内容 of 同一性で統合し、Claude評価・ChatGPT評価に加えてAntigravity評価を緑字で追記。</div>
      <div class="cov-box">
        <div class="cov-row"><span>統合前</span><b>合計118案</b><i>ChatGPT 50 ・ Fable 18 ・ Gemini 20 ・ Opus 30</i></div>
        <div class="cov-row"><span>統合後</span><b>${total}案</b><i>重複を統一 ・ 4案/1枚あたり2案 ・ 全${pages.length}ページ</i></div>
      </div>
      <div class="cov-note">
        本資料は、元の統合本文・出典表記・Claude評価・ChatGPT評価の文言を変更せず、各カード末尾にAntigravity評価を緑色の評価欄として追加したものです。
        評価は、物理・化学的妥当性、モデリング、プラント適用性の観点からの参考意見です。
      </div>
      <div class="cov-evals">
        <div class="cov-eval red"><b>Claude評価</b> 赤字の既存評価欄。元PDFの評価文をそのまま保持。</div>
        <div class="cov-eval blue"><b>ChatGPT評価</b> 青字の既存評価欄。元PDFの評価文をそのまま保持。</div>
        <div class="cov-eval green"><b>Antigravity評価</b> 緑字の追記評価欄。本資料の作成時に新たに追加。</div>
      </div>
      <div class="cov-cats">
        <div>分類:</div>
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
  html, body {
    margin: 0; padding: 0;
    font-family: "Yu Gothic", "Meiryo", "MS Gothic", sans-serif;
    color: #1a1a1a;
  }
  @page { size: A4; margin: 0; }
  .page {
    width: 210mm; height: 297mm; padding: 8mm 12mm 8mm;
    display: flex; flex-direction: column; page-break-after: always; position: relative;
  }
  .phead {
    display: flex; justify-content: space-between; align-items: baseline;
    border-bottom: 1.5px solid #333; padding-bottom: 2mm; margin-bottom: 3.5mm;
  }
  .pt { font-size: 9.5pt; font-weight: bold; color: #333; }
  .pn { font-size: 8pt; color: #888; }
  .card {
    flex: 1; border: 1px solid #d5d5d5; border-radius: 2.5mm; padding: 4mm 6mm;
    margin-bottom: 3.5mm; display: flex; flex-direction: column; justify-content: center;
    overflow: hidden; background: #fdfdfd;
  }
  .card:last-child { margin-bottom: 0; }
  .card.empty { border: 1px dashed #e2e2e2; background: transparent; }
  .cat {
    align-self: flex-start; font-size: 7pt; font-weight: bold; border: 1px solid;
    border-radius: 1.5mm; padding: .6mm 2mm; margin-bottom: 2mm;
  }
  .title { font-size: 11.5pt; font-weight: bold; line-height: 1.28; margin-bottom: 2mm; color: #111; }
  .num { display: inline-block; color: #bbb; font-size: 9.5pt; margin-right: 2mm; }
  .desc { font-size: 8.0pt; line-height: 1.42; text-align: justify; color: #2a2a2a; }
  .src {
    margin-top: 2mm; padding-top: 1.5mm; border-top: 1px dotted #ccc;
    font-size: 7.2pt; color: #666; line-height: 1.3;
  }
  .srclbl {
    display: inline-block; background: #eee; color: #555; font-weight: bold;
    border-radius: 1.2mm; padding: .35mm 1.5mm; margin-right: 2mm; font-size: 6.8pt;
  }
  .eval {
    margin-top: 1.8mm; padding: 1.8mm 2.6mm; border-radius: 0.8mm;
    font-size: 7.6pt; line-height: 1.35; text-align: justify;
  }
  .eval.claude {
    background: #fbf0f0; border-left: 1.1mm solid #c62828; color: #c62828;
  }
  .eval.chatgpt {
    background: #eef5ff; border-left: 1.1mm solid #1565c0; color: #1565c0;
  }
  .eval.antigravity {
    background: #f0fbf0; border-left: 1.1mm solid #2e7d32; color: #2e7d32;
  }
  .evlbl {
    display: inline-block; font-weight: bold; border: 1px solid currentColor;
    border-radius: 1.2mm; padding: .2mm 1.5mm; margin-right: 2mm; font-size: 6.8pt;
  }
  .cover { justify-content: center; }
  .cov-wrap { padding: 0 6mm; }
  .cov-kicker { font-size: 10pt; letter-spacing: 3px; color: #1d6fb8; font-weight: bold; margin-bottom: 6mm; }
  .cover h1 { font-size: 30pt; line-height: 1.35; margin: 0 0 8mm; color: #111; letter-spacing: 1px; }
  .cov-sub { font-size: 11pt; line-height: 1.6; color: #555; margin-bottom: 9mm; }
  .cov-box { border: 1.5px solid #333; border-radius: 3mm; padding: 6mm 7mm; margin-bottom: 8mm; }
  .cov-row { display: flex; align-items: baseline; gap: 5mm; padding: 2.5mm 0; }
  .cov-row + .cov-row { border-top: 1px solid #e0e0e0; }
  .cov-row span { width: 20mm; font-size: 10pt; color: #888; }
  .cov-row b { font-size: 16pt; width: 40mm; }
  .cov-row i { font-size: 9.5pt; color: #777; font-style: normal; }
  .cov-note {
    font-size: 9.5pt; line-height: 1.75; color: #555; text-align: justify;
    background: #f6f6f6; border-radius: 2mm; padding: 4.5mm 5.5mm; margin-bottom: 6mm;
  }
  .cov-evals { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 3mm; margin-bottom: 6mm; }
  .cov-eval { font-size: 8.8pt; line-height: 1.6; border-radius: 2mm; padding: 3.5mm 4.5mm; }
  .cov-eval.red { color: #c62828; border: 1px solid #c62828; background: #fbf0f0; }
  .cov-eval.blue { color: #1565c0; border: 1px solid #1565c0; background: #eef5ff; }
  .cov-eval.green { color: #2e7d32; border: 1px solid #2e7d32; background: #f0fbf0; }
  .cov-cats { font-size: 9.5pt; display: flex; flex-wrap: wrap; gap: 4mm; align-items: center; }
  .cov-cats div { color: #333; font-weight: bold; }
  .cov-cats span { font-weight: bold; }
</style></head><body>
${cover}
${pages.map(pageHtml).join('')}
</body></html>`;

fs.writeFileSync(pathOf('./out_antigravity.html'), html, 'utf8');

let browser;
try {
  browser = await chromium.launch();
} catch {
  browser = await chromium.launch({ channel: 'chrome' });
}
const page = await browser.newPage();
await page.goto('file://' + pathOf('./out_antigravity.html').replace(/\\/g, '/'), { waitUntil: 'networkidle' });
await page.pdf({
  path: pathOf('../腐食対策アイデア_統合版_評価付き_ChatGPT追記.pdf'),
  format: 'A4',
  printBackground: true,
  margin: { top: 0, bottom: 0, left: 0, right: 0 },
});
await browser.close();

console.log(`done. ideas=${total} pages(content)=${pages.length} +cover, claude=yes, chatgpt=yes, antigravity=yes`);
