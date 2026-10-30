import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const project = path.join(repo, 'videos/made-with-hyperframes');
const require = createRequire(path.join(project, 'package.json'));
const sharp = require('sharp');
const data = (file, mime) => `data:${mime};base64,${fs.readFileSync(file).toString('base64')}`;
const logo = data(path.join(project, 'assets/brand/icon.svg'), 'image/svg+xml');
const poster = data(path.join(project, 'assets/edit/cover-hero.png'), 'image/png');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1080" height="1920" viewBox="0 0 1080 1920">
<defs><clipPath id="poster"><rect x="72" y="710" width="936" height="527" rx="22"/></clipPath></defs>
<rect width="1080" height="1920" fill="#0c0d12"/>
<image x="72" y="116" width="76" height="76" xlink:href="${logo}"/>
<g font-family="Liberation Sans, sans-serif" fill="#f6f5f1">
<text x="170" y="143" font-size="22" font-weight="700" letter-spacing="2">MADE WITH</text>
<text x="170" y="181" font-size="36" font-weight="700">Hyperframes</text>
<text x="72" y="345" font-size="94" font-weight="700" letter-spacing="-4">Great video.</text>
<text x="72" y="462" font-size="94" font-weight="700" letter-spacing="-4">What was</text>
<rect x="64" y="497" width="670" height="122" rx="10" fill="#d8ff63"/>
<text x="84" y="589" fill="#171916" font-size="94" font-weight="700" letter-spacing="-4">the prompt?</text>
<image x="72" y="710" width="936" height="527" preserveAspectRatio="xMidYMid slice" clip-path="url(#poster)" xlink:href="${poster}"/>
<text x="74" y="1288" font-size="34" font-weight="700">Cinematic AI Future</text>
<text x="74" y="1333" font-size="28" fill="#b9b8c5">By Gowtham · Made with Hyperframes</text>
<path d="M74 1402H1006" stroke="#5d4e88" stroke-width="2"/>
<text x="74" y="1478" font-size="39" font-weight="700">Community videos.</text>
<text x="74" y="1531" font-size="39" fill="#a790ff" font-weight="700">Creative starting points.</text>
<text x="74" y="1660" font-size="40" font-weight="700">madewithhyperframes.com</text>
<text x="74" y="1720" font-size="29" fill="#b9b8c5">Explore the directory</text>
</g></svg>`;
const output = path.join(project, 'renders');
fs.mkdirSync(output, { recursive: true });
fs.writeFileSync(path.join(output, 'cover.svg'), svg);
await sharp(Buffer.from(svg)).png().toFile(path.join(output, 'cover.png'));
console.log('Cover written: renders/cover.png and editable renders/cover.svg');
