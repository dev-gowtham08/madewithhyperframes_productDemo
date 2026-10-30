# Successful capture audit

Accepted source: `capture-retry.tfbBXkK9/site/`. The original failed `capture/` is historical evidence and is not used.

`result.log` reports `ok: true`, HTTP 200, five screenshots and 31 assets. No `BLOCKED.md` exists in the accepted source. Reviewed `scroll-000.png` and `scroll-072.png` at full size. Both show the actual directory, populated cards, credits, playable previews and consistent site branding; this is not an error/login/loading page.

## Verified against the captured current site

- Brand: Made With Hyperframes; lime four-tile icon with violet play tile. Correct captured mark: `assets/logo-b32346bc.svg`. The separately extracted SVG labeled `svgs/logo-789ecb3d.svg` is a structural candidate, not automatically the product logo.
- Independent community directory, curated by Gowtham; not a video editor.
- Search, All tools / Hyperframes / Opus tabs, category controls, Full prompt control and results count are visibly present.
- Categories include Motion, Product Demo, Explainer and others. Counts are captured UI content, not promotional claims to repeat in overlays.
- Creator names are visible below each card.
- Cinematic AI Future, by Gowtham, displays the Full prompt badge. It is an AI-category video made with Hyperframes, 0:10 long.
- The About copy explicitly describes the filter → detail → watch → copy workflow and distinguishes available context from complete prompts.
- Captured CSS tokens: canvas `#f3f1eb`, paper `#fbfaf7`, charcoal `#171916`, violet `#6950de`, violet tint `#e6e0ff`, lime `#d8ff63`, muted `#6e726b`, line `#d9dbd3`.
- Captured type: Arial; Georgia is used for the editorial ampersand. Local font substitution must be explicit; screenshot text is preserved.

## Excluded asset identified and recovered

The only image represented in the captured DOM but missing from the image asset directory was **One-Shot Motion Edit**, by **Torres /Coding with AI**. It is a 9,227-byte JPEG, excluded by `size-floor`. All other embedded poster payloads were matched to saved files by SHA-256.

The exact JPEG bytes were recovered from the captured HTML's base64 data URL to `assets/recovered/one-shot-motion-edit.jpg`. No image was invented, regenerated or downloaded. `assets/recovered/provenance.json` records the SHA-256 and origin. Visually inspected: a cream title frame with the word “THIS”. Its small file size does not imply missing video footage; this is a poster, not a video.

## Still required

The homepage capture does not contain the interaction recordings, detail page or original video file. A screenshot of Full prompt cannot prove that the filter was clicked, and About copy cannot prove successful clipboard behavior. `scripts/capture-interactions.mjs` therefore:

1. Records real tool selection and Full prompt activation, verifying all visible filtered cards have the badge.
2. Opens the same Cinematic AI Future card, verifies title, creator and complete-prompt note, and checks playback time advances.
3. Records Copy prompt, waits for the actual Copied state, and compares clipboard contents with the complete prompt.
4. Captures separate responsive portrait and landscape layouts and attributed cards in three categories.
5. Downloads the original visual video track from its live detail-page VideoObject metadata, omitting source audio.

No successful interaction capture exists yet. The script stops if content changes or required behavior fails; it never patches labels, prompts, cards or clipboard responses. Only a visible cursor is overlaid to show actual automated mouse movement.

## Design correction

The preset remixer initially mistook dark thumbnail colors for the brand canvas. Its automatic `#41346A` canvas / white text inversion was corrected to the captured CSS custom properties above. The actual page screenshot, not aggregate thumbnail colors, determines the design.
