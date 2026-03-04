import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ================================================================
   1. HOLOGRAPHIC WORKSTATION — Laptop with floating UI panels,
      code lines, orbital rings, and constellation particles.
      Mouse-reactive parallax.
      Represents: Software Analyst @ Nomura (React migration,
      Spring Boot microservices, Neo4j, AI dashboards)
   ================================================================ */

function HoloWorkstation() {
  const group = useRef();
  const screenGlow = useRef();
  const panelsGroup = useRef();
  const particlesRef = useRef();
  const orbitalRef = useRef();
  const mouseSmooth = useRef({ x: 0, y: 0 });

  const particles = useMemo(() => {
    const n = 220;
    const pos = new Float32Array(n * 3);
    const col = new Float32Array(n * 3);
    const meta = [];
    for (let i = 0; i < n; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.2 + Math.random() * 1.0;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6;
      pos[i * 3 + 2] = r * Math.cos(phi);
      const t = Math.random();
      col[i * 3] = t * 0.47;
      col[i * 3 + 1] = 0.6 + (1 - t) * 0.4;
      col[i * 3 + 2] = 0.78 + t * 0.22;
      meta.push({
        speed: 0.15 + Math.random() * 0.4,
        offset: Math.random() * Math.PI * 2,
        baseR: r, theta, phi,
      });
    }
    return { pos, col, meta, n };
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const mx = state.pointer.x, my = state.pointer.y;
    mouseSmooth.current.x += (mx - mouseSmooth.current.x) * 0.05;
    mouseSmooth.current.y += (my - mouseSmooth.current.y) * 0.05;
    const sx = mouseSmooth.current.x, sy = mouseSmooth.current.y;

    // Mouse-reactive rotation + gentle idle drift
    group.current.rotation.y = sx * 0.4 + Math.sin(t * 0.25) * 0.15;
    group.current.rotation.x = -sy * 0.15;
    group.current.position.y = Math.sin(t * 0.6) * 0.06;

    if (screenGlow.current)
      screenGlow.current.material.emissiveIntensity = 0.4 + Math.sin(t * 1.8) * 0.15;

    if (panelsGroup.current)
      panelsGroup.current.children.forEach((c, i) => {
        c.position.y = c.userData.baseY + Math.sin(t * 1.2 + i * 1.5) * 0.04;
        const mouseProx = Math.max(0, 1 - Math.abs(sx) * 2 - Math.abs(sy) * 2) * 0.05;
        c.material.opacity = 0.15 + Math.sin(t * 2 + i) * 0.05 + mouseProx;
      });

    if (particlesRef.current) {
      const p = particlesRef.current.geometry.attributes.position.array;
      for (let i = 0; i < particles.n; i++) {
        const m = particles.meta[i];
        const angle = m.theta + t * m.speed;
        const r = m.baseR + Math.sin(t * 0.4 + m.offset) * 0.2;
        p[i * 3] = r * Math.sin(m.phi) * Math.cos(angle);
        p[i * 3 + 1] = r * Math.sin(m.phi) * Math.sin(angle) * 0.6 + Math.sin(t * 0.8 + m.offset) * 0.15;
        p[i * 3 + 2] = r * Math.cos(m.phi);
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }

    if (orbitalRef.current) {
      orbitalRef.current.rotation.z = t * 0.1 + sx * 0.1;
      orbitalRef.current.rotation.x = Math.sin(t * 0.15) * 0.1 + 1.3 + sy * 0.08;
    }
  });

  const panels = [
    { pos: [-0.85, 0.55, -0.1], size: [0.35, 0.22], rot: [0, 0.3, 0], color: "#00ffc8" },
    { pos: [0.85, 0.6, -0.1], size: [0.3, 0.18], rot: [0, -0.3, 0], color: "#7850ff" },
    { pos: [-0.65, 0.9, -0.2], size: [0.25, 0.12], rot: [-0.1, 0.2, 0.05], color: "#00d4ff" },
    { pos: [0.6, 0.92, -0.2], size: [0.2, 0.14], rot: [-0.1, -0.15, -0.05], color: "#00ffc8" },
    { pos: [0, 1.05, -0.25], size: [0.45, 0.1], rot: [-0.15, 0, 0], color: "#7850ff" },
  ];

  return (
    <group ref={group}>
      {/* Laptop base */}
      <mesh position={[0, -0.08, 0.05]}>
        <boxGeometry args={[1.5, 0.04, 0.95]} />
        <meshStandardMaterial color="#101020" metalness={0.95} roughness={0.15} />
      </mesh>
      <mesh position={[0, -0.058, 0.05]}>
        <boxGeometry args={[1.52, 0.005, 0.97]} />
        <meshStandardMaterial emissive="#00ffc8" emissiveIntensity={0.3} transparent opacity={0.5} />
      </mesh>
      <mesh position={[0, -0.055, 0.1]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.3, 0.75]} />
        <meshStandardMaterial color="#080812" emissive="#7850ff" emissiveIntensity={0.04} transparent opacity={0.8} />
      </mesh>

      {/* Screen */}
      <mesh position={[0, 0.42, -0.42]} rotation={[-0.2, 0, 0]}>
        <boxGeometry args={[1.5, 0.95, 0.025]} />
        <meshStandardMaterial color="#08081a" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh ref={screenGlow} position={[0, 0.42, -0.405]} rotation={[-0.2, 0, 0]}>
        <planeGeometry args={[1.38, 0.85]} />
        <meshStandardMaterial color="#030318" emissive="#00ffc8" emissiveIntensity={0.4} transparent opacity={0.95} />
      </mesh>

      {/* Code lines on screen */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const indent = (i % 3) * 0.08;
        const w = [0.65, 0.45, 0.55, 0.3, 0.6, 0.4, 0.5, 0.35][i];
        const c = i % 3 === 0 ? "#00ffc8" : i % 3 === 1 ? "#7850ff" : "#00d4ff";
        return (
          <mesh key={i} position={[-0.35 + indent, 0.72 - i * 0.075, -0.39]} rotation={[-0.2, 0, 0]}>
            <planeGeometry args={[w, 0.012]} />
            <meshStandardMaterial emissive={c} emissiveIntensity={0.7} transparent opacity={0.5 + (i % 2) * 0.15} />
          </mesh>
        );
      })}

      {/* Floating holographic panels */}
      <group ref={panelsGroup}>
        {panels.map((cfg, i) => (
          <mesh key={i} position={cfg.pos} rotation={cfg.rot} userData={{ baseY: cfg.pos[1] }}>
            <planeGeometry args={cfg.size} />
            <meshStandardMaterial emissive={cfg.color} emissiveIntensity={0.6} transparent opacity={0.15} side={THREE.DoubleSide} depthWrite={false} />
          </mesh>
        ))}
      </group>

      {/* Orbital rings */}
      <group ref={orbitalRef} position={[0, 0.3, -0.1]}>
        <mesh><torusGeometry args={[1.15, 0.004, 16, 100]} /><meshStandardMaterial emissive="#00ffc8" emissiveIntensity={1} transparent opacity={0.25} /></mesh>
        <mesh rotation={[0.15, 0.3, 0.1]}><torusGeometry args={[1.0, 0.003, 16, 100]} /><meshStandardMaterial emissive="#7850ff" emissiveIntensity={0.8} transparent opacity={0.18} /></mesh>
        <mesh rotation={[-0.1, -0.2, 0.2]}><torusGeometry args={[1.3, 0.002, 16, 100]} /><meshStandardMaterial emissive="#00d4ff" emissiveIntensity={0.6} transparent opacity={0.1} /></mesh>
      </group>

      {/* Constellation particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={particles.pos} count={particles.n} itemSize={3} />
          <bufferAttribute attach="attributes-color" array={particles.col} count={particles.n} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.015} vertexColors transparent opacity={0.55} blending={THREE.AdditiveBlending} depthWrite={false} sizeAttenuation />
      </points>
    </group>
  );
}

/* ================================================================
   2. CRYSTALLINE TESSERACT — Nested rotating wireframe cubes
      with energy nodes traveling along edges, central core,
      and orbiting build artifacts. Mouse-reactive.
      Represents: Software Developer Intern @ Nomura (CI/CD
      pipelines, Pact testing, component architecture)
   ================================================================ */

function CrystallineTesseract() {
  const group = useRef();
  const innerRef = useRef();
  const outerRef = useRef();
  const midRef = useRef();
  const nodesRef = useRef();
  const trailsRef = useRef();
  const shapesGroupRef = useRef();
  const mouseSmooth = useRef({ x: 0, y: 0 });

  const cubeEdges = useMemo(() => {
    const s = 0.5;
    const v = [[-s,-s,-s],[s,-s,-s],[s,s,-s],[-s,s,-s],[-s,-s,s],[s,-s,s],[s,s,s],[-s,s,s]];
    const e = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
    const pos = new Float32Array(e.length * 6);
    e.forEach((ed, i) => {
      const a = v[ed[0]], b = v[ed[1]];
      pos[i*6]=a[0]; pos[i*6+1]=a[1]; pos[i*6+2]=a[2];
      pos[i*6+3]=b[0]; pos[i*6+4]=b[1]; pos[i*6+5]=b[2];
    });
    return pos;
  }, []);

  const nodes = useMemo(() => {
    const n = 24;
    const pos = new Float32Array(n * 3);
    const col = new Float32Array(n * 3);
    const meta = [];
    for (let i = 0; i < n; i++) {
      const isCyan = i % 2 === 0;
      col[i*3] = isCyan ? 0 : 0.47;
      col[i*3+1] = isCyan ? 1 : 0.31;
      col[i*3+2] = isCyan ? 0.78 : 1;
      meta.push({
        cubeScale: [0.5, 0.8, 1.15][i % 3],
        edgeIdx: i % 12,
        speed: 0.3 + Math.random() * 0.6,
        offset: Math.random() * Math.PI * 2,
      });
    }
    return { pos, col, meta, n };
  }, []);

  const trails = useMemo(() => {
    const n = 80;
    const pos = new Float32Array(n * 3);
    const col = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const theta = Math.random() * Math.PI * 2;
      const r = 0.3 + Math.random() * 0.9;
      pos[i*3] = Math.cos(theta) * r;
      pos[i*3+1] = (Math.random() - 0.5) * 2;
      pos[i*3+2] = Math.sin(theta) * r;
      const t = Math.random();
      col[i*3] = t * 0.3; col[i*3+1] = 0.5 + t * 0.5; col[i*3+2] = 0.7 + t * 0.3;
    }
    return { pos, col, n };
  }, []);

  // Orbiting build artifact shapes
  const shapes = useMemo(() =>
    Array.from({ length: 5 }, (_, i) => ({
      radius: 0.6 + i * 0.15,
      speed: (0.15 + Math.random() * 0.25) * (i % 2 === 0 ? 1 : -1),
      offset: (i / 5) * Math.PI * 2,
      y: (Math.random() - 0.5) * 0.5,
      size: 0.022 + Math.random() * 0.012,
      color: ["#00ffc8", "#7850ff", "#00d4ff"][i % 3],
    })),
  []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const mx = state.pointer.x, my = state.pointer.y;
    mouseSmooth.current.x += (mx - mouseSmooth.current.x) * 0.05;
    mouseSmooth.current.y += (my - mouseSmooth.current.y) * 0.05;
    const sx = mouseSmooth.current.x, sy = mouseSmooth.current.y;

    // Mouse-reactive rotation + idle spin
    group.current.rotation.y = sx * 0.4 + t * 0.15;
    group.current.rotation.x = -sy * 0.2;
    group.current.position.y = Math.sin(t * 0.5) * 0.06;

    if (innerRef.current) { innerRef.current.rotation.x = t * 0.4; innerRef.current.rotation.z = t * 0.3; }
    if (midRef.current) { midRef.current.rotation.x = -t * 0.2; midRef.current.rotation.y = t * 0.25; }
    if (outerRef.current) { outerRef.current.rotation.y = -t * 0.1; outerRef.current.rotation.z = t * 0.08; }

    // Energy nodes travel along cube edges
    if (nodesRef.current) {
      const verts = [[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]];
      const edges = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
      const p = nodesRef.current.geometry.attributes.position.array;
      for (let i = 0; i < nodes.n; i++) {
        const m = nodes.meta[i];
        const progress = ((t * m.speed + m.offset) % 1 + 1) % 1;
        const edge = edges[m.edgeIdx];
        const a = verts[edge[0]], b = verts[edge[1]];
        const s = m.cubeScale * 0.5;
        p[i*3] = (a[0] + (b[0] - a[0]) * progress) * s;
        p[i*3+1] = (a[1] + (b[1] - a[1]) * progress) * s;
        p[i*3+2] = (a[2] + (b[2] - a[2]) * progress) * s;
      }
      nodesRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Trail particles orbit
    if (trailsRef.current) {
      const p = trailsRef.current.geometry.attributes.position.array;
      for (let i = 0; i < trails.n; i++) {
        const angle = t * 0.2 + i * 0.1;
        const r = 0.3 + Math.sin(t * 0.3 + i) * 0.15 + (i % 5) * 0.15;
        p[i*3] = Math.cos(angle + i) * r;
        p[i*3+1] = trails.pos[i*3+1] + Math.sin(t * 0.8 + i * 0.5) * 0.1;
        p[i*3+2] = Math.sin(angle + i) * r;
      }
      trailsRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Orbiting geometric shapes
    if (shapesGroupRef.current) {
      shapesGroupRef.current.children.forEach((child, i) => {
        const s = shapes[i];
        const angle = t * s.speed + s.offset;
        child.position.x = Math.cos(angle) * s.radius;
        child.position.y = s.y + Math.sin(t * 0.8 + i) * 0.05;
        child.position.z = Math.sin(angle) * s.radius;
        child.rotation.x = t * 0.5;
        child.rotation.y = t * 0.3;
      });
    }
  });

  return (
    <group ref={group}>
      {/* Inner wire cube */}
      <group ref={innerRef} scale={1}>
        <lineSegments>
          <bufferGeometry><bufferAttribute attach="attributes-position" array={cubeEdges.slice()} count={24} itemSize={3} /></bufferGeometry>
          <lineBasicMaterial color="#00ffc8" transparent opacity={0.7} />
        </lineSegments>
      </group>

      {/* Mid wire cube */}
      <group ref={midRef} scale={1.6}>
        <lineSegments>
          <bufferGeometry><bufferAttribute attach="attributes-position" array={cubeEdges.slice()} count={24} itemSize={3} /></bufferGeometry>
          <lineBasicMaterial color="#7850ff" transparent opacity={0.4} />
        </lineSegments>
      </group>

      {/* Outer wire cube */}
      <group ref={outerRef} scale={2.3}>
        <lineSegments>
          <bufferGeometry><bufferAttribute attach="attributes-position" array={cubeEdges.slice()} count={24} itemSize={3} /></bufferGeometry>
          <lineBasicMaterial color="#00d4ff" transparent opacity={0.2} />
        </lineSegments>
      </group>

      {/* Energy nodes */}
      <points ref={nodesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={nodes.pos} count={nodes.n} itemSize={3} />
          <bufferAttribute attach="attributes-color" array={nodes.col} count={nodes.n} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.06} vertexColors transparent opacity={0.9} blending={THREE.AdditiveBlending} depthWrite={false} sizeAttenuation />
      </points>

      {/* Trail particles */}
      <points ref={trailsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={trails.pos} count={trails.n} itemSize={3} />
          <bufferAttribute attach="attributes-color" array={trails.col} count={trails.n} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.018} vertexColors transparent opacity={0.4} blending={THREE.AdditiveBlending} depthWrite={false} sizeAttenuation />
      </points>

      {/* Orbiting build artifact shapes */}
      <group ref={shapesGroupRef}>
        {shapes.map((s, i) => (
          <mesh key={i}>
            <octahedronGeometry args={[s.size, 0]} />
            <meshStandardMaterial emissive={s.color} emissiveIntensity={1.5} transparent opacity={0.6} />
          </mesh>
        ))}
      </group>

      {/* Central core */}
      <mesh><sphereGeometry args={[0.08, 16, 16]} /><meshStandardMaterial emissive="#00ffc8" emissiveIntensity={2} transparent opacity={0.6} /></mesh>
    </group>
  );
}

/* ================================================================
   3. ANATOMICAL SKULL — Detailed wireframe skull built from
      point clouds: cranium, eye sockets, nasal cavity, jaw,
      cheekbones, brow ridge, teeth, neural sparks, and an
      AR-style scanning beam. Strong mouse tracking for the
      "augmented reality" feel.
      Represents: AR/VR Developer @ Tata TRDDC (3D nasal cavity
      modeling, Blender, surgical planning, immersive AR/VR)
   ================================================================ */

function AnatomicalSkull() {
  const group = useRef();
  const skullRef = useRef();
  const neuronsRef = useRef();
  const pulseRef = useRef();
  const scanRef = useRef();
  const scanRingRef = useRef();
  const mouseSmooth = useRef({ x: 0, y: 0 });

  const skull = useMemo(() => {
    const points = [];
    const colors = [];

    const cyanC = (brightness) => [0.0, brightness, 0.78];
    const purpleC = (brightness) => [0.47 * brightness, 0.31 * brightness, brightness];
    const mixC = (t) => [t * 0.25, 0.5 + t * 0.5, 0.78 + t * 0.22];

    // ===== CRANIUM — 30 horizontal cross-section rings =====
    for (let s = 0; s < 30; s++) {
      const t = s / 29;
      const y = 0.9 - t * 1.0;
      let rx, rz;
      if (t < 0.15) {
        const d = t / 0.15;
        rx = d * 0.52; rz = d * 0.55;
      } else if (t < 0.5) {
        const d = (t - 0.15) / 0.35;
        rx = 0.52 + d * 0.08; rz = 0.55 + d * 0.05;
      } else if (t < 0.75) {
        const d = (t - 0.5) / 0.25;
        rx = 0.6 - d * 0.05; rz = 0.6 - d * 0.02;
      } else {
        const d = (t - 0.75) / 0.25;
        rx = 0.55 - d * 0.1; rz = 0.58 - d * 0.05;
      }
      const n = Math.floor(18 + t * 12);
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2;
        points.push(Math.cos(a) * rx, y, Math.sin(a) * rz);
        const c = cyanC(0.5 + (1 - t) * 0.5);
        colors.push(c[0], c[1], c[2]);
      }
    }

    // ===== EYE SOCKETS — orbital rims + depth rings =====
    for (let side = -1; side <= 1; side += 2) {
      const sx = side * 0.22, sy = 0.12, sz = 0.45;
      for (let i = 0; i < 24; i++) {
        const a = (i / 24) * Math.PI * 2;
        points.push(sx + Math.cos(a) * 0.16, sy + Math.sin(a) * 0.13, sz + Math.sin(a) * 0.02);
        colors.push(0.0, 1.0, 0.78);
      }
      for (let ring = 1; ring <= 3; ring++) {
        const scale = 1 - ring * 0.25, depth = ring * 0.04;
        for (let i = 0; i < 16; i++) {
          const a = (i / 16) * Math.PI * 2;
          points.push(sx + Math.cos(a) * 0.16 * scale, sy + Math.sin(a) * 0.13 * scale, sz - depth);
          const b = 0.5 + scale * 0.5;
          colors.push(0.47 * b, 0.31 * b, b);
        }
      }
    }

    // ===== NASAL BRIDGE + APERTURE =====
    for (let i = 0; i < 12; i++) {
      const t = i / 11, y = 0.15 - t * 0.28, z = 0.5 + Math.sin(t * Math.PI) * 0.06;
      points.push(-0.03, y, z); colors.push(0, 0.9, 0.78);
      points.push(0.03, y, z); colors.push(0, 0.9, 0.78);
    }
    for (let i = 0; i < 20; i++) {
      const a = (i / 20) * Math.PI * 2;
      const w = 0.07 * (1 + 0.3 * Math.sin(a));
      points.push(Math.cos(a) * w, -0.08 + Math.sin(a) * 0.1, 0.52);
      colors.push(0.2, 0.8, 0.78);
    }

    // ===== CHEEKBONES (zygomatic arches) =====
    for (let side = -1; side <= 1; side += 2) {
      for (let i = 0; i < 15; i++) {
        const t = i / 14;
        points.push(
          side * (0.38 + Math.sin(t * Math.PI) * 0.15),
          -t * 0.15,
          0.35 + Math.sin(t * Math.PI * 0.8) * 0.15
        );
        colors.push(0.1, 0.75, 0.78);
      }
    }

    // ===== UPPER JAW (maxilla) =====
    for (let i = 0; i < 22; i++) {
      const a = (i / 22) * Math.PI;
      points.push(Math.cos(a) * 0.3, -0.22, 0.3 + Math.sin(a) * 0.2);
      colors.push(0.15, 0.6, 0.78);
    }

    // ===== LOWER JAW (mandible) =====
    for (let i = 0; i < 30; i++) {
      const t = i / 29;
      let x, y, z;
      if (t < 0.15) {
        const d = t / 0.15;
        x = 0.35; y = -0.2 - d * 0.25; z = 0.15 - d * 0.1;
      } else if (t > 0.85) {
        const d = (t - 0.85) / 0.15;
        x = -0.35; y = -0.45 + d * 0.25; z = 0.15 - (1 - d) * 0.1;
      } else {
        const d = (t - 0.15) / 0.7;
        const a = d * Math.PI;
        x = Math.cos(a) * 0.35; y = -0.45 - Math.sin(a) * 0.08; z = 0.05 + Math.sin(a) * 0.35;
      }
      points.push(x, y, z);
      const c = purpleC(0.6 + t * 0.4);
      colors.push(c[0], c[1], c[2]);
    }

    // Chin
    for (let i = 0; i < 10; i++) {
      const a = (i / 9) * Math.PI;
      points.push(Math.cos(a) * 0.1, -0.52 - Math.sin(a) * 0.03, 0.38 + Math.sin(a) * 0.04);
      colors.push(0.3, 0.25, 0.9);
    }

    // ===== TEETH =====
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI;
      points.push(Math.cos(a) * 0.25, -0.25, 0.32 + Math.sin(a) * 0.15);
      colors.push(0.5, 0.5, 0.7);
    }

    // ===== TEMPORAL LINES =====
    for (let side = -1; side <= 1; side += 2) {
      for (let i = 0; i < 18; i++) {
        const t = i / 17;
        points.push(side * (0.52 + Math.sin(t * Math.PI * 0.7) * 0.08), 0.6 - t * 0.6, -0.1 + t * 0.35);
        const c = mixC(t);
        colors.push(c[0], c[1], c[2]);
      }
    }

    // ===== BROW RIDGE =====
    for (let i = 0; i < 20; i++) {
      const t = i / 19;
      const bump = Math.sin(t * Math.PI) * 0.04;
      points.push(-0.4 + t * 0.8, 0.26 + bump, 0.46 + bump * 0.5);
      colors.push(0, 0.95, 0.78);
    }

    // ===== BACK BASE (foramen magnum) =====
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2;
      points.push(Math.cos(a) * 0.15, -0.25, -0.45 + Math.sin(a) * 0.1);
      colors.push(0.3, 0.5, 0.8);
    }

    // ===== SAGITTAL LINE (top midline) =====
    for (let i = 0; i < 20; i++) {
      const t = i / 19;
      const angle = -0.3 + t * Math.PI * 0.85;
      const r = 0.58 + Math.sin(t * Math.PI) * 0.04;
      points.push(0, 0.1 + Math.sin(angle) * r, Math.cos(angle) * r);
      colors.push(0.0, 0.6 + t * 0.4, 0.78);
    }

    const posArr = new Float32Array(points);
    const colArr = new Float32Array(colors);
    const count = points.length / 3;

    // Neural sparks
    const neuronCount = 50;
    const neuronPos = new Float32Array(neuronCount * 3);
    const neuronCol = new Float32Array(neuronCount * 3);
    const neuronMeta = [];
    for (let i = 0; i < neuronCount; i++) {
      const isCyan = i % 3 !== 0;
      neuronCol[i*3] = isCyan ? 0 : 0.47;
      neuronCol[i*3+1] = isCyan ? 1 : 0.31;
      neuronCol[i*3+2] = isCyan ? 0.78 : 1;
      neuronMeta.push({
        orbitR: 0.6 + Math.random() * 0.4,
        orbitSpeed: 0.4 + Math.random() * 0.8,
        ySpeed: 0.3 + Math.random() * 0.5,
        offset: Math.random() * Math.PI * 2,
        yOffset: Math.random() * Math.PI * 2,
      });
    }

    return { posArr, colArr, count, neuronPos, neuronCol, neuronMeta, neuronCount };
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const mx = state.pointer.x, my = state.pointer.y;
    mouseSmooth.current.x += (mx - mouseSmooth.current.x) * 0.04;
    mouseSmooth.current.y += (my - mouseSmooth.current.y) * 0.04;
    const sx = mouseSmooth.current.x, sy = mouseSmooth.current.y;

    // Strong mouse tracking — AR feel
    group.current.rotation.y = sx * 0.6 + Math.sin(t * 0.2) * 0.2;
    group.current.rotation.x = -sy * 0.3;
    group.current.position.y = Math.sin(t * 0.4) * 0.04;

    // Skull breathing animation
    if (skullRef.current) {
      const pos = skullRef.current.geometry.attributes.position.array;
      for (let i = 0; i < skull.count; i++) {
        const bx = skull.posArr[i*3], by = skull.posArr[i*3+1], bz = skull.posArr[i*3+2];
        const breath = Math.sin(t * 1.5 + by * 3) * 0.008;
        pos[i*3] = bx * (1 + breath);
        pos[i*3+1] = by * (1 + breath * 0.5);
        pos[i*3+2] = bz * (1 + breath);
      }
      skullRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Neural sparks orbit
    if (neuronsRef.current) {
      const p = neuronsRef.current.geometry.attributes.position.array;
      for (let i = 0; i < skull.neuronCount; i++) {
        const m = skull.neuronMeta[i];
        const angle = t * m.orbitSpeed + m.offset;
        const r = m.orbitR + Math.sin(t * 0.5 + m.offset) * 0.1;
        p[i*3] = Math.cos(angle) * r;
        p[i*3+1] = Math.sin(t * m.ySpeed + m.yOffset) * 0.5;
        p[i*3+2] = Math.sin(angle) * r;
      }
      neuronsRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Pulse ring
    if (pulseRef.current) {
      pulseRef.current.position.y = Math.sin(t * 0.8) * 0.7;
      pulseRef.current.material.opacity = 0.12 + Math.sin(t * 2) * 0.05;
    }

    // AR scanning disc sweeps through the skull
    if (scanRef.current) {
      scanRef.current.position.y = Math.sin(t * 0.6) * 0.55;
      scanRef.current.material.opacity = 0.05 + Math.abs(Math.cos(t * 0.6)) * 0.04;
    }
    if (scanRingRef.current) {
      scanRingRef.current.position.y = Math.sin(t * 0.6) * 0.55;
      scanRingRef.current.material.emissiveIntensity = 0.6 + Math.abs(Math.cos(t * 0.6)) * 0.5;
    }
  });

  return (
    <group ref={group}>
      {/* Skull point cloud */}
      <points ref={skullRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={skull.posArr.slice()} count={skull.count} itemSize={3} />
          <bufferAttribute attach="attributes-color" array={skull.colArr} count={skull.count} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.016} vertexColors transparent opacity={0.85} sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} />
      </points>

      {/* Neural spark particles */}
      <points ref={neuronsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={skull.neuronPos} count={skull.neuronCount} itemSize={3} />
          <bufferAttribute attach="attributes-color" array={skull.neuronCol} count={skull.neuronCount} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.04} vertexColors transparent opacity={0.7} blending={THREE.AdditiveBlending} depthWrite={false} sizeAttenuation />
      </points>

      {/* AR scanning disc */}
      <mesh ref={scanRef} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.65, 32]} />
        <meshStandardMaterial emissive="#00d4ff" emissiveIntensity={0.3} transparent opacity={0.05} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>

      {/* AR scan ring */}
      <mesh ref={scanRingRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.5, 0.004, 8, 64]} />
        <meshStandardMaterial emissive="#00ffc8" emissiveIntensity={0.8} transparent opacity={0.35} />
      </mesh>

      {/* Pulse rings */}
      <mesh ref={pulseRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.65, 0.003, 8, 64]} />
        <meshStandardMaterial emissive="#00ffc8" emissiveIntensity={1.5} transparent opacity={0.15} />
      </mesh>
      <mesh rotation={[0.3, 0, 0.1]}><torusGeometry args={[0.8, 0.002, 8, 64]} /><meshStandardMaterial emissive="#7850ff" emissiveIntensity={0.8} transparent opacity={0.08} /></mesh>
      <mesh rotation={[1.2, 0.5, 0]}><torusGeometry args={[0.9, 0.002, 8, 64]} /><meshStandardMaterial emissive="#00ffc8" emissiveIntensity={0.6} transparent opacity={0.06} /></mesh>
    </group>
  );
}

/* ================================================================
   CANVAS WRAPPERS — pointerEvents:"auto" enables mouse tracking
   even when parent container has pointerEvents:"none"
   ================================================================ */

const canvasStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "16px",
  overflow: "hidden",
  pointerEvents: "auto",
};

export const LaptopVisual = () => (
  <div style={canvasStyle}>
    <Canvas camera={{ position: [0, 0.5, 3], fov: 42 }} gl={{ alpha: true, antialias: true }} style={{ background: "transparent" }}>
      <ambientLight intensity={0.25} />
      <directionalLight position={[3, 4, 2]} intensity={0.7} />
      <pointLight position={[-2, 2, 3]} intensity={0.4} color="#00ffc8" />
      <pointLight position={[2, -1, 2]} intensity={0.3} color="#7850ff" />
      <HoloWorkstation />
    </Canvas>
  </div>
);

export const InternVisual3D = () => (
  <div style={canvasStyle}>
    <Canvas camera={{ position: [0, 0.3, 3.5], fov: 42 }} gl={{ alpha: true, antialias: true }} style={{ background: "transparent" }}>
      <ambientLight intensity={0.15} />
      <pointLight position={[-2, 2, 3]} intensity={0.6} color="#00ffc8" />
      <pointLight position={[2, -1, 2]} intensity={0.4} color="#7850ff" />
      <CrystallineTesseract />
    </Canvas>
  </div>
);

export const FaceVisual = () => (
  <div style={canvasStyle}>
    <Canvas camera={{ position: [0, 0.1, 2.4], fov: 42 }} gl={{ alpha: true, antialias: true }} style={{ background: "transparent" }}>
      <ambientLight intensity={0.1} />
      <pointLight position={[-2, 1.5, 3]} intensity={0.6} color="#00ffc8" />
      <pointLight position={[2, -0.5, 2]} intensity={0.4} color="#7850ff" />
      <pointLight position={[0, 0, 3]} intensity={0.2} color="#00d4ff" />
      <AnatomicalSkull />
    </Canvas>
  </div>
);
