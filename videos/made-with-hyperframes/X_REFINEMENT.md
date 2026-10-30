# X product walkthrough refinement — 29 October 2026

This revision refines the existing brand-first HyperFrames project. It preserves the captured dark website, featured creator video, real search/filter/copy interactions, GitHub contribution handoff, local Kokoro narration, and CC BY music.

## Final edit

- 0–6s: MadeWithHyperframes.com appears immediately, followed by “Discover videos made with Hyperframes and Opus.” and “Real creations. Creative prompts. Community inspiration.” The authentic directory reveals beneath it.
- 6–15s: Search for “cinematic,” then choose Hyperframes and Full prompt. The real directory results update.
- 15–25s: Open Cinematic AI Future by Gowtham, show playback, creator credit, “Open original,” the creator-shared prompt, and Copy prompt → Copied.
- 25–31s: Show the site’s Submit your video button opening the GitHub contribution guide. The guide uses a submission issue template and maintainer review.
- 31–36s: MadeWithHyperframes.com, “Discover. Get Inspired. Create.” and “Explore the directory.” remain readable through the ending.

The 15-second portrait cutdown retains brand, directory, copy-prompt payoff, submission, and CTA. A separately composed landscape edit remains available. All variants use fixed local assets and 30 fps.

## Specific fixes

- Replaced the former large “Made With Hyperframes” opening treatment with the requested domain-first title and concise product promise.
- Replaced automatic four-word caption fragments with complete spoken thoughts and fixed holds; omitted the redundant last spoken CTA caption because the same words are already on the end card.
- Broke the long opening domain across two lines in landscape so it cannot overlap the real site capture.
- Replaced the closing headline and URL layout with the requested domain, tagline, and single CTA.
- Preserved the actual detail page and source link, complete-prompt evidence, accurate GitHub handoff, music provenance, and local voice.

See `qa/DELIVERY_REVIEW.md` for export and visual QA, `SOURCES_AND_RIGHTS.md` for attribution, and `RENDERING.md` for reproduction.

## Transition polish

The film now uses paired scene pushes at each major handoff. Each outgoing scene remains live through the 0.42-second main transition or 0.34-second cutdown transition. Navigation steps move laterally; portrait detail → prompt and submission → CTA move upward. The landscape detail → prompt move stays lateral to protect the caption line. These are seek-safe GSAP moves on the existing timed scene hosts, with the real website and video assets preserved. The first mask prototype revealed an opaque background, so it was discarded. The final encoded boundary frames were inspected under `qa/<variant>/export/`.
