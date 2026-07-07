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
  return `
  <div class="card">
    <div class="cat" style="color:${cText(idea.cat)};border-color:${cText(idea.cat)}">${esc(idea.cat)}</div>
    <div class="title"><span class="num">${String(n).padStart(2, '0')}</span>${esc(idea.title)}</div>
    <div class="desc">${esc(idea.desc)}</div>
    <div class="src"><span class="srclbl">同一と判断し統合した案</span>${esc(idea.src)}</div>
    <div class="eval claude"><span class="evlbl">Claude評価</span>${esc(claudeEval)}</div>
    <div class="eval chatgpt"><span class="evlbl">ChatGPT評価</span>${esc(chatgptEval)}</div>
  </div>`;
};

const total = flat.length;
const pageHtml = (cards, idx) => `
  <section class="page">
    <div class="phead">
      <div class="pt">廃棄物処理ボイラ 腐食対策アイデア 統合版（Claude評価＋ChatGPT評価付き）</div>
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
      <div class="cov-sub">4つの提案資料（ChatGPT 50案・Fable 18案・Gemini 20案・Opus 30案）を<br>内容の同一性で統合し、Claude評価にChatGPT評価を青字で追記。</div>
      <div class="cov-box">
        <div class="cov-row"><span>統合前</span><b>合計118案</b><i>ChatGPT 50 ・ Fable 18 ・ Gemini 20 ・ Opus 30</i></div>
        <div class="cov-row"><span>統合後</span><b>${total}案</b><i>重複を統一 ・ 4案/1枚あたり2案 ・ 全${pages.length}ページ</i></div>
      </div>
      <div class="cov-note">
        本資料は、元の統合本文・出典表記・Claude評価の文言を変更せず、各カード末尾にChatGPT評価を青色の評価欄として追加したものです。
        評価は実装優先度、検証難度、費用対効果、現場適用性の観点からの参考意見です。
      </div>
      <div class="cov-evals">
        <div class="cov-eval red"><b>Claude評価</b> 赤字の既存評価欄。元PDFの評価文をそのまま保持。</div>
        <div class="cov-eval blue"><b>ChatGPT評価</b> 青字の追記評価欄。既存本文とClaude評価の後ろに追加。</div>
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
    width: 210mm; height: 297mm; padding: 13mm 15mm 11mm;
    display: flex; flex-direction: column; page-break-after: always; position: relative;
  }
  .phead {
    display: flex; justify-content: space-between; align-items: baseline;
    border-bottom: 1.5px solid #333; padding-bottom: 3mm; margin-bottom: 4.5mm;
  }
  .pt { font-size: 10pt; font-weight: bold; color: #333; }
  .pn { font-size: 8.5pt; color: #888; }
  .card {
    flex: 1; border: 1px solid #d5d5d5; border-radius: 3mm; padding: 5.5mm 7mm;
    margin-bottom: 5mm; display: flex; flex-direction: column; justify-content: center;
    overflow: hidden; background: #fdfdfd;
  }
  .card:last-child { margin-bottom: 0; }
  .card.empty { border: 1px dashed #e2e2e2; background: transparent; }
  .cat {
    align-self: flex-start; font-size: 7.5pt; font-weight: bold; border: 1px solid;
    border-radius: 2mm; padding: .8mm 2.3mm; margin-bottom: 2.7mm;
  }
  .title { font-size: 12.2pt; font-weight: bold; line-height: 1.32; margin-bottom: 2.8mm; color: #111; }
  .num { display: inline-block; color: #bbb; font-size: 10pt; margin-right: 2.4mm; }
  .desc { font-size: 8.8pt; line-height: 1.56; text-align: justify; color: #2a2a2a; }
  .src {
    margin-top: 3.3mm; padding-top: 2.2mm; border-top: 1px dotted #ccc;
    font-size: 7.8pt; color: #666; line-height: 1.35;
  }
  .srclbl {
    display: inline-block; background: #eee; color: #555; font-weight: bold;
    border-radius: 1.5mm; padding: .45mm 1.8mm; margin-right: 2.3mm; font-size: 7.3pt;
  }
  .eval {
    margin-top: 2.2mm; padding: 2.4mm 3.2mm; border-radius: 1mm;
    font-size: 8.15pt; line-height: 1.48; text-align: justify;
  }
  .eval.claude {
    background: #fbf0f0; border-left: 1.1mm solid #c62828; color: #c62828;
  }
  .eval.chatgpt {
    background: #eef5ff; border-left: 1.1mm solid #1565c0; color: #1565c0;
  }
  .evlbl {
    display: inline-block; font-weight: bold; border: 1px solid currentColor;
    border-radius: 1.5mm; padding: .25mm 1.7mm; margin-right: 2.2mm; font-size: 7.2pt;
  }
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
  .cov-note {
    font-size: 9.5pt; line-height: 1.85; color: #555; text-align: justify;
    background: #f6f6f6; border-radius: 2mm; padding: 5mm 6mm; margin-bottom: 7mm;
  }
  .cov-evals { display: grid; grid-template-columns: 1fr 1fr; gap: 4mm; margin-bottom: 7mm; }
  .cov-eval { font-size: 9.2pt; line-height: 1.7; border-radius: 2mm; padding: 4mm 5mm; }
  .cov-eval.red { color: #c62828; border: 1px solid #c62828; background: #fbf0f0; }
  .cov-eval.blue { color: #1565c0; border: 1px solid #1565c0; background: #eef5ff; }
  .cov-cats { font-size: 9.5pt; display: flex; flex-wrap: wrap; gap: 4mm; align-items: center; }
  .cov-cats div { color: #333; font-weight: bold; }
  .cov-cats span { font-weight: bold; }
</style></head><body>
${cover}
${pages.map(pageHtml).join('')}
</body></html>`;

fs.writeFileSync(pathOf('./out_chatgpt.html'), html, 'utf8');

let browser;
try {
  browser = await chromium.launch();
} catch {
  browser = await chromium.launch({ channel: 'chrome' });
}
const page = await browser.newPage();
await page.goto('file://' + pathOf('./out_chatgpt.html').replace(/\\/g, '/'), { waitUntil: 'networkidle' });
await page.pdf({
  path: pathOf('./out_chatgpt.pdf'),
  format: 'A4',
  printBackground: true,
  margin: { top: 0, bottom: 0, left: 0, right: 0 },
});
await browser.close();

console.log(`done. ideas=${total} pages(content)=${pages.length} +cover, claude=yes, chatgpt=yes`);
