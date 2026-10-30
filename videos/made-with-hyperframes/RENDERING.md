# Rebuild and render

## Current X refinement

From the repository root, use the already verified dark captures and frozen assets:

```bash
node scripts/prepare-brand-first-assets.mjs
node scripts/build-brand-first.mjs
bash scripts/render-film.sh
```

`render-film.sh` saves a new candidate under `videos/made-with-hyperframes/renders/review.*/` and records its path in `qa/latest-render-directory.txt`. It checks and snapshots portrait, landscape, and cutdown, then exports each at 30 fps and decodes all three. Inspect the generated sheets and `inspection.json`; then run `node scripts/finalize-dark-render.mjs` from the repository root to replace delivery MP4s and record hashes. The checked current batch used HyperFrames 0.8.216. The editable Studio project is `videos/made-with-hyperframes/`. The existing cover is preserved; `build-brand-first-cover.mjs` recreates its earlier artwork. The previous commands below describe the archived opening concept.


From `/home/gowtham/Projects/madewithhyperframes-product-demo`:

```bash
npm install --prefix tools/capture
node scripts/prepare-edit-assets.mjs
node scripts/build-film.mjs
bash scripts/render-film.sh
```

For export only, run `bash scripts/render-film.sh`; existing captures, media and voice files are reused. The capture-tools package includes both `ffmpeg-static` and `ffprobe-static`, and the render script adds their binary directories to PATH. `register-voice-bus.mjs` is obsolete and is not required: native `data-audio-group="narration"` attributes declare the narration bus.

The verified CLI pin is HyperFrames 0.8.214 (upgraded from 0.8.196). The script checks compatibility before adopting a new pin. Browser/network execution now works in the agent environment as well as the normal terminal.

Do not rebuild while a render is running. `build-film.mjs` regenerates editable scene HTML from the saved implementation and current local voice metadata. It resets audio-carve attributes; `render-film.sh` reapplies the measured carve before checking/rendering.

`prepare-edit-assets.mjs` requires the verified successful capture and original video. The clean UI cuts are deterministic frame selections with retained source ranges recorded in `assets/edit/edit-ledger.json`. It does not contact the website. The intro derivative uses source seconds 3.6–10 plus a 2.5-second final-frame hold, keeping its original motion/identity and avoiding an awkward crop of the source's city title in portrait.

The scene contract uses one paused GSAP timeline per composition, local GSAP/font/media files, framework-owned video playback, one caption track, separate voice/music/SFX tracks, and scene sub-compositions. All final formats are explicitly rendered at 30 fps.

The 29 October revision uses a dark charcoal film stage, violet and lime highlights, and the authentic light site UI as the foreground product capture. The credited original video fills the first frames. During its pullback, the surrounding canvas remains charcoal; the selected captured card replaces it. The original light website interface is not recolored or fabricated. The landscape layout is independently composed in its own HTML, not cropped from portrait.

The main sequence follows the recorded voice timing: hook/reveal 0–8.9, discovery 8.9–15.4, detail 15.4–19.1, prompt/copy 19.1–25.4, examples 25.4–30.9, CTA 30.9–36. The CTA is fully settled by 31.45 and holds through 36. The short version uses intro/reveal 0–5, prompt/copy 5–10, CTA 10–15. Its last spoken CTA is cut from the same measured local take and placed at 10.2.

Initial review screenshots are in `qa/<format>/frames`. Final-source snapshots are in `qa/<format>/final-frames`. Decoded output contact sheets and loudness logs are in `qa/<format>/export`. Each candidate batch has `inspection.json` with resolution, fps, duration, audio-presence and complete-decode results. Image inspection and playback/listening remain separate review gates.

Publication credit is in `SOURCES_AND_RIGHTS.md`; retain it in the published video description. The original HeyGen Free-plan audio is preserved only as historical material and is not selected by the current builder.
