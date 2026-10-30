# Current revision — X product walkthrough delivered 29 October 2026

The latest transition polish is delivered. The previous hard cuts now use short paired scene pushes that keep outgoing footage visible, with a caption-safe landscape detail-to-prompt handoff. The current checked batch is `videos/made-with-hyperframes/renders/review.1y4XNk/`; the promoted MP4 hashes are in `videos/made-with-hyperframes/renders/delivery-manifest.json`. The older X candidate `review.G1oIO1/` remains as a revision reference. Current QA is `videos/made-with-hyperframes/qa/DELIVERY_REVIEW.md`.

The current X refinement keeps the existing editable brand-first project. The opening now begins with `MadeWithHyperframes.com` and the requested product promise; caption fragments were replaced with complete thought captions; the closing uses “Discover. Get Inspired. Create.” and “Explore the directory.” The real dark site footage, creator video, Full prompt interaction, original source link, Copy prompt → Copied, and GitHub submission guide are retained. Source build: `scripts/build-brand-first.mjs`; edit notes: `videos/made-with-hyperframes/X_REFINEMENT.md`.

HyperFrames 0.8.216 rendered all three versions. Candidate `videos/made-with-hyperframes/renders/review.G1oIO1/` passed complete decode and source checks. Encoded scene and boundary sheets were visually inspected; full mixed audio transcribed correctly, with −19.4 LUFS for both 36-second mains and −19.7 LUFS for the cutdown. See `videos/made-with-hyperframes/qa/DELIVERY_REVIEW.md` and the SHA-256 delivery manifest.

The user requested a darker, more polished film with a stronger opening. Three revised MP4s and a dark cover are delivered in `videos/made-with-hyperframes/renders/`. The old MP4s are preserved in `renders/archive-v1/`. The first seconds now use the verified moving community video with creator credit, then reveal its captured directory card on a charcoal stage. The authentic site UI, local Kokoro voice, and licensed Scott Buckley music remain. All three compositions passed HyperFrames 0.8.214 checks; final exports passed full decode, format, timing, and encoded-frame review. See `qa/DELIVERY_REVIEW.md` for evidence and the remaining listening-review limit.

---

# Production status

## Delivered — 28 October 2026

Three MP4s now exist in `videos/made-with-hyperframes/renders/`: `main-portrait.mp4` (36s), `main-landscape.mp4` (36s), and `cutdown-portrait.mp4` (15s), all 30 fps. `cover.png` and the three editable compositions are preserved.

All exports passed full decoding, resolution/fps/duration validation, source checks, and encoded-frame/transition review. Final mixed-audio transcription matches the scripts, and no clipping was measured. Listening review was not performed; see `videos/made-with-hyperframes/qa/DELIVERY_REVIEW.md` for the precise QA scope.

Resolved the obsolete helper reference and missing ffprobe dependency. Verified upgrade from HyperFrames 0.8.196 to 0.8.212. Captures and generated local audio were reused. No recapture or reinitialization occurred.

Publication music credit is in `SOURCES_AND_RIGHTS.md`. The editable preview remains available at http://localhost:3017/#project/made-with-hyperframes .

---

## Historical production notes


## Active update — 28 October 2026

The obsolete `register-voice-bus.mjs` call is absent from the current render script. Installed repository-local `ffprobe-static` and added its binary directory to the rendering PATH; the latest CLI's audio checks previously failed solely because ffprobe was missing. HyperFrames upgraded from 0.8.196 to 0.8.212 and its compatibility check now passes, including audio validation.

Browser and network execution now work in the agent session. The agent is running the existing render pipeline directly; captures, local Kokoro narration and music are being reused. Final-source checks, snapshots and MP4 QA are in progress. No new capture or audio generation is required.

---


## Current update — original media recovered; three compositions authored

`interaction-capture.m20iZP` passed both real UI/clipboard checks. Its original video has now been recovered successfully using `scripts/recover-original-media.mjs`: 10 seconds, 1280×720, 30 fps, full decode check passed. The successful homepage and both interaction takes are preserved. See `SOURCES_AND_RIGHTS.md` in the video project.

Visual inspection caught screenshot-induced scale/crop artifacts in the recordings. Clean working clips and exact retained-frame ranges are saved under `assets/edit`; Copied holds use verified screenshots. Six source contact sheets and exclusion evidence are saved under `qa/capture-review`.

Editable 36-second portrait, independently laid out landscape, and 15-second portrait cutdown now exist at `videos/made-with-hyperframes/index.html`, `landscape/index.html`, and `cutdown/index.html`. The source builder is `scripts/build-film.mjs`. Initial portrait static lint passed with zero findings. Browser-backed check/snapshot review and final MP4 exports are still pending.

The user explicitly selected local open-source audio after the original HeyGen Free-plan restriction was identified. All eight Kokoro WAVs now exist; measured caption alignment is being finished. Licensed Scott Buckley “Origami” music and source-page rights evidence are local. Original HeyGen audio is historical/internal-preview-only and must be replaced before promotional renders.

Current browser review command: `bash scripts/review-film.sh` from repository root. Agent browser/listener restrictions still require the normal terminal; no security bypass or elevated execution has been attempted.

---

## Historical state (superseded by update above)

## Current state — successful homepage capture accepted

The normal-terminal recovery succeeded at `videos/made-with-hyperframes/capture-retry.tfbBXkK9/site/` (`ok: true`, HTTP 200, five screenshots, 31 saved assets). Its screenshots and correct logo were inspected. `CAPTURE_AUDIT.md` documents the verified UI and exact recovery of the one excluded asset: the 9,227-byte **One-Shot Motion Edit** poster, recovered from the captured HTML without modifying the successful capture.

The first supplemental interaction attempt, `interaction-capture.FjGJun`, verified the actual Hyperframes → Full prompt results and **Cinematic AI Future** detail text and moving playback. It failed at the copy step: a decoded recording frame shows the real **Try again** state. This attempt has `ok: false` and `BLOCKED.md`; it is diagnostic evidence, not approved production footage.

The recorder was corrected after inspecting the failure: grant Chrome's separate `clipboard-sanitized-write` permission, prefer the website's light theme, bring the page to the foreground, and stop immediately with permission diagnostics if the site says Try again. It never replaces the label or clipboard implementation. Syntax checks pass; the corrected browser run is pending in the normal terminal.

New artifacts:

- `scripts/capture-interactions.mjs`: records both responsive layouts, real filter/navigation/copy actions, confirms clipboard contents, and freezes the original video from live metadata.
- `videos/made-with-hyperframes/STORYBOARD.md`: seven-beat main plan, recomposition direction and 15-second cutdown plan.
- `videos/made-with-hyperframes/SCRIPT.md`: 66-word main narration plus separate short take.
- `videos/made-with-hyperframes/frame.md`: preset-derived design corrected to the actual light brand tokens.
- `videos/made-with-hyperframes/audio_request*.json` and `scripts/prepare-audio.sh`: strict HeyGen narration/music preparation with completeness checks; audio not generated yet.
- `videos/made-with-hyperframes/renders/cover.png` and `cover.svg`: authored and visually inspected 1080×1920 cover using the captured brand mark and genuine poster, with creator credit.

**No main, landscape or cutdown film has been rendered.** `index.html` remains the original scaffold. Composition implementation must use a successful supplemental interaction take and measured voice timing. The final browser QA/render still requires the normal terminal under this session's permission profile.

Current next commands, from repository root:

```bash
node scripts/capture-interactions.mjs
bash scripts/prepare-audio.sh
```

Do not rerun the original homepage recovery or reinitialize. See `NEXT_STEPS.md` for prerequisites and precise outputs. The historical blockers below describe the restricted agent session, not the now-working normal terminal.

## Completed

- Read the HyperFrames entry workflow, intent and routing guidance, product-launch-video skill, and CLI capture/setup guidance.
- Checked personal preferences and recipes: both empty.
- Initialized `videos/made-with-hyperframes/` with cached CLI 0.8.196 and portrait resolution.
- Saved the user-authorized brief and deliverable requirements.

## Observed blockers

- `curl` to https://www.madewithhyperframes.com/ failed: `Could not resolve host`.
- Checks of https://registry.npmjs.org and https://example.com also failed DNS resolution, indicating an environment-wide network limitation.
- Web tool requests to both www and apex site URLs reported inaccessible; search returned no results.
- `npx hyperframes usage --json` and skill refresh could not complete normally with registry connectivity unavailable. Usage is unknown; freshness is unverified.
- Cached CLI auth status exited 1 with `fetch failed`. Sign-in and available voice/music providers remain unknown.
- Cached CLI capture exited 1 with `{"ok":false,"error":"listen EPERM: operation not permitted 127.0.0.1"}` after emitting `Failed to create stream fd: Operation not permitted`.
- Cached CLI usage returned `{"status":"unknown","reason":"usage_request_failed"}`.

The deployed website and actual browser behavior remain unverified. No partial capture is approved for use.

## Diagnosis and permitted recovery

The failing commands ran with the environment's default restricted sandbox. External network access is restricted and `sandbox_approval` is explicitly disabled (automatically rejected). Although the execution tool has a `require_escalated` parameter in its schema, this session's policy does not permit using it to request elevated execution. No elevated retry was attempted and no approval dialog was available. This is a policy restriction, not a rejected user decision.

DNS failed for unrelated domains (`madewithhyperframes.com`, `github.com`, `registry.npmjs.org`, and `example.com`). This establishes a broad resolution failure in this execution environment, not that the product domain is wrong or offline. The evidence does not distinguish a network policy effect from a host resolver fault outside the sandbox.

A minimal Node HTTP server also failed with `EPERM: listen EPERM: operation not permitted 127.0.0.1:43127`. This independently reproduces the listener prohibition without HyperFrames or the website. It is a permission failure rather than a port-in-use (`EADDRINUSE`) or website timeout. The capture cannot start its local browser infrastructure under these permissions.

The latest user instruction requires preserving the capture hard stop and using supported escalation only. No repeated restricted network/browser attempts or security workarounds were made after that instruction. See `RECOVERY.md` and `scripts/recover-capture.sh` for runnable local recovery commands, gates, and precise asset requirements.

## Local source findings (not live capture)

A sibling checkout exists at `/home/gowtham/Projects/madewithhyperframes`, commit `0a2c9b100edeba575c5f2ae428d6b3eca9b47712` (2026-10-26). Read-only inspection confirmed:

- Search, tool/category filters, and “Full prompt” selection implemented in `components/directory-grid.tsx`.
- `prompt_partial: false` determines complete-prompt inclusion.
- Detail pages include title, creator, tools, prompt, and copy control.
- `components/copy-prompt-button.tsx` sets “Copied” only after clipboard write succeeds; failure shows “Try again”.
- Light palette: background `#f3f1eb`, paper `#fbfaf7`, text `#171916`, violet `#6950de`, lime `#d8ff63`; logo at `public/icon.svg`.
- Complete-prompt candidate entries credited to Gowtham: `cinematic-ai-future-gowtham` and `macbook-pro-air-concept-gowtham`. Their playback files remain remote.
- The locally available Poultry Path MP4 has partial prompt context and is unsuitable as the complete-prompt central demo.

These findings improve preparation but do not establish deployed parity, video reuse rights, successful interaction capture, or rendered output. The creative brief and original scaffold remain unchanged.

## Resume

1. Run in an environment with working external HTTPS/DNS and permission to launch the capture browser. Refresh `product-launch-video` and inspect usage/auth status.
2. Re-read the saved brief. Capture the site into a fresh directory; require `ok: true`, no `BLOCKED.md`, and usable screenshots/structure.
3. Verify search, tool/category filters, “Full prompt,” detail metadata, exact prompt text, and actual copy feedback. Select a central full-prompt entry with confirmed promotional reuse rights. Record source URLs, credits and rights evidence.
4. Read composition, animation, keyframe, media, audio, registry and rendering contracts before implementation. Search registry for the planned continuity transitions.
5. Produce the verified storyboard/script, brand-derived visual spec, licensed audio and frozen captures. Follow the workflow's frame-worker dispatch and assembly contract.
6. Build portrait, recompose landscape, and edit the 15-second cutdown. Run checks, inspect snapshots and transitions, render all exports at 30 fps, and inspect decoded video and audio. Make the cover from a strong verified frame.

Alternatively, the user can provide authentic local interaction recordings, high-resolution screenshots, example video files, exact prompts/credits and reuse permission evidence. Confirm that source substitution before proceeding; do not manufacture a substitute directory UI.

## Brand-first product walkthrough — 29 October 2026

The user replaced the old hook concept with a new brand-first product demo. The original light and dark deliveries are archived under `videos/made-with-hyperframes/renders/archive-v1/` and `archive-v2/`. The new concept, narration, and seven-scene main edit are in `BRAND_FIRST_STORYBOARD.md`, `BRAND_FIRST_SCRIPT.md`, and `scripts/build-brand-first.mjs`.

The current site's authentic dark theme was captured successfully for portrait and landscape at `feature-capture.vGNo0i/` (manifest `ok: true`). Search for “cinematic” returns the featured Cinematic AI Future card. The website's “Submit your video” button opens the GitHub contribution guide, which offers an issue template and maintainer review. A second verified capture at `interaction-capture.dJDDI6/` (manifest `ok: true`) confirms tool filtering, Full prompt, playing detail, and Copy prompt → Copied in both formats. Source media, screenshots, voice, score, and official logo are frozen locally. No fabricated UI or submission was created.

Current render: `videos/made-with-hyperframes/qa/brand-first-render.log`. The current delivery files under `renders/` remain the earlier version until the new batch passes source, snapshot, encode, audio, and visual checks and is promoted. The new cover image is ready. The selected creator's prompt and source provenance remain in `SOURCES_AND_RIGHTS.md`.
