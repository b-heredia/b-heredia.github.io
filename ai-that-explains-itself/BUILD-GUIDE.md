# Build Guide — AI That Explains Itself

A step-by-step walkthrough of how this project was built and why each decision was made. Read it with the code open beside it. By the end you should be able to explain every part of the site in your own words, in a portfolio review or an interview.

---

## Step 0 — Define the problem before the product

**Audience:** everyday people who use AI chat tools but don't work in tech.

**Problem:** AI answers *sound* equally confident whether they're right, half-right or invented. Fluent writing hides the difference.

**Goal:** teach a habit, not a tool. Someone who uses this page once should read the next AI answer differently, even without the page.

**Decision: four lenses, not a "trust score."**
A score (like "72% reliable") would be fake precision. The page can't know if an answer is true, and pretending to would repeat the problem it's trying to solve. Lenses give people *questions to ask*, which keeps the human doing the judging. This matches the portfolio principle "Empower, don't replace."

---

## Step 1 — Choose the architecture

| Option | Why not / why |
|---|---|
| Live AI on the page | Needs an API key and a server. A key in front-end code is public, and anyone could spend your money. Better saved for a version 2. |
| A framework (React, etc.) | Adds a build step and lots of tooling for a three-file site. |
| **Plain HTML + CSS + JavaScript** ✅ | Runs anywhere, free on GitHub Pages, every line is readable, and nothing you paste leaves the browser. |

**Why three files, not one?** Each file has one job: `index.html` is structure, `style.css` is appearance, `script.js` is behavior. When something breaks, you know where to look.

---

## Step 2 — Structure the page (`index.html`)

The page tells a story in five numbered sections, the same way your portfolio numbers its sections ("01 — Experiments"):

1. **Lenses:** learn the method.
2. **Read Along:** watch the method used on real-feeling examples.
3. **Paste an Answer:** use it on your own.
4. **Ask Back:** take it with you to any AI tool.
5. **How It Was Made:** the project practices what it teaches.

That order (*learn → watch → try → keep*) is a common teaching pattern. Each step needs less help than the one before.

**Code decisions to notice**
- **Semantic tags** (`<nav>`, `<header>`, `<section>`, `<article>`, `<aside>`, `<footer>`) tell screen readers and search engines what each part *is*, not just how it looks.
- **Empty containers** like `<div id="example-tabs"></div>` get filled in by JavaScript. The HTML holds the frame; the script fills it with content.
- **A skip link** (`Skip to the examples`) appears only when you press Tab. Keyboard users can jump past the hero.
- **`aria-live="polite"`** on the margin note means screen readers announce the new note when it changes.

---

## Step 3 — Carry over the Swiss design system (`style.css`)

This page reuses the portfolio's design tokens so the two feel like one body of work.

**Swiss (International Typographic Style) principles used here**
- **A grid you can feel.** Everything snaps to the same 12-column grid (`.grid`). Section labels sit in columns 1–3; titles start at column 4. Your eye learns the rhythm.
- **Type as the image.** No photos or illustrations. The giant uppercase headlines (`.giant`) carry the visual weight, with tight `letter-spacing: -0.055em` and `line-height: .82` so letters lock together into blocks.
- **Asymmetry.** "AI That / Explains / Itself" steps to the right (`.indent-1`, `.indent-2`), echoing the stepped "Bri / Ana / Here / Dia" on your homepage.
- **Hairline rules and numbering.** Thin 1px black lines and big numbers (01, A, B, C, D) organize content the way an editorial magazine does.
- **Restraint.** One typeface family, two colors, no shadows, no rounded corners.

**The key design problem: four lenses, zero colors.**
Most annotation tools use highlighter colors. In strict black and white, each lens needs a different *shape*:

| Lens | Style | CSS |
|---|---|---|
| Claim | solid underline | `border-bottom: 2px solid` |
| Confidence | dotted underline | `border-bottom: 2px dotted` |
| Source | [brackets] | `::before { content: "[" }` |
| Assumption | inverted block | black background, white text |

This constraint made the design *better*. It works for people with color blindness and still reads on a black-and-white printout. That's a strong point to bring up in a portfolio review.

**Footnotes, not tooltips.** Each marked phrase gets a small superscript number, and its explanation appears in a "margin note" column on the right, like footnotes in a printed essay. Tooltips hide on mobile and vanish when you move the mouse. A margin note stays put while you read.

**Responsive behavior.** Under 960px wide, the three columns (lenses, answer, note) stack vertically. Under 640px, the tabs stack too. `clamp()` lets font sizes scale smoothly between a minimum and a maximum, with no jumps at breakpoints.

---

## Step 4 — Separate content from code (`script.js`, section 1)

All the words for the examples live in one `EXAMPLES` array at the top of `script.js`. Answers mark phrases like this:

```js
"{{4|A quick way to check is the float test...}}"
```

The `4` points to note number 4 in that example's `notes`. **Why do it this way?** You can rewrite an example, or add a fourth, without touching any layout code. Content people and code people can work separately, even when they're the same person on different days.

---

## Step 5 — Build the examples (`script.js`, section 3)

1. **Tabs.** One button per example. Clicking one calls `showExample(i)`. Arrow keys also move between tabs, which is the standard pattern screen-reader users expect.
2. **Parse the markers.** `ex.answer.split(/\{\{(\d+)\|(.+?)\}\}/)` cuts the answer into pieces: plain text, number, marked text, plain text, and so on.
3. **Make marks.** `makeMark()` wraps each marked phrase in a `<span role="button" tabindex="0">`.
   *Why a span and not a `<button>`?* A real button can't wrap across two lines of text, and long phrases need to. `role="button"` plus `tabindex="0"` plus an Enter/Space key handler gives the span a button's accessibility.
4. **Lens toggles.** Turning a lens off adds a class like `hide-claim` to the answer, and the CSS removes that style. JavaScript changes *state*; CSS decides *appearance*.

---

## Step 6 — Build the reader (`script.js`, section 4)

The reader uses **regular expressions** (text-matching patterns) instead of AI. Each rule in `RULES` has a lens, a pattern and a note. For example:

```js
{ lens: "confidence", kind: "hedge",
  re: /\b(?:may|might|could|usually|often|...)\b/gi,
  note: "A hedge. The answer is signaling uncertainty..." }
```

- `\b` means "word boundary," so `may` doesn't match inside `mayor`.
- `g` finds every match; `i` ignores capital letters.

**Handling overlaps.** "Experts recommend" could match two rules. `findMatches()` sorts every match by position and keeps the first one, so earlier rules in the list win. That's why the order of `RULES` matters.

**Follow-up questions.** `buildQuestions()` takes the first match of each kind and turns it into a question that quotes the AI's own words back to it ("You said 'always.' Are there exceptions?"). Quoting makes the follow-up specific, and specific questions get better answers.

**Security: `textContent`, never `innerHTML`.** People paste unknown text. If the page inserted it as HTML, a paste like `<img src=x onerror=...>` could run code. The `el()` helper only ever uses `textContent` and text nodes, so a paste always shows up as plain words. (This was tested.)

**Honesty in the interface.** "What this reader can't do" sits right next to the input box, not hidden in a footer. When nothing is flagged, the page says that doesn't mean the answer is correct.

---

## Step 7 — Document AI's role honestly

Section 05 of the page and the README both say who did what. Guidelines used:

1. **Be specific.** "Claude drafted the JavaScript" says more than "made with AI."
2. **Credit decisions to the person who made them.** Choosing the audience, the approach and the aesthetic is real work, and it was yours.
3. **Name what was checked and against what.** Every factual note in the examples links back to a source.
4. **Label generated content where it appears.** Each example says "AI answer (written for this demo)."
5. **Keep a change log.** The README has a "What I changed after the AI's draft" section. Fill it in as you edit. It shows your judgment, and that's what a reviewer is really looking for.

---

## Step 8 — Test, then publish

**Testing done**
- Desktop (1440px) and phone (390px) widths: no sideways scrolling.
- Clicking marks, switching tabs, toggling lenses, running the sample.
- Pasting HTML into the reader to confirm it shows as plain text.
- No JavaScript errors in the console.

**Test it yourself**
1. Open `ai-that-explains-itself/index.html` in your browser.
2. Press **Tab** repeatedly. Can you reach and open every mark with Enter?
3. Paste a real answer from ChatGPT or Claude. Do the marks make sense? Note what's missed. That's your version-2 list.
4. Show it to one person outside tech, then watch and listen without explaining. Where do they hesitate?

**Publish (VS Code or GitHub Desktop)**
1. Open the `portfolio` folder. You'll see the new `ai-that-explains-itself/` folder and the changed `index.html`.
2. Commit with a message like: `Add Project 01: AI That Explains Itself`.
3. Push to `main`.
4. If GitHub Pages is on for the repo (**Settings → Pages**), the project appears at
   `https://b-heredia.github.io/portfolio/ai-that-explains-itself/` within a minute or two.

---

## How to talk about it (30-second version)

> "AI answers sound equally confident whether they're right or wrong. I built a reading tool that teaches everyday people to look underneath an answer through four lenses: claims, confidence, sources and assumptions. Because the design is strictly black and white, each lens has its own shape instead of a color, so it works for color-blind readers too. I chose not to put AI on the page: it runs on transparent word lists, so nothing you paste leaves your browser. I built it with Claude, and the page documents exactly what the AI did and what I decided."
