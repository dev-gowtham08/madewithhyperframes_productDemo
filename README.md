# Made With Hyperframes product demo

**Current delivery (30 October 2026):** minimal domain-first product walkthrough for X, with authentic dark website footage, short paired scene transitions, complete captions, prompt and creator details, GitHub submission handoff, and a clean CTA. The portrait export reviewed for posting is `videos/made-with-hyperframes/renders/made-with-hyperframes_2026-10-30_13-20-25.mp4`. Earlier exports are preserved locally and excluded from Git.

An authentic product film built from the preserved directory capture and verified filter, detail and clipboard interactions.

Editable compositions are in `videos/made-with-hyperframes/index.html` (36s portrait), `landscape/index.html` (36s landscape) and `cutdown/index.html` (15s portrait). All target 30 fps. The cover is `videos/made-with-hyperframes/renders/cover.png`.

See `videos/made-with-hyperframes/X_REFINEMENT.md` for the production prompt, `BRIEF.md` for the original brief, `SOURCES_AND_RIGHTS.md` for attribution, and `RENDERING.md` for reproduction instructions. Final exports are `renders/main-portrait.mp4`, `renders/main-landscape.mp4` and `renders/cutdown-portrait.mp4` inside the video project. QA evidence and limits are in `qa/DELIVERY_REVIEW.md`.

To resume export without recapturing or regenerating audio:

```bash
npm install --prefix tools/capture
bash scripts/render-film.sh
```

The script uses repository-local FFmpeg and ffprobe. Keep the Scott Buckley music attribution from `SOURCES_AND_RIGHTS.md` with published videos.
