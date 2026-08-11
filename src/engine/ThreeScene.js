import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class ThreeEngine {
  constructor(containerElement, onSelectMesh, onUpdateAnnotations) {
    this.container = containerElement;
    this.onSelectMesh = onSelectMesh;
    this.onUpdateAnnotations = onUpdateAnnotations;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.currentModelGroup = null;
    this.animationTick = null;
    this.annotationsData = [];
    this.originalPositions = new Map();

    // Settings
    this.isAutoRotate = false;
    this.isWireframe = false;
    this.explodeFactor = 0;
    this.lightingPreset = 'space';
    this.clock = new THREE.Clock();
    this.animId = null;

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.init();
  }

  init() {
    // 1. Scene
    this.scene = new THREE.Scene();

    // 2. Camera
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    this.camera.position.set(0, 4, 14);

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.container.appendChild(this.renderer.domElement);

    // 4. Orbit Controls (Rotation & Maximizing Freedom)
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.maxDistance = 80;
    this.controls.minDistance = 1.5;

    // 5. Setup Lighting Environment
    this.setupLighting();

    // 6. Event Listeners
    window.addEventListener('resize', this.onResize);
    this.renderer.domElement.addEventListener('pointerdown', this.onPointerDown);

    // 7. Start Animation Loop
    this.animate();
  }

  setupLighting() {
    // Clear existing lights
    const existingLights = this.scene.children.filter(c => c.isLight || c.isSky);
    existingLights.forEach(l => this.scene.remove(l));

    if (this.lightingPreset === 'space') {
      this.scene.background = new THREE.Color(0x050711);

      const ambientLight = new THREE.AmbientLight(0x38bdf8, 0.8);
      this.scene.add(ambientLight);

      const dirLight1 = new THREE.DirectionalLight(0x8b5cf6, 2.0);
      dirLight1.position.set(10, 20, 15);
      this.scene.add(dirLight1);

      const dirLight2 = new THREE.DirectionalLight(0x06b6d4, 1.5);
      dirLight2.position.set(-15, -10, -10);
      this.scene.add(dirLight2);

    } else if (this.lightingPreset === 'cyberpunk') {
      this.scene.background = new THREE.Color(0x0a0518);

      const ambientLight = new THREE.AmbientLight(0xec4899, 0.7);
      this.scene.add(ambientLight);

      const pLight1 = new THREE.PointLight(0x06b6d4, 3, 30);
      pLight1.position.set(10, 10, 10);
      this.scene.add(pLight1);

      const pLight2 = new THREE.PointLight(0xec4899, 3, 30);
      pLight2.position.set(-10, -5, 10);
      this.scene.add(pLight2);

    } else if (this.lightingPreset === 'studio') {
      this.scene.background = new THREE.Color(0x18181b);

      const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
      this.scene.add(ambientLight);

      const dirLight = new THREE.DirectionalLight(0xffffff, 1.8);
      dirLight.position.set(5, 15, 10);
      this.scene.add(dirLight);
    }
  }

  loadModel(modelData) {
    if (this.currentModelGroup) {
      this.scene.remove(this.currentModelGroup);
    }

    this.currentModelGroup = modelData.group;
    this.animationTick = modelData.animationTick || null;
    this.annotationsData = modelData.annotations || [];
    this.scene.add(this.currentModelGroup);

    // Cache original positions for explode view
    this.originalPositions.clear();
    this.currentModelGroup.traverse((child) => {
      if (child.isMesh) {
        this.originalPositions.set(child.uuid, child.position.clone());
      }
    });

    // Reset Camera view to fit bounds
    this.resetCamera();
  }

  // Camera Controls
  resetCamera() {
    if (!this.currentModelGroup) return;

    const box = new THREE.Box3().setFromObject(this.currentModelGroup);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = this.camera.fov * (Math.PI / 180);
    let cameraZ = Math.abs(maxDim / (2 * Math.tan(fov / 2))) * 1.6;
    cameraZ = Math.max(cameraZ, 4);

    this.camera.position.set(center.x, center.y + maxDim * 0.3, center.z + cameraZ);
    this.controls.target.copy(center);
    this.controls.update();
  }

  setAutoRotate(enable) {
    this.isAutoRotate = enable;
    this.controls.autoRotate = enable;
    this.controls.autoRotateSpeed = 2.0;
  }

  setLightingPreset(preset) {
    this.lightingPreset = preset;
    this.setupLighting();
  }

  setWireframe(enable) {
    this.isWireframe = enable;
    if (this.currentModelGroup) {
      this.currentModelGroup.traverse((child) => {
        if (child.isMesh && child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(m => m.wireframe = enable);
          } else {
            child.material.wireframe = enable;
          }
        }
      });
    }
  }

  setExplodeFactor(factor) {
    this.explodeFactor = factor;
    if (!this.currentModelGroup) return;

    this.currentModelGroup.traverse((child) => {
      if (child.isMesh && this.originalPositions.has(child.uuid)) {
        const origPos = this.originalPositions.get(child.uuid);
        // Explode outward along position vector from origin
        const dir = origPos.clone().normalize();
        if (dir.length() === 0) dir.set(1, 0, 0);
        child.position.copy(origPos).addScaledVector(dir, factor * 1.5);
      }
    });
  }

  // Pointer Click Object Inspector
  onPointerDown = (event) => {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    if (!this.currentModelGroup) return;

    const intersects = this.raycaster.intersectObjects(this.currentModelGroup.children, true);
    if (intersects.length > 0) {
      const hitObject = intersects[0].object;
      if (this.onSelectMesh) {
        this.onSelectMesh({
          name: hitObject.name || "3D Mesh Part",
          description: hitObject.userData?.description || "Interactive component of the generated 3D scene model.",
          uuid: hitObject.uuid
        });
      }
    }
  };

  onResize = () => {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  takeScreenshot() {
    this.renderer.render(this.scene, this.camera);
    return this.renderer.domElement.toDataURL('image/png');
  }

  // Render Loop
  animate = () => {
    this.animId = requestAnimationFrame(this.animate);
    const elapsedTime = this.clock.getElapsedTime();

    // Update Controls
    this.controls.update();

    // Model Animations
    if (this.animationTick) {
      this.animationTick(elapsedTime);
    }

    // Project 3D Annotations to 2D HTML Screen Coordinates
    if (this.annotationsData.length > 0 && this.onUpdateAnnotations) {
      const screenPins = this.annotationsData.map(ann => {
        const vec = new THREE.Vector3(...ann.pos);
        vec.project(this.camera);

        const width = this.container.clientWidth;
        const height = this.container.clientHeight;

        const x = (vec.x * .5 + .5) * width;
        const y = (-(vec.y * .5) + .5) * height;
        const visible = vec.z < 1.0;

        return { text: ann.text, x, y, visible };
      });
      this.onUpdateAnnotations(screenPins);
    }

    this.renderer.render(this.scene, this.camera);
  };

  dispose() {
    if (this.animId) cancelAnimationFrame(this.animId);
    window.removeEventListener('resize', this.onResize);
    if (this.renderer && this.renderer.domElement) {
      this.container.removeChild(this.renderer.domElement);
      this.renderer.dispose();
    }
  }
}
