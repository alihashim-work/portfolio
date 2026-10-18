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
| `assets/models/` | Each model is a small `.json` header plus a binary `.bin` of quantised geometry. `office20` (room, walnut executive desk, 16mm projector, stand) loads first; scanned furniture streams in afterwards. Textures sit in `assets/models/tex/`. |
| `data/` | All content as plain JSON: `films.json` (75 films with YouTube links and thumbnails), `statics.json`, `campaigns.json`, `scripts.json` (full Urdu and English scripts), `clients.json`, `career.json`, `books.json`. Edit these to update content; the 3D bookshelf and career board read them directly. |
| `sw.js` | Service worker: repeat visits load from the device cache. |
| `office-study/` | The earlier "Agency CXO Office" procedural study, preserved unchanged. |

## How it loads (fast first, heavy later)

1. HTML and CSS (~100 KB) paint the page and a photographic poster of the room immediately.
2. Portfolio images load lazily as panels open.
3. The 3D module downloads only the room shell, desk and projector (about 0.9 MB compressed), then the live room fades in over the poster; furniture streams in afterwards.
4. Everything heavy is cached by the service worker for return visits.

## Credits and licences

- Window view: "Faisal Mosque in the background of Centaurus Mall", Ahmed Iftikhar Sarmad, CC BY-SA 4.0, via Wikimedia Commons (cropped).
- Scanned furniture, materials and environment: Poly Haven, CC0.
- Three.js and addons: MIT.
- Desk, projector, room shell, corkboard, whiteboard and career board: modelled for this project.
- Client work is shown for portfolio purposes; marks belong to their owners.

## Status (honest)

The path-traced renders of the desk and projector are close to photographic. The live browser room is a real-time approximation: no baked global illumination yet, a sparsely furnished 20 × 20 m space, and simple typewriter and curtain models. See `docs/ROADMAP.md`.
