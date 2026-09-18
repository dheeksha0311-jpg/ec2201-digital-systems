/**
 * EC2201 — Digital Systems Design
 * Interactive 3D WebGL Scenes powered by Three.js
 * 
 * 1. 3D Silicon Microchip (DIP-14 Dual In-Line Package IC)
 *    - Interactive Pin Probing / Raycaster
 *    - X-Ray / Transparent View (reveals internal silicon die & gold wire bonds)
 *    - Signal Pulse Animation
 *    - Full Drag/Orbit Controls
 * 
 * 2. 3D Holographic Decision Reactor (APPROVE / REJECT / REVIEW Core)
 *    - Click-to-Shockwave energy burst
 *    - Turbo Orbit Speed toggle
 *    - Dynamic Status color morphing
 * 
 * 3. 3D Karnaugh Hypercube (4-Variable Spatial Adjacency Grid)
 *    - 3D Node Raycaster (Click spheres to inspect & sync with 2D K-Map)
 *    - Gray-code adjacency laser interconnects
 *    - Auto-spin toggle & current vector snap
 */

window.EC2201_3D = (function () {
  'use strict';

  const scenes = {
    chip: null,
    reactor: null,
    kmap: null
  };

  // Helper: setup smooth mouse drag rotation on a container
  function attachDragRotation(domElement, targetObject, speed = 0.006) {
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let velocityX = 0;
    let velocityY = 0;
    let autoSpinEnabled = true;

    domElement.addEventListener('pointerdown', (e) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
      velocityX = 0;
      velocityY = 0;
    });

    window.addEventListener('pointermove', (e) => {
      if (!isDragging || !targetObject) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      targetObject.rotation.y += deltaX * speed;
      targetObject.rotation.x += deltaY * speed;
      targetObject.rotation.x = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, targetObject.rotation.x));

      velocityX = deltaX * speed * 0.5;
      velocityY = deltaY * speed * 0.5;
    });

    window.addEventListener('pointerup', () => {
      isDragging = false;
    });

    return {
      applyInertia: function (autoSpinY = 0.002) {
        if (!targetObject) return;
        if (!isDragging) {
          if (autoSpinEnabled) {
            targetObject.rotation.y += autoSpinY;
          }
          targetObject.rotation.y += velocityX;
          targetObject.rotation.x += velocityY;
          velocityX *= 0.92;
          velocityY *= 0.92;
        }
      },
      toggleAutoSpin: function () {
        autoSpinEnabled = !autoSpinEnabled;
        return autoSpinEnabled;
      },
      isAutoSpinning: function () {
        return autoSpinEnabled;
      }
    };
  }

  // Pin definitions for 74LS08 Quad 2-Input AND Gate
  const PIN_METADATA = [
    { pin: 1, name: "1A", desc: "Input 1A (Monthly Inflow Buffer A)", voltage: "5.0V / 0V" },
    { pin: 2, name: "1B", desc: "Input 1B (CIBIL Score B)", voltage: "5.0V / 0V" },
    { pin: 3, name: "1Y", desc: "Output 1Y (1A · 1B intermediate term)", voltage: "Logic High/Low" },
    { pin: 4, name: "2A", desc: "Input 2A (Working Age Window C)", voltage: "5.0V / 0V" },
    { pin: 5, name: "2B", desc: "Input 2B (Inverted Default D')", voltage: "5.0V / 0V" },
    { pin: 6, name: "2Y", desc: "Output 2Y (2A · 2B intermediate term)", voltage: "Logic High/Low" },
    { pin: 7, name: "GND", desc: "System Ground Reference (0V)", voltage: "0.0V DC" },
    { pin: 8, name: "3Y", desc: "Output 3Y (APPROVE Final Gating)", voltage: "Logic High/Low" },
    { pin: 9, name: "3B", desc: "Input 3B (Cascade Feed)", voltage: "5.0V / 0V" },
    { pin: 10, name: "3A", desc: "Input 3A (Cascade Feed)", voltage: "5.0V / 0V" },
    { pin: 11, name: "4Y", desc: "Output 4Y (Spare AND Gate)", voltage: "Hi-Z" },
    { pin: 12, name: "4B", desc: "Input 4B (Spare Input)", voltage: "0.0V" },
    { pin: 13, name: "4A", desc: "Input 4A (Spare Input)", voltage: "0.0V" },
    { pin: 14, name: "VCC", desc: "Positive DC Power Supply Rail", voltage: "+5.0V DC" }
  ];

  // =========================================================================
  // 1. 3D SILICON MICROCHIP (DIP-14 Integrated Circuit)
  // =========================================================================
  function initChipScene(containerId) {
    const container = document.getElementById(containerId);
    if (!container || typeof THREE === 'undefined') return;
    if (scenes.chip) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 280;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 3.8, 6.2);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "default" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x38bdf8, 1.4);
    dirLight1.position.set(5, 10, 7);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x818cf8, 0.9);
    dirLight2.position.set(-5, -3, -5);
    scene.add(dirLight2);

    const chipGroup = new THREE.Group();
    chipGroup.rotation.x = 0.35;
    chipGroup.rotation.y = -0.45;
    scene.add(chipGroup);

    // IC Body (DIP-14 proportions)
    const bodyGeo = new THREE.BoxGeometry(5.0, 0.65, 2.2);
    const bodyMat = new THREE.MeshPhongMaterial({
      color: 0x181e29,
      shininess: 40,
      transparent: false,
      opacity: 1.0
    });
    const chipBody = new THREE.Mesh(bodyGeo, bodyMat);
    chipGroup.add(chipBody);

    // Internal Silicon Die (visible in X-Ray mode)
    const dieGeo = new THREE.BoxGeometry(1.4, 0.1, 1.2);
    const dieMat = new THREE.MeshPhongMaterial({
      color: 0x0284c7,
      emissive: 0x0369a1,
      emissiveIntensity: 0.5,
      shininess: 90
    });
    const siliconDie = new THREE.Mesh(dieGeo, dieMat);
    siliconDie.position.set(0, 0, 0);
    siliconDie.visible = false;
    chipGroup.add(siliconDie);

    // Gold Bond Wire Lines
    const wireGeo = new THREE.BufferGeometry();
    const wirePoints = [];
    for (let i = -3; i <= 3; i++) {
      wirePoints.push(i * 0.18, 0.05, 0.55);
      wirePoints.push(i * 0.6, -0.15, 1.1);
      wirePoints.push(i * 0.18, 0.05, -0.55);
      wirePoints.push(i * 0.6, -0.15, -1.1);
    }
    wireGeo.setAttribute('position', new THREE.Float32BufferAttribute(wirePoints, 3));
    const wireLines = new THREE.LineSegments(wireGeo, new THREE.LineBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.8 }));
    wireLines.visible = false;
    chipGroup.add(wireLines);

    // Beveled top notch at Pin 1 end
    const notchGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.7, 16, 1, false, 0, Math.PI);
    const notchMat = new THREE.MeshLambertMaterial({ color: 0x0f172a });
    const notch = new THREE.Mesh(notchGeo, notchMat);
    notch.rotation.y = Math.PI / 2;
    notch.position.set(-2.5, 0.05, 0);
    chipGroup.add(notch);

    // Pin 1 dot indent
    const dotGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const dotMat = new THREE.MeshLambertMaterial({ color: 0x0f172a });
    const dot = new THREE.Mesh(dotGeo, dotMat);
    dot.position.set(-2.0, 0.34, 0.65);
    chipGroup.add(dot);

    // Laser etched label
    const canvasText = document.createElement('canvas');
    canvasText.width = 512;
    canvasText.height = 128;
    const ctx = canvasText.getContext('2d');
    ctx.fillStyle = '#181e29';
    ctx.fillRect(0, 0, 512, 128);
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 36px "Fira Code", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('EC2201 • 74LS08', 256, 44);
    ctx.font = '22px "Inter", sans-serif';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('QUAD 2-IN AND GATE IC', 256, 88);

    const labelTex = new THREE.CanvasTexture(canvasText);
    const labelGeo = new THREE.PlaneGeometry(4.2, 1.2);
    const labelMat = new THREE.MeshBasicMaterial({ map: labelTex, transparent: true });
    const labelMesh = new THREE.Mesh(labelGeo, labelMat);
    labelMesh.rotation.x = -Math.PI / 2;
    labelMesh.position.set(0.1, 0.33, 0);
    chipGroup.add(labelMesh);

    // 14 Metallic Pins & PCB LEDs
    const pinMeshes = [];
    const pinLeds = [];
    const pinMat = new THREE.MeshPhongMaterial({
      color: 0xd4d4d8,
      specular: 0xffffff,
      shininess: 90
    });
    const pinGlowMatInactive = new THREE.MeshBasicMaterial({ color: 0x475569 });

    const startX = -1.95;
    const stepX = 0.65;

    // Bottom Row: Pins 1 to 7
    for (let i = 0; i < 7; i++) {
      const px = startX + i * stepX;
      const pinGeo1 = new THREE.BoxGeometry(0.2, 0.5, 0.5);
      const mesh1 = new THREE.Mesh(pinGeo1, pinMat.clone());
      mesh1.position.set(px, -0.25, 1.3);
      mesh1.userData = { pinIndex: i, meta: PIN_METADATA[i] };
      chipGroup.add(mesh1);
      pinMeshes.push(mesh1);

      const ledGeo1 = new THREE.SphereGeometry(0.08, 12, 12);
      const ledMesh1 = new THREE.Mesh(ledGeo1, pinGlowMatInactive.clone());
      ledMesh1.position.set(px, -0.45, 1.6);
      chipGroup.add(ledMesh1);
      pinLeds.push(ledMesh1);
    }

    // Top Row: Pins 14 down to 8 (i = 0 is Pin 14, i = 6 is Pin 8)
    for (let i = 0; i < 7; i++) {
      const px = startX + i * stepX;
      const pinIndex = 13 - i;
      const pinGeo2 = new THREE.BoxGeometry(0.2, 0.5, 0.5);
      const mesh2 = new THREE.Mesh(pinGeo2, pinMat.clone());
      mesh2.position.set(px, -0.25, -1.3);
      mesh2.userData = { pinIndex: pinIndex, meta: PIN_METADATA[pinIndex] };
      chipGroup.add(mesh2);
      pinMeshes.push(mesh2);

      const ledGeo2 = new THREE.SphereGeometry(0.08, 12, 12);
      const ledMesh2 = new THREE.Mesh(ledGeo2, pinGlowMatInactive.clone());
      ledMesh2.position.set(px, -0.45, -1.6);
      chipGroup.add(ledMesh2);
      pinLeds.push(ledMesh2);
    }

    // PCB Solder Pads Plane
    const pcbGeo = new THREE.PlaneGeometry(6.6, 4.0);
    const pcbMat = new THREE.MeshLambertMaterial({ color: 0x064e3b });
    const pcb = new THREE.Mesh(pcbGeo, pcbMat);
    pcb.rotation.x = -Math.PI / 2;
    pcb.position.y = -0.55;
    chipGroup.add(pcb);

    const gridHelper = new THREE.GridHelper(6.0, 16, 0x10b981, 0x047857);
    gridHelper.position.y = -0.54;
    chipGroup.add(gridHelper);

    // Drag rotation controls
    const controller = attachDragRotation(container, chipGroup, 0.007);

    // Raycaster for Pin interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function onPointerMove(e) {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(pinMeshes);

      const hudText = document.getElementById("chip-hud-text");
      if (intersects.length > 0) {
        const meta = intersects[0].object.userData.meta;
        if (meta && hudText) {
          hudText.innerHTML = `PROBED: <strong style="color:#38bdf8;">PIN ${meta.pin} (${meta.name})</strong> — ${meta.desc}`;
          renderer.domElement.style.cursor = 'pointer';
        }
      } else {
        renderer.domElement.style.cursor = 'grab';
      }
    }
    renderer.domElement.addEventListener('pointermove', onPointerMove);

    renderer.domElement.addEventListener('click', () => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(pinMeshes);
      if (intersects.length > 0) {
        const meta = intersects[0].object.userData.meta;
        if (typeof playTone === 'function' && window.audioSynthEnabled) {
          playTone(880, 0.06, 'sine', 0.1);
        }
        const hudText = document.getElementById("chip-hud-text");
        if (hudText) {
          hudText.innerHTML = `LATCHED: <strong style="color:#00f59b;">PIN ${meta.pin} (${meta.name})</strong>: ${meta.desc} [${meta.voltage}]`;
        }
      }
    });

    // Animation Loop
    let isXRay = false;
    let animId;
    function animate() {
      animId = requestAnimationFrame(animate);
      controller.applyInertia(0.003);
      renderer.render(scene, camera);
    }
    animate();

    scenes.chip = {
      container,
      renderer,
      camera,
      scene,
      chipGroup,
      pinLeds,
      controller,
      animId,
      toggleXRay: function () {
        isXRay = !isXRay;
        bodyMat.transparent = isXRay;
        bodyMat.opacity = isXRay ? 0.35 : 1.0;
        siliconDie.visible = isXRay;
        wireLines.visible = isXRay;
        labelMesh.visible = !isXRay;
        return isXRay;
      },
      pulseSignals: function () {
        pinLeds.forEach((led, idx) => {
          setTimeout(() => {
            led.material.color.setHex(0x38bdf8);
            setTimeout(() => {
              led.material.color.setHex(0x475569);
            }, 250);
          }, idx * 40);
        });
        if (typeof playTone === 'function' && window.audioSynthEnabled) {
          playTone(523.25, 0.15, 'triangle', 0.1);
        }
      },
      resetView: function () {
        chipGroup.rotation.set(0.35, -0.45, 0);
        camera.position.set(0, 3.8, 6.2);
      },
      updatePins: function (inputs, outputs) {
        if (!pinLeds || pinLeds.length < 10) return;
        const isA = Boolean(inputs && inputs.A);
        const isB = Boolean(inputs && inputs.B);
        const isC = Boolean(inputs && inputs.C);
        const isD = Boolean(inputs && inputs.D);
        const isE = Boolean(inputs && inputs.E);
        const isApp = outputs ? outputs.status === 'APPROVE' : false;

        const colorActive = new THREE.Color(0x00f59b);
        const colorInactive = new THREE.Color(0x334155);
        const colorCyan = new THREE.Color(0x38bdf8);

        if (pinLeds[0]) pinLeds[0].material.color = isA ? colorCyan : colorInactive;
        if (pinLeds[1]) pinLeds[1].material.color = isB ? colorCyan : colorInactive;
        if (pinLeds[2]) pinLeds[2].material.color = isC ? colorCyan : colorInactive;
        if (pinLeds[3]) pinLeds[3].material.color = isD ? colorCyan : colorInactive;
        if (pinLeds[4]) pinLeds[4].material.color = isE ? colorCyan : colorInactive;
        if (pinLeds[7]) pinLeds[7].material.color = isApp ? colorActive : colorInactive;
      }
    };

    window.addEventListener('resize', () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w > 0 && h > 0) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    });
  }

  // =========================================================================
  // 2. 3D HOLOGRAPHIC DECISION REACTOR (Logic Lab Live Core)
  // =========================================================================
  function initDecisionReactorScene(containerId) {
    const container = document.getElementById(containerId);
    if (!container || typeof THREE === 'undefined') return;
    if (scenes.reactor) return;

    const width = container.clientWidth || 360;
    const height = container.clientHeight || 260;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.5, 4.8);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "default" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambient);

    const coreLight = new THREE.PointLight(0x00f59b, 2.5, 12);
    coreLight.position.set(0, 0, 0);
    scene.add(coreLight);

    const reactorGroup = new THREE.Group();
    scene.add(reactorGroup);

    // Central Polyhedron Core
    const coreGeo = new THREE.IcosahedronGeometry(1.0, 1);
    const coreMat = new THREE.MeshPhongMaterial({
      color: 0x00f59b,
      emissive: 0x00f59b,
      emissiveIntensity: 0.6,
      shininess: 90
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    reactorGroup.add(coreMesh);

    // Outer wireframe cage
    const wireGeo = new THREE.IcosahedronGeometry(1.25, 1);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x00f59b,
      wireframe: true,
      transparent: true,
      opacity: 0.4
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    reactorGroup.add(wireMesh);

    // Orbiting Holographic Gimbal Rings
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.7
    });

    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(1.65, 0.03, 8, 48), ringMat);
    reactorGroup.add(ring1);

    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(1.95, 0.03, 8, 48), ringMat);
    ring2.rotation.x = Math.PI / 3;
    reactorGroup.add(ring2);

    const ring3 = new THREE.Mesh(new THREE.TorusGeometry(2.25, 0.02, 8, 48), ringMat);
    ring3.rotation.y = Math.PI / 4;
    reactorGroup.add(ring3);

    // Particle field
    const partCount = 70;
    const partGeo = new THREE.BufferGeometry();
    const partPos = new Float32Array(partCount * 3);
    for (let i = 0; i < partCount; i++) {
      const radius = 1.3 + Math.random() * 1.4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      partPos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      partPos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      partPos[i * 3 + 2] = radius * Math.cos(phi);
    }
    partGeo.setAttribute('position', new THREE.BufferAttribute(partPos, 3));
    const partMat = new THREE.PointsMaterial({
      color: 0x00f59b,
      size: 0.07,
      transparent: true,
      opacity: 0.8
    });
    const particles = new THREE.Points(partGeo, partMat);
    reactorGroup.add(particles);

    const controller = attachDragRotation(container, reactorGroup, 0.006);

    let animId;
    let clock = new THREE.Clock();
    let ringSpeedMultiplier = 1.0;
    let shockwaveScale = 1.0;

    function triggerShockwave() {
      shockwaveScale = 1.45;
      if (typeof playTone === 'function' && window.audioSynthEnabled) {
        playTone(659.25, 0.2, 'sine', 0.12);
      }
    }

    container.addEventListener('click', triggerShockwave);

    function animate() {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      controller.applyInertia(0.005);
      ring1.rotation.z += 0.015 * ringSpeedMultiplier;
      ring2.rotation.y += 0.018 * ringSpeedMultiplier;
      ring3.rotation.x += 0.012 * ringSpeedMultiplier;
      particles.rotation.y -= 0.004 * ringSpeedMultiplier;

      // Pulse breathing with shockwave decay
      if (shockwaveScale > 1.0) {
        shockwaveScale = Math.max(1.0, shockwaveScale - 0.025);
      }
      const pulse = (1.0 + Math.sin(elapsed * 4) * 0.05) * shockwaveScale;
      coreMesh.scale.set(pulse, pulse, pulse);

      renderer.render(scene, camera);
    }
    animate();

    scenes.reactor = {
      container,
      renderer,
      camera,
      scene,
      reactorGroup,
      controller,
      animId,
      triggerPulse: triggerShockwave,
      toggleTurbo: function () {
        ringSpeedMultiplier = ringSpeedMultiplier === 1.0 ? 3.0 : 1.0;
        return ringSpeedMultiplier > 1.0;
      },
      resetView: function () {
        reactorGroup.rotation.set(0, 0, 0);
        camera.position.set(0, 1.5, 4.8);
      },
      setStatus: function (status) {
        let hexColor = 0x00f59b;
        let ringHex = 0x38bdf8;
        if (status === 'REJECT') {
          hexColor = 0xff3b5c;
          ringHex = 0xf43f5e;
        } else if (status === 'REVIEW') {
          hexColor = 0xf59e0b;
          ringHex = 0xfbbf24;
        }

        coreMat.color.setHex(hexColor);
        coreMat.emissive.setHex(hexColor);
        wireMat.color.setHex(hexColor);
        coreLight.color.setHex(hexColor);
        ringMat.color.setHex(ringHex);
        partMat.color.setHex(hexColor);
      }
    };

    window.addEventListener('resize', () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w > 0 && h > 0) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    });
  }

  // =========================================================================
  // 3. 3D KARNAUGH HYPERCUBE (4-Variable Spatial Adjacency Cube)
  // =========================================================================
  function initKMapCubeScene(containerId) {
    const container = document.getElementById(containerId);
    if (!container || typeof THREE === 'undefined') return;
    if (scenes.kmap) return;

    const width = container.clientWidth || 360;
    const height = container.clientHeight || 280;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 2.2, 5.8);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "default" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambient);
    const dLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    dLight.position.set(3, 5, 4);
    scene.add(dLight);

    const kmapGroup = new THREE.Group();
    scene.add(kmapGroup);

    // 4-Variable 16-node Hypercube Layout
    const nodes = [];
    const nodeMeshes = [];

    const colInactive = 0x334155;
    const colActiveOne = 0x00f59b;
    const colSelected = 0x38bdf8;

    const sphereGeo = new THREE.SphereGeometry(0.14, 16, 16);
    const nodeMatBase = new THREE.MeshPhongMaterial({
      color: colInactive,
      shininess: 50
    });

    for (let i = 0; i < 16; i++) {
      const a = (i >> 3) & 1;
      const b = (i >> 2) & 1;
      const c = (i >> 1) & 1;
      const d = i & 1;

      const scale = a === 1 ? 1.55 : 0.85;
      const x = (b === 1 ? 1 : -1) * scale;
      const y = (c === 1 ? 1 : -1) * scale;
      const z = (d === 1 ? 1 : -1) * scale;

      const mesh = new THREE.Mesh(sphereGeo, nodeMatBase.clone());
      mesh.position.set(x, y, z);
      mesh.userData = { minterm: i, a, b, c, d };
      kmapGroup.add(mesh);

      nodes.push({ id: i, a, b, c, d, x, y, z, mesh });
      nodeMeshes.push(mesh);
    }

    // Connect Gray-code neighbors
    const edgeMat = new THREE.LineBasicMaterial({
      color: 0x334155,
      transparent: true,
      opacity: 0.8
    });

    const edgeGeo = new THREE.BufferGeometry();
    const edgePoints = [];

    for (let i = 0; i < 16; i++) {
      for (let bit = 0; bit < 4; bit++) {
        const j = i ^ (1 << bit);
        if (i < j) {
          edgePoints.push(nodes[i].x, nodes[i].y, nodes[i].z);
          edgePoints.push(nodes[j].x, nodes[j].y, nodes[j].z);
        }
      }
    }
    edgeGeo.setAttribute('position', new THREE.Float32BufferAttribute(edgePoints, 3));
    const edges = new THREE.LineSegments(edgeGeo, edgeMat);
    kmapGroup.add(edges);

    const controller = attachDragRotation(container, kmapGroup, 0.007);

    // Raycaster for clicking spheres
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    renderer.domElement.addEventListener('pointermove', (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodeMeshes);
      const hudEl = document.getElementById("kmap-3d-hud-text");

      if (intersects.length > 0) {
        const d = intersects[0].object.userData;
        if (hudEl) {
          hudEl.innerHTML = `TARGET: <strong style="color:#38bdf8;">m${d.minterm}</strong> (A=${d.a}, B=${d.b}, C=${d.c}, D=${d.d})`;
        }
        renderer.domElement.style.cursor = 'pointer';
      } else {
        renderer.domElement.style.cursor = 'grab';
      }
    });

    renderer.domElement.addEventListener('click', () => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodeMeshes);
      if (intersects.length > 0) {
        const m = intersects[0].object.userData.minterm;
        if (typeof window.handleKMapCellClick === 'function') {
          window.handleKMapCellClick(m);
        }
      }
    });

    let animId;
    function animate() {
      animId = requestAnimationFrame(animate);
      controller.applyInertia(0.004);
      renderer.render(scene, camera);
    }
    animate();

    scenes.kmap = {
      container,
      renderer,
      camera,
      scene,
      kmapGroup,
      nodes,
      controller,
      animId,
      resetView: function () {
        kmapGroup.rotation.set(0, 0, 0);
        camera.position.set(0, 2.2, 5.8);
      },
      highlightMinterm: function (mintermIndex) {
        nodes.forEach((n) => {
          if (n.id === mintermIndex) {
            n.mesh.material.color.setHex(colSelected);
            n.mesh.material.emissive = new THREE.Color(colSelected);
            n.mesh.material.emissiveIntensity = 0.8;
            n.mesh.scale.set(1.6, 1.6, 1.6);
          } else {
            n.mesh.material.color.setHex(colInactive);
            n.mesh.material.emissive = new THREE.Color(0x000000);
            n.mesh.material.emissiveIntensity = 0;
            n.mesh.scale.set(1.0, 1.0, 1.0);
          }
        });
      },
      updateFunctionMinterms: function (mintermSet) {
        nodes.forEach((n) => {
          const isOne = mintermSet && mintermSet.has(n.id);
          n.mesh.material.color.setHex(isOne ? colActiveOne : colInactive);
          n.mesh.material.emissive = isOne ? new THREE.Color(colActiveOne) : new THREE.Color(0x000000);
          n.mesh.material.emissiveIntensity = isOne ? 0.6 : 0;
          n.mesh.scale.set(isOne ? 1.25 : 1.0, isOne ? 1.25 : 1.0, isOne ? 1.25 : 1.0);
        });
      }
    };

    window.addEventListener('resize', () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w > 0 && h > 0) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    });
  }

  // Public Controls API
  return {
    initChip: initChipScene,
    initReactor: initDecisionReactorScene,
    initKMapCube: initKMapCubeScene,
    
    // Chip controls
    toggleChipXRay: function () {
      if (scenes.chip) return scenes.chip.toggleXRay();
    },
    pulseChipSignals: function () {
      if (scenes.chip) scenes.chip.pulseSignals();
    },
    toggleChipSpin: function () {
      if (scenes.chip) return scenes.chip.controller.toggleAutoSpin();
    },
    resetChipView: function () {
      if (scenes.chip) scenes.chip.resetView();
    },

    // Reactor controls
    triggerReactorPulse: function () {
      if (scenes.reactor) scenes.reactor.triggerPulse();
    },
    toggleReactorTurbo: function () {
      if (scenes.reactor) return scenes.reactor.toggleTurbo();
    },
    resetReactorView: function () {
      if (scenes.reactor) scenes.reactor.resetView();
    },
    updateDecision: function (status) {
      if (scenes.reactor) scenes.reactor.setStatus(status);
    },
    updateChipPins: function (inputs, outputs) {
      if (scenes.chip) scenes.chip.updatePins(inputs, outputs);
    },

    // KMap controls
    toggleKMapSpin: function () {
      if (scenes.kmap) return scenes.kmap.controller.toggleAutoSpin();
    },
    resetKMapView: function () {
      if (scenes.kmap) scenes.kmap.resetView();
    },
    highlightKMapMinterm: function (index) {
      if (scenes.kmap) scenes.kmap.highlightMinterm(index);
    },
    updateKMapMinterms: function (set) {
      if (scenes.kmap) scenes.kmap.updateFunctionMinterms(set);
    },

    refreshLayout: function () {
      ['chip', 'reactor', 'kmap'].forEach((k) => {
        const s = scenes[k];
        if (s && s.container && s.renderer && s.camera) {
          const w = s.container.clientWidth;
          const h = s.container.clientHeight;
          if (w > 0 && h > 0) {
            s.camera.aspect = w / h;
            s.camera.updateProjectionMatrix();
            s.renderer.setSize(w, h);
          }
        }
      });
    }
  };
})();
