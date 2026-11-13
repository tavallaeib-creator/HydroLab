# Version comparison: Version 1 vs Version 2

## Result

Version 2 is the preferred development base. It retains the same application components and molecular dataset as Version 1 while already containing a more developed visual stylesheet and small Three.js presentation refinements. Version 1 was not modified.

## Files that differ

| File | Difference observed |
|---|---|
| `README.md` | Version 1 uses the Molecule Atlas name and a shorter project guide. Version 2 labels itself as a Version 2 copy and documents its visual refinement and dataset provenance. |
| `index.html` | Browser title, theme color, and description differ. Version 1 is branded Molecule Atlas; Version 2 has a slightly refined Molecule Atlas title and metadata. |
| `package.json` | Package name and version differ (`molecule-atlas` / `1.0.0` vs `molecule-atlas` / `2.0.0`). Scripts and dependency lists are the same. |
| `src/components/MoleculeViewer.jsx` | Version 2 adds visual refinements to atom appearance, hydrogen contrast, bond-offset direction, and viewer presentation. |
| `src/styles.css` | Version 2 adds a substantial visual-system refinement over Version 1 (about 46.3 KB vs 25.7 KB). |

## Files that are unchanged between the supplied archives

- `src/App.jsx`
- `src/main.jsx`
- `src/data/molecules.json`
- `generate_data.py`
- `vite.config.js`
- `.gitignore`

Version 2 also wraps the project files in a `molecule-atlas-v2/` directory and includes empty `src/` and `public/` directory entries in the archive.

## Dataset validation

The two supplied `src/data/molecules.json` files are byte-for-byte identical. In the HydroLab working copy, `generate_data.py` was also adjusted to write to the project-relative `src/data/molecules.json` path instead of the old `/mnt/data/molecule-atlas/` location; the molecule definitions and generation procedure were not changed. The ten stored records cover methane, ethane, propane, butane, pentane, hexane, ethene, ethyne, propene, and benzene. Internal checks confirmed that atom arrays match stored atom counts, element counts match carbon/hydrogen fields, and every bond endpoint refers to an existing atom.
