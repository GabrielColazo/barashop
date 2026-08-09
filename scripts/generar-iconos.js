const sharp = require('sharp');
const path = require('path');

// SVG del barco CON CARA — SOLO casco+mástil+velas+cara (sin agua/olas)
// Bounding box del barco: x=215..465 (w=250), y=50..243 (h=193)
const BOAT_ELEMENTS = `
<path stroke="#7A5230" stroke-width="5" stroke-linecap="round" d="M340 190 L340 50"/>
<path fill="#3E8E4F" d="M340 55 Q400 80 418 128 Q378 138 340 140 Z"/>
<path fill="#2F6E3C" d="M340 55 Q280 80 262 128 Q302 138 340 140 Z"/>
<path fill="#C99461" d="M215 190 Q215 220 245 232 Q292 243 340 243 Q388 243 435 232 Q465 220 465 190 Z"/>
<path fill="#A9713F" d="M226 226 Q292 241 340 241 Q388 241 454 226 L446 206 Q388 220 340 220 Q292 220 234 206 Z"/>
<rect fill="#7A5230" x="215" y="184" width="250" height="10" rx="5"/>
<circle cx="248" cy="199" r="4" fill="#7A5230" opacity="0.5"/>
<circle cx="432" cy="199" r="4" fill="#7A5230" opacity="0.5"/>
<circle cx="310" cy="199" r="4" fill="#7A5230" opacity="0.5"/>
<circle cx="370" cy="199" r="4" fill="#7A5230" opacity="0.5"/>
<circle cx="304" cy="172" r="5" fill="#1F2937"/>
<circle cx="378" cy="172" r="5" fill="#1F2937"/>
<path d="M298 186 Q340 202 382 186" fill="none" stroke="#1F2937" stroke-width="4" stroke-linecap="round"/>
<ellipse cx="288" cy="180" rx="9" ry="5" fill="#F59E0B" opacity="0.35"/>
<ellipse cx="398" cy="180" rx="9" ry="5" fill="#F59E0B" opacity="0.35"/>
`;

// Create a wrapper SVG with the boat centered at ~90% width
function makeIconSVG(bgColor) {
  // Boat bounding box: x=215..465 (w=250), y=50..243 (h=193)
  // Boat center: (340, 146.5)
  // To occupy ~90% of 1000px canvas: scale = 900/250 = 3.6
  // Strategy: translate to canvas center → scale → translate back by boat center
  const scale = 3.2; // ~80% del ancho del ícono
  const cx = 340, cy = 146.5; // boat center in SVG coords
  return `<svg xmlns="http://www.w3.org/2000/svg" width="SIZE" height="SIZE" viewBox="0 0 1000 1000">
  <rect width="1000" height="1000" fill="${bgColor}"/>
  <g transform="translate(500, 500) scale(${scale}) translate(${-cx}, ${-cy})">
    ${BOAT_ELEMENTS}
  </g>
</svg>`;
}

async function generate() {
  const outDir = path.join(__dirname, '..', 'assets', 'img', 'icons');

  const configs = [
    { name: 'icon-192.png', size: 192, bg: 'none' },
    { name: 'icon-512.png', size: 512, bg: 'none' },
    { name: 'icon-maskable-192.png', size: 192, bg: '#ffffff' },
    { name: 'icon-maskable-512.png', size: 512, bg: '#ffffff' },
  ];

  for (const cfg of configs) {
    const svgStr = makeIconSVG(cfg.bg).replace(/SIZE/g, String(cfg.size));
    const outPath = path.join(outDir, cfg.name);
    await sharp(Buffer.from(svgStr))
      .resize(cfg.size, cfg.size)
      .png()
      .toFile(outPath);
    console.log(`✓ ${cfg.name} (${cfg.size}x${cfg.size}, bg=${cfg.bg})`);
  }
}

generate().catch(err => { console.error(err); process.exit(1); });
