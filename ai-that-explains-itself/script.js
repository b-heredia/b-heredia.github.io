/* =========================================================
   AI That Explains Itself — script.js
   Plain JavaScript, no libraries, no AI calls, no tracking.
   Sections:
     1. Content (lenses, examples, prompts)  ← edit text here
     2. Helpers
     3. Examples (tabs, marks, margin notes)
     4. Reader (paste-your-own)
     5. Prompts (copy buttons)
   ========================================================= */

/* ---------- 1. CONTENT ---------- */

const LENSES = {
  claim:      { label: "Claim",      plural: "Claims",             letter: "A" },
  confidence: { label: "Confidence", plural: "Confidence signals", letter: "B" },
  source:     { label: "Source",     plural: "Sources",            letter: "C" },
  assumption: { label: "Assumption", plural: "Assumptions",        letter: "D" },
};

/* Each example answer marks phrases like {{1|this text}}.
   The number points to a note in `notes` below it.
   Keeping words separate from layout means you can rewrite
   an example without touching any other code. */
const EXAMPLES = [
  {
    question: "Can I still eat eggs that are past the date on the carton?",
    answer:
      "Yes — {{1|eggs are usually safe to eat for 3 to 5 weeks after you buy them}}, as long as they've been {{2|kept in the refrigerator}}. {{3|The date on the carton is mostly about quality, not safety.}} {{4|A quick way to check is the float test: if an egg floats in water, throw it out.}} {{5|You'll be fine}} as long as you cook them thoroughly.",
    notes: {
      1: { type: "claim", body: "A specific, checkable number. It matches U.S. government guidance for raw eggs in the shell kept in the fridge — but the answer doesn't tell you where it came from.", check: "USDA Food Safety and Inspection Service, or the USDA FoodKeeper app." },
      2: { type: "assumption", body: "Assumes you live somewhere eggs are washed and must be refrigerated, like the U.S. Egg rules differ by country. It also assumes you know when you bought them.", check: "Your country's food-safety agency." },
      3: { type: "source", body: "Mostly accurate in the U.S., but stated with no source. A trustworthy answer would say who says so. Here, it's the USDA.", check: "Ask the AI: \"Who says the date is about quality?\"" },
      4: { type: "confidence", body: "Presented as a reliable safety test. It isn't. A floating egg is older, but USDA says it \"may be perfectly safe,\" and an egg that sinks can still carry bacteria. Confident wording, shaky claim.", check: "Crack it into a bowl and check for an off smell or look." },
      5: { type: "confidence", body: "A promise about you. The AI doesn't know your health. Some people face higher risk from food poisoning.", check: "Ask: \"Is this different for anyone?\"" },
    },
    notSaid: [
      "Who is at higher risk: infants, young children, older adults, pregnant people and people with weakened immune systems.",
      "How to check an egg after you crack it (smell and appearance).",
      "That egg handling rules differ outside the U.S.",
    ],
    verdict: "A fair starting point. Confirm the number with an official food-safety source.",
  },
  {
    question: "How much should I have saved for retirement by 30?",
    answer:
      "{{1|A common guideline is to have about one year's salary saved by age 30.}} So {{2|if you make $50,000, you should aim for around $50,000}}. {{3|Experts recommend}} saving {{4|15% of your income}} each year, including any employer match. {{5|If you're behind, don't worry — you have plenty of time to catch up}} by {{6|investing in a low-cost index fund}}.",
    notes: {
      1: { type: "source", body: "\"A common guideline\" — whose? This is Fidelity's rule of thumb. Fidelity is an investment company; naming it lets you judge the source for yourself.", check: "Fidelity, \"How much do I need to retire?\" guidelines." },
      2: { type: "assumption", body: "Assumes a steady salary and turns a rule of thumb into a \"should.\" Fidelity's own math assumes saving from age 25, steady raises and retiring at 67.", check: "Ask: \"What assumptions is that guideline based on?\"" },
      3: { type: "source", body: "\"Experts\" is a vague source. Which ones? Vague authority sounds convincing exactly because you can't check it.", check: "Ask: \"Which experts, specifically?\"" },
      4: { type: "claim", body: "A specific number that matches Fidelity's guidance (15% of pre-tax pay, including any employer match). Specific numbers sound trustworthy — and are easy to check.", check: "Fidelity retirement guidelines." },
      5: { type: "assumption", body: "Reassurance, not information. It assumes nothing else is going on: debt, caring for family, irregular income.", check: "Ask: \"What if I also have debt?\"" },
      6: { type: "confidence", body: "Stated as the answer rather than one option among several. The AI doesn't know your situation, and it isn't a financial advisor.", check: "A licensed financial advisor or a nonprofit credit counselor." },
    },
    notSaid: [
      "It never asked about your income, debt or emergency savings.",
      "Most popular guidelines come from financial companies, which have their own point of view.",
      "This is general information, not financial advice.",
    ],
    verdict: "Treat as general context. Don't act on it without your own numbers.",
  },
  {
    question: "Who invented the light bulb?",
    answer:
      "{{1|Thomas Edison invented the light bulb in 1879.}} {{2|He tested thousands of materials}} before finding a carbon filament that lasted, and {{3|his design became the one everyone used}}. {{4|It is widely considered one of the most important inventions in history.}}",
    notes: {
      1: { type: "confidence", body: "One name, one date, total certainty. History is messier. Humphry Davy showed electric light in 1802, and Joseph Swan in England demonstrated a carbon-filament bulb in 1878. Swan and Edison each made a practical bulb around 1879.", check: "Ask: \"Who else worked on the light bulb?\"" },
      2: { type: "claim", body: "A popular story worth checking. Edison's lab did test many filament materials, but \"thousands\" is the kind of round number that gets repeated without a source.", check: "A museum or encyclopedia entry on Edison's lab." },
      3: { type: "claim", body: "An overstatement. In Britain, Swan's company sold bulbs, and after a patent fight the two men's companies combined into \"Ediswan.\"", check: "Search \"Ediswan.\"" },
      4: { type: "source", body: "\"Widely considered\" — by whom? This is an opinion dressed as a fact. It may be a fair opinion, but it isn't a source.", check: "Ask: \"Who considers it that?\"" },
    },
    notSaid: [
      "Other inventors worked on the same problem, before and alongside Edison.",
      "Edison worked with a team of researchers, not alone.",
      "\"Who invented it?\" questions often have complicated answers.",
    ],
    verdict: "Sounds certain, but simplifies. A good moment to ask, \"Who else was involved?\"",
  },
];

const PROMPTS = [
  { text: "What are you assuming about me or my situation?", why: "Brings the hidden \"you\" in the answer into the open." },
  { text: "How confident are you in each part of that answer, and why?", why: "Separates the solid parts from the guesses." },
  { text: "Which parts should I double-check, and where?", why: "Turns the answer into a short to-do list." },
  { text: "What sources support this? Only name ones you're sure exist.", why: "AI tools sometimes invent sources. Always open the link yourself." },
  { text: "What would change your answer?", why: "Shows how much the answer depends on details you didn't give." },
  { text: "What did you leave out to keep this short?", why: "Short answers drop the exceptions." },
  { text: "Mark which parts are fact and which are opinion.", why: "Fluent writing blurs the line between the two." },
];

/* Word lists for the reader. Plain patterns anyone can read
   and change. Order matters: earlier rules win when two
   matches overlap. */
const RULES = [
  { lens: "source", kind: "link", re: /https?:\/\/[^\s)]+/gi,
    note: "A link you can open. Good sign — but open it. AI tools sometimes cite pages that don't exist or don't say what the answer claims." },
  { lens: "source", kind: "vague",
    re: /\b(?:according to (?:experts|research|studies|scientists|doctors)|(?:studies|research) (?:show|shows|suggest|suggests|has shown|have shown|indicates?)|(?:experts|scientists|doctors|professionals) (?:say|agree|recommend|believe|suggest)|it is (?:widely |generally |commonly )?(?:believed|known|considered|accepted|recommended)|widely (?:considered|regarded|believed|accepted)|many people (?:say|believe|think)|some (?:say|argue|believe)|a common (?:guideline|rule|recommendation)|research|studies|experts)\b/gi,
    note: "A vague source. Who, exactly? A name you can look up is stronger than a crowd you can't." },
  { lens: "assumption", kind: "you",
    re: /\b(?:you should|you['’]ll want to|you need to|you have to|you must|if you['’]re|if you are|assuming|for most people|most people|as long as|in the (?:US|U\.S\.|United States|UK)|your (?:employer|doctor|landlord|bank))\b/gi,
    note: "The answer assumes something about you or where you live. Is it true for you?" },
  { lens: "confidence", kind: "absolute",
    re: /\b(?:always|never|definitely|certainly|guaranteed|undoubtedly|clearly|obviously|without a doubt|everyone|no one|nobody|proven|the best|the only|you['’]ll be fine|don['’]t worry)\b|100%/gi,
    note: "An absolute. Real life rarely is. Ask: are there exceptions?" },
  { lens: "confidence", kind: "hedge",
    re: /\b(?:may|might|could|possibly|perhaps|likely|unlikely|probably|generally|typically|usually|often|sometimes|in most cases|in many cases|tends? to|it depends|roughly|approximately)\b/gi,
    note: "A hedge. The answer is signaling uncertainty, which is honest. Ask how uncertain, and about what." },
  { lens: "claim", kind: "number",
    // A number, optionally a range ("7 to 9"), optionally a unit ("hours", "%", "°F").
    re: /\$\d+(?:,\d{3})*(?:\.\d+)?(?:\s?(?:k|million|billion|thousand)\b)?|\b\d+(?:,\d{3})*(?:\.\d+)?(?:\s?(?:to|-|–)\s?\d+(?:,\d{3})*(?:\.\d+)?)?(?:\s?%|\s?°\s?[FC]\b|\s?(?:percent|years?|months?|weeks?|days?|hours?|minutes?|times|million|billion|thousand)\b|x\b)?/gi,
    note: "A specific number. Specific sounds trustworthy, but it's also easy to get wrong, and easy to check." },
];

const SAMPLE =
`Most adults need 7 to 9 hours of sleep per night. Studies show that people who sleep less than 6 hours are more likely to get sick. You should always avoid screens for at least an hour before bed, because blue light definitely disrupts your sleep. If you're still having trouble, experts recommend keeping your bedroom at around 65°F. Melatonin may help, but it is generally best to talk to your doctor first.`;

/* ---------- 2. HELPERS ---------- */

const $ = (sel) => document.querySelector(sel);

function el(tag, attrs = {}, ...children) {
  // Builds elements with textContent only, never innerHTML,
  // so pasted text can never inject code into the page.
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") node.className = v;
    else if (k === "text") node.textContent = v;
    else node.setAttribute(k, v);
  }
  for (const c of children) node.append(c);
  return node;
}

function pad(n) { return String(n).padStart(2, "0"); }

function makeMark(lens, text, n) {
  const m = el("span", { class: `mk mk-${lens}`, role: "button", tabindex: "0", "data-n": n });
  m.append(text, el("sup", { text: n }));
  return m;
}

function wireMarks(container, onPick) {
  const pick = (m) => {
    container.querySelectorAll(".mk.is-active").forEach((x) => x.classList.remove("is-active"));
    m.classList.add("is-active");
    onPick(Number(m.dataset.n), m);
  };
  container.addEventListener("click", (e) => {
    const m = e.target.closest(".mk[role=button]");
    if (m) pick(m);
  });
  container.addEventListener("keydown", (e) => {
    const m = e.target.closest(".mk[role=button]");
    if (m && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); pick(m); }
  });
}

function renderNote(panel, { n, lens, quote, body, check }) {
  panel.replaceChildren(
    el("p", { class: "small-label", text: "Margin note" }),
    el("p", { class: "note-num", text: pad(n) }),
    el("p", { class: "note-type", text: `${LENSES[lens].letter} — ${LENSES[lens].label}` }),
    el("p", { class: "note-quote", text: `“${quote}”` }),
    el("p", { class: "note-body", text: body }),
  );
  if (check) {
    const c = el("p", { class: "note-check" });
    c.append(el("strong", { text: "How to check" }), check);
    panel.append(c);
  }
}

function resetNote(panel, msg) {
  panel.replaceChildren(
    el("p", { class: "small-label", text: "Margin note" }),
    el("p", { class: "note-empty", text: msg }),
  );
}

async function copyText(text, btn) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // Fallback for browsers that block the clipboard API on local files.
    const t = el("textarea"); t.value = text; document.body.append(t);
    t.select(); document.execCommand("copy"); t.remove();
  }
  const old = btn.textContent;
  btn.textContent = "Copied";
  setTimeout(() => (btn.textContent = old), 1500);
}

function copyRow(text, why) {
  const t = el("span", { class: "prompt-text", text });
  if (why) t.append(el("span", { class: "prompt-why", text: why }));
  const b = el("button", { type: "button", class: "copy", text: "Copy", "aria-label": `Copy: ${text}` });
  b.addEventListener("click", () => copyText(text, b));
  return el("li", {}, t, b);
}

/* ---------- 3. EXAMPLES ---------- */

const hidden = new Set();          // lenses the reader has switched off
const tabs = $("#example-tabs");
const panel = $("#example-panel");
const exNote = $("#example-note");

function applyLensFilter(container) {
  for (const key of Object.keys(LENSES)) container.classList.toggle(`hide-${key}`, hidden.has(key));
}

function showExample(i) {
  const ex = EXAMPLES[i];
  tabs.querySelectorAll(".tab").forEach((t, j) => {
    t.setAttribute("aria-selected", String(j === i));
    t.tabIndex = j === i ? 0 : -1;
  });

  const answer = el("p", { class: "answer" });
  // Split "{{3|text}}" markers into plain text and marks.
  const parts = ex.answer.split(/\{\{(\d+)\|(.+?)\}\}/);
  for (let k = 0; k < parts.length; k += 3) {
    if (parts[k]) answer.append(parts[k]);
    if (parts[k + 1]) {
      const n = Number(parts[k + 1]);
      answer.append(makeMark(ex.notes[n].type, parts[k + 2], n));
    }
  }

  const notSaid = el("div", { class: "not-said" },
    el("p", { class: "small-label", text: "What the answer didn't say" }),
    el("ul", {}, ...ex.notSaid.map((s) => el("li", { text: s }))));

  const verdict = el("div", { class: "verdict" },
    el("strong", { text: "Read it as:" }), el("p", { text: ex.verdict }));

  panel.replaceChildren(
    el("p", { class: "ex-question", text: `Question ${pad(i + 1)}` }),
    el("p", { class: "ex-question-text", text: ex.question }),
    el("p", { class: "answer-label", text: "AI answer (written for this demo)" }),
    answer, notSaid, verdict,
  );
  panel.setAttribute("aria-labelledby", `tab-${i}`);
  applyLensFilter(panel);
  resetNote(exNote, "Select a marked phrase in the answer.");
}

EXAMPLES.forEach((ex, i) => {
  const t = el("button", { type: "button", class: "tab", role: "tab", id: `tab-${i}`, "aria-controls": "example-panel" },
    el("span", { class: "tab-num", text: pad(i + 1) }),
    el("span", { class: "tab-q", text: ex.question }));
  t.addEventListener("click", () => showExample(i));
  tabs.append(t);
});

// Arrow keys move between tabs (the standard pattern screen-reader users expect).
tabs.addEventListener("keydown", (e) => {
  const list = [...tabs.querySelectorAll(".tab")];
  const i = list.indexOf(document.activeElement);
  if (i < 0) return;
  let next = null;
  if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (i + 1) % list.length;
  if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (i - 1 + list.length) % list.length;
  if (next !== null) { e.preventDefault(); list[next].focus(); showExample(next); }
});

wireMarks(panel, (n, m) => {
  const ex = EXAMPLES[[...tabs.children].findIndex((t) => t.getAttribute("aria-selected") === "true")];
  const note = ex.notes[n];
  renderNote(exNote, { n, lens: note.type, quote: m.firstChild.textContent, body: note.body, check: note.check });
});

// Lens toggles
const toggles = $("#lens-toggles");
for (const [key, lens] of Object.entries(LENSES)) {
  const b = el("button", { type: "button", class: "toggle", "aria-pressed": "true" },
    el("span", { class: "box", "aria-hidden": "true" }),
    el("span", { class: `mk mk-${key}`, text: lens.label }));
  b.addEventListener("click", () => {
    const on = b.getAttribute("aria-pressed") === "true";
    b.setAttribute("aria-pressed", String(!on));
    on ? hidden.add(key) : hidden.delete(key);
    applyLensFilter(panel);
  });
  toggles.append(b);
}

showExample(0);

/* ---------- 4. READER ---------- */

const input = $("#reader-text");
const out = $("#reader-out");
const result = $("#reader-result");
const readerNote = $("#reader-note");
let found = [];

function findMatches(text) {
  const all = [];
  RULES.forEach((rule, priority) => {
    for (const m of text.matchAll(rule.re)) {
      all.push({ start: m.index, end: m.index + m[0].length, text: m[0], priority, ...rule });
    }
  });
  // Earliest first; on a tie, higher-priority rule, then the longer match.
  all.sort((a, b) => a.start - b.start || a.priority - b.priority || (b.end - b.start) - (a.end - a.start));
  const kept = [];
  let lastEnd = -1;
  for (const m of all) if (m.start >= lastEnd) { kept.push(m); lastEnd = m.end; }
  return kept;
}

function buildQuestions(ms, text) {
  const q = [];
  const first = (lens, kind) => ms.find((m) => m.lens === lens && (!kind || m.kind === kind));
  const short = (s) => (s.length > 50 ? s.slice(0, 50) + "…" : s);
  const num = first("claim");
  const vague = first("source", "vague");
  const link = first("source", "link");
  const abs = first("confidence", "absolute");
  const hedge = first("confidence", "hedge");
  const you = first("assumption");
  if (num) q.push(`Where does “${short(num.text)}” come from?`);
  if (vague) q.push(`You said “${short(vague.text)}.” Which specific sources?`);
  if (link) q.push("Does that link actually say what you said it does? Quote the part.");
  if (abs) q.push(`You said “${short(abs.text)}.” Are there exceptions?`);
  if (hedge) q.push(`You said “${short(hedge.text)}.” How likely, and what does it depend on?`);
  if (you) q.push(`What are you assuming about me when you say “${short(you.text)}”?`);
  if (!hedge && text.length > 200) q.push("You didn't express any doubt. How confident are you, and what would change your answer?");
  q.push("What did you leave out of this answer?");
  return q;
}

function runReader() {
  const text = input.value.trim();
  if (!text) { input.focus(); return; }
  found = findMatches(text);

  // Rebuild the text as plain text nodes with marks between them.
  result.replaceChildren();
  let pos = 0;
  found.forEach((m, i) => {
    if (m.start > pos) result.append(text.slice(pos, m.start));
    result.append(makeMark(m.lens, m.text, i + 1));
    pos = m.end;
  });
  if (pos < text.length) result.append(text.slice(pos));

  // Counts per lens
  const counts = $("#reader-counts");
  counts.replaceChildren(...Object.entries(LENSES).map(([key, lens]) => {
    const n = found.filter((m) => m.lens === key).length;
    return el("div", {},
      el("p", { class: "count-num", text: pad(n) }),
      el("p", { class: "count-label" }, el("span", { class: `mk mk-${key}`, text: n === 1 ? lens.label : lens.plural })));
  }));

  $("#reader-questions").replaceChildren(...buildQuestions(found, text).map((t) => copyRow(t)));
  resetNote(readerNote, found.length ? "Select a marked phrase." : "Nothing flagged. That doesn't mean it's correct — only that the wording didn't match the word lists.");
  out.hidden = false;
  out.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
}

wireMarks(result, (n, m) => {
  const f = found[n - 1];
  renderNote(readerNote, { n, lens: f.lens, quote: f.text, body: f.note });
});

$("#reader-run").addEventListener("click", runReader);
$("#reader-sample").addEventListener("click", () => { input.value = SAMPLE; runReader(); });
$("#reader-clear").addEventListener("click", () => { input.value = ""; out.hidden = true; input.focus(); });
input.addEventListener("keydown", (e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) runReader(); });

/* ---------- 5. PROMPTS ---------- */

$("#prompt-list").replaceChildren(...PROMPTS.map((p) => copyRow(p.text, p.why)));
