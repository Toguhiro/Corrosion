import fs from 'fs';
import pw from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pw;

const html = `<!doctype html><html lang="ja"><head><meta charset="utf-8">
<style>
  * { box-sizing: border-box; }
  @page { size: A4; margin: 14mm 15mm 16mm; }
  body { margin: 0; font-family: "IPAGothic","IPAPGothic",sans-serif; color: #1a1a1a;
    font-size: 9.8pt; line-height: 1.7; }
  h1 { font-size: 18pt; line-height: 1.4; margin: 0 0 2mm; }
  .sub { color: #555; font-size: 10.5pt; margin-bottom: 5mm; }
  .meta { font-size: 8.5pt; color: #777; border-top: 1.5px solid #333; border-bottom: 1.5px solid #333;
    padding: 2mm 0; margin-bottom: 6mm; }
  h2 { font-size: 12.5pt; margin: 7mm 0 2.5mm; padding: 1.5mm 3mm; background: #eef3f8;
    border-left: 2mm solid #1d6fb8; break-after: avoid; }
  h3 { font-size: 10.5pt; margin: 4mm 0 1.5mm; color: #1d6fb8; break-after: avoid; }
  p { margin: 0 0 2.5mm; text-align: justify; }
  ul, ol { margin: 0 0 2.5mm; padding-left: 5mm; }
  li { margin-bottom: 1.2mm; text-align: justify; }
  table { border-collapse: collapse; width: 100%; font-size: 8.8pt; margin: 2mm 0 3mm; }
  th, td { border: 1px solid #bbb; padding: 1.5mm 2mm; vertical-align: top; text-align: left; line-height: 1.55; }
  th { background: #f0f0f0; }
  tr { break-inside: avoid; }
  .box { border: 1px solid #c62828; background: #fdf3f3; border-radius: 2mm; padding: 3mm 4mm;
    margin: 3mm 0; break-inside: avoid; }
  .box b:first-child { color: #c62828; }
  .good { border-color: #0f8a6a; background: #f0f8f5; }
  .good b:first-child { color: #0f8a6a; }
  .cit { color: #1d6fb8; font-weight: bold; font-size: 8.5pt; }
  .srcs { font-size: 8.3pt; line-height: 1.65; }
  .srcs li { margin-bottom: 1.6mm; word-break: break-all; }
  .srcs .u { color: #555; }
  .rx { background: #f6f6f6; border-radius: 1.5mm; padding: 1.5mm 3mm; font-size: 9.2pt; margin: 1.5mm 0 2.5mm; }
</style></head><body>

<h1>深掘り検討メモ 付録A：候補薬剤の原理</h1>
<div class="sub">水酸化マグネシウムスラリーと第一リン酸アルミ溶液 ── なぜ効くのか・実例はあるか（出典付き）</div>
<div class="meta">親資料：深掘り_煤吹き添加剤一体化.pdf（統合版 案27）｜ 出典は文中の [M1] [A1] 等で示し、末尾§6に URL を記載 ｜ 数値は出典・一般文献の代表値</div>

<h2>1. 前提：塩素腐食を支える「3つの脚」と、2剤の役割分担</h2>
<p>廃棄物ボイラの高温塩素腐食は、次の3要素が揃ったときに加速する。</p>
<ol>
<li><b>溶融塩の膜（電解質）</b>：ZnCl2-KCl（共晶 約230℃）・PbCl2-KCl（約411℃）等の低融点塩化物が管表面で液膜化する。</li>
<li><b>酸性の攻撃種</b>：HCl・Cl2・ZnCl2（ルイス酸）が保護酸化皮膜を酸性フラックス化して溶かす。</li>
<li><b>塩素サイクル（active oxidation）</b>：金属界面で Fe＋2HCl→FeCl2＋H2。FeCl2 は400〜500℃で蒸気圧が無視できず外側へ拡散し、酸化されて Cl2 を再放出。塩素は消費されずに循環し、鉄だけが削られ続ける。</li>
</ol>
<div class="box good"><b>【結論の先出し】</b>Mg(OH)2 は脚①②（灰・雰囲気側）を、リン酸アルミは脚③（金属界面側）を攻撃する。<b>競合ではなく相補</b>の関係にあり、「灰側の無害化」と「金属側のバリア」という別々の防御線を担う。</div>

<h2>2. 水酸化マグネシウム：灰を「危険な液体」から「無害な粉」に変える</h2>
<h3>2.1 その場で反応性MgOが生まれる</h3>
<p>スラリー液滴が炉内に入ると水がフラッシュ蒸発し、約330〜350℃で Mg(OH)2 → MgO＋H2O と分解する。この「低温でその場生成したMgO」は、焼き固めた市販MgO粉と異なり<b>多孔質・高比表面積の反応性微粒子</b>として灰中に分散する。Mg(OH)2自体も軟らかい鉱物（モース硬度2.5〜3）で、噴流に混ぜてもエロージョン性が低い。</p>
<h3>2.2 4つの作用機構</h3>
<ul>
<li><b>① 融点の底上げ・液相の分断：</b>MgO（融点2852℃）は塩化物共晶に溶け込まない不活性骨材として灰中の「液体の割合」を下げる。溶融塩腐食は<b>連続した液膜</b>があって初めて電気化学的に走るため、耐火物粒子が液膜を分断するだけで腐食速度が落ちる。</li>
<li><b>② 酸性ガスの中和：</b>MgO＋2HCl→MgCl2＋H2O は熱力学的に進み、管近傍のHClを消費する。生成する MgCl2（融点714℃）は ZnCl2系共晶（230℃）よりはるかに安全側（KCl-MgCl2共晶で430℃前後まで下がる点は留意）。SO3 も MgSO4 として固定し、堆積物の酸性度を下げる<span class="cit">[M1][M4]</span>。</li>
<li><b>③ 灰を脆くする「離型層」効果：</b>微細MgO粒子は灰粒子間の焼結ネック成長を妨げ、灰を緻密な板ではなく<b>粉っぽい層のまま</b>保つ（クラフト回収ボイラでMgO添加が付着物対策として研究されているのも同じ機構<span class="cit">[M5]</span>）。スートブロワで塗る場合、管表面にMgOリッチな薄層＝離型層ができ、次の灰は<b>その上に</b>積もる。次回煤吹きでは酸化皮膜ではなく離型層で剥がれるため、「清掃のたびに保護皮膜を剥ぐ」悪循環を断てる。</li>
<li><b>④ 実績化学の転用：</b>重油焚きでは、Mg系添加剤が低融点のNa-V複合酸化物（535℃〜で溶融）を高融点マグネシウムバナデート（約1074℃）へ変える「溶ける灰を溶けない灰に変える」対策として半世紀の実績がある。灯油燃焼炉での実験でも、Mg(OH)2 が高温灰腐食を抑制することが報告されている<span class="cit">[M4]</span>。同じ戦法を V2O5 系から塩化物系へ持ち替えるのが本提案。</li>
</ul>
<h3>2.3 実例：TIFI（標的炉内噴射）と欧州での適用</h3>
<ul>
<li>米Fuel Tech社の <b>TIFI（Targeted In-Furnace Injection）</b>は、CFDモデルで噴射ポート位置と液滴軌道を設計し、<b>希釈したMg(OH)2スラリーを空気微粒化して問題部位へ狙い撃ちする</b>商用技術。同社はこのプログラムを<b>「主として廃棄物発電（WtE）ボイラ向け」</b>と位置づけ、塩化物起因の高温腐食を対象にしている<span class="cit">[M1]</span>。</li>
<li>同社のSEC年次報告書（10-K）には、FUEL CHEM（Mg(OH)2注入）プログラムが<b>北米・メキシコ・欧州の燃焼設備で稼働中</b>であること、RDF焚きWtE実機での試験で<b>腐食速度50%超の低減とスラグ制御の同時改善</b>が得られたことが記載されている<span class="cit">[M2]</span>。</li>
<li>欧州法人 Fuel-Tech N.V.（オランダ）による大型ボイラへのTIFI適用成功例も公表されている（石炭焚き・スラグ対策）<span class="cit">[M3]</span>。関連特許として「ボイラのスラグ・腐食制御プロセス」<span class="cit">[M6]</span>。</li>
</ul>
<div class="box"><b>【本提案との差分】</b>TIFIは炉壁の専用ポートからの噴射であり、スートブロワ経由・清掃直後の新生面への塗布（時間的ターゲティング）とは異なる。TIFIの実績は「Mg(OH)2の化学がWtEの塩素腐食に効く」ことの裏付けとして引用し、投入経路の工夫が本提案の新規性であることに変わりはない。</div>
<h3>2.4 正直な限界</h3>
<ul>
<li>MgOはアルカリ（K・Na）を化学的に捕捉する力は弱い（それはカオリンの役割）。効果の主体は物理的希釈＋酸中和。</li>
<li>過剰投与はMgOリッチ堆積物自体のファウリングを招く（重油焚きでの過投与トラブルとして既知）。</li>
<li>MgCl2は吸湿性のため、停缶中に湿分を吸って休止腐食を起こし得る。定検時の水洗と組み合わせる。</li>
</ul>

<h2>3. 第一リン酸アルミ：金属界面に「化学結合したガラスの蓋」を作る</h2>
<h3>3.1 硬化の化学 ── 管の熱が焼成炉の代わりになる</h3>
<p>第一リン酸アルミ Al(H2PO4)3 は50%級の酸性水溶液として使う耐火物バインダの定番薬品<span class="cit">[A5]</span>。加熱による相変化は文献で段階的に整理されている<span class="cit">[A4]</span>：</p>
<div class="rx">〜200℃：水分蒸発・Al(H2PO4)3として固化 → 〜350℃：縮合してポリリン酸アルミ（AlH2P3O10等）へ → <b>400℃超：非晶質メタリン酸アルミ（ガラス質）を形成</b> → さらに高温で結晶質AlPO4（SiO2と同構造・約1500℃まで安定）へ<span class="cit">[A4][A5]</span></div>
<p>つまり<b>過熱器の管表面温度（400〜500℃）が、ちょうどガラス質皮膜の生成温度域に一致する</b>。塗布後の乾燥・焼成工程が不要で、管自体の熱で硬化が完結する──これがスートブロワ経由のオンライン塗布と決定的に相性が良い理由。</p>
<h3>3.2 密着の機構 ── 「塗る」のではなく「反応して結合する」</h3>
<ul>
<li>低粘度の酸性液が酸化スケールの気孔・マイクロクラックに毛細管浸透し、表面の鉄酸化物をわずかに溶かして<b>リン酸鉄の化学結合層</b>を作る。常温の鋼のリン酸塩処理（パーカライジング）と同じ化学の高温版。</li>
<li>この「酸溶液→化学反応→セラミック化」は Chemically Bonded Phosphate Ceramics（CBPC・化学結合リン酸塩セラミックス）として体系化されており、溶射のような機械的付着（アンカー効果）ではなく化学結合で密着するのが本質的な強み。</li>
</ul>
<h3>3.3 なぜ塩素サイクルに効くか</h3>
<p>塩素サイクル（§1脚③）が回るには (a) Cl種が金属まで届く、(b) 生成したFeCl2蒸気が外へ出る、という<b>双方向の物質移動</b>が必要。緻密なガラス質皮膜は行きと帰りの両方に蓋をするため、サイクルの回転そのものを止められる。耐食合金のように「腐食反応の速度で競う」のではなく、反応経路を遮断する防御。</p>
<h3>3.4 実例：ガスタービンのリン酸塩結合コーティング</h3>
<ul>
<li><b>SermeTel系コーティング</b>：1966年にTeleflex社が開発したSermeTel Wは<b>リン酸＋クロム酸＋アルミ粉末</b>の加熱硬化型コーティングで、ガスタービン圧縮機の翼・ディスク・ケース等の防食・防エロージョンの業界標準となった<span class="cit">[A3]</span>。現行品（例：SermeTel Process 5380DP、Praxair Surface Technologies）は<b>クロメート/リン酸塩バインダ中にアルミ粒子を充填した皮膜で、650℃（1200°F）までの運用</b>とされ、入口案内翼で1000時間超の腐食なし運転実績が公表されている<span class="cit">[A1]</span>。</li>
<li><b>クロムフリー化の流れ</b>：6価クロムを含まない「リン酸塩結合コーティング」の特許（US6224657等<span class="cit">[A2]</span>）や、超合金の高温腐食（hot corrosion）保護用のクロメートフリー無機コーティング特許<span class="cit">[A6]</span>が続いており、<b>リン酸塩バインダ皮膜が燃焼ガス環境の高温部品を守れること</b>は特許・製品の両面で裏付けがある。</li>
</ul>
<div class="box"><b>【引用上の注意】</b>SermeTel系はアルミ粒子充填＋（従来品は）クロメート併用の塗布焼成コーティングであり、本提案の「第一リン酸アルミ溶液の単独オンライン噴霧」と同一物ではない。ここで裏付けられるのは「<b>リン酸塩結合というバインダ化学が、高温・腐食性の燃焼ガス環境で長期実績を持つ</b>」という点。無充填・薄膜・高頻度再塗布という使い方は本提案独自であり、KCl共存下での皮膜安定性（K-Al-リン酸塩の生成が安定相か低融点相か）が最大の検証項目になる（親資料 Phase 1）。</div>
<h3>3.5 正直な限界</h3>
<ul>
<li><b>厚い残存灰の上に噴くと逆効果</b>：本剤は文字通り耐火物の接着剤であり、灰の上から掛けると灰を管に焼き固める恐れがある。「よく清掃した直後の面に薄く」が絶対条件（煤吹き一体化と本質的に相性が良い理由でもある）。</li>
<li>水冷壁（管温約300℃）では硬化が遅く水和相が残りやすい。本命の適用先は過熱器。</li>
<li>酸性液（pH1〜2）のため薬液系統はSUS316L級または樹脂系で構成する。P分の飛灰組成・灰有効利用への影響は事前確認。</li>
</ul>

<h2>4. まとめ：役割分担表</h2>
<table>
<tr><th></th><th>Mg(OH)2 スラリー</th><th>第一リン酸アルミ溶液</th></tr>
<tr><td>攻める脚（§1）</td><td>①溶融塩膜・②酸性雰囲気</td><td>③金属界面の塩素サイクル</td></tr>
<tr><td>守り方</td><td>灰側を無害化（融点↑・液膜分断・離型層）</td><td>金属側に化学結合ガラスバリア</td></tr>
<tr><td>施工面の条件</td><td>灰の上からでも可</td><td><b>清掃直後の面 限定</b></td></tr>
<tr><td>実績の由来</td><td>重油焚きV腐食対策（半世紀）／TIFIでWtE適用・欧州稼働<span class="cit">[M1][M2]</span></td><td>耐火物バインダ<span class="cit">[A5]</span>／CBPC／ガスタービン翼皮膜<span class="cit">[A1][A3]</span></td></tr>
<tr><td>最大の検証点</td><td>過投与ファウリング・休止腐食（MgCl2吸湿）</td><td>KCl共存下での皮膜安定性・熱サイクル密着</td></tr>
</table>
<div class="box"><b>【混合厳禁】</b>MgO（塩基）＋酸性リン酸塩は「リン酸マグネシウムセメント」（道路緊急補修用の超速硬セメント）の組成そのものであり、配管内で数分で固化する。2剤を使う場合は完全別系統とするか、十分な清水フラッシュを挟む設計が必須。</div>

<h2>5. 検証実験への落とし込み（親資料 Phase 1 の具体化）</h2>
<ul>
<li><b>Mg系</b>：模擬灰（KCl-ZnCl2共晶）＋Mg(OH)2混合比を振り、示差熱分析で初融点の上昇を確認 → クーポン腐食試験（450℃×100h級）で減肉比較 → 煤吹き模擬の剥離試験で「離型層」効果を定量。</li>
<li><b>リン酸アルミ系</b>：清浄鋼面／予酸化面／薄灰残存面の3水準に噴霧・管温硬化 → 皮膜断面SEMで密着とガラス化を確認 → KClペレット載せ450℃保持で皮膜の生存性（K反応相の同定）→ 熱サイクル（200⇔500℃）で剥離寿命。</li>
<li>判定基準：無処理比で腐食減量50%減（TIFIのWtE実績値<span class="cit">[M2]</span>と同水準）を仮目標に設定。</li>
</ul>

<h2>6. 出典一覧</h2>
<h3>Mg(OH)2 関連 [M]</h3>
<ol class="srcs">
<li>[M1] Fuel Tech Inc.「TIFI Targeted In-Furnace Injection」製品ページ（Mg(OH)2スラリーの標的噴射・WtE向け腐食抑制）<br><span class="u">https://www.ftek.com/en-US/products/productssubchemicaltechnologies/tifi</span></li>
<li>[M2] Fuel Tech Inc. Form 10-K（米SEC年次報告書・2020年度）：FUEL CHEMプログラムの北米・メキシコ・<b>欧州</b>での稼働、RDF焚きWtE実機で腐食速度50%超低減の記載<br><span class="u">https://www.sec.gov/Archives/edgar/data/846913/000143774921006048/ftek20201231_10k.htm</span></li>
<li>[M3] Power Engineering（2003）「Fuel-Tech N.V. announces successful TIFI application on a large coal-fueled unit」（欧州法人によるTIFI適用公表）<br><span class="u">https://www.power-eng.com/2003/07/17/fuel-tech-nv-announces-successful-tifi-application-on-a-large-coal-fueled-unit/</span></li>
<li>[M4] 「The Inhibitive Action of Magnesium Hydroxide on Hot Ash Corrosion of Stainless Steel in a Kerosene Fired Furnace」（Mg(OH)2の高温灰腐食抑制の実験報告）<br><span class="u">https://www.researchgate.net/publication/265754127</span></li>
<li>[M5] 「Effectiveness of magnesium oxide additives in mitigating fouling problems in kraft recovery boilers」（MgO添加による付着物改質・クラフト回収ボイラ）<br><span class="u">https://www.researchgate.net/publication/296923100</span></li>
<li>[M6] US Patent 7,845,292「Process for slag and corrosion control in boilers」（ボイラのスラグ・腐食制御プロセス）<br><span class="u">https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/7845292</span></li>
</ol>
<h3>リン酸アルミ関連 [A]</h3>
<ol class="srcs">
<li>[A1] SermeTel Process 5380DP（Praxair Surface Technologies）製品情報：アルミ充填クロメート/リン酸塩皮膜、650℃まで、タービン圧縮機部品向け<br><span class="u">https://avioparts.com/product/coatings/top-coats/sermetel5380dp-praxair-surface-technologies</span></li>
<li>[A2] US Patent 6,224,657「Hexavalent chromium-free phosphate-bonded coatings」（6価クロムフリーのリン酸塩結合コーティング）<br><span class="u">https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/6224657</span></li>
<li>[A3] Finishing and Coating「Development of a Novel Hexavalent-Chromium-Free Sacrificial Aluminum-Ceramic Paint」（SermeTel W（1966年・Teleflex）の歴史とリン酸＋クロム酸＋Al粉の組成解説）<br><span class="u">https://finishingandcoating.com/index.php/plating/1214-development-of-a-novel-hexavalent-chromium-free-sacrificial-aluminum-ceramic-paint</span></li>
<li>[A4] 「Further insights on the thermal degradation of aluminum metaphosphate prepared from aluminum dihydrogen phosphate solution」Journal of the European Ceramic Society（Al(H2PO4)3の段階的硬化：〜350℃ポリリン酸塩→400℃超でメタリン酸塩）<br><span class="u">https://www.sciencedirect.com/science/article/abs/pii/S0955221921001722</span></li>
<li>[A5] Aluminum Dihydrogen Phosphate 耐火物バインダ技術解説（AlPO4マトリクスが約1500℃まで安定、350〜500℃乾燥で高強度）<br><span class="u">https://www.tairanchemical.com/news/aluminum-dihydrogen-phosphate-adp-refractory-binder-guide.html</span></li>
<li>[A6] US Patent 12,252,628「Chromate-free inorganic coating systems for hot corrosion protection of superalloy substrate」（超合金の高温腐食保護用クロメートフリー無機コーティング）<br><span class="u">https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/12252628</span></li>
</ol>
<p style="font-size:8.3pt;color:#777;">注：Web出典は2026年7月時点の検索結果に基づく。[M4][M5]は出版社版の書誌確認を推奨。本文の共晶温度・融点等は一般文献の代表値であり、実適用時は対象系の状態図・実測で確認のこと。</p>

</body></html>`;

const outHtml = new URL('./chem.html', import.meta.url).pathname;
fs.writeFileSync(outHtml, html);
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('file://' + outHtml, { waitUntil: 'networkidle' });
await page.pdf({ path: new URL('./chem_out.pdf', import.meta.url).pathname, format: 'A4', printBackground: true });
await browser.close();
console.log('done');
