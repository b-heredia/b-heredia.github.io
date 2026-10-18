/* =========================================================
   The Clarity Tool — script.js
   Plain JavaScript. No libraries, no AI calls, no storage,
   no tracking. Everything lives in memory and disappears
   when the page closes.
   Sections:
     1. Copy (all the words, in one place)
     2. State + helpers
     3. Stage navigation
     4. 01 Empty: live "chaos" field
     5. 02 Sort: one at a time, snap to grid
     6. 03 Choose
     7. 04 Clear: next step + summary
   ========================================================= */

/* ---------- 1. COPY ---------- */

const PILES = {
  do:      { label: "Do",      summary: "Small things for today." },
  plan:    { label: "Plan",    summary: "Give each one a time on your calendar." },
  release: { label: "Release", summary: "Set down for now. You can pick these up later." },
};

const PLACEHOLDER =
`rent due friday
mom's birthday
that thing I said in the meeting
laundry
job applications
the noise the car is making`;

/* ---------- 2. STATE + HELPERS ---------- */

const state = {
  thoughts: [],      // { key, text, pile: null | "do" | "plan" | "release" }
  history: [],       // keys in the order they were sorted (for undo)
  choice: null,      // key of the chosen next step
  smaller: "",
  stage: 0,
  returnTo: 0,       // where "About → Back" returns
};

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const pad = (n) => String(n).padStart(2, "0");
const reduceMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

function el(tag, attrs = {}, ...kids) {
  // textContent only, never innerHTML: what people type is always plain text.
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") n.className = v;
    else if (k === "text") n.textContent = v;
    else n.setAttribute(k, v);
  }
  n.append(...kids);
  return n;
}

// Same input → same "random" number, so a thought keeps its
// position and tilt instead of jumping around on every keystroke.
function seeded(str) {
  let h = 2166136261;
  for (const c of str) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return () => ((h = Math.imul(h ^ (h >>> 15), 2246822507) ^ Math.imul(h ^ (h >>> 13), 3266489909)) >>> 0) / 4294967296;
}

/* ---------- 3. STAGE NAVIGATION ---------- */

function go(n) {
  const id = n === "about" ? "stage-about" : `stage-${n}`;
  $$(".stage").forEach((s) => (s.hidden = s.id !== id));
  const stage = document.getElementById(id);
  stage.classList.remove("is-entering");
  void stage.offsetWidth;                 // restart the entrance animation
  stage.classList.add("is-entering");

  if (n !== "about") state.stage = n;
  const prog = $("#progress");
  prog.classList.toggle("is-hidden", n === 0 || n === "about");
  $$("#progress li").forEach((li) => {
    const step = Number(li.dataset.step);
    li.classList.toggle("is-done", typeof n === "number" && step < n);
    li.classList.toggle("is-now", step === n);
    if (step === n) li.setAttribute("aria-current", "step"); else li.removeAttribute("aria-current");
  });

  window.scrollTo(0, 0);
  // Move keyboard + screen-reader focus to the new stage's heading.
  stage.querySelector("h1, h2").focus({ preventScroll: true });

  if (n === 2) startSort();
  if (n === 3) buildChoices();
  if (n === 4) buildClear();
}

$$("[data-go]").forEach((b) => b.addEventListener("click", () => go(Number(b.dataset.go))));
$("#about-open").addEventListener("click", () => { state.returnTo = state.stage; go("about"); });
$("#about-close").addEventListener("click", () => go(state.returnTo));

/* ---------- 4. 01 EMPTY ---------- */

const dump = $("#dump-text");
const chaos = $("#chaos");
dump.placeholder = PLACEHOLDER;

function parseThoughts(text) {
  const seen = {};
  return text.split("\n").map((t) => t.trim()).filter(Boolean).map((t) => {
    seen[t] = (seen[t] || 0) + 1;
    return { key: `${t}#${seen[t]}`, text: t, pile: null };
  });
}

function makeBit(t, compact) {
  const r = seeded(t.key);
  const size = compact ? 13 + r() * 20 : 15 + r() * 30;
  const bit = el("span", { class: "bit", "data-key": t.key, text: t.text });
  const left = r() * 62;
  bit.style.left = `${left}%`;
  bit.style.maxWidth = `calc(${100 - left}% - 12px)`;   // never runs off the edge
  bit.style.top = `${4 + r() * 78}%`;
  bit.style.fontSize = `${size.toFixed(0)}px`;
  bit.style.fontWeight = r() > 0.5 ? 700 : 400;
  bit.style.rotate = `${(r() * 28 - 14).toFixed(1)}deg`;
  if (r() > 0.6) bit.style.textTransform = "uppercase";
  return bit;
}

// Only add/remove what changed, so existing thoughts stay put.
function renderChaos(box, list, compact = false) {
  const keep = new Set(list.map((t) => t.key));
  [...box.children].forEach((c) => { if (!keep.has(c.dataset.key)) c.remove(); });
  const have = new Set([...box.children].map((c) => c.dataset.key));
  list.forEach((t) => { if (!have.has(t.key)) box.append(makeBit(t, compact)); });
}

dump.addEventListener("input", () => {
  const list = parseThoughts(dump.value);
  renderChaos(chaos, list);
  $("#dump-count").textContent = `${pad(list.length)} thought${list.length === 1 ? "" : "s"}`;
  $("#to-sort").disabled = list.length === 0;
});

$("#to-sort").addEventListener("click", () => {
  state.thoughts = parseThoughts(dump.value);
  state.history = [];
  state.choice = null;
  state.smaller = "";
  go(2);
});

/* ---------- 5. 02 SORT ---------- */

const pile = $("#pile");
const current = $("#current-thought");
const choiceBtns = $$(".choice");

function unsorted() { return state.thoughts.filter((t) => !t.pile); }

function startSort() {
  pile.replaceChildren();
  $$(".column ol").forEach((ol) => ol.replaceChildren());
  state.thoughts.forEach((t) => (t.pile = null));
  state.history = [];
  renderChaos(pile, unsorted(), true);
  updateSorter();
}

function updateCounts() {
  $$(".column").forEach((col) => {
    const n = state.thoughts.filter((t) => t.pile === col.dataset.pile).length;
    col.querySelector("h3").replaceChildren(PILES[col.dataset.pile].label, el("span", { class: "n", text: pad(n) }));
  });
}

function updateSorter() {
  const left = unsorted();
  const total = state.thoughts.length;
  $("#undo").disabled = state.history.length === 0;
  updateCounts();
  let cont = $("#to-choose");

  if (left.length) {
    $("#sort-count").textContent = `Thought ${pad(total - left.length + 1)} / ${pad(total)}`;
    current.textContent = left[0].text;
    choiceBtns.forEach((b) => (b.disabled = false));
    $(".choices").hidden = false;
    if (cont) cont.remove();
  } else {
    $("#sort-count").textContent = `All ${pad(total)} sorted`;
    current.textContent = "Everything has a place.";
    $(".choices").hidden = true;
    if (!cont) {
      cont = el("button", { type: "button", class: "btn btn-solid btn-big", id: "to-choose", text: "Choose a next step →" });
      cont.addEventListener("click", () => go(3));
      $(".choices").after(cont);
    }
    cont.focus();
  }
}

// FLIP animation: measure where the thought starts (scattered in the
// pile), put it in its column, then animate from the old spot to the new.
function snapInto(item, li) {
  const source = pile.querySelector(`[data-key="${CSS.escape(item.key)}"]`);
  const from = source && source.offsetParent ? source : current;
  const a = from.getBoundingClientRect();
  const rot = source ? source.style.rotate || "0deg" : "0deg";
  if (source) source.remove();

  const b = li.getBoundingClientRect();
  if (reduceMotion()) return;
  li.classList.add("snap");
  li.animate(
    [
      { transformOrigin: "top left", transform: `translate(${a.left - b.left}px, ${a.top - b.top}px) rotate(${rot})`, opacity: 0.4 },
      { transformOrigin: "top left", transform: "none", opacity: 1 },
    ],
    { duration: 520, easing: "cubic-bezier(.2,.8,.2,1)" }
  ).finished.then(() => li.classList.remove("snap"));
}

function sortCurrent(pileName) {
  const item = unsorted()[0];
  if (!item) return;
  item.pile = pileName;
  state.history.push(item.key);
  const li = el("li", { "data-key": item.key, text: item.text });
  $(`.column[data-pile="${pileName}"] ol`).append(li);
  snapInto(item, li);
  if (pileName === "release") requestAnimationFrame(() => li.classList.add("faded"));
  updateSorter();
}

function undo() {
  const key = state.history.pop();
  if (!key) return;
  const item = state.thoughts.find((t) => t.key === key);
  item.pile = null;
  $(`.column li[data-key="${CSS.escape(key)}"]`)?.remove();
  // Put it back at the front of the line.
  state.thoughts = [item, ...state.thoughts.filter((t) => t !== item)];
  renderChaos(pile, unsorted(), true);
  updateSorter();
}

choiceBtns.forEach((b) => b.addEventListener("click", () => sortCurrent(b.dataset.pile)));
$("#undo").addEventListener("click", undo);

// Keyboard shortcuts: D / P / R to sort, Z to undo.
document.addEventListener("keydown", (e) => {
  if (state.stage !== 2 || $("#stage-2").hidden) return;
  if (e.ctrlKey || e.metaKey || e.altKey || e.target.matches("input, textarea")) return;
  const map = { d: "do", p: "plan", r: "release" };
  const k = e.key.toLowerCase();
  if (map[k] && unsorted().length) { e.preventDefault(); sortCurrent(map[k]); }
  if (k === "z") { e.preventDefault(); undo(); }
});

/* ---------- 6. 03 CHOOSE ---------- */

function buildChoices() {
  const options = [
    ...state.thoughts.filter((t) => t.pile === "do"),
    ...state.thoughts.filter((t) => t.pile === "plan"),
  ];
  const list = $("#pick-list");
  list.replaceChildren();
  $("#smaller-text").value = state.smaller;
  $("#to-clear").disabled = !state.choice;

  if (!options.length) {
    // Everything was released. That's a valid outcome, not an error.
    $("#choose-lede").textContent = "You released everything. Nothing needs you right now, and that's a real answer.";
    $(".smaller").hidden = true;
    const b = el("button", { type: "button", class: "btn btn-solid btn-big", text: "Finish →" });
    b.addEventListener("click", () => { state.choice = null; go(4); });
    list.append(b);
    return;
  }
  $("#choose-lede").textContent = "Not the most important one. The one you could start soonest.";
  $(".smaller").hidden = false;

  options.forEach((t, i) => {
    const input = el("input", { type: "radio", name: "next", value: t.key, id: `opt-${i}` });
    if (state.choice === t.key) input.checked = true;
    input.addEventListener("change", () => { state.choice = t.key; $("#to-clear").disabled = false; });
    list.append(el("label", { class: "pick-opt", for: `opt-${i}` },
      input, el("span", { class: "t", text: t.text }), el("span", { class: "tag", text: PILES[t.pile].label })));
  });
}

$("#smaller-text").addEventListener("input", (e) => (state.smaller = e.target.value.trim()));
$("#smaller-text").addEventListener("keydown", (e) => { if (e.key === "Enter" && state.choice) go(4); });
$("#to-clear").addEventListener("click", () => go(4));

/* ---------- 7. 04 CLEAR ---------- */

function buildClear() {
  const chosen = state.thoughts.find((t) => t.key === state.choice);
  const total = state.thoughts.length;
  $("#tally").textContent = chosen
    ? `${pad(total)} thought${total === 1 ? "" : "s"} → 1 next step.`
    : `${pad(total)} thought${total === 1 ? "" : "s"} → set down for now.`;

  const card = $("#next-card");
  card.replaceChildren(el("p", { class: "small-label", text: chosen ? "Your next step" : "Your next step" }));
  if (chosen) {
    card.append(el("p", { class: "next-step", text: state.smaller || chosen.text }));
    if (state.smaller) card.append(el("p", { class: "next-from", text: `From: ${chosen.text}` }));
  } else {
    card.append(el("p", { class: "next-step", text: "Rest." }));
    card.append(el("p", { class: "next-from", text: "Nothing on your list needs you today." }));
  }

  const summary = $("#summary");
  summary.replaceChildren(...Object.entries(PILES).map(([key, p]) => {
    const items = state.thoughts.filter((t) => t.pile === key);
    return el("div", { class: key },
      el("h3", { text: `${p.label} ${pad(items.length)}` }),
      el("p", { class: "note", text: p.summary }),
      items.length
        ? el("ol", {}, ...items.map((t) => el("li", { text: t.text })))
        : el("p", { class: "empty", text: "Nothing here." }));
  }));
}

function summaryText() {
  const chosen = state.thoughts.find((t) => t.key === state.choice);
  const lines = [`THE CLARITY TOOL — ${new Date().toLocaleDateString()}`, ""];
  lines.push(`NEXT STEP: ${chosen ? state.smaller || chosen.text : "Rest."}`);
  if (chosen && state.smaller) lines.push(`(from: ${chosen.text})`);
  for (const [key, p] of Object.entries(PILES)) {
    lines.push("", `${p.label.toUpperCase()} — ${p.summary}`);
    const items = state.thoughts.filter((t) => t.pile === key);
    lines.push(...(items.length ? items.map((t) => `- ${t.text}`) : ["- (nothing)"]));
  }
  return lines.join("\n");
}

$("#copy-summary").addEventListener("click", async (e) => {
  const btn = e.currentTarget;
  try { await navigator.clipboard.writeText(summaryText()); }
  catch {
    const t = el("textarea"); t.value = summaryText(); document.body.append(t);
    t.select(); document.execCommand("copy"); t.remove();
  }
  btn.textContent = "Copied";
  setTimeout(() => (btn.textContent = "Copy summary"), 1500);
});
$("#print-summary").addEventListener("click", () => window.print());
$("#start-over").addEventListener("click", () => {
  Object.assign(state, { thoughts: [], history: [], choice: null, smaller: "" });
  dump.value = "";
  chaos.replaceChildren();
  $("#dump-count").textContent = "00 thoughts";
  $("#to-sort").disabled = true;
  go(1);
});

go(0);
