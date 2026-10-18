# Ali Hashim: portfolio

Creative strategist and bilingual (Urdu and English) copywriter. This repository holds the portfolio website: a walk-through writers' office in 3D, with a Classic View that works without 3D.

## What's here

| Path | What it is |
|---|---|
| `index.html` | The whole portfolio: text, Urdu typography, campaigns, films, statics, scripts, clients, career and contact. Works on its own (Classic View) in about 70 KB. |
| `css/site.css`, `js/ui.js` | Layout, lightbox, Classic View routing. |
| `js/studio.js` | The 3D office (Three.js 0.163 from jsDelivr): guided scroll tour, free look and walk, screening mode, zoom-in panels. Loaded after the page is usable. |
| `assets/img/` | Thumbnails, statics, logos, portrait, and `poster.webp` (a path-traced still shown instantly while 3D loads). |
| `assets/textures/` | Photo-scanned PBR materials (walnut, herringbone parquet, velvet, leather, plaster), interior environment, window plate. |
| `assets/models/` | `office20.json` (20 × 20 m room, walnut executive desk, 16mm projector, stand) and scanned furniture. Geometry is quantised; textures sit in `assets/models/tex/`. |
| `sw.js` | Service worker: repeat visits load from the device cache. |
| `office-study/` | The earlier "Agency CXO Office" procedural study, preserved unchanged. |

## How it loads (fast first, heavy later)

1. HTML and CSS (~100 KB) paint the page and a photographic poster of the room immediately.
2. Portfolio images load lazily as panels open.
3. The 3D module and room assets download in the background, then the live room fades in over the poster.
4. Everything heavy is cached by the service worker for return visits.

## Credits and licences

- Window view: "Faisal Mosque in the background of Centaurus Mall", Ahmed Iftikhar Sarmad, CC BY-SA 4.0, via Wikimedia Commons (cropped).
- Scanned furniture, materials and environment: Poly Haven, CC0.
- Three.js and addons: MIT.
- Desk, projector, room shell, corkboard, whiteboard and career board: modelled for this project.
- Client work is shown for portfolio purposes; marks belong to their owners.

## Status (honest)

The path-traced renders of the desk and projector are close to photographic. The live browser room is a real-time approximation: no baked global illumination yet, a sparsely furnished 20 × 20 m space, and simple typewriter and curtain models. See `docs/ROADMAP.md`.

## Deployment repair — 18 October 2026

The supplied portfolio is now the homepage. Asset directories have been restored from the original uploaded blobs, without removing the root uploads. The original 15 × 12 m office remains at `office-study/`. The supplied newer room uses its 20 × 20 m layout. Missing prop wood material references and graphics failure handling were corrected. Classic View works without WebGL, including campaign details, film links, image enlargement, Urdu scripts, client credits and contact.

Live: https://alihashim-work.github.io/portfolio/

This is the originally authorized agency-cxo-office repository, renamed to portfolio (GitHub ID 1424338700). No additional repository or paid service was created. GPU rendering and photorealism still require visual verification on a WebGL-capable device; do not treat the photographic poster as proof of live-render quality.
