"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { useMemo, useRef } from "react";
import type { Points as ThreePoints } from "three";

function NeuralCloud() {
  const ref = useRef<ThreePoints>(null);
  const data = useMemo(() => {
    const count = 220;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const r = Math.random() * 3.2 + 0.6;
      const t = Math.random() * Math.PI * 2;
      const p = (Math.random() - 0.5) * Math.PI;
      positions[i * 3] = Math.cos(t) * Math.cos(p) * r;
      positions[i * 3 + 1] = Math.sin(p) * r * 0.62;
      positions[i * 3 + 2] = Math.sin(t) * Math.cos(p) * r;
    }
    return positions;
  }, []);

  useFrame((state, delta) => {
    if (!ref.current) return;
    const lean = state.pointer.x * 0.06;
    ref.current.rotation.y += delta * 0.035;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.18) * 0.05 + lean * 0.1;
  });

  return (
    <Points ref={ref} positions={data} stride={3}>
      <PointMaterial
        transparent
        color="#7DF9FF"
        size={0.011}
        sizeAttenuation
        opacity={0.34}
        depthWrite={false}
      />
    </Points>
  );
}

/** Stays behind hero copy only; z-index + isolate on parent prevent overlap with following sections. */
export function SystemScene() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 h-full min-h-0 w-full overflow-hidden">
      <Canvas
        className="!absolute inset-0 h-full w-full"
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
        dpr={[1, 1.2]}
        camera={{ position: [0, 0, 4], fov: 48 }}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.22} />
        <directionalLight position={[2, 2, 2]} intensity={0.28} color="#C9F31D" />
        <NeuralCloud />
      </Canvas>
    </div>
  );
}
