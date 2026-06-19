# Lighthouse Performance Audit — Seamless Skies

## What is Lighthouse?

Lighthouse is an open-source, automated tool by Google for measuring web page quality across:
- **Performance** — Core Web Vitals, load speed, render metrics
- **Accessibility** — ARIA, contrast, keyboard navigation
- **Best Practices** — HTTPS, console errors, modern APIs
- **SEO** — meta tags, headings, crawlability
- **PWA** — Progressive Web App compliance

---

## How to Run a Lighthouse Audit

### Method 1 — Chrome DevTools (No install required)
1. Run the app locally: `npm run dev`
2. Open Chrome and navigate to `http://localhost:5173`
3. Open DevTools (`F12` or `Ctrl+Shift+I`)
4. Click the **Lighthouse** tab
5. Select **Desktop** device, check all categories
6. Click **Analyze page load**

### Method 2 — CLI (Most reliable, headless)
```bash
# One-time install
npm install -g lighthouse

# Run audit against local dev server
npm run dev &
npx lighthouse http://localhost:5173 \
  --output html \
  --output-path ./lighthouse-report.html \
  --chrome-flags="--headless"

# Open report
start lighthouse-report.html    # Windows
open lighthouse-report.html     # macOS
```

### Method 3 — VS Code Extension
Install the **Lighthouse** extension from the VS Code Marketplace. Run audits directly from the editor.

---

## Expected Performance Metrics

> Scores are based on the production build (`npm run build && npm run preview`) on a modern machine.

| Metric | Target | Notes |
|---|---|---|
| **Performance** | ≥ 80 | Leaflet + tile loading affects initial LCP |
| **Accessibility** | ≥ 90 | ARIA labels, roles, and htmlFor pairs added |
| **Best Practices** | ≥ 90 | HTTPS required in production |
| **SEO** | ≥ 90 | Title tag and meta description in index.html |

## Core Web Vitals Targets

| Vital | Target | Description |
|---|---|---|
| **LCP** (Largest Contentful Paint) | < 2.5 s | Time until largest element renders |
| **FID** / **INP** | < 100 ms | Interaction responsiveness |
| **CLS** (Cumulative Layout Shift) | < 0.1 | Visual stability |
| **FCP** (First Contentful Paint) | < 1.8 s | Time to first rendered content |
| **TTI** (Time to Interactive) | < 3.8 s | Time until fully interactive |

---

## Performance Optimisations Already Applied

| Optimisation | File | Impact |
|---|---|---|
| `React.lazy` + `Suspense` | `App.jsx` | FlightFinder & LostAndFound code-split |
| `React.memo` | `FlightFinder.jsx` | Skips re-render unless flights/props change |
| `useMemo` for derived lists | `FlightFinder.jsx`, `FlightDetails.jsx` | Avoids recomputation on every render |
| Vendor chunk splitting | `vite.config.js` | Separates react + leaflet into cached chunks |
| `manualChunks` | `vite.config.js` | react-vendor, leaflet-vendor chunks |
| Source maps | `vite.config.js` | Easier debugging without performance penalty |
| Key-based reconciliation | `App.jsx` | `key={selectedFlight?.icao24}` prevents stale renders |

---

## Running Against the Production Build

```bash
npm run build
npm run preview          # Serves on http://localhost:4173
npx lighthouse http://localhost:4173 --output html --output-path ./lighthouse-report.html
```

---

## Interpreting Results

- **Red (0–49)**: Requires immediate attention
- **Orange (50–89)**: Needs improvement
- **Green (90–100)**: Good

Focus first on the **Performance** and **Accessibility** tabs. In the Opportunities section, look for:
- "Eliminate render-blocking resources" — Outfit font is async-loaded already
- "Properly size images" — hero.png is small (13 KB), acceptable
- "Reduce unused JavaScript" — vendor splitting addresses this
