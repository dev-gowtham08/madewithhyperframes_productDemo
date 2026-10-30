# Resume authentic capture

Run these commands in a normal local terminal, not this restricted agent session. No sudo, browser sandbox disabling, alternative DNS routing, or project reinitialization is needed.

```bash
cd /home/gowtham/Projects/madewithhyperframes-product-demo
bash scripts/recover-capture.sh
```

Requires Node 22+, npm, working HTTPS/DNS, and a Chromium-compatible browser usable by HyperFrames. The script checks the website and npm registry, tests a loopback listener on a free port, and captures with the project's existing CLI version, 0.8.196. It preserves `BRIEF.md`, `index.html`, `hyperframes.json`, and the original failed `capture/` directory. Each attempt gets a fresh `capture-retry.XXXXXXXX/` directory containing logs and `site/` output.

If browser setup fails after those preflights pass, run:

```bash
cd /home/gowtham/Projects/madewithhyperframes-product-demo/videos/made-with-hyperframes
npx --yes hyperframes@0.8.196 doctor --json
npx --yes hyperframes@0.8.196 browser --help
```

Follow the installed CLI's browser setup instructions. A longer capture timeout will not resolve DNS or `EPERM`. Do not consume an attempt containing `BLOCKED.md` or lacking an explicit `ok: true` result. The recovery script checks structural output; a person/agent must also inspect the screenshots and page content. Refresh the workflow skills and check providers after access is restored:

```bash
npx --yes hyperframes@0.8.196 skills update product-launch-video
npx --yes hyperframes@0.8.196 usage --json
npx --yes hyperframes@0.8.196 auth status
```

Auth status exiting 1 is not by itself evidence of a capture failure. Read its explanation; select an available voice/music provider without dropping the requested audio.

## Required assets and evidence

1. **Directory captures:** current home/directory page, selected Hyperframes or Opus tab (or relevant category), then the actual “Full prompt” active state and changed results. Capture at 2× pixel density for enlarged text. Record the real clicks and cursor coordinates.
2. **One complete-prompt project:** its actual card, detail view, playable original excerpt, title, creator, tool metadata, full prompt text, “Copy prompt” click, and actual successful “Copied” state. Record the page URL, original media URL, creator URL and reuse permission/license. The opening excerpt and central demo must refer to the same entry.
3. **Specific source candidates:** local data lists `https://www.madewithhyperframes.com/projects/cinematic-ai-future-gowtham` and `/projects/macbook-pro-air-concept-gowtham` as complete-prompt entries credited to Gowtham. Their media is remotely hosted; a playable, locally frozen file is still required. These are candidates, not live-verified selections. The available local `public/videos/poultry-path-en.mp4` belongs to `poultry-path-demo-video-d1gv55`, marked `prompt_partial: true`; do not use it for the full-prompt payoff.
4. **Expansion montage:** distinct verified Motion, Product Demo and Explainer examples with local excerpt/poster assets, visible creator attribution and reuse evidence. Category labels must match the actual site.
5. **Brand:** current `/icon.svg`, CSS color/font tokens and required font files/license. The sibling checkout provides source evidence, but compare it with the successful live capture before finalizing.
6. **Audio:** English narration with timings, a promotional-use music file and its license/source, and any interface sounds with rights evidence. All files must be local before render.

The sibling source repository is `/home/gowtham/Projects/madewithhyperframes`, commit `0a2c9b100edeba575c5f2ae428d6b3eca9b47712`. Its code confirms filters and copy feedback, but it is not a successful current-site capture. Preserve this distinction.

## Production after successful capture

Resume the seven-beat brief; do not reinitialize. Inspect and adopt the successful fresh capture as the workflow source, then build the visual spec, storyboard, narration, frame compositions, three edits and cover. Run the checks/snapshots required by the installed workflow before rendering.

Once the portrait composition is actually implemented and inspected, its render command is:

```bash
cd /home/gowtham/Projects/madewithhyperframes-product-demo/videos/made-with-hyperframes
npm run check
npx --yes hyperframes@0.8.196 snapshot --at 1.5,2.9,3.2,5,6.9,7.2,10,12.9,13.2,16,18.9,19.2,23,26.9,27.2,29,30.9,31.2,33,35.5
npx --yes hyperframes@0.8.196 render --fps 30 --quality delivery --output renders/main-portrait.mp4
ffprobe -v error -show_entries stream=codec_name,width,height,r_frame_rate:format=duration -of json renders/main-portrait.mp4
```

**Do not run the rendering block against the current blank scaffold.** Landscape and cutdown compositions still need authoring. Each needs its own checks, snapshot inspection and export review; changing render dimensions is not landscape recomposition. Verify the main films are approximately 36 seconds, the cutdown 15 seconds, and each is 30 fps. Decode and inspect transition boundaries and full exports; listen to the audio and verify the end-card hold.
