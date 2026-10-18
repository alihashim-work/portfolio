# Agency CXO Office

A 15 × 12 m vintage advertising-agency executive suite, built as a lightweight static Three.js website.

**Live:** https://alihashim-work.github.io/agency-cxo-office/

## Revision 02 — material and detail study

This is an improved real-time architectural concept, **not a finished photorealistic visualization**. All furniture and textures are generated in code. There are no downloaded furniture assets, generated-image services, accounts, trackers, asset subscriptions, API keys or backend.

- Corrected human-scale furniture: a 2.65 × 1.1 m walnut desk with a nominal 78 cm desktop, drawer fronts, brass pulls, leather blotter, banker lamp and rotary telephone.
- Cognac leather seating with curved arms, welt details, buttons and upholstery tacks; a detailed coffee table and ceramics.
- Individual oak floorboards, wood grain, subtle upholstery grain, textile curtains, a patterned carpet, wall panelling and a populated library.
- A reel projector facing the portfolio screen, framed campaign studies, a pinboard, an archive cabinet and plants.
- Warm daylight, cast shadows, material reflections, and a screening mode that closes the curtains and dims daylight.
- Arrival, desk, lounge and cutaway overview camera presets. The ceiling, front window wall and right wall are hidden only for the overview.
- High-detail toggle adjusts render resolution. Static geometry is batched by material, and the 1,000 floorboards are instanced.

The room envelope uses a **4 m ceiling**, following the original brief; the earlier website blockout had 4.5 m walls. Furniture placement is conceptual, not a construction or circulation-compliance drawing.

## Files and controls

- `index.html`: accessible interface, dependency loading and error state.
- `office.js`: deterministic geometry, materials, lighting and controls.
- `baseline.html`: the original blockout, preserved for comparison.

Drag to orbit, scroll to zoom, right-drag to pan. Use the view buttons to return to an interior camera after orbiting outside the room. Reduced-motion preferences disable camera transitions.

## Validation and limits

JavaScript syntax and the actual Three.js geometry were checked locally. Checks cover finite vertex data, the 15 × 12 m footprint, desktop height, curtain/daylight mode changes, overview visibility, and unchanged world bounds after geometry batching. Revision 02 contains approximately 110k triangles, 1,000 instanced floorboards and 101 mesh batches/objects after optimization.

Software geometry previews were inspected for composition. These are not GPU renders. The Work cloud browser could load the website but could not create a WebGL context, so final WebGL shading, performance and visual fidelity must still be verified on a WebGL-capable device. The user confirmed the original baseline rendered in their browser.

The site requires WebGL and access to jsDelivr for the pinned Three.js 0.165.0 module and its official addons. A friendly error is shown if dependencies or WebGL fail. No dependency upgrades are introduced by this revision.

## Spline workspace

The existing separate editable Spline concept is `Agency CXO Office — 15x12m Vintage Suite`, UUID `d049e5d9-a108-4201-9864-5ae4ffa89daa`. It is **not automatically synchronized** with this website. Revision 02 changes the website; it does not claim to update the Spline scene.

## Cost, licensing and repository scope

All work remains in `alihashim-work/agency-cxo-office`. Hosting uses the already enabled GitHub Pages main/root configuration. No paid services or workflows were added.

Three.js and its official addons are used under the MIT license: https://threejs.org/license . The pinned upstream license is https://cdn.jsdelivr.net/npm/three@0.165.0/LICENSE . Procedural geometry, textures and campaign graphics are authored for this project; no third-party image or furniture asset licenses are required.

Git history and `baseline.html` preserve the earlier version. Future work can refine the material response and add properly licensed detailed models if needed, without treating this concept as already photorealistic.
