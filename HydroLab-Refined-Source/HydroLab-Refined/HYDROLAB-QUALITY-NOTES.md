# HydroLab quality refinement

This source package keeps the existing HydroLab name, title, logo text, molecule records, routes, and feature set.

The install/build hook applies focused source refinements:
- load the existing Three.js viewer only when the Explorer view is opened;
- keep OrbitControls damping alive after input and sleep the render loop when idle;
- search Persian formula and both language variants of molecule family names;
- prevent selecting the same molecule twice in the comparison view;
- announce quiz feedback accessibly and remove a decorative coordinate placeholder;
- split the Three.js dependency into its own build chunk.

Run npm install, npm run test:data where available, and npm run build before deploying. The ten-molecule source dataset is preserved.
