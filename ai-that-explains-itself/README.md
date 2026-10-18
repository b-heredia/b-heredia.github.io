# AI That Explains Itself

**Project 01 — Briana Heredia, Creative AI Technologist**

A reading tool for everyday people who use AI. AI answers arrive fluent, confident and complete, which makes them easy to trust and hard to question. This site teaches people to look underneath an answer through four lenses:

| Lens | Mark | What it catches | Ask back |
|---|---|---|---|
| **A — Claim** | solid underline | Checkable facts: numbers, dates, names | "Where does that come from?" |
| **B — Confidence** | dotted underline | Hedges ("usually") and absolutes ("always") | "How sure are you, and why?" |
| **C — Source** | [brackets] | Who the answer leans on; vague ones like "experts say" | "Which source, exactly?" |
| **D — Assumption** | black highlight | What the answer decided about you | "What are you assuming about me?" |

## What's on the page

1. **Four Lenses.** A one-screen explanation of the method.
2. **Read Along.** Three everyday questions (food safety, money, history) with annotated AI answers. Click a marked phrase to open its margin note, toggle lenses on and off, and see "What the answer didn't say."
3. **Paste an Answer.** Paste any AI answer. The page marks it using the four lenses, counts what it found, and writes follow-up questions you can copy back into the AI.
4. **Ask Back.** Seven follow-up prompts that get most AI chat tools to explain themselves.
5. **How It Was Made.** Who did what: human, AI, and the sources used for fact-checking.

## Run it

No install, no build step.

- **Locally:** open `index.html` in any browser.
- **Online:** published with GitHub Pages from the `portfolio` repo, at `/ai-that-explains-itself/`.

## Files

```
ai-that-explains-itself/
├── index.html      Page structure and all fixed text
├── style.css       Swiss black-and-white design system
├── script.js       Example content, word lists, and interactions
├── README.md       This file
└── BUILD-GUIDE.md  Step-by-step walkthrough of design and code decisions
```

## Privacy

Nothing leaves the browser. The reader uses plain word lists in `script.js`. It doesn't call an AI model or a server, and it has no analytics. The only outside request is the Google Fonts stylesheet, which the page doesn't need to work.

## Limitations (stated on the page too)

- **The reader checks wording, not truth.** It can't tell whether an answer is correct.
- Word lists miss things and flag harmless words (for example, "may" in "May 2026").
- English only.
- The three example answers were **written for this project** to show common patterns. They are not transcripts from any specific AI product.

---

## AI's role in this project

This project is about making AI legible, so it documents its own AI use plainly.

**Tool:** Claude (Anthropic), used in Claude's Cowork mode, October 2026.

**What I (Briana) did**
- Came up with the concept, title and audience.
- Wrote the brief: an interactive website for everyday people, in a black-and-white Swiss editorial style that matches my portfolio.
- Made the key decisions: annotated examples plus a paste-your-own reader; no AI on the live page; host it inside my portfolio repo.
- Reviewed the result and decided what to publish.

**What the AI did**
- Drafted the HTML, CSS and JavaScript.
- Wrote the three example answers, their margin notes and the "didn't say" lists.
- Wrote the reader's word lists and the follow-up prompts.
- Fact-checked the example notes against the sources below.
- Drafted this README and `BUILD-GUIDE.md`.

**What I changed after the AI's draft**
<!-- Keep this list honest and specific. It's the most useful part for anyone reviewing your work. -->
- _[Add your own edits here: copy you rewrote, design changes, bugs you found, examples you replaced.]_

**Sources used to check the examples**
- USDA Food Safety and Inspection Service, [Shell Eggs from Farm to Table](https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/eggs/shell-eggs-farm-table): 3–5 weeks refrigerated, dates are about quality, the float test, higher-risk groups.
- Fidelity, [Retirement guidelines](https://www.fidelity.com/viewpoints/retirement/retirement-guidelines): 1× salary by 30, 15% savings rate, and the assumptions behind them.
- Inventing Europe, [Ediswan](https://www.inventingeurope.eu/story/ediswan): Davy (1802), Swan (1878), Swan and Edison (1879), the Ediswan company.

## What's next (version 2 ideas)

- Let people compare two AI answers to the same question side by side.
- Test the lenses with five real users and rewrite whatever confused them.
- An optional, clearly labeled AI mode that asks a model to annotate its own answer, then shows where the model's self-explanation and the word lists disagree.
- Spanish-language version.

---

© 2026 Briana Heredia. Imagined by a human. Built with AI. Explained by both.
