# HydroLab — Interactive Molecular Explorer

**Design refinement:** The latest source includes the official HydroLab cream, navy, blue, and purple palette; larger bilingual typography; higher-contrast layered cards; consistent accessible controls; responsive navigation; and creator attribution in both Persian and English.

HydroLab is a bilingual (English / Persian) chemistry learning application built with React, Vite, and Three.js. It uses the existing molecular dataset and calculated 3D conformers from the supplied Version 2 project.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. To create and preview a production build:

```bash
npm run build
npm run preview
```

The 3D coordinates are checked into `src/data/molecules.json`; Python and RDKit are not needed to run the application. `generate_data.py` is retained from the source project for reproducibility in an environment with RDKit installed.

## Features

- **Home:** HydroLab introduction, featured molecule, representative molecules, bond learning cards, a benzene insight, and links to interactive learning.
- **Molecule Explorer:** searchable and filterable library, interactive Three.js scene, molecular information, bond profile, and PubChem provenance.
- **Three rendering modes:** ball-and-stick, space-filling, and an atom-labelled structural representation. These modes alter the rendered geometry rather than only changing a label.
- **Viewer controls:** orbit, zoom, reset camera, auto-rotation, and atom labels.
- **Molecule Comparison:** compare formula, molar mass, atom counts, family, bond-order counts, structural descriptions, and SMILES strings for two selected molecules.
- **Chemistry Quiz:** localized multiple-choice questions, answer feedback, progress, scoring, and restart.
- **Persian / English:** all primary navigation and feature UI is translated, text direction follows the selected language, and the language preference is stored locally.
- **Responsive layout:** desktop three-column explorer with adaptive tablet and mobile layouts, touch-sized controls, and compact five-item mobile navigation.
- **Visual system:** centralized HydroLab palette tokens, distinct white / pale-blue / purple surfaces, larger type scales, keyboard focus indicators, and reduced-motion support.
- **Creator attribution:** footer credit in Persian and English for Baran Tavallaei.

## Project structure

```text
hydrolab/
├── index.html
├── package.json
├── vite.config.js
├── generate_data.py
└── src/
    ├── App.jsx
    ├── main.jsx
    ├── styles.css
    ├── components/
    │   └── MoleculeViewer.jsx
    └── data/
        └── molecules.json
```

## Molecular data and scientific notes

The original Version 2 molecular JSON file is preserved byte-for-byte. The ten records cover methane, ethane, propane, butane, pentane, hexane, ethene, ethyne, propene, and benzene. Formulas, atom and bond arrays, element coordinates, bond orders, identifiers, descriptions, molecular masses, and atom counts were not modified as part of the redesign.

- Compound identities, formulas, PubChem CIDs, and SMILES connectivity are referenced to PubChem records.
- Explicit hydrogens and 3D coordinates were generated from the listed SMILES using RDKit ETKDGv3, then energy-minimized with MMFF94s.
- The conformers are representative computed models. They are not experimental coordinates, quantum-chemical results, or a simulation of molecular motion.
- Benzene is rendered with a conventional alternating-bond visual cue. Its six C–C bonds are equivalent in the aromatic molecule; the alternating drawing represents one resonance form.

PubChem reference records:

| Molecule | CID | Record |
|---|---:|---|
| Methane | 297 | https://pubchem.ncbi.nlm.nih.gov/compound/297 |
| Ethane | 6324 | https://pubchem.ncbi.nlm.nih.gov/compound/6324 |
| Propane | 6334 | https://pubchem.ncbi.nlm.nih.gov/compound/6334 |
| Butane | 7843 | https://pubchem.ncbi.nlm.nih.gov/compound/7843 |
| Pentane | 8003 | https://pubchem.ncbi.nlm.nih.gov/compound/8003 |
| Hexane | 8058 | https://pubchem.ncbi.nlm.nih.gov/compound/8058 |
| Ethene | 6325 | https://pubchem.ncbi.nlm.nih.gov/compound/6325 |
| Ethyne | 6326 | https://pubchem.ncbi.nlm.nih.gov/compound/6326 |
| Propene | 8252 | https://pubchem.ncbi.nlm.nih.gov/compound/8252 |
| Benzene | 241 | https://pubchem.ncbi.nlm.nih.gov/compound/241 |

## Visual design

The page background remains warm cream (`#FFF4DE`). Primary cards use white surfaces, secondary educational cards use pale blue derived from the official `#C6DCE8` and `#A2C3D4` colors, major headings and navigation use `#284D79` / `#3C5188`, actions use `#216499`, and the interactive molecular stage remains dark navy (`#182D43`). Signature purple (`#914E91`) is limited to selected highlights and accents. Persian text uses Vazirmatn and English text uses Inter; chemical formula spans are explicitly isolated LTR in either language.

## Viewer interaction

- Drag: orbit the camera.
- Wheel / trackpad: zoom.
- Reset camera: restore the fitted view.
- Auto rotate: rotate the molecular model continuously.
- Atom labels: toggle element labels in the ball-and-stick and space-filling modes.
- Ball-and-stick: render atoms with bond cylinders.
- Space-filling: render larger atoms while hiding the bond rods.
- Structural formula: render atom labels and bond-order rods without atom spheres.

The renderer limits device pixel ratio for mobile performance and disposes scene geometry, materials, textures, controls, resize observers, and animation frames when the molecule or viewer mode changes.

## Localization

The UI starts in English unless a saved language preference exists. Select the language control to switch between English (LTR) and Persian (RTL). The preference is stored as `hydrolab-language` in local storage. Chemical formulas and notation remain unchanged between languages.

## Known limitations

- The library is the supplied ten-molecule hydrocarbon collection; it is not a general-purpose chemistry database.
- The structural representation is an atom-labelled 3D connectivity view derived from the supplied coordinates, not a 2D textbook skeletal drawing.
- Persian and Inter fonts are requested from Google Fonts; system fallbacks are used when the font service is unavailable.
- Browser-based visual QA and device-level testing depend on an available browser runtime and are not implied by a successful production build.
