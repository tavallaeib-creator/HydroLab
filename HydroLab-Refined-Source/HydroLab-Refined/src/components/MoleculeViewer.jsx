import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const ATOM_STYLE = {
  C: { color: 0x61758c, edge: 0xa0b5ca, radius: 0.39, spaceRadius: 0.72, label: '#f0f5fb' },
  H: { color: 0xf2f6fb, edge: 0xb5c9dd, radius: 0.235, spaceRadius: 0.51, label: '#f2f6fb' },
};

function makeAtomLabel(element, color, scale = 0.34) {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const context = canvas.getContext('2d');
  if (!context) return null;
  context.clearRect(0, 0, 128, 128);
  context.font = '700 62px Inter, Arial, sans-serif';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillStyle = color;
  context.fillText(element, 64, 66);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false, depthTest: false });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(scale, scale, 1);
  return sprite;
}

function addBond(group, start, end, order, material, radius = 0.055, offsetStep = 0.13, aromatic = false, aromaticIndex = 0, offsetDirection = null) {
  const direction = new THREE.Vector3().subVectors(end, start);
  const length = direction.length();
  if (length < 0.001) return;
  direction.normalize();

  let lineCount = 1;
  if (order >= 2.6) lineCount = 3;
  else if (order >= 1.8) lineCount = 2;
  else if (aromatic && aromaticIndex % 2 === 0) lineCount = 2;

  const reference = Math.abs(direction.y) < 0.88
    ? new THREE.Vector3(0, 1, 0)
    : new THREE.Vector3(1, 0, 0);
  let normal;
  if (offsetDirection && offsetDirection.lengthSq() > 0.0001) {
    normal = offsetDirection.clone().addScaledVector(direction, -offsetDirection.dot(direction));
  }
  if (!normal || normal.lengthSq() < 0.0001) normal = new THREE.Vector3().crossVectors(direction, reference);
  normal.normalize();

  const offsets = lineCount === 1
    ? [0]
    : Array.from({ length: lineCount }, (_, index) => (index - (lineCount - 1) / 2) * offsetStep);

  offsets.forEach((offset) => {
    const shift = normal.clone().multiplyScalar(offset);
    const a = start.clone().add(shift);
    const b = end.clone().add(shift);
    const segment = new THREE.Vector3().subVectors(b, a);
    const rodRadius = lineCount === 1 ? radius : radius * 0.72;
    const geometry = new THREE.CylinderGeometry(rodRadius, rodRadius, segment.length(), 12, 1, false);
    const cylinder = new THREE.Mesh(geometry, material);
    cylinder.position.copy(a).add(b).multiplyScalar(0.5);
    cylinder.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), segment.normalize());
    cylinder.castShadow = false;
    cylinder.receiveShadow = false;
    group.add(cylinder);
  });
}

export default function MoleculeViewer({ molecule, showLabels, resetTrigger, mode = 'ballStick', autoRotate = false, language = 'en', unavailableText = '3D graphics are not available in this browser.' }) {
  const mountRef = useRef(null);
  const fitRef = useRef(null);
  const labelsGroupRef = useRef(null);
  const requestRenderRef = useRef(null);
  const autoRotateRef = useRef(autoRotate);
  const startAutoRotateRef = useRef(null);
  autoRotateRef.current = autoRotate;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || !molecule) return undefined;

    const width = Math.max(1, mount.clientWidth);
    const height = Math.max(1, mount.clientHeight);
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#182D43');

    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 240);
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    } catch {
      const fallback = document.createElement('div');
      fallback.className = 'viewer-fallback';
      fallback.textContent = unavailableText;
      mount.replaceChildren(fallback);
      return () => { mount.innerHTML = ''; };
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    mount.appendChild(renderer.domElement);
    renderer.domElement.tabIndex = 0;
    renderer.domElement.setAttribute('aria-label', language === 'fa' ? `نمایشگر تعاملی مولکول ${molecule.nameFa}` : `Interactive 3D view of ${molecule.name}`);

    scene.add(new THREE.HemisphereLight(0xdceafa, 0x17283c, 1.5));
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.85);
    keyLight.position.set(5, 8, 7);
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(0x9bc4e4, 0.62);
    fillLight.position.set(-6, -2, 5);
    scene.add(fillLight);
    const rimLight = new THREE.DirectionalLight(0x914e91, 0.32);
    rimLight.position.set(1, -6, -4);
    scene.add(rimLight);

    const moleculeGroup = new THREE.Group();
    const atomGroup = new THREE.Group();
    const bondGroup = new THREE.Group();
    const labelsGroup = new THREE.Group();
    moleculeGroup.add(bondGroup, atomGroup, labelsGroup);
    scene.add(moleculeGroup);
    labelsGroupRef.current = labelsGroup;

    const atomPositions = molecule.atoms.map((atom) => new THREE.Vector3(atom.x, atom.y, atom.z));
    const atomGeometry = new THREE.SphereGeometry(1, 28, 20);
    const atomMaterials = {
      carbon: new THREE.MeshStandardMaterial({ color: ATOM_STYLE.C.color, roughness: 0.48, metalness: 0.02 }),
      carbonEdge: new THREE.MeshStandardMaterial({ color: ATOM_STYLE.C.edge, roughness: 0.56, metalness: 0.0 }),
      hydrogen: new THREE.MeshStandardMaterial({ color: ATOM_STYLE.H.color, roughness: 0.5, metalness: 0.0 }),
      hydrogenEdge: new THREE.MeshStandardMaterial({ color: ATOM_STYLE.H.edge, roughness: 0.62, metalness: 0.0 }),
    };
    const bondMaterial = new THREE.MeshStandardMaterial({ color: 0x9bc4e4, roughness: 0.56, metalness: 0.06 });

    if (mode !== 'structural') {
      molecule.atoms.forEach((atom, index) => {
        const style = ATOM_STYLE[atom.element] || ATOM_STYLE.C;
        const isHydrogen = atom.element === 'H';
        const radius = mode === 'spaceFill' ? style.spaceRadius : style.radius;
        const edge = new THREE.Mesh(atomGeometry, isHydrogen ? atomMaterials.hydrogenEdge : atomMaterials.carbonEdge);
        edge.position.copy(atomPositions[index]);
        edge.scale.setScalar(radius * 1.055);
        atomGroup.add(edge);
        const sphere = new THREE.Mesh(atomGeometry, isHydrogen ? atomMaterials.hydrogen : atomMaterials.carbon);
        sphere.position.copy(atomPositions[index]);
        sphere.scale.setScalar(radius);
        atomGroup.add(sphere);
      });
    }

    if (mode === 'spaceFill') bondGroup.visible = false;
    const heavyPositions = molecule.atoms.map((atom, index) => atom.element === 'C' ? atomPositions[index] : null).filter(Boolean);
    const molecularCenter = heavyPositions.reduce((sum, point) => sum.add(point), new THREE.Vector3()).multiplyScalar(1 / Math.max(1, heavyPositions.length));
    let aromaticIndex = 0;
    molecule.bonds.forEach((bond) => {
      const start = atomPositions[bond.source];
      const end = atomPositions[bond.target];
      if (!start || !end) return;
      const midpoint = start.clone().add(end).multiplyScalar(0.5);
      let offsetDirection = null;
      if (bond.aromatic) {
        offsetDirection = molecularCenter.clone().sub(midpoint);
      } else if (bond.order >= 1.8) {
        const neighborIndex = molecule.bonds.filter((candidate) => candidate !== bond).map((candidate) => {
          if (candidate.source === bond.source) return candidate.target;
          if (candidate.target === bond.source) return candidate.source;
          if (candidate.source === bond.target) return candidate.target;
          if (candidate.target === bond.target) return candidate.source;
          return -1;
        }).find((index) => index >= 0 && index !== bond.source && index !== bond.target);
        if (neighborIndex !== undefined) offsetDirection = atomPositions[neighborIndex].clone().sub(midpoint);
      }
      const bondRadius = mode === 'structural' ? 0.036 : 0.055;
      const separation = mode === 'structural' ? 0.105 : 0.13;
      addBond(bondGroup, start, end, bond.order, bondMaterial, bondRadius, separation, bond.aromatic, aromaticIndex, offsetDirection);
      if (bond.aromatic) aromaticIndex += 1;
    });

    const bounds = new THREE.Box3().setFromObject(moleculeGroup);
    const center = bounds.getCenter(new THREE.Vector3());
    moleculeGroup.position.sub(center);
    const sphere = bounds.getBoundingSphere(new THREE.Sphere());
    const radius = Math.max(sphere.radius, 1.0);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.listenToKeyEvents(window);
    controls.dampingFactor = 0.075;
    controls.enablePan = false;
    controls.rotateSpeed = 0.62;
    controls.zoomSpeed = 0.72;
    controls.minDistance = Math.max(1.8, radius * 1.25);
    controls.maxDistance = Math.max(18, radius * 9);
    controls.target.set(0, 0, 0);

    const fitCamera = () => {
      const distance = radius / Math.sin(THREE.MathUtils.degToRad(camera.fov * 0.5)) * 0.72;
      camera.position.set(distance * 0.82, distance * 0.48, distance * 1.08);
      camera.near = Math.max(0.05, distance / 100);
      camera.far = distance * 30;
      camera.updateProjectionMatrix();
      controls.target.set(0, 0, 0);
      controls.update();
    };
    fitRef.current = fitCamera;
    fitCamera();

    let disposed = false;
    let renderFrame = null;
    let autoFrame = null;
    const renderOnce = () => {
      if (disposed || renderFrame !== null) return;
      renderFrame = window.requestAnimationFrame(() => {
        renderFrame = null;
        if (disposed) return;
        controls.update();
        renderer.render(scene, camera);
      });
    };
    const animate = () => {
      if (disposed) return;
      if (!autoRotateRef.current) { autoFrame = null; return; }
      moleculeGroup.rotation.y += 0.0028;
      controls.update();
      renderer.render(scene, camera);
      autoFrame = window.requestAnimationFrame(animate);
    };
    startAutoRotateRef.current = () => {
      if (autoFrame === null && !disposed) animate();
    };
    controls.addEventListener('change', renderOnce);
    requestRenderRef.current = renderOnce;

    const handleResize = () => {
      const nextWidth = Math.max(1, mount.clientWidth);
      const nextHeight = Math.max(1, mount.clientHeight);
      camera.aspect = nextWidth / nextHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(nextWidth, nextHeight);
      renderOnce();
    };
    const resizeObserver = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(handleResize) : null;
    if (resizeObserver) resizeObserver.observe(mount);
    else window.addEventListener('resize', handleResize);

    renderer.render(scene, camera);
    if (autoRotateRef.current) startAutoRotateRef.current();

    return () => {
      disposed = true;
      if (renderFrame !== null) window.cancelAnimationFrame(renderFrame);
      if (autoFrame !== null) window.cancelAnimationFrame(autoFrame);
      resizeObserver?.disconnect();
      if (!resizeObserver) window.removeEventListener('resize', handleResize);
      controls.removeEventListener('change', renderOnce);
      controls.dispose();
      const geometries = new Set();
      const materials = new Set();
      moleculeGroup.traverse((object) => {
        if (object.geometry) geometries.add(object.geometry);
        if (object.material) {
          const objectMaterials = Array.isArray(object.material) ? object.material : [object.material];
          objectMaterials.forEach((material) => {
            materials.add(material);
            if (material.map) material.map.dispose();
          });
        }
      });
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
      renderer.dispose();
      renderer.domElement.remove();
      labelsGroupRef.current = null;
      startAutoRotateRef.current = null;
      requestRenderRef.current = null;
      fitRef.current = null;
    };
  }, [molecule, mode, unavailableText, language]);

  useEffect(() => {
    const group = labelsGroupRef.current;
    if (!group) return;
    group.children.forEach((sprite) => {
      sprite.material?.map?.dispose?.();
      sprite.material?.dispose?.();
    });
    group.clear();
    if (showLabels || mode === 'structural') {
      molecule.atoms.forEach((atom, index) => {
        const style = ATOM_STYLE[atom.element] || ATOM_STYLE.C;
        const label = makeAtomLabel(atom.element, style.label, mode === 'structural' ? 0.39 : 0.32);
        if (!label) return;
        label.position.set(atom.x, atom.y, atom.z + (mode === 'structural' ? 0.03 : style.radius * 0.04));
        group.add(label);
      });
    }
    requestRenderRef.current?.();
  }, [molecule, showLabels, mode, language]);

  useEffect(() => {
    if (autoRotate) startAutoRotateRef.current?.();
  }, [autoRotate]);

  useEffect(() => {
    if (resetTrigger > 0) fitRef.current?.();
  }, [resetTrigger]);

  return <div className="viewer-canvas" ref={mountRef} role="group" aria-label={language === 'fa' ? `مدل سه‌بعدی تعاملی ${molecule.nameFa}` : `Interactive 3D molecular model of ${molecule.name}`} />;
}
