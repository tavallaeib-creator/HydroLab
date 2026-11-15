import { readFile, writeFile } from 'node:fs/promises';

async function replaceOnce(path, before, after, label) {
  const url = new URL('./' + path, import.meta.url);
  const source = await readFile(url, 'utf8');
  if (source.includes(after)) return false;
  const index = source.indexOf(before);
  if (index < 0) throw new Error('HydroLab refinement not found: ' + label + ' in ' + path);
  await writeFile(url, source.slice(0, index) + after + source.slice(index + before.length));
  return true;
}

const changes = [];
const apply = async (...args) => { if (await replaceOnce(...args)) changes.push(args[3]); };

await apply('src/App.jsx',
  "import { useEffect, useMemo, useState } from 'react';",
  "import { lazy, Suspense, useEffect, useMemo, useState } from 'react';",
  'lazy-load React viewer');
await apply('src/App.jsx',
  "import MoleculeViewer from './components/MoleculeViewer.jsx';",
  "const MoleculeViewer = lazy(() => import('./components/MoleculeViewer.jsx'));",
  'lazy-load Three.js viewer');
await apply('src/App.jsx',
  "viewerUnavailable: '3D graphics are not available in this browser.', collectionLabel:",
  "viewerUnavailable: '3D graphics are not available in this browser.', viewerLoading: 'Loading molecular viewer…', collectionLabel:",
  'English loading copy');
await apply('src/App.jsx',
  "viewerUnavailable: 'نمایش سه‌بعدی در این مرورگر در دسترس نیست.', collectionLabel:",
  "viewerUnavailable: 'نمایش سه‌بعدی در این مرورگر در دسترس نیست.', viewerLoading: 'در حال بارگذاری نمایشگر مولکولی…', collectionLabel:",
  'Persian loading copy');
await apply('src/App.jsx',
  "const matchesSearch = !needle || [molecule.name, molecule.formula, molecule.nameFa, molecule.smiles].some((value) => String(value).toLocaleLowerCase().includes(needle));",
  "const matchesSearch = !needle || [molecule.name, molecule.formula, molecule.formulaFa, molecule.nameFa, molecule.smiles, CATEGORY_LABEL.en[molecule.category], CATEGORY_LABEL.fa[molecule.category]].some((value) => String(value ?? '').toLocaleLowerCase().includes(needle));",
  'search Persian formula and family names');
await apply('src/App.jsx',
  '<div className="stage-corner stage-top-left"><span className="live-dot" />{copy.liveModelLabel}</div><div className="stage-corner stage-top-right">{molecule.atomCount} {copy.atomUnit}</div><div className="stage-coordinate">X <span>—</span> Y <span>—</span> Z <span>—</span></div>',
  '<div className="stage-corner stage-top-left"><span className="live-dot" />{copy.liveModelLabel}</div><div className="stage-corner stage-top-right">{molecule.atomCount} {copy.atomUnit}</div>',
  'remove placeholder coordinates');
await apply('src/App.jsx',
  '<div className="viewer-stage"><MoleculeViewer molecule={molecule} showLabels={showLabels} resetTrigger={resetTrigger} mode={viewMode} autoRotate={autoRotate} language={language} unavailableText={copy.viewerUnavailable} />',
  '<div className="viewer-stage"><Suspense fallback={<div className="viewer-loading" role="status">{copy.viewerLoading}</div>}><MoleculeViewer molecule={molecule} showLabels={showLabels} resetTrigger={resetTrigger} mode={viewMode} autoRotate={autoRotate} language={language} unavailableText={copy.viewerUnavailable} /></Suspense>',
  'add localized viewer loading state');

const option = "{molecules.map((molecule) => <option key={molecule.id} value={molecule.id}>{language === 'fa' ? molecule.nameFa : molecule.name} ({molecule.formula})</option>)}";
await apply('src/App.jsx', option,
  "{molecules.map((molecule) => <option key={molecule.id} value={molecule.id} disabled={molecule.id === secondId}>{language === 'fa' ? molecule.nameFa : molecule.name} ({molecule.formula})</option>)}",
  'prevent duplicate molecule in first comparison select');
await apply('src/App.jsx', option,
  "{molecules.map((molecule) => <option key={molecule.id} value={molecule.id} disabled={molecule.id === firstId}>{language === 'fa' ? molecule.nameFa : molecule.name} ({molecule.formula})</option>)}",
  'prevent duplicate molecule in second comparison select');
await apply('src/App.jsx',
  "{feedbackShown && <div className={isCorrect ? 'quiz-feedback correct' : 'quiz-feedback incorrect'}><strong>{isCorrect ? copy.correct : copy.incorrect}</strong>",
  "{feedbackShown && <div className={isCorrect ? 'quiz-feedback correct' : 'quiz-feedback incorrect'} role=\"status\" aria-live=\"polite\" aria-atomic=\"true\"><strong>{isCorrect ? copy.correct : copy.incorrect}</strong>",
  'announce quiz feedback accessibly');

const oldLoop = [
"    let disposed = false;",
"    let renderFrame = null;",
"    let autoFrame = null;",
"    const renderOnce = () => {",
"      if (disposed || renderFrame !== null) return;",
"      renderFrame = window.requestAnimationFrame(() => {",
"        renderFrame = null;",
"        if (disposed) return;",
"        controls.update();",
"        renderer.render(scene, camera);",
"      });",
"    };",
"    const animate = () => {",
"      if (disposed) return;",
"      if (!autoRotateRef.current) { autoFrame = null; return; }",
"      moleculeGroup.rotation.y += 0.0028;",
"      controls.update();",
"      renderer.render(scene, camera);",
"      autoFrame = window.requestAnimationFrame(animate);",
"    };",
"    startAutoRotateRef.current = () => {",
"      if (autoFrame === null && !disposed) animate();",
"    };",
"    controls.addEventListener('change', renderOnce);",
"    requestRenderRef.current = renderOnce;",
"",
"    const handleResize = () => {",
"      const nextWidth = Math.max(1, mount.clientWidth);",
"      const nextHeight = Math.max(1, mount.clientHeight);",
"      camera.aspect = nextWidth / nextHeight;",
"      camera.updateProjectionMatrix();",
"      renderer.setSize(nextWidth, nextHeight);",
"      renderOnce();",
"    };"
].join('\n');
const newLoop = [
"    let disposed = false;",
"    let renderFrame = null;",
"    const clock = new THREE.Clock();",
"",
"    // Keep OrbitControls damping alive after input, then sleep when the model is idle.",
"    const scheduleRender = () => {",
"      if (disposed || renderFrame !== null) return;",
"      renderFrame = window.requestAnimationFrame(renderFrameStep);",
"    };",
"    const renderFrameStep = () => {",
"      renderFrame = null;",
"      if (disposed) return;",
"      const delta = Math.min(clock.getDelta(), 0.05);",
"      if (autoRotateRef.current) moleculeGroup.rotation.y += 0.168 * delta;",
"      const controlsAreMoving = controls.update();",
"      renderer.render(scene, camera);",
"      if (autoRotateRef.current || controlsAreMoving) scheduleRender();",
"    };",
"",
"    startAutoRotateRef.current = scheduleRender;",
"    requestRenderRef.current = scheduleRender;",
"    controls.addEventListener('start', scheduleRender);",
"    controls.addEventListener('change', scheduleRender);",
"",
"    const handleResize = () => {",
"      const nextWidth = Math.max(1, mount.clientWidth);",
"      const nextHeight = Math.max(1, mount.clientHeight);",
"      camera.aspect = nextWidth / nextHeight;",
"      camera.updateProjectionMatrix();",
"      renderer.setSize(nextWidth, nextHeight);",
"      scheduleRender();",
"    };"
].join('\n');
await apply('src/components/MoleculeViewer.jsx', oldLoop, newLoop, 'schedule smooth and efficient viewer rendering');
await apply('src/components/MoleculeViewer.jsx',
  "      if (renderFrame !== null) window.cancelAnimationFrame(renderFrame);\n      if (autoFrame !== null) window.cancelAnimationFrame(autoFrame);\n      resizeObserver?.disconnect();\n      if (!resizeObserver) window.removeEventListener('resize', handleResize);\n      controls.removeEventListener('change', renderOnce);\n      controls.dispose();",
  "      if (renderFrame !== null) window.cancelAnimationFrame(renderFrame);\n      resizeObserver?.disconnect();\n      if (!resizeObserver) window.removeEventListener('resize', handleResize);\n      controls.removeEventListener('start', scheduleRender);\n      controls.removeEventListener('change', scheduleRender);\n      controls.dispose();",
  'clean up scheduled viewer frames and listeners');

const cssUrl = new URL('./src/styles.css', import.meta.url);
let css = await readFile(cssUrl, 'utf8');
if (!css.includes('.viewer-loading {')) {
  css += '\n/* The WebGL viewer is loaded only when the explorer is opened. */\n.viewer-loading {\n  position: absolute;\n  inset: 0;\n  display: grid;\n  place-items: center;\n  padding: 24px;\n  color: var(--viewer-text, #f5f8fc);\n  background: var(--viewer-bg, #182d43);\n  font-size: 13px;\n  text-align: center;\n}\n';
  await writeFile(cssUrl, css);
  changes.push('add localized loading surface');
}

const viteUrl = new URL('./vite.config.js', import.meta.url);
let vite = await readFile(viteUrl, 'utf8');
if (!vite.includes('manualChunks')) {
  const marker = '  plugins: [react()],\n';
  if (!vite.includes(marker)) throw new Error('Vite plugin declaration not found.');
  const addition = "  plugins: [react()],\n  build: {\n    rollupOptions: {\n      output: {\n        manualChunks(id) {\n          if (id.includes('/node_modules/three/')) return 'three-vendor';\n        },\n      },\n    },\n  },\n";
  await writeFile(viteUrl, vite.replace(marker, addition));
  changes.push('split Three.js into a vendor chunk');
}

console.log(changes.length ? 'Applied: ' + changes.join('; ') : 'HydroLab refinements already applied.');
