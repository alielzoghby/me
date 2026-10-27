/**
 * THREE-SCENE.JS
 * Immersive 3D WebGL Multi-Section Scroll & Interactive Experience for Ali Darwish
 * Powered by Three.js (r128)
 */

(function initScrollDriven3DScene() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  // Scene, Camera, Renderer
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x060911, 0.018);

  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 24);

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambientLight);

  const cyanLight = new THREE.PointLight(0x00f0ff, 4.0, 60);
  cyanLight.position.set(15, 12, 18);
  scene.add(cyanLight);

  const purpleLight = new THREE.PointLight(0xa855f7, 4.0, 60);
  purpleLight.position.set(-15, -12, 18);
  scene.add(purpleLight);

  const emeraldLight = new THREE.PointLight(0x00ffaa, 2.5, 45);
  emeraldLight.position.set(0, -15, 10);
  scene.add(emeraldLight);

  // Group for Central 3D Cyber Core
  const coreGroup = new THREE.Group();
  scene.add(coreGroup);

  // 1. Outer Torus Knot Wireframe
  const torusKnotGeo = new THREE.TorusKnotGeometry(4.2, 1.15, 140, 20, 2, 3);
  const torusKnotMat = new THREE.MeshStandardMaterial({
    color: 0x00f0ff,
    wireframe: true,
    transparent: true,
    opacity: 0.5,
    roughness: 0.2,
    metalness: 0.85,
    emissive: 0x002233,
    emissiveIntensity: 0.3
  });
  const torusKnotMesh = new THREE.Mesh(torusKnotGeo, torusKnotMat);
  coreGroup.add(torusKnotMesh);

  // 2. Inner Glowing Icosahedron
  const icoGeo = new THREE.IcosahedronGeometry(2.4, 2);
  const icoMat = new THREE.MeshStandardMaterial({
    color: 0x8a2be2,
    wireframe: true,
    transparent: true,
    opacity: 0.75,
    roughness: 0.1,
    metalness: 0.9,
    emissive: 0x330066,
    emissiveIntensity: 0.4
  });
  const icoMesh = new THREE.Mesh(icoGeo, icoMat);
  coreGroup.add(icoMesh);

  // 3. Floating Orbital Celestial Rings
  const ringGeo1 = new THREE.TorusGeometry(7.6, 0.05, 16, 120);
  const ringMat1 = new THREE.MeshBasicMaterial({ color: 0x00ffaa, transparent: true, opacity: 0.45 });
  const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
  ring1.rotation.x = Math.PI / 3;
  coreGroup.add(ring1);

  const ringGeo2 = new THREE.TorusGeometry(9.2, 0.05, 16, 120);
  const ringMat2 = new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.35 });
  const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
  ring2.rotation.y = Math.PI / 4;
  ring2.rotation.x = -Math.PI / 6;
  coreGroup.add(ring2);

  const ringGeo3 = new THREE.TorusGeometry(11.0, 0.04, 16, 120);
  const ringMat3 = new THREE.MeshBasicMaterial({ color: 0xa855f7, transparent: true, opacity: 0.25 });
  const ring3 = new THREE.Mesh(ringGeo3, ringMat3);
  ring3.rotation.z = Math.PI / 2;
  coreGroup.add(ring3);

  // 4. Interactive Particle Universe (3,000 particles)
  const particleCount = 3000;
  const particlePositions = new Float32Array(particleCount * 3);
  const particleColors = new Float32Array(particleCount * 3);

  const colorPalette = [
    new THREE.Color(0x00f0ff), // Cyan
    new THREE.Color(0xa855f7), // Purple
    new THREE.Color(0x00ffaa), // Emerald
    new THREE.Color(0x38bdf8), // Sky Blue
    new THREE.Color(0xffffff)  // Star White
  ];

  for (let i = 0; i < particleCount; i++) {
    const radius = 8 + Math.random() * 55;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);

    particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    particlePositions[i * 3 + 2] = radius * Math.cos(phi);

    const chosenColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];
    particleColors[i * 3] = chosenColor.r;
    particleColors[i * 3 + 1] = chosenColor.g;
    particleColors[i * 3 + 2] = chosenColor.b;
  }

  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

  const particleMaterial = new THREE.PointsMaterial({
    size: 0.22,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
  });

  const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particleSystem);

  // Initial core position
  coreGroup.position.set(5.5, 0, -2);

  // Mouse Physics State
  let mouseX = 0;
  let mouseY = 0;
  let targetMouseX = 0;
  let targetMouseY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  // SCROLL-DRIVEN 3D TRANSFORMATION CALCULATOR
  let scrollProgress = 0;
  let targetCorePos = { x: 5.5, y: 0, z: -2 };
  let targetCoreRot = { x: 0, y: 0, z: 0 };
  let targetCoreScale = 1;

  function updateScrollTransforms() {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    scrollProgress = totalHeight > 0 ? window.scrollY / totalHeight : 0;

    const isMobile = window.innerWidth < 768;

    // Interpolate 3D scene parameters through various page sections
    // 0.00 -> Hero
    // 0.15 -> About
    // 0.35 -> Interactive Lab
    // 0.55 -> Experience Timeline
    // 0.75 -> Projects
    // 0.90 -> Skills & Education
    // 1.00 -> Contact

    if (scrollProgress < 0.12) {
      // Hero
      targetCorePos.x = isMobile ? 0 : 5.5;
      targetCorePos.y = isMobile ? -2 : 0;
      targetCorePos.z = isMobile ? -6 : -2;
      targetCoreScale = isMobile ? 0.7 : 1.0;
      targetCoreRot.z = 0;
    } else if (scrollProgress < 0.30) {
      // About section -> Glide to Left Background
      targetCorePos.x = isMobile ? 0 : -5.8;
      targetCorePos.y = 0.5;
      targetCorePos.z = isMobile ? -8 : -4;
      targetCoreScale = isMobile ? 0.6 : 0.85;
      targetCoreRot.z = scrollProgress * 4;
    } else if (scrollProgress < 0.50) {
      // Interactive Lab -> Shift to Right & Closer for depth
      targetCorePos.x = isMobile ? 0 : 6.0;
      targetCorePos.y = -1.0;
      targetCorePos.z = isMobile ? -8 : -3;
      targetCoreScale = isMobile ? 0.65 : 0.9;
      targetCoreRot.z = scrollProgress * 6;
    } else if (scrollProgress < 0.70) {
      // Experience Timeline -> Center-Left Floating Tech Anchor
      targetCorePos.x = isMobile ? 0 : -6.2;
      targetCorePos.y = 0;
      targetCorePos.z = isMobile ? -7 : -3.5;
      targetCoreScale = isMobile ? 0.65 : 0.88;
      targetCoreRot.z = scrollProgress * 8;
    } else if (scrollProgress < 0.85) {
      // Projects -> Deep Background Backdrop
      targetCorePos.x = isMobile ? 0 : 5.0;
      targetCorePos.y = 1.0;
      targetCorePos.z = isMobile ? -10 : -6;
      targetCoreScale = isMobile ? 0.7 : 1.1;
      targetCoreRot.z = scrollProgress * 10;
    } else {
      // Contact Section -> Converge in Center with high presence
      targetCorePos.x = isMobile ? 0 : 4.5;
      targetCorePos.y = -0.5;
      targetCorePos.z = isMobile ? -7 : -2.5;
      targetCoreScale = isMobile ? 0.75 : 1.0;
      targetCoreRot.z = scrollProgress * 12;
    }
  }

  window.addEventListener('scroll', updateScrollTransforms, { passive: true });
  updateScrollTransforms();

  // Window Resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    updateScrollTransforms();
  });

  // Animation Loop with Smooth Interpolation
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Constant smooth geometry rotations
    torusKnotMesh.rotation.x = elapsedTime * 0.25;
    torusKnotMesh.rotation.y = elapsedTime * 0.3;

    icoMesh.rotation.x = -elapsedTime * 0.35;
    icoMesh.rotation.y = -elapsedTime * 0.4;

    ring1.rotation.z = elapsedTime * 0.2;
    ring2.rotation.z = -elapsedTime * 0.18;
    ring3.rotation.y = elapsedTime * 0.15;

    // Dynamic scroll rotation & position lerp
    coreGroup.position.x += (targetCorePos.x - coreGroup.position.x) * 0.05;
    coreGroup.position.y += (targetCorePos.y - coreGroup.position.y) * 0.05;
    coreGroup.position.z += (targetCorePos.z - coreGroup.position.z) * 0.05;

    const currentScale = coreGroup.scale.x;
    const nextScale = currentScale + (targetCoreScale - currentScale) * 0.05;
    coreGroup.scale.set(nextScale, nextScale, nextScale);

    // Particle universe responsive swirl
    particleSystem.rotation.y = elapsedTime * 0.03 + scrollProgress * 3.0;
    particleSystem.rotation.x = elapsedTime * 0.015 + scrollProgress * 1.5;

    // Mouse parallax lerp
    targetMouseX += (mouseX * 0.6 - targetMouseX) * 0.04;
    targetMouseY += (mouseY * 0.6 - targetMouseY) * 0.04;

    coreGroup.rotation.y = targetMouseX + scrollProgress * 5;
    coreGroup.rotation.x = -targetMouseY + scrollProgress * 2.5;

    // Soft floating wave
    coreGroup.position.y += Math.sin(elapsedTime * 2.0) * 0.008;

    renderer.render(scene, camera);
  }

  animate();
})();
