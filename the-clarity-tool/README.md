# The Clarity Tool

**Project 02 — Briana Heredia, Creative AI Technologist**

For when everything feels like too much. When you're overwhelmed, the problem usually isn't how much there is. It's that everything feels **equally urgent and all mixed together**. The Clarity Tool walks you through four steps, one screen at a time:

| Step | What happens |
|---|---|
| **01 Empty** | Write down everything taking up space, one thought per line. As you type, each thought appears in a box beside you: scattered, tilted and overlapping, the way it feels in your head. |
| **02 Sort** | One thought at a time, set large. Choose **Do** (small, in my control today), **Plan** (matters, needs a time) or **Release** (I can't act on it today). Each thought snaps out of the mess into a clean column. |
| **03 Choose** | Pick one next step: not the most important one, the one you could start soonest. Optionally shrink it to a ten-minute version. |
| **04 Clear** | Your next step, big, in a black card. Below it, the full sorted list. Released thoughts are struck through and faded, still visible, so you know you set them down on purpose. Copy or print it. |

Keyboard: **D / P / R** to sort, **Z** to undo.

## Run it

No install or build step. Open `index.html` in any browser, or visit it on GitHub Pages at `/the-clarity-tool/`.

## Privacy, by design

People type personal things into a tool like this, so:

- Nothing is sent anywhere. There's no server, no AI call and no analytics.
- Nothing is saved. Close the page and it's gone. "Copy" and "Print" are the only ways to keep anything, and both are the user's choice.
- The only outside request is the Google Fonts stylesheet. The page works without it.

## Care

This tool sorts thoughts. It isn't therapy or medical advice. The page links to the **988 Suicide & Crisis Lifeline** (U.S., call or text 988) in the footer and the About screen.

## Files

```
the-clarity-tool/
├── index.html      Five screens: start, four steps, about
├── style.css       Swiss black-and-white system + the chaos/snap motion
├── script.js       All copy, state and interactions
├── README.md       This file
└── BUILD-GUIDE.md  How it was built, and every design decision
```

## Accessibility

- Every stage works with a keyboard alone. Focus moves to the new heading on each step.
- Thoughts are typed as plain text and always displayed as plain text.
- Lenses and piles are shown by shape and words, never color alone.
- The faded gray (#767676) still passes WCAG AA contrast.
- With "reduce motion" turned on in the system settings, all animation stops.

---

## AI's role in this project

**Tool:** Claude (Anthropic), in Claude's Cowork mode, October 2026.

**How we worked:** Claude proposed options at each decision point, with sketches and trade-offs. Briana chose. Claude then built from those choices.

**Decisions made by Briana**

| Decision | Options offered | Briana chose |
|---|---|---|
| Core mechanic | Dump then sort · One question at a time · Visual drag-and-size | **Dump, then sort** |
| Piles | Do/Plan/Release · Control circles · Now/Later/Never | **Do / Plan / Release** |
| AI on the page | None, private · Optional AI helper | **None, private by design** |
| Ending | Next step + summary · Next step only · Saved in browser | **Next step + summary** |
| Flow | Full-screen stages · One long page | **Full-screen stages** |
| Sorting | One at a time · List with buttons · Drag to columns | **One thought at a time** |
| Signature moment | Chaos snaps to grid · Big numbers · Pure restraint | **Chaos snaps to grid** |
| Released thoughts | Struck through + faded · Disappear · Let-go ritual | **Struck through, then faded** |

She also defined the concept, the title, the audience and the visual direction (black-and-white Swiss editorial, bold, minimal, precise), and she reviews the result before publishing.

**What the AI did**
- Framed the problem and proposed the options above.
- Wrote the HTML, CSS and JavaScript.
- Wrote the interface copy (prompts, button hints, summary notes).
- Tested the flow on desktop and phone widths, with keyboard shortcuts and undo, including the "released everything" path.
- Checked the 988 Lifeline information against SAMHSA.
- Drafted this README and the build guide.

**What I changed after the AI's draft**
<!-- Fill this in honestly as you review. If you change nothing, say so. -->
- _[Your edits here, or: "Reviewed the full draft; no changes in version 1."]_

## Version 2 ideas

- Go back to Empty and add thoughts without losing the sorting so far.
- For Plan items, add a "when?" field and export them to a calendar.
- An optional, clearly labeled AI helper that suggests a ten-minute version of a step. Off by default.
- A short test with five people who describe themselves as overwhelmed, then rewrite whatever slowed them down.
- Spanish-language version.

---

© 2026 Briana Heredia. Imagined by a human. Built with AI.
