import { useRef } from "react";
import { View, StyleSheet } from "react-native";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

import ballPattern from "../../assets/ballPattern.png";

function Ball() {
  const mesh = useRef();
  const texture = new THREE.TextureLoader().load(ballPattern);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 1);

  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.x -= 0.03;
      mesh.current.rotation.y += 0.0;
    }
  });

  return (
    <mesh ref={mesh} position={[0, 1, 0]}>
      <sphereGeometry args={[2, 42, 42]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}

function TransparentObject() {
  return (
    <mesh position={[0, -1, 1.1]}>
      <boxGeometry args={[3.9, 0.1, 2.2]} />
      <meshStandardMaterial color="#DAF7D9" />
    </mesh>
  );
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
      <planeGeometry args={[70, 70]} />
      <meshStandardMaterial color="#5B635B" />
    </mesh>
  );
}

export default function Game3DView({ isOverlayVisible }) {
  return (
    <View style={styles.container}>
      <Canvas style={styles.canvas} camera={{ position: [0, 20, 10], fov: 80 }}>
        <ambientLight />
        <directionalLight position={[10, 10, 10]} intensity={1} castShadow />
        <Ball />
        <TransparentObject />
        <Ground />
      </Canvas>
      {isOverlayVisible && <View style={styles.overlayContainer} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DAF7D9",
  },
  canvas: {
    flex: 1,
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});
