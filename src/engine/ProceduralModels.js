import * as THREE from 'three';

/**
 * ProceduralModels - Provides rich 3D procedural scenes for scientific, educational & custom prompts.
 */

// Helper to create glowing material
function createGlowMaterial(color, opacity = 0.8) {
  return new THREE.MeshStandardMaterial({
    color: color,
    emissive: color,
    emissiveIntensity: 0.6,
    roughness: 0.2,
    metalness: 0.8,
    transparent: opacity < 1,
    opacity: opacity
  });
}

// 1. Biological Neuron
export function generateNeuronScene() {
  const group = new THREE.Group();
  group.name = "NeuronScene";

  // Soma (Cell Body)
  const somaGeo = new THREE.DodecahedronGeometry(1.8, 2);
  const somaMat = new THREE.MeshStandardMaterial({
    color: 0x8b5cf6,
    emissive: 0x4c1d95,
    emissiveIntensity: 0.4,
    roughness: 0.3,
    metalness: 0.2
  });
  const soma = new THREE.Mesh(somaGeo, somaMat);
  soma.name = "Cell Body (Soma)";
  soma.userData = { description: "Contains the nucleus and cytoplasm. Processes incoming signals." };
  group.add(soma);

  // Nucleus
  const nucGeo = new THREE.SphereGeometry(0.7, 16, 16);
  const nucMat = createGlowMaterial(0xec4899, 0.9);
  const nucleus = new THREE.Mesh(nucGeo, nucMat);
  nucleus.name = "Nucleus";
  nucleus.userData = { description: "Stores genetic information (DNA) and controls cell activities." };
  group.add(nucleus);

  // Dendrites branching out from Soma
  const dendriteMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, roughness: 0.4 });
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const dendrite = new THREE.Group();
    
    // Main branch
    const branchGeo = new THREE.CylinderGeometry(0.2, 0.4, 2.5, 8);
    const branch = new THREE.Mesh(branchGeo, dendriteMat);
    branch.position.set(Math.cos(angle) * 2, Math.sin(angle) * 2, (Math.random() - 0.5) * 1.5);
    branch.rotation.z = angle + Math.PI / 2;
    branch.name = `Dendrite Branch ${i+1}`;
    branch.userData = { description: "Receives electrical impulses from other neurons." };
    dendrite.add(branch);
    
    // Sub-branches (Spines)
    const spineGeo = new THREE.SphereGeometry(0.18, 8, 8);
    const spine = new THREE.Mesh(spineGeo, createGlowMaterial(0x38bdf8));
    spine.position.set(Math.cos(angle) * 3.2, Math.sin(angle) * 3.2, (Math.random() - 0.5) * 2);
    spine.name = `Dendritic Spine ${i+1}`;
    spine.userData = { description: "Small membranous protrusion that receives input from a single axon terminal." };
    dendrite.add(spine);

    group.add(dendrite);
  }

  // Axon Hillock & Main Axon Cable
  const axonCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, -1.8, 0),
    new THREE.Vector3(0, -4, 0.5),
    new THREE.Vector3(0, -7, -0.5),
    new THREE.Vector3(0, -10, 0)
  ]);
  const axonGeo = new THREE.TubeGeometry(axonCurve, 30, 0.25, 12, false);
  const axonMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.3 });
  const axon = new THREE.Mesh(axonGeo, axonMat);
  axon.name = "Axon";
  axon.userData = { description: "Long nerve fiber that conducts electrical impulses away from the soma." };
  group.add(axon);

  // Myelin Sheaths (Protective insulation cylinders along Axon)
  const sheathMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    roughness: 0.2,
    metalness: 0.3
  });
  const sheathPositions = [-3.5, -5.5, -7.5, -9];
  sheathPositions.forEach((yPos, idx) => {
    const sheathGeo = new THREE.CylinderGeometry(0.45, 0.45, 1.2, 16);
    const sheath = new THREE.Mesh(sheathGeo, sheathMat);
    sheath.position.set(0, yPos, (idx % 2 === 0 ? 0.3 : -0.3));
    sheath.name = `Myelin Sheath ${idx + 1}`;
    sheath.userData = { description: "Fatty layer that insulates the axon and increases signal transmission speed." };
    group.add(sheath);

    // Node of Ranvier (Gap)
    const gapGeo = new THREE.RingGeometry(0.26, 0.42, 16);
    const gap = new THREE.Mesh(gapGeo, createGlowMaterial(0x10b981));
    gap.position.set(0, yPos - 0.75, (idx % 2 === 0 ? 0.3 : -0.3));
    gap.rotation.x = Math.PI / 2;
    gap.name = `Node of Ranvier ${idx + 1}`;
    gap.userData = { description: "Gap in myelin sheath allowing rapid conduction of nerve impulses." };
    group.add(gap);
  });

  // Axon Terminals & Synaptic Knobs
  const terminalGroup = new THREE.Group();
  terminalGroup.position.set(0, -10.5, 0);
  for (let i = 0; i < 5; i++) {
    const termAngle = (i / 5) * Math.PI * 2;
    const termLineGeo = new THREE.CylinderGeometry(0.08, 0.12, 1.5, 8);
    const termLine = new THREE.Mesh(termLineGeo, dendriteMat);
    termLine.position.set(Math.cos(termAngle) * 0.8, -0.6, Math.sin(termAngle) * 0.8);
    termLine.rotation.z = Math.cos(termAngle) * 0.5;
    
    const knobGeo = new THREE.SphereGeometry(0.25, 12, 12);
    const knob = new THREE.Mesh(knobGeo, createGlowMaterial(0xf43f5e));
    knob.position.set(Math.cos(termAngle) * 1.4, -1.3, Math.sin(termAngle) * 1.4);
    knob.name = `Synaptic Terminal ${i + 1}`;
    knob.userData = { description: "Releases neurotransmitters into the synaptic cleft to transmit signal to next cell." };
    
    terminalGroup.add(termLine);
    terminalGroup.add(knob);
  }
  group.add(terminalGroup);

  // Electrical Action Potential Pulses (Animated particles)
  const pulseGeo = new THREE.SphereGeometry(0.15, 8, 8);
  const pulseMat = createGlowMaterial(0x60a5fa, 1);
  const pulses = [];
  for (let p = 0; p < 6; p++) {
    const pulse = new THREE.Mesh(pulseGeo, pulseMat);
    pulse.name = "Action Potential Signal";
    pulse.userData = { isPulse: true, progress: p * 0.15 };
    group.add(pulse);
    pulses.push(pulse);
  }

  return {
    group,
    title: "Biological Neuron Structure",
    category: "Neuroscience / Biology",
    annotations: [
      { text: "Cell Body (Soma)", pos: [0, 0.5, 0] },
      { text: "Nucleus", pos: [0.8, 0, 0] },
      { text: "Dendrite", pos: [2.5, 2, 0] },
      { text: "Axon", pos: [0.5, -4.5, 0] },
      { text: "Myelin Sheath", pos: [0.8, -7.5, 0] },
      { text: "Synaptic Terminal", pos: [1.5, -11.5, 0] }
    ],
    animationTick: (time) => {
      // Rotate cell body slowly
      soma.rotation.y = time * 0.2;
      nucleus.rotation.y = -time * 0.3;
      
      // Move action potential pulses down axon curve
      pulses.forEach((pulse) => {
        let prog = (pulse.userData.progress + time * 0.25) % 1;
        const pt = axonCurve.getPoint(prog);
        pulse.position.copy(pt);
      });
    }
  };
}

// 2. Solar System
export function generateSolarSystemScene() {
  const group = new THREE.Group();
  group.name = "SolarSystemScene";

  // Sun
  const sunGeo = new THREE.SphereGeometry(2.5, 32, 32);
  const sunMat = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
  const sun = new THREE.Mesh(sunGeo, sunMat);
  sun.name = "The Sun";
  sun.userData = { description: "G2V yellow dwarf star at the center of the solar system containing 99.8% of system mass." };
  group.add(sun);

  // Sun Glow Halo
  const haloGeo = new THREE.SphereGeometry(3.1, 32, 32);
  const haloMat = new THREE.MeshBasicMaterial({
    color: 0xffdd44,
    transparent: true,
    opacity: 0.25,
    side: THREE.BackSide
  });
  const halo = new THREE.Mesh(haloGeo, haloMat);
  group.add(halo);

  // Planets data
  const planetData = [
    { name: "Mercury", size: 0.4, dist: 4.5, color: 0xa8a29e, speed: 1.5, desc: "Smallest and innermost planet with extreme temperature variations." },
    { name: "Venus", size: 0.65, dist: 6.5, color: 0xf59e0b, speed: 1.1, desc: "Hottest planet with thick toxic carbon dioxide atmosphere." },
    { name: "Earth", size: 0.75, dist: 9.0, color: 0x3b82f6, speed: 0.8, desc: "Third planet from the Sun, only known celestial body to support life.", hasMoon: true },
    { name: "Mars", size: 0.5, dist: 11.5, color: 0xef4444, speed: 0.6, desc: "The Red Planet with iron oxide soil and Olympus Mons volcano." },
    { name: "Jupiter", size: 1.6, dist: 15.0, color: 0xd97706, speed: 0.4, desc: "Largest gas giant planet featuring the Great Red Spot storm." },
    { name: "Saturn", size: 1.3, dist: 19.0, color: 0xfde047, speed: 0.3, desc: "Famous for its magnificent ice and dust ring system.", hasRings: true },
    { name: "Uranus", size: 0.9, dist: 23.0, color: 0x06b6d4, speed: 0.2, desc: "Ice giant that rotates on a severe 98-degree sideways tilt." },
    { name: "Neptune", size: 0.85, dist: 26.5, color: 0x2563eb, speed: 0.15, desc: "Outermost ice giant with supersonic wind speeds over 1200 mph." }
  ];

  const planets = [];

  planetData.forEach((pd) => {
    // Orbit Ring Visual
    const orbitGeo = new THREE.RingGeometry(pd.dist - 0.05, pd.dist + 0.05, 64);
    const orbitMat = new THREE.MeshBasicMaterial({ color: 0x475569, side: THREE.DoubleSide, transparent: true, opacity: 0.4 });
    const orbitRing = new THREE.Mesh(orbitGeo, orbitMat);
    orbitRing.rotation.x = Math.PI / 2;
    group.add(orbitRing);

    // Planet Mesh
    const pGeo = new THREE.SphereGeometry(pd.size, 24, 24);
    const pMat = new THREE.MeshStandardMaterial({ color: pd.color, roughness: 0.6, metalness: 0.2 });
    const planet = new THREE.Mesh(pGeo, pMat);
    planet.name = pd.name;
    planet.userData = { description: pd.desc, dist: pd.dist, speed: pd.speed, angle: Math.random() * Math.PI * 2 };
    
    // Saturn Rings
    if (pd.hasRings) {
      const ringGeo = new THREE.RingGeometry(pd.size * 1.4, pd.size * 2.3, 32);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0xfef08a, side: THREE.DoubleSide, transparent: true, opacity: 0.7 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2.5;
      planet.add(ring);
    }

    // Earth Moon
    if (pd.hasMoon) {
      const moonGeo = new THREE.SphereGeometry(0.2, 12, 12);
      const moonMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0 });
      const moon = new THREE.Mesh(moonGeo, moonMat);
      moon.name = "The Moon";
      moon.position.set(1.2, 0, 0);
      moon.userData = { description: "Earth's natural satellite, affecting ocean tides and axial stability." };
      planet.add(moon);
      planet.userData.moon = moon;
    }

    group.add(planet);
    planets.push(planet);
  });

  return {
    group,
    title: "Interactive Solar System",
    category: "Astronomy / Planetary Science",
    annotations: [
      { text: "Sun (Center Star)", pos: [0, 3, 0] },
      { text: "Earth & Moon", pos: [9, 1.2, 0] },
      { text: "Saturn Rings", pos: [19, 1.8, 0] }
    ],
    animationTick: (time) => {
      sun.rotation.y = time * 0.1;
      planets.forEach((p) => {
        const u = p.userData;
        u.angle += u.speed * 0.008;
        p.position.x = Math.cos(u.angle) * u.dist;
        p.position.z = Math.sin(u.angle) * u.dist;
        p.rotation.y = time * 0.8;

        if (u.moon) {
          u.moon.position.x = Math.cos(time * 2) * 1.2;
          u.moon.position.z = Math.sin(time * 2) * 1.2;
        }
      });
    }
  };
}

// 3. DNA Double Helix
export function generateDNADoubleHelixScene() {
  const group = new THREE.Group();
  group.name = "DNAScene";

  const numPairs = 24;
  const radius = 2.0;
  const heightStep = 0.5;
  const twistStep = 0.35;

  const strand1Points = [];
  const strand2Points = [];

  const basePairs = [
    { name: "Adenine-Thymine (A-T)", colorA: 0xef4444, colorB: 0x3b82f6 },
    { name: "Guanine-Cytosine (G-C)", colorA: 0x10b981, colorB: 0xf59e0b }
  ];

  for (let i = 0; i < numPairs; i++) {
    const y = (i - numPairs / 2) * heightStep;
    const angle = i * twistStep;

    const x1 = Math.cos(angle) * radius;
    const z1 = Math.sin(angle) * radius;
    const x2 = Math.cos(angle + Math.PI) * radius;
    const z2 = Math.sin(angle + Math.PI) * radius;

    strand1Points.push(new THREE.Vector3(x1, y, z1));
    strand2Points.push(new THREE.Vector3(x2, y, z2));

    // Base pair rod connecting strand 1 and strand 2
    const bpData = basePairs[i % 2];
    const rGroup = new THREE.Group();
    rGroup.name = `Base Pair ${i+1}: ${bpData.name}`;
    rGroup.userData = { description: `Nucleotide pair: ${bpData.name}. Forms genetic sequence code.` };

    // Half rod A
    const rodAGeo = new THREE.CylinderGeometry(0.12, 0.12, radius, 8);
    const rodAMat = createGlowMaterial(bpData.colorA, 0.9);
    const rodA = new THREE.Mesh(rodAGeo, rodAMat);
    rodA.position.set(x1 / 2, y, z1 / 2);
    rodA.rotation.z = Math.PI / 2;
    rodA.rotation.y = -angle;

    // Half rod B
    const rodBGeo = new THREE.CylinderGeometry(0.12, 0.12, radius, 8);
    const rodBMat = createGlowMaterial(bpData.colorB, 0.9);
    const rodB = new THREE.Mesh(rodBGeo, rodBMat);
    rodB.position.set(x2 / 2, y, z2 / 2);
    rodB.rotation.z = Math.PI / 2;
    rodB.rotation.y = -(angle + Math.PI);

    // Hydrogen bond center node
    const hBondGeo = new THREE.SphereGeometry(0.2, 10, 10);
    const hBondMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1, metalness: 0.9 });
    const hBond = new THREE.Mesh(hBondGeo, hBondMat);
    hBond.position.set(0, y, 0);

    rGroup.add(rodA);
    rGroup.add(rodB);
    rGroup.add(hBond);
    group.add(rGroup);
  }

  // Backbone Tubes
  const curve1 = new THREE.CatmullRomCurve3(strand1Points);
  const tubeGeo1 = new THREE.TubeGeometry(curve1, 64, 0.22, 12, false);
  const tubeMat1 = new THREE.MeshStandardMaterial({ color: 0x8b5cf6, roughness: 0.3, metalness: 0.4 });
  const backbone1 = new THREE.Mesh(tubeGeo1, tubeMat1);
  backbone1.name = "Sugar-Phosphate Backbone 1";
  backbone1.userData = { description: "Outer structural framework consisting of alternating sugar and phosphate groups." };
  group.add(backbone1);

  const curve2 = new THREE.CatmullRomCurve3(strand2Points);
  const tubeGeo2 = new THREE.TubeGeometry(curve2, 64, 0.22, 12, false);
  const tubeMat2 = new THREE.MeshStandardMaterial({ color: 0x06b6d4, roughness: 0.3, metalness: 0.4 });
  const backbone2 = new THREE.Mesh(tubeGeo2, tubeMat2);
  backbone2.name = "Sugar-Phosphate Backbone 2";
  backbone2.userData = { description: "Antiparallel complementary strand forming the double helix." };
  group.add(backbone2);

  return {
    group,
    title: "DNA Double Helix Molecular Structure",
    category: "Genetics / Molecular Biology",
    annotations: [
      { text: "Sugar-Phosphate Backbone", pos: [2.2, 4, 0] },
      { text: "Base Pair (A-T / G-C)", pos: [0, 0, 0] },
      { text: "Hydrogen Bonds", pos: [0, -2, 0] }
    ],
    animationTick: (time) => {
      group.rotation.y = time * 0.4;
    }
  };
}

// 4. Anatomical Human Heart
export function generateHeartScene() {
  const group = new THREE.Group();
  group.name = "HeartScene";

  // Main Muscle Body (Myocardium)
  const heartGeo = new THREE.SphereGeometry(2.2, 32, 32);
  heartGeo.scale(1.2, 1.6, 1.1);
  const heartMat = new THREE.MeshStandardMaterial({
    color: 0xbe123c,
    roughness: 0.5,
    metalness: 0.1,
    bumpScale: 0.05
  });
  const body = new THREE.Mesh(heartGeo, heartMat);
  body.name = "Myocardium (Heart Muscle)";
  body.userData = { description: "Thick muscular layer of the heart that contracts to pump oxygenated and deoxygenated blood." };
  group.add(body);

  // Aorta Arch (Main artery out top)
  const aortaCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 2, 0),
    new THREE.Vector3(0.5, 3.5, 0),
    new THREE.Vector3(-0.5, 4.2, -0.3),
    new THREE.Vector3(-1.2, 3.0, -0.5)
  ]);
  const aortaGeo = new THREE.TubeGeometry(aortaCurve, 20, 0.45, 16, false);
  const aortaMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.3 });
  const aorta = new THREE.Mesh(aortaGeo, aortaMat);
  aorta.name = "Aortic Arch";
  aorta.userData = { description: "Main vessel carrying oxygen-rich blood from the left ventricle to the rest of the body." };
  group.add(aorta);

  // Superior Vena Cava
  const vcGeo = new THREE.CylinderGeometry(0.38, 0.38, 2.5, 16);
  const vcMat = new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.3 });
  const vc = new THREE.Mesh(vcGeo, vcMat);
  vc.position.set(1.2, 2.8, 0.3);
  vc.name = "Superior Vena Cava";
  vc.userData = { description: "Large vein carrying deoxygenated blood from the upper body back to the right atrium." };
  group.add(vc);

  // Coronary Arteries (Red/Blue surface blood vessels)
  for (let c = 0; c < 5; c++) {
    const cMat = new THREE.MeshStandardMaterial({ color: c % 2 === 0 ? 0xef4444 : 0x3b82f6 });
    const cCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3((Math.random() - 0.5) * 1.5, 1.5, 1.2),
      new THREE.Vector3((Math.random() - 0.5) * 2.2, 0, 1.4),
      new THREE.Vector3((Math.random() - 0.5) * 1.8, -1.8, 1.0)
    ]);
    const cGeo = new THREE.TubeGeometry(cCurve, 12, 0.08, 8, false);
    const vessel = new THREE.Mesh(cGeo, cMat);
    vessel.name = `Coronary Vessel ${c+1}`;
    vessel.userData = { description: "Supplies blood flow and oxygen to the heart tissue muscle itself." };
    group.add(vessel);
  }

  return {
    group,
    title: "Anatomical Human Heart & Major Vessels",
    category: "Cardiology / Human Anatomy",
    annotations: [
      { text: "Aortic Arch", pos: [-0.5, 4.2, 0] },
      { text: "Superior Vena Cava", pos: [1.2, 3.2, 0] },
      { text: "Myocardium", pos: [0, 0, 1.2] }
    ],
    animationTick: (time) => {
      // Pulsing heartbeat animation (systole / diastole)
      const beat = 1 + Math.sin(time * 6) * 0.05 + Math.sin(time * 12) * 0.02;
      body.scale.set(1.2 * beat, 1.6 * beat, 1.1 * beat);
    }
  };
}

// 5. Rutherford-Bohr Quantum Atom
export function generateAtomScene() {
  const group = new THREE.Group();
  group.name = "AtomScene";

  // Nucleus Cluster (Protons + Neutrons)
  const nucGroup = new THREE.Group();
  nucGroup.name = "Atomic Nucleus";
  nucGroup.userData = { description: "Dense central core containing positively charged Protons and neutral Neutrons." };

  for (let i = 0; i < 14; i++) {
    const isProton = i % 2 === 0;
    const pGeo = new THREE.SphereGeometry(0.35, 16, 16);
    const pMat = createGlowMaterial(isProton ? 0xef4444 : 0x3b82f6);
    const particle = new THREE.Mesh(pGeo, pMat);
    particle.position.set(
      (Math.random() - 0.5) * 1.0,
      (Math.random() - 0.5) * 1.0,
      (Math.random() - 0.5) * 1.0
    );
    particle.name = isProton ? `Proton (+)` : `Neutron (0)`;
    particle.userData = { description: isProton ? "Positively charged subatomic particle." : "Neutrally charged subatomic particle." };
    nucGroup.add(particle);
  }
  group.add(nucGroup);

  // Electron Orbits & Orbiting Electrons
  const orbitColors = [0x06b6d4, 0x8b5cf6, 0xec4899];
  const electrons = [];

  for (let o = 0; o < 3; o++) {
    const orbitRadius = 2.8 + o * 0.8;
    const orbitRingGeo = new THREE.RingGeometry(orbitRadius - 0.03, orbitRadius + 0.03, 64);
    const orbitMat = new THREE.MeshBasicMaterial({ color: orbitColors[o], side: THREE.DoubleSide, transparent: true, opacity: 0.6 });
    const orbit = new THREE.Mesh(orbitRingGeo, orbitMat);
    
    // Tilt orbital planes at different 3D angles
    orbit.rotation.x = Math.PI / 3 * (o + 1);
    orbit.rotation.y = Math.PI / 4 * o;
    group.add(orbit);

    // Electron particle
    const eleGeo = new THREE.SphereGeometry(0.22, 12, 12);
    const eleMat = createGlowMaterial(0x38bdf8, 1);
    const electron = new THREE.Mesh(eleGeo, eleMat);
    electron.name = `Electron shell ${o+1}`;
    electron.userData = {
      description: "Negatively charged subatomic particle orbiting the nucleus in energy levels.",
      radius: orbitRadius,
      rotX: orbit.rotation.x,
      rotY: orbit.rotation.y,
      speed: 2 + o * 0.8,
      phase: o * (Math.PI / 1.5)
    };
    group.add(electron);
    electrons.push(electron);
  }

  return {
    group,
    title: "Quantum Rutherford-Bohr Atom Model",
    category: "Physics / Quantum Chemistry",
    annotations: [
      { text: "Nucleus (Protons & Neutrons)", pos: [0, 0, 0] },
      { text: "Electron Orbital Shell", pos: [2.8, 2, 0] },
      { text: "Electron (-)", pos: [-3, -1, 0] }
    ],
    animationTick: (time) => {
      nucGroup.rotation.y = time * 0.3;
      electrons.forEach((e) => {
        const u = e.userData;
        const angle = time * u.speed + u.phase;
        
        // Calculate 3D position on tilted plane
        const localVec = new THREE.Vector3(Math.cos(angle) * u.radius, Math.sin(angle) * u.radius, 0);
        localVec.applyAxisAngle(new THREE.Vector3(1, 0, 0), u.rotX);
        localVec.applyAxisAngle(new THREE.Vector3(0, 1, 0), u.rotY);
        e.position.copy(localVec);
      });
    }
  };
}

// 6. Universal Smart Procedural Scene Generator for ANY User Prompt
export function generateGenericScene(promptText = "Interactive 3D Reality Model") {
  const group = new THREE.Group();
  group.name = "CustomScene";

  const lower = promptText.toLowerCase();

  // Keyword Domain Classification
  const isVehicle = /car|vehicle|automobile|truck|rover|bus|race|engine|speed/i.test(lower);
  const isAircraft = /plane|airplane|jet|rocket|spaceship|ufo|drone|helicopter|flying/i.test(lower);
  const isArchitecture = /house|building|skyscraper|pyramid|castle|tower|bridge|stadium|structure|monument|city/i.test(lower);
  const isChemistry = /molecule|water|h2o|benzene|atom|chemical|crystal|polymer|protein|compound/i.test(lower);
  const isNature = /volcano|mountain|island|tree|flower|forest|ocean|river|earth|nature|landscape/i.test(lower);
  const isSpace = /black hole|galaxy|nebula|star|comet|asteroid|saturn|moon|mars/i.test(lower);
  const isRobotics = /robot|drone|satellite|chip|cpu|computer|cyborg|sensor|radar|telescope|microscope/i.test(lower);
  const isOrganic = /cell|virus|bacteria|organ|brain|eye|dna|skull|skeleton/i.test(lower);

  let title = promptText.charAt(0).toUpperCase() + promptText.slice(1);
  let category = "AI Custom 3D Model";
  let annotations = [];
  let animationTick = null;

  if (isVehicle || isAircraft) {
    category = isAircraft ? "Aerospace Engineering" : "Automotive Engineering";

    // Chassis / Body
    const bodyGeo = isAircraft ? new THREE.ConeGeometry(1.2, 5, 16) : new THREE.BoxGeometry(2.2, 1.0, 4.2);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x2563eb, metalness: 0.8, roughness: 0.2 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    if (isAircraft) body.rotation.x = Math.PI / 2;
    body.name = isAircraft ? "Fuselage / Body" : "Vehicle Chassis";
    body.userData = { description: "Main aerodynamic structural body frame." };
    group.add(body);

    // Cockpit Glass Canopy
    const glassGeo = new THREE.SphereGeometry(0.8, 16, 16);
    glassGeo.scale(0.8, 0.6, 1.2);
    const glassMat = createGlowMaterial(0x38bdf8, 0.5);
    const canopy = new THREE.Mesh(glassGeo, glassMat);
    canopy.position.set(0, 0.7, isAircraft ? 0.5 : 0.2);
    canopy.name = "Cockpit Glass Canopy";
    group.add(canopy);

    // Thrusters / Wheels
    if (isAircraft) {
      // Wings
      const wingGeo = new THREE.BoxGeometry(6.5, 0.1, 1.5);
      const wingMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9, roughness: 0.3 });
      const wings = new THREE.Mesh(wingGeo, wingMat);
      wings.position.set(0, 0, -0.5);
      wings.name = "Main Wings";
      group.add(wings);

      // Thruster Glow
      const thrusterGeo = new THREE.CylinderGeometry(0.4, 0.6, 1.5, 16);
      const thrusterMat = createGlowMaterial(0xef4444, 0.9);
      const thruster = new THREE.Mesh(thrusterGeo, thrusterMat);
      thruster.position.set(0, 0, -2.8);
      thruster.rotation.x = Math.PI / 2;
      thruster.name = "Rocket Thruster Exhaust";
      group.add(thruster);
    } else {
      // 4 Wheels
      const wheelGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.4, 16);
      const wheelMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.9 });
      const wheelPositions = [[-1.2, -0.4, 1.4], [1.2, -0.4, 1.4], [-1.2, -0.4, -1.4], [1.2, -0.4, -1.4]];
      wheelPositions.forEach((pos, idx) => {
        const wheel = new THREE.Mesh(wheelGeo, wheelMat);
        wheel.position.set(...pos);
        wheel.rotation.z = Math.PI / 2;
        wheel.name = `Wheel ${idx + 1}`;
        group.add(wheel);
      });
    }

    annotations = [
      { text: body.name, pos: [0, 1.2, 0] },
      { text: isAircraft ? "Rocket Thruster" : "Tire Assembly", pos: [0, -0.5, -2] }
    ];

    animationTick = (time) => {
      body.position.y = Math.sin(time * 2) * 0.15;
    };

  } else if (isArchitecture) {
    category = "Architecture & Civil Engineering";

    // Base Terrain / Foundation
    const baseGeo = new THREE.CylinderGeometry(4.5, 5.0, 0.4, 32);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8 });
    const foundation = new THREE.Mesh(baseGeo, baseMat);
    foundation.position.y = -0.2;
    foundation.name = "Foundation Base";
    group.add(foundation);

    if (lower.includes("pyramid")) {
      const pyrGeo = new THREE.ConeGeometry(3.5, 4.0, 4);
      const pyrMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.6 });
      const pyramid = new THREE.Mesh(pyrGeo, pyrMat);
      pyramid.position.y = 2.0;
      pyramid.rotation.y = Math.PI / 4;
      pyramid.name = "Ancient Golden Pyramid";
      group.add(pyramid);
    } else {
      // Skyscraper / Tower Structure
      const towerGeo = new THREE.BoxGeometry(2.2, 6.0, 2.2);
      const towerMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.9, roughness: 0.1 });
      const tower = new THREE.Mesh(towerGeo, towerMat);
      tower.position.y = 3.0;
      tower.name = "Primary Skyscraper Tower";
      group.add(tower);

      // Glass windows grid overlay
      const glassGeo = new THREE.BoxGeometry(2.3, 5.8, 2.3);
      const glassMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true, transparent: true, opacity: 0.4 });
      const windows = new THREE.Mesh(glassGeo, glassMat);
      windows.position.y = 3.0;
      group.add(windows);

      // Spire Antenna
      const spireGeo = new THREE.CylinderGeometry(0.05, 0.2, 2.5, 8);
      const spireMat = createGlowMaterial(0xef4444, 0.9);
      const spire = new THREE.Mesh(spireGeo, spireMat);
      spire.position.y = 7.25;
      spire.name = "Communication Spire Antenna";
      group.add(spire);
    }

    annotations = [
      { text: "Primary Tower Spire", pos: [0, 7.5, 0] },
      { text: "Foundation Base", pos: [0, 0, 3] }
    ];

  } else if (isChemistry) {
    category = "Chemistry / Molecular Structure";

    // Central Atom (e.g. Oxygen)
    const centerGeo = new THREE.SphereGeometry(1.2, 24, 24);
    const centerMat = createGlowMaterial(0xef4444, 0.9);
    const centerAtom = new THREE.Mesh(centerGeo, centerMat);
    centerAtom.name = "Central Atom (Oxygen / Core)";
    group.add(centerAtom);

    // Bonded Sub-Atoms (e.g. Hydrogens or Carbon ring)
    for (let a = 0; a < 4; a++) {
      const angle = (a / 4) * Math.PI * 2;
      const subGeo = new THREE.SphereGeometry(0.65, 16, 16);
      const subMat = createGlowMaterial(0x38bdf8, 0.9);
      const subAtom = new THREE.Mesh(subGeo, subMat);
      const pos = new THREE.Vector3(Math.cos(angle) * 2.8, Math.sin(angle) * 1.5, Math.sin(angle) * 2.8);
      subAtom.position.copy(pos);
      subAtom.name = `Bonded Atom ${a + 1}`;
      group.add(subAtom);

      // Covalent Bond Cylinder
      const bondGeo = new THREE.CylinderGeometry(0.12, 0.12, pos.length(), 8);
      const bondMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.2, metalness: 0.8 });
      const bond = new THREE.Mesh(bondGeo, bondMat);
      bond.position.copy(pos.clone().multiplyScalar(0.5));
      bond.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), pos.clone().normalize());
      bond.name = `Covalent Bond ${a + 1}`;
      group.add(bond);
    }

    annotations = [
      { text: "Central Core Atom", pos: [0, 1.4, 0] },
      { text: "Covalent Chemical Bond", pos: [1.4, 0.8, 1.4] }
    ];

    animationTick = (time) => {
      group.rotation.y = time * 0.3;
    };

  } else {
    // Universal Multi-Node Procedural Geometry Engine for ANY query
    category = "Synthetic 3D Scene";

    // Hash prompt string to determine consistent deterministic color & shapes
    let hash = 0;
    for (let i = 0; i < lower.length; i++) hash = lower.charCodeAt(i) + ((hash << 5) - hash);
    const colors = [0x8b5cf6, 0x06b6d4, 0xec4899, 0x10b981, 0xf59e0b, 0x3b82f6];
    const primaryColor = colors[Math.abs(hash) % colors.length];
    const secondaryColor = colors[Math.abs(hash + 2) % colors.length];

    // Central Hero Mesh
    const heroGeometries = [
      new THREE.IcosahedronGeometry(1.8, 2),
      new THREE.TorusKnotGeometry(1.2, 0.4, 100, 16),
      new THREE.DodecahedronGeometry(1.8, 1),
      new THREE.OctahedronGeometry(2.0, 1)
    ];
    const heroGeo = heroGeometries[Math.abs(hash) % heroGeometries.length];
    const heroMat = new THREE.MeshStandardMaterial({
      color: primaryColor,
      roughness: 0.2,
      metalness: 0.7,
      emissive: primaryColor,
      emissiveIntensity: 0.2
    });
    const heroMesh = new THREE.Mesh(heroGeo, heroMat);
    heroMesh.name = title;
    heroMesh.userData = { description: `Dynamically synthesized 3D visual model for: "${promptText}".` };
    group.add(heroMesh);

    // Orbiting Glowing Ring
    const ringGeo = new THREE.TorusGeometry(3.0, 0.08, 16, 100);
    const ringMat = createGlowMaterial(secondaryColor, 0.8);
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 3;
    group.add(ring);

    // Satellite Nodes
    const satGroup = new THREE.Group();
    for (let s = 0; s < 5; s++) {
      const angle = (s / 5) * Math.PI * 2;
      const sGeo = new THREE.SphereGeometry(0.35, 12, 12);
      const sMat = createGlowMaterial(secondaryColor, 0.9);
      const sat = new THREE.Mesh(sGeo, sMat);
      sat.position.set(Math.cos(angle) * 3.0, Math.sin(angle) * 1.0, Math.sin(angle) * 3.0);
      sat.name = `Data Node ${s + 1}`;
      satGroup.add(sat);
    }
    group.add(satGroup);

    // Floating Energy Particle Field
    const pCount = 200;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i += 3) {
      pPos[i] = (Math.random() - 0.5) * 12;
      pPos[i + 1] = (Math.random() - 0.5) * 12;
      pPos[i + 2] = (Math.random() - 0.5) * 12;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({ color: secondaryColor, size: 0.1, transparent: true, opacity: 0.7 });
    const particles = new THREE.Points(pGeo, pMat);
    group.add(particles);

    annotations = [
      { text: title, pos: [0, 2.2, 0] },
      { text: "Energy Ring", pos: [3.0, 0, 0] }
    ];

    animationTick = (time) => {
      heroMesh.rotation.x = time * 0.3;
      heroMesh.rotation.y = time * 0.4;
      ring.rotation.z = time * 0.2;
      satGroup.rotation.y = -time * 0.3;
      particles.rotation.y = time * 0.05;
    };
  }

  return {
    group,
    title,
    category,
    annotations,
    animationTick
  };
}

/**
 * Main dispatcher to route prompt text to best procedural model generator
 */
export function createSceneFromPrompt(promptText = "") {
  const text = promptText.toLowerCase();

  if (text.includes("neuron") || text.includes("brain") || text.includes("nerve") || text.includes("synapse")) {
    return generateNeuronScene();
  } else if (text.includes("solar") || text.includes("planet") || text.includes("orbit") || text.includes("space") || text.includes("sun")) {
    return generateSolarSystemScene();
  } else if (text.includes("dna") || text.includes("helix") || text.includes("gene") || text.includes("chromosome")) {
    return generateDNADoubleHelixScene();
  } else if (text.includes("heart") || text.includes("cardiac") || text.includes("anatomy") || text.includes("aorta")) {
    return generateHeartScene();
  } else if (text.includes("atom") || text.includes("electron") || text.includes("proton") || text.includes("quantum") || text.includes("bohr")) {
    return generateAtomScene();
  } else {
    return generateGenericScene(promptText || "Interactive 3D Reality Model");
  }
}
