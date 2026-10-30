# Delivery

Finished videos are in `videos/made-with-hyperframes/renders/`:

- `main-portrait.mp4` — 1080×1920, 36s, 30 fps.
- `main-landscape.mp4` — 1920×1080, 36s, 30 fps.
- `cutdown-portrait.mp4` — 1080×1920, 15s, 30 fps.
- `cover.png` — 1080×1920 cover; `cover.svg` is editable.

Read `videos/made-with-hyperframes/qa/DELIVERY_REVIEW.md` for QA evidence and its listening-review limitation. Keep the music attribution from `SOURCES_AND_RIGHTS.md` in published descriptions.

Editable projects remain at the video project's `index.html`, `landscape/index.html` and `cutdown/index.html`. The preview runs at http://localhost:3017/#project/made-with-hyperframes . For future exports use `bash scripts/render-film.sh`; do not recapture or regenerate audio unless intentionally changing those assets.
