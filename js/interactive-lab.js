/**
 * INTERACTIVE-LAB.JS
 * Proves Frontend Mastery with live Reactive Streams, POS State Engine, and 3D Shader Forge.
 */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 1. Tab Switching Controller
  // =========================================================================
  const labTabs = document.querySelectorAll('.lab-tab');
  const labPanels = document.querySelectorAll('.lab-panel');

  labTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.getAttribute('data-tab');
      if (window.soundEngine) window.soundEngine.playTab();

      labTabs.forEach(t => t.classList.remove('active'));
      labPanels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const activePanel = document.getElementById(`panel-${targetTab}`);
      if (activePanel) activePanel.classList.add('active');

      // Re-trigger Three.js resize if tab 3 opened
      if (targetTab === 'threejs-shader-lab' && window.resizeLabThree) {
        setTimeout(window.resizeLabThree, 50);
      }
    });
  });

  // =========================================================================
  // 2. RxJS Stream Visualizer Engine
  // =========================================================================
  const emitEventBtn = document.getElementById('emit-event-btn');
  const emitBatchBtn = document.getElementById('emit-batch-btn');
  const clearStreamBtn = document.getElementById('clear-stream-btn');
  const rawMarblesContainer = document.getElementById('raw-marbles-container');
  const pipedMarblesContainer = document.getElementById('piped-marbles-container');
  const streamLog = document.getElementById('stream-log');

  const opDebounce = document.getElementById('op-debounce');
  const opFilter = document.getElementById('op-filter');
  const opTransform = document.getElementById('op-transform');

  let debounceTimer = null;
  let eventCounter = 0;

  function logStreamMessage(msg, isSuccess = false) {
    const p = document.createElement('div');
    p.className = `log-line ${isSuccess ? 'text-green' : 'text-cyan'}`;
    const time = new Date().toLocaleTimeString();
    p.innerHTML = `<span class="text-muted">[${time}]</span> ${msg}`;
    streamLog.prepend(p);
    while (streamLog.children.length > 25) {
      streamLog.removeChild(streamLog.lastChild);
    }
  }

  function emitSingleEvent(customValue = null) {
    eventCounter++;
    const val = customValue !== null ? customValue : Math.floor(Math.random() * 50) + 1;
    if (window.soundEngine) window.soundEngine.playStreamEmit(400 + val * 10);

    // 1. Render in Raw Stream
    const rawMarble = document.createElement('div');
    rawMarble.className = 'marble-item';
    rawMarble.textContent = val;
    rawMarblesContainer.appendChild(rawMarble);
    rawMarblesContainer.scrollLeft = rawMarblesContainer.scrollWidth;

    logStreamMessage(`$raw.next(${val}) emitted to Observable stream.`);

    // 2. Pipe Logic (Debounce -> Filter -> Map)
    const runPipeline = (eventVal) => {
      // Filter Operator
      if (opFilter && opFilter.checked) {
        if (eventVal <= 20) {
          logStreamMessage(`Filter dropped event (${eventVal} &le; 20).`, false);
          return;
        }
      }

      // Map Transform Operator
      let transformedVal = eventVal;
      if (opTransform && opTransform.checked) {
        transformedVal = `$${(eventVal * 1.5).toFixed(0)}`;
      }

      // Render in Subscribed Output
      const pipedMarble = document.createElement('div');
      pipedMarble.className = 'marble-item';
      pipedMarble.style.background = 'linear-gradient(135deg, #00ffaa 0%, #00f0ff 100%)';
      pipedMarble.textContent = transformedVal;
      pipedMarblesContainer.appendChild(pipedMarble);
      pipedMarblesContainer.scrollLeft = pipedMarblesContainer.scrollWidth;

      if (window.soundEngine) window.soundEngine.playStreamEmit(800);
      logStreamMessage(`Subscribed listener received: <strong>${transformedVal}</strong>`, true);
    };

    if (opDebounce && opDebounce.checked) {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        runPipeline(val);
      }, 300);
    } else {
      runPipeline(val);
    }
  }

  if (emitEventBtn) {
    emitEventBtn.addEventListener('click', () => emitSingleEvent());
  }

  if (emitBatchBtn) {
    emitBatchBtn.addEventListener('click', () => {
      let count = 0;
      const interval = setInterval(() => {
        emitSingleEvent();
        count++;
        if (count >= 5) clearInterval(interval);
      }, 90);
    });
  }

  if (clearStreamBtn) {
    clearStreamBtn.addEventListener('click', () => {
      rawMarblesContainer.innerHTML = '';
      pipedMarblesContainer.innerHTML = '';
      streamLog.innerHTML = '<span class="log-line text-muted">[Stream Reset] All observables cleared.</span>';
    });
  }

  // =========================================================================
  // 3. POS & Inventory Reactive State Machine
  // =========================================================================
  const initialInventory = [
    { id: 'item-1', name: 'Logistics Scanner Terminal', price: 249.00, stock: 15 },
    { id: 'item-2', name: 'Smart Warehouse Beacon', price: 49.50, stock: 42 },
    { id: 'item-3', name: 'Enterprise RFID Reader', price: 120.00, stock: 8 },
    { id: 'item-4', name: 'Thermal Barcode Printer', price: 185.00, stock: 20 }
  ];

  let currentInventory = JSON.parse(JSON.stringify(initialInventory));
  let cart = [];

  const posItemsList = document.getElementById('pos-items-list');
  const posCartBox = document.getElementById('pos-cart-box');
  const posSubtotal = document.getElementById('pos-subtotal');
  const posTax = document.getElementById('pos-tax');
  const posTotal = document.getElementById('pos-total');
  const posCheckoutBtn = document.getElementById('pos-checkout-btn');
  const posResetBtn = document.getElementById('pos-reset-btn');

  function renderPOSCatalog() {
    if (!posItemsList) return;
    posItemsList.innerHTML = '';
    currentInventory.forEach(item => {
      const card = document.createElement('div');
      card.className = 'pos-item-card';
      card.innerHTML = `
        <div class="pos-item-name">${item.name}</div>
        <div class="pos-item-meta">
          <span class="pos-item-price">$${item.price.toFixed(2)}</span>
          <span class="pos-item-stock">Stock: <strong>${item.stock}</strong></span>
        </div>
      `;
      card.addEventListener('click', () => addToCart(item.id));
      posItemsList.appendChild(card);
    });
  }

  function addToCart(itemId) {
    const product = currentInventory.find(p => p.id === itemId);
    if (!product || product.stock <= 0) return;

    product.stock--;
    const existing = cart.find(c => c.id === itemId);
    if (existing) {
      existing.qty++;
    } else {
      cart.push({ ...product, qty: 1 });
    }

    if (window.soundEngine) window.soundEngine.playClick();
    renderPOSCatalog();
    renderCart();
  }

  function renderCart() {
    if (!posCartBox) return;
    if (cart.length === 0) {
      posCartBox.innerHTML = '<div class="empty-cart-msg">Cart is empty. Click items on the left to add.</div>';
      if (posSubtotal) posSubtotal.textContent = '$0.00';
      if (posTax) posTax.textContent = '$0.00';
      if (posTotal) posTotal.textContent = '$0.00';
      if (posCheckoutBtn) posCheckoutBtn.disabled = true;
      return;
    }

    posCartBox.innerHTML = '';
    let subtotal = 0;

    cart.forEach(item => {
      const itemTotal = item.price * item.qty;
      subtotal += itemTotal;

      const row = document.createElement('div');
      row.className = 'cart-line-item';
      row.innerHTML = `
        <div><span class="cart-line-qty">${item.qty}x</span> ${item.name}</div>
        <strong>$${itemTotal.toFixed(2)}</strong>
      `;
      posCartBox.appendChild(row);
    });

    const tax = subtotal * 0.14;
    const total = subtotal + tax;

    if (posSubtotal) posSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    if (posTax) posTax.textContent = `$${tax.toFixed(2)}`;
    if (posTotal) posTotal.textContent = `$${total.toFixed(2)}`;
    if (posCheckoutBtn) posCheckoutBtn.disabled = false;
  }

  if (posCheckoutBtn) {
    posCheckoutBtn.addEventListener('click', () => {
      const invoiceId = 'INV-' + Math.floor(100000 + Math.random() * 900000);
      if (window.confetti) {
        window.confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      }
      if (window.soundEngine) window.soundEngine.playSuccess();

      posCartBox.innerHTML = `
        <div class="p-3 text-center" style="background: rgba(16,185,129,0.15); border-radius: 8px; border: 1px solid rgba(16,185,129,0.3); color: #34d399;">
          <strong>✔ Transaction Processed!</strong><br>
          <span style="font-size: 0.8rem; font-family: monospace;">Receipt #${invoiceId} synced with warehouse.</span>
        </div>
      `;
      cart = [];
      if (posCheckoutBtn) posCheckoutBtn.disabled = true;
    });
  }

  if (posResetBtn) {
    posResetBtn.addEventListener('click', () => {
      currentInventory = JSON.parse(JSON.stringify(initialInventory));
      cart = [];
      renderPOSCatalog();
      renderCart();
    });
  }

  renderPOSCatalog();
  renderCart();

  // =========================================================================
  // 4. Mini 3D WebGL Shader & Geometry Laboratory
  // =========================================================================
  const labCanvas = document.getElementById('lab-three-canvas');
  if (labCanvas && typeof THREE !== 'undefined') {
    let labWidth = labCanvas.clientWidth || 500;
    let labHeight = labCanvas.clientHeight || 340;

    const labScene = new THREE.Scene();
    const labCamera = new THREE.PerspectiveCamera(50, labWidth / labHeight, 0.1, 100);
    labCamera.position.z = 7;

    const labRenderer = new THREE.WebGLRenderer({
      canvas: labCanvas,
      alpha: true,
      antialias: true
    });
    labRenderer.setSize(labWidth, labHeight);
    labRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Lighting
    const labLight1 = new THREE.PointLight(0x00f0ff, 3.0, 30);
    labLight1.position.set(6, 6, 6);
    labScene.add(labLight1);

    const labLight2 = new THREE.PointLight(0xa855f7, 3.0, 30);
    labLight2.position.set(-6, -6, 6);
    labScene.add(labLight2);

    const labAmbient = new THREE.AmbientLight(0xffffff, 0.6);
    labScene.add(labAmbient);

    // Geometries
    const geometries = {
      torusKnot: new THREE.TorusKnotGeometry(1.8, 0.55, 120, 20),
      icosahedron: new THREE.IcosahedronGeometry(2.3, 2),
      octahedron: new THREE.OctahedronGeometry(2.3, 2),
      dodecahedron: new THREE.DodecahedronGeometry(2.3, 1)
    };

    const labMaterial = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      wireframe: true,
      roughness: 0.15,
      metalness: 0.85,
      emissive: 0x003344,
      emissiveIntensity: 0.4
    });

    let currentMesh = new THREE.Mesh(geometries.torusKnot, labMaterial);
    labScene.add(currentMesh);

    // Inner glowing core
    const innerGeo = new THREE.SphereGeometry(1.0, 16, 16);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      wireframe: true,
      transparent: true,
      opacity: 0.6
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    currentMesh.add(innerMesh);

    // Dynamic Mini Particles
    let particleCount = 1200;
    let labParticlesGeo = new THREE.BufferGeometry();
    let positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 14;
    }
    labParticlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const labParticlesMat = new THREE.PointsMaterial({
      color: 0x00ffaa,
      size: 0.08,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending
    });
    let labParticles = new THREE.Points(labParticlesGeo, labParticlesMat);
    labScene.add(labParticles);

    // Controls
    let rotationSpeed = 1.0;
    const speedSlider = document.getElementById('speed-slider');
    const speedVal = document.getElementById('speed-val');
    const lightSlider = document.getElementById('light-slider');
    const lightVal = document.getElementById('light-val');
    const particleSlider = document.getElementById('particle-slider');
    const particleVal = document.getElementById('particle-val');
    const wireframeToggle = document.getElementById('wireframe-toggle');
    const geometryName = document.getElementById('geometry-name');

    if (speedSlider) {
      speedSlider.addEventListener('input', (e) => {
        rotationSpeed = parseFloat(e.target.value);
        if (speedVal) speedVal.textContent = rotationSpeed.toFixed(1) + 'x';
      });
    }

    if (lightSlider) {
      lightSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        labLight1.intensity = val;
        labLight2.intensity = val;
        if (lightVal) lightVal.textContent = val.toFixed(1);
      });
    }

    if (particleSlider) {
      particleSlider.addEventListener('input', (e) => {
        const newCount = parseInt(e.target.value, 10);
        if (particleVal) particleVal.textContent = newCount;
        
        labScene.remove(labParticles);
        labParticlesGeo.dispose();
        
        const newPos = new Float32Array(newCount * 3);
        for (let i = 0; i < newCount * 3; i++) {
          newPos[i] = (Math.random() - 0.5) * 14;
        }
        labParticlesGeo = new THREE.BufferGeometry();
        labParticlesGeo.setAttribute('position', new THREE.BufferAttribute(newPos, 3));
        labParticles = new THREE.Points(labParticlesGeo, labParticlesMat);
        labScene.add(labParticles);
      });
    }

    if (wireframeToggle) {
      wireframeToggle.addEventListener('change', (e) => {
        labMaterial.wireframe = e.target.checked;
      });
    }

    // Geometry Switch Buttons
    const geoButtons = document.querySelectorAll('.btn-geo');
    geoButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const geoKey = btn.getAttribute('data-geo');
        if (geometries[geoKey]) {
          geoButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          
          labScene.remove(currentMesh);
          currentMesh = new THREE.Mesh(geometries[geoKey], labMaterial);
          currentMesh.add(innerMesh);
          labScene.add(currentMesh);
          
          if (geometryName) geometryName.textContent = btn.textContent + ' Geometry';
          if (window.soundEngine) window.soundEngine.playClick();
        }
      });
    });

    window.resizeLabThree = function() {
      if (!labCanvas) return;
      const parent = labCanvas.parentElement;
      const width = parent ? parent.clientWidth : labCanvas.clientWidth;
      const height = parent ? parent.clientHeight : labCanvas.clientHeight;
      if (width > 0 && height > 0) {
        labCamera.aspect = width / height;
        labCamera.updateProjectionMatrix();
        labRenderer.setSize(width, height);
      }
    };

    // Trigger initial resize after layout renders
    setTimeout(window.resizeLabThree, 100);
    window.addEventListener('resize', window.resizeLabThree);

    function animateLab() {
      requestAnimationFrame(animateLab);
      currentMesh.rotation.x += 0.01 * rotationSpeed;
      currentMesh.rotation.y += 0.015 * rotationSpeed;
      innerMesh.rotation.x -= 0.015 * rotationSpeed;
      innerMesh.rotation.z += 0.02 * rotationSpeed;
      labParticles.rotation.y -= 0.003 * rotationSpeed;
      labRenderer.render(labScene, labCamera);
    }
    animateLab();
  }

});
