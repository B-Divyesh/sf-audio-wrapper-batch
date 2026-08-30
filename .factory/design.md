# Wrapline visual thesis

## Direction: the risograph finishing bench

Wrapline should feel like a small print room for sound: voice tracks enter as loose sheets, move through a repeatable jig, and leave as numbered editions. The interface uses tactile risograph collage rather than studio-black DAW chrome. Misregistered color, crop marks, paper fibers, masking-tape labels, and waveform strips explain the product's job without pretending to be an editor. Decoration is concentrated in the opening bench illustration and compact production marks; the working surface stays quiet.

The visual system is deliberately single-mode. Warm paper is part of the product metaphor and provides a consistent installed-app splash. Dark mode would weaken the ink-on-stock identity and is not needed for a focused production utility.

## Palette

| Token | Value | Use |
| --- | --- | --- |
| Paper | `#F2EBDD` | page and installed splash |
| Stock | `#FFF9ED` | raised working sheets |
| Ink | `#17221F` | primary text, rules, controls |
| Ink soft | `#53605A` | secondary copy (7:1 on paper) |
| Registration blue | `#145B73` | links, focus, active stages |
| Tomato ink | `#B9362B` | primary actions and production marks; deepened for AA small-text contrast |
| Ochre | `#C58B19` | warnings and bed layer |
| Success | `#216A46` | completed exports |
| Danger | `#9E2D25` | destructive/error states |

Colors are flat inks rather than gradients. State always includes text or an icon; color is never the only signal. All body text pairs meet WCAG AA against their surfaces. The dark ink focus ring against paper exceeds 3:1.

## Type

- Display and labels: **Arial Narrow**, `Aptos Narrow`, `Roboto Condensed`, system sans-serif. Tight uppercase resembles job tickets without shipping a font payload.
- Body and controls: **Atkinson Hyperlegible**, `Segoe UI`, system sans-serif. The installed system stack is readable, fast, and completely local.
- Scale: 13 / 16 / 20 / 28 / clamp(40–68) px. Body never falls below 16 px. Numbers and receipts use tabular figures.

## Space and shape

An 8 px base grid with 4 px optical adjustments. The page maxes at 1180 px. Working groups use proximity and strong horizontal rules, while independent recipe and queue sheets may use a 1 px ink border and a hard 5 px offset shadow. Corners stay at 0–4 px: paper is cut, not inflated. All interactive targets are at least 44 px.

Desktop layout resembles a two-station bench: recipe controls at left and the batch queue at right. At 760 px, stations stack and secondary explanations collapse before controls shrink. At 390 px, the hero illustration becomes a shallow strip, table rows become labeled blocks, and the action rail follows document flow so it cannot cover content or a device safe area.

Privacy, terms, and not-found routes use the same ink-block wordmark, compact production navigation, paper footer, and visible skip path as the working bench. The not-found page keeps the recovery action literal and uses an oversized, misregistered waveform mark for product-specific character without turning the message into a metaphor.

## Interaction grammar

- Adding a source creates a numbered job ticket immediately.
- Recipe layers read top-to-bottom in render order: intro, voice, outro, with the bed shown beneath.
- Primary actions are tomato blocks with a small offset shadow; press moves the block onto its shadow.
- Render progress advances along the ticket edge and is announced through a polite live region.
- Save, export, and paid state use plain language and show where data lives: “Saved on this device.”
- Keyboard users can add files, edit every recipe control, review audio, render, download, remove, and restore a license without custom gestures.

## Motion policy

UI state changes last 160–220 ms and animate only transform or opacity. New queue tickets enter from 8 px below because they arrive on the bench; pressing a block moves it 2 px toward its shadow. Render progress is a determinate width transition. Nothing loops. Under `prefers-reduced-motion: reduce`, movement and smooth scrolling are removed and state changes are instant.

## Asset plan and provenance

- `public/art/wrapline-bench.webp`: original generated hero illustration, a top-down risograph collage of labeled-by-shape audio strips passing through a mechanical wrapping jig. It communicates intro + voice + outro + bed without UI screenshots or capability claims. The source PNG and prompt sidecar live in `assets/src/`.
- `public/art/wrapline-social.jpg`: 1200 × 630 social-preview crop composed from the same original bench artwork. It keeps the waveform strips and finishing jig visible in social cards without adding text to the art.
- PWA icons are original hand-authored SVG-derived artwork: four misregistered waveform strips held by crop marks. They are rendered locally to PNG at 192 and 512 px; the same mark is used for the maskable icon.
- Small waveform and status marks are CSS/SVG authored for this repository.

### Image prompt sheet

**Use case:** stylized-concept. **Subject:** overhead audio finishing bench where three paper waveform strips—short intro, long voice, short outro—feed through a compact hand-operated registration jig, with a separate ochre music-bed ribbon tucked underneath. **World/materials:** cut paper, coarse uncoated stock, masking tape, ink rollers, registration crosses, subtle paper fibers. **Light/lens:** flat editorial overhead light, no photographic depth of field. **Palette words:** warm cream paper, carbon-black ink, deep registration blue, tomato-red ink, sparing ochre. **Composition:** landscape, machinery centered right, generous calm negative space at left, readable at small sizes. **Style:** sophisticated two-pass 1960s risograph editorial collage, visible halftone and slightly imperfect registration, handmade but precise. **Negative list:** no text, letters, numbers, logos, watermarks, people, faces, hands, microphones, headphones, computers, glossy 3D, gradients, neon, generic SaaS UI.

Generation command: `/opt/fleet/lib/gen-image.sh`, Azure AI Foundry deployment `factory-image`, generated 2026-08-28. Generated imagery is original to Wrapline and used under the product's MIT distribution. Every candidate is visually reviewed for text artifacts, accidental marks, seams, and palette consistency before use.
