# Build Guide — The Clarity Tool

How Project 02 was built, step by step, with the reasoning behind each design and code decision. Read it with the code open beside it.

---

## Step 1 — Frame the problem

**Audience:** anyone who feels mentally overwhelmed.

**Insight:** overwhelm is usually not *too much to do*. It's everything feeling **equally urgent and all mixed together**. Your brain keeps re-checking every item because nothing has a place.

**So the tool has three jobs:**
1. **Get it out.** Writing thoughts down takes them out of working memory.
2. **Separate it.** Give every thought one clear place.
3. **Narrow it.** End on *one* next step, not a new to-do list.

**Why Swiss design fits:** the International Typographic Style is about order: strict grids, clear hierarchy, lots of white space, one strong focal point. Here those aren't just a look. They show what the tool does.

---

## Step 2 — The decisions (made by Briana)

At each decision point, two to four options were proposed with trade-offs, and you chose. The full table is in the README. The reasoning behind each pick:

- **Dump, then sort** over a guided Q&A: concrete and satisfying, and it works whether your mind holds tasks or worries.
- **Do / Plan / Release:** three piles is about the most a stressed mind can juggle. "Release" matters most, because many thoughts aren't tasks at all, and the tool needs an honest place for them.
- **No AI on the page:** people type private things here. Privacy *is* the feature.
- **Full-screen stages:** you only see one thing at a time. The interface practices the calm it promises.
- **One thought at a time:** a decision about one item is small, while a decision about a whole list feels big.
- **Chaos snaps to grid:** the signature moment. It makes the change from messy to ordered visible.
- **Struck through and faded:** released thoughts stay on the page, so you know you set them down on purpose, not that you lost them.

---

## Step 3 — Structure (`index.html`)

Six `<section class="stage">` elements: Start, 01–04 and About. Only one is visible at a time, using the `hidden` attribute.

- **Why `hidden`, not a separate page per step?** Everything stays in memory on one page. If each step were its own page, the thoughts would have to be stored or sent somewhere between pages, which would break the privacy promise.
- **Progress bar in the nav** (01 Empty · 02 Sort · 03 Choose · 04 Clear): a thick top rule marks steps you've done and the one you're on. `aria-current="step"` tells screen readers where you are.
- **Care note in the footer and About screen:** short, calm, always reachable, never in the way.

---

## Step 4 — Design system (`style.css`)

Carried over from your homepage so the portfolio feels like one body of work: the 12-column grid, Helvetica, giant uppercase type with tight tracking, 1px rules and the diagonal hairlines on the start screen.

**New for this project**

- **Stage layout.** Each step repeats the same structure: a huge step number in columns 1–3, the title in 4–12, and the working area below. That repetition is calming, because by step 02 you already know where to look.
- **The chaos field (`.chaos`, `.bit`).** Each thought becomes a `<span>` positioned absolutely at a random spot, with a random size, weight, tilt and casing. The `overflow: hidden` frame makes the mess feel contained.
- **The current thought (`.current`)** is set huge, in bold uppercase. One thought, nothing competing with it.
- **The three choices** are one bordered strip, split into thirds. On hover they invert to black, the same inversion as the `.hl` highlight on your homepage.
- **Released thoughts** use `text-decoration: line-through` plus a color transition to `#767676`. That's the lightest gray that still passes WCAG AA contrast, so it *looks* faded but stays readable.
- **The next-step card** is the only large black block in the whole flow, which makes it the focal point. That's Swiss hierarchy: one thing gets the weight.
- **Motion** is short and functional. Stages rise into place, and thoughts snap into columns. `prefers-reduced-motion` turns all of it off.
- **Print styles** print only the final summary, with the black card as an outline so it doesn't use up ink.

---

## Step 5 — Code (`script.js`)

### Words in one place
`PILES` and `PLACEHOLDER` at the top hold the copy, so rewording never means hunting through logic.

### State
One `state` object holds everything: the thoughts, sorting history (for undo), the chosen step and the "smaller" version. Nothing is written to `localStorage`, cookies or a server.

### Stable chaos: seeded randomness
If positions were truly random, every keystroke would make all the thoughts jump. Instead, `seeded(key)` turns each thought's text into a repeatable "random" number generator. The same thought always lands in the same spot with the same tilt. `renderChaos()` only adds or removes the thoughts that changed.

### The snap: a FLIP animation
"FLIP" stands for **F**irst, **L**ast, **I**nvert, **P**lay:
1. **First:** measure where the thought is in the scattered pile (`getBoundingClientRect`).
2. **Last:** add it to its column and measure where it landed.
3. **Invert:** set a transform that moves it back to where it started, with the same tilt.
4. **Play:** animate the transform to `none`, so it glides and straightens into place.

This is a standard technique for smooth layout animations, and the browser does the heavy lifting.

### Undo and shortcuts
Each sort adds the thought's key to `state.history`. Undo removes the last key, takes the thought out of its column and puts it back at the front of the line. **D / P / R / Z** work only on the Sort step, and never while you're typing in a field.

### Edge case: everything released
If nothing is in Do or Plan, the tool doesn't show an error. It says: *"You released everything. Nothing needs you right now, and that's a real answer,"* and the next step becomes **Rest.** Designing for this case is part of designing for real people.

### Safety
All text goes in through `textContent`, never `innerHTML`. A thought like `<b>bold?</b>` shows up exactly as typed. This was tested.

### Focus management
On every stage change, focus moves to the new heading, so keyboard and screen-reader users land in the right place.

---

## Step 6 — Testing done

- The full flow at 1440px (desktop) and 390px (phone), with no sideways scrolling.
- Keyboard sorting, undo, and the "make it smaller" path.
- The "released everything" path ends on **Rest.**
- HTML typed as a thought is shown as plain text.
- No JavaScript errors.

**Test it yourself**
1. Run through it with your own real list. Does any wording feel off when you're actually stressed?
2. Try it with only the keyboard (Tab, Enter, D/P/R).
3. Give it to one person who's having a busy week. Watch without explaining, and note where they pause.

---

## Step 7 — Publish

From the `portfolio` folder in VS Code's terminal:

```bash
git add .
git commit -m "Add Project 02: The Clarity Tool"
git push origin main
```

It will appear at `https://b-heredia.github.io/portfolio/the-clarity-tool/`.

---

## How to talk about it (30 seconds)

> "When people are overwhelmed, everything feels equally urgent. The Clarity Tool walks you through emptying your head, sorting each thought into Do, Plan or Release, and leaving with one next step. The signature moment is visual: your thoughts first appear scattered and tilted, the way they feel, then snap into a clean Swiss grid as you sort. It's private by design, with no AI and no storage, because people type personal things into it. I made the design decisions, Claude built from them, and the README documents exactly who did what."
