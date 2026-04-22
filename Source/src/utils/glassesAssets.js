const svgToDataUrl = (svgString) => {
  const base64 = btoa(unescape(encodeURIComponent(svgString)))
  return `data:image/svg+xml;base64,${base64}`
}

export const glassesAssets = {
  'horn-rimmed': svgToDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100">
    <defs>
      <linearGradient id="f1" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:#3d2317"/>
        <stop offset="100%" style="stop-color:#1a0f0a"/>
      </linearGradient>
    </defs>
    <ellipse cx="50" cy="50" rx="40" ry="35" fill="none" stroke="url(#f1)" stroke-width="8"/>
    <ellipse cx="150" cy="50" rx="40" ry="35" fill="none" stroke="url(#f1)" stroke-width="8"/>
    <path d="M 90 50 Q 100 45 110 50" fill="none" stroke="url(#f1)" stroke-width="6"/>
    <path d="M 10 40 L 0 35" fill="none" stroke="url(#f1)" stroke-width="6"/>
    <path d="M 190 40 L 200 35" fill="none" stroke="url(#f1)" stroke-width="6"/>
  </svg>`),
  'metal-round': svgToDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100">
    <defs>
      <linearGradient id="g1" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:#ffd700"/>
        <stop offset="100%" style="stop-color:#b8860b"/>
      </linearGradient>
    </defs>
    <circle cx="50" cy="50" r="35" fill="none" stroke="url(#g1)" stroke-width="3"/>
    <circle cx="150" cy="50" r="35" fill="none" stroke="url(#g1)" stroke-width="3"/>
    <path d="M 85 50 L 115 50" fill="none" stroke="url(#g1)" stroke-width="3"/>
    <path d="M 85 55 L 115 55" fill="none" stroke="url(#g1)" stroke-width="3"/>
    <path d="M 15 50 L 0 48" fill="none" stroke="url(#g1)" stroke-width="3"/>
    <path d="M 185 50 L 200 48" fill="none" stroke="url(#g1)" stroke-width="3"/>
  </svg>`),
  'clear-crystal': svgToDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100">
    <defs>
      <linearGradient id="c1" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:#f5f5f5;stop-opacity:0.9"/>
        <stop offset="100%" style="stop-color:#d4d4d4;stop-opacity:0.7"/>
      </linearGradient>
    </defs>
    <ellipse cx="50" cy="50" rx="38" ry="33" fill="none" stroke="url(#c1)" stroke-width="5"/>
    <ellipse cx="150" cy="50" rx="38" ry="33" fill="none" stroke="url(#c1)" stroke-width="5"/>
    <path d="M 88 50 Q 100 47 112 50" fill="none" stroke="url(#c1)" stroke-width="4"/>
    <path d="M 12 42 L 0 38" fill="none" stroke="url(#c1)" stroke-width="4"/>
    <path d="M 188 42 L 200 38" fill="none" stroke="url(#c1)" stroke-width="4"/>
  </svg>`),
  'aviator': svgToDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100">
    <defs>
      <linearGradient id="a1" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:#d0d0d0"/>
        <stop offset="100%" style="stop-color:#707070"/>
      </linearGradient>
      <linearGradient id="a2" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:#1a1a2e;stop-opacity:0.95"/>
        <stop offset="100%" style="stop-color:#0a0a15;stop-opacity:0.98"/>
      </linearGradient>
    </defs>
    <path d="M 15 25 Q 50 15 85 25 Q 85 70 50 80 Q 15 70 15 25 Z" fill="url(#a2)" stroke="url(#a1)" stroke-width="3"/>
    <path d="M 115 25 Q 150 15 185 25 Q 185 70 150 80 Q 115 70 115 25 Z" fill="url(#a2)" stroke="url(#a1)" stroke-width="3"/>
    <path d="M 85 30 L 115 30" fill="none" stroke="url(#a1)" stroke-width="3"/>
    <path d="M 85 35 L 115 35" fill="none" stroke="url(#a1)" stroke-width="2"/>
    <path d="M 15 35 L 0 32" fill="none" stroke="url(#a1)" stroke-width="3"/>
    <path d="M 185 35 L 200 32" fill="none" stroke="url(#a1)" stroke-width="3"/>
  </svg>`)
}

export function createGlassesImage(type) {
  return glassesAssets[type] || null
}
