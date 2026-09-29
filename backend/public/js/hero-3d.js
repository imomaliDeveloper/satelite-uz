/**
 * SATELITE.UZ - 3D Futuristic Satellite & Orbit Visual Identity
 * Built with Three.js Procedural Geometry (Zero external model dependencies)
 */

class SateliteScene {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.options = {
      isCompact: options.isCompact || false,
      enableMouseParallax: options.enableMouseParallax !== false,
      ...options
    };

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.satelliteGroup = null;
    this.orbitRings = [];
    this.particles = null;
    this.animationFrameId = null;

    this.mouseX = 0;
    this.mouseY = 0;
    this.targetMouseX = 0;
    this.targetMouseY = 0;

    this.init();
  }

  init() {
    // Check for Three.js global
    if (typeof THREE === 'undefined') {
      console.warn('[SATELITE 3D] Three.js not loaded, skipping 3D canvas.');
      return;
    }

    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || (this.options.isCompact ? 300 : 600);

    // 1. Scene
    this.scene = new THREE.Scene();

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.set(0, 5, 24);

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    this.container.appendChild(this.renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x6366f1, 3, 50);
    pointLight.position.set(10, 15, 10);
    this.scene.add(pointLight);

    const cyanLight = new THREE.PointLight(0x06b6d4, 2.5, 50);
    cyanLight.position.set(-15, -10, 5);
    this.scene.add(cyanLight);

    // 5. Central Celestial Orb (Planet / Learning Core)
    const coreGeometry = new THREE.SphereGeometry(3.5, 32, 32);
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.4,
      metalness: 0.8,
      emissive: 0x1e1b4b,
      emissiveIntensity: 0.6
    });
    this.core = new THREE.Mesh(coreGeometry, coreMaterial);
    this.scene.add(this.core);

    // Core Atmosphere Glow Ring
    const atmoGeometry = new THREE.SphereGeometry(3.7, 32, 32);
    const atmoMaterial = new THREE.MeshBasicMaterial({
      color: 0x6366f1,
      transparent: true,
      opacity: 0.15,
      wireframe: true
    });
    this.atmosphere = new THREE.Mesh(atmoGeometry, atmoMaterial);
    this.scene.add(this.atmosphere);

    // 6. Orbital Rings
    this.createOrbitRings();

    // 7. Procedural Satellite Assembly
    this.createSatellite();

    // 8. Background Star Field
    this.createStarParticles();

    // Event listeners
    window.addEventListener('resize', this.onWindowResize.bind(this));
    if (this.options.enableMouseParallax) {
      window.addEventListener('mousemove', this.onMouseMove.bind(this));
    }

    // Theme reaction
    window.addEventListener('themeChanged', (e) => {
      this.updateThemeVisuals(e.detail?.theme);
    });
    // Check initial theme
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    if (currentTheme === 'light') {
      this.updateThemeVisuals('light');
    }

    // Start render loop
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      this.renderer.render(this.scene, this.camera);
    } else {
      this.animate();
    }
  }

  createOrbitRings() {
    const ringRadii = [6.8, 9.5];
    ringRadii.forEach((radius, i) => {
      const ringGeo = new THREE.TorusGeometry(radius, 0.04, 16, 100);
      const ringMat = new THREE.MeshBasicMaterial({
        color: i === 0 ? 0x6366f1 : 0x06b6d4,
        transparent: true,
        opacity: 0.4
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2.3 + (i * 0.2);
      ring.rotation.y = i * 0.4;
      this.scene.add(ring);
      this.orbitRings.push(ring);
    });
  }

  createSatellite() {
    this.satelliteGroup = new THREE.Group();

    // Main Satellite Bus (Cube/Body)
    const bodyGeo = new THREE.BoxGeometry(1.2, 0.9, 0.9);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0xd1d5db,
      metalness: 0.9,
      roughness: 0.2
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    this.satelliteGroup.add(body);

    // Solar Panel Wings (Left & Right)
    const panelGeo = new THREE.BoxGeometry(2.4, 0.8, 0.05);
    const panelMat = new THREE.MeshStandardMaterial({
      color: 0x1e3a8a,
      emissive: 0x0284c7,
      emissiveIntensity: 0.3,
      metalness: 0.7,
      roughness: 0.3
    });

    const leftPanel = new THREE.Mesh(panelGeo, panelMat);
    leftPanel.position.set(-2.0, 0, 0);
    this.satelliteGroup.add(leftPanel);

    const rightPanel = new THREE.Mesh(panelGeo, panelMat);
    rightPanel.position.set(2.0, 0, 0);
    this.satelliteGroup.add(rightPanel);

    // Parabolic Antenna Dish
    const dishGeo = new THREE.ConeGeometry(0.5, 0.3, 16, 1, true);
    const dishMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.8 });
    const dish = new THREE.Mesh(dishGeo, dishMat);
    dish.position.set(0, 0.6, 0);
    dish.rotation.x = -Math.PI;
    this.satelliteGroup.add(dish);

    // Status Indicator Light
    const ledGeo = new THREE.SphereGeometry(0.1, 8, 8);
    const ledMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    const led = new THREE.Mesh(ledGeo, ledMat);
    led.position.set(0.5, 0.4, 0.45);
    this.satelliteGroup.add(led);

    // Position on outer orbit
    this.satelliteGroup.position.set(8.5, 0, 0);
    this.satelliteOrbitRadius = 8.5;
    this.satelliteAngle = 0;

    this.scene.add(this.satelliteGroup);
  }

  createStarParticles() {
    const starCount = this.options.isCompact ? 400 : 1000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 80;
      positions[i + 1] = (Math.random() - 0.5) * 80;
      positions[i + 2] = (Math.random() - 0.5) * 60;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.12,
      transparent: true,
      opacity: 0.75
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  updateThemeVisuals(theme) {
    const isLight = theme === 'light';
    if (this.particles && this.particles.material) {
      this.particles.material.color.setHex(isLight ? 0x6366f1 : 0xffffff);
      this.particles.material.opacity = isLight ? 0.35 : 0.75;
    }
    if (this.core && this.core.material) {
      this.core.material.color.setHex(isLight ? 0x3b82f6 : 0x0f172a);
    }
  }

  onMouseMove(e) {
    this.targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
    this.targetMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
  }

  onWindowResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    this.animationFrameId = requestAnimationFrame(this.animate.bind(this));

    // Smooth mouse parallax interpolation
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;

    this.camera.position.x = this.mouseX * 3;
    this.camera.position.y = 5 + (this.mouseY * 2);
    this.camera.lookAt(0, 0, 0);

    // Rotate Central Orb & Atmosphere
    if (this.core) {
      this.core.rotation.y += 0.003;
      this.atmosphere.rotation.y -= 0.002;
    }

    // Orbit Satellite
    if (this.satelliteGroup) {
      this.satelliteAngle += 0.012;
      const x = Math.cos(this.satelliteAngle) * this.satelliteOrbitRadius;
      const z = Math.sin(this.satelliteAngle) * this.satelliteOrbitRadius;
      const y = Math.sin(this.satelliteAngle * 2) * 1.5;

      this.satelliteGroup.position.set(x, y, z);
      this.satelliteGroup.rotation.y = -this.satelliteAngle + Math.PI / 2;
      this.satelliteGroup.rotation.z = Math.sin(this.satelliteAngle) * 0.2;
    }

    // Slow particles drift
    if (this.particles) {
      this.particles.rotation.y += 0.0005;
    }

    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.renderer && this.renderer.domElement) {
      this.renderer.domElement.remove();
    }
  }
}

window.SateliteScene = SateliteScene;
