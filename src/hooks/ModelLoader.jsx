import { useEffect } from "react";
import { useGLTF } from "@react-three/drei/native";
import * as THREE from "three";

export default function ModelLoader({ modelUri, textureUri, onLoad }) {
  const { scene } = useGLTF(modelUri);

  useEffect(() => {
    if (scene) {
      const BeigeMaterial = new THREE.MeshStandardMaterial({ color: 0xddd6ca });
      const textureLoader = new THREE.TextureLoader();

      textureLoader.load(textureUri, (texture) => {
        texture.flipY = false;
        texture.generateMipmaps = true;
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.magFilter = THREE.LinearFilter;

        const landMaterial = new THREE.MeshStandardMaterial({ map: texture });

        scene.traverse((child) => {
          if (child.isMesh) {
            if (child.name === "stageOneLand") {
              child.material = landMaterial;
            } else if (child.name === "fence") {
              child.material = BeigeMaterial;
            }
            child.castShadow = true;
            child.receiveShadow = true;
            child.material.needsUpdate = true;
          }
        });

        onLoad(scene);
      });
    }
  }, [scene, textureUri, onLoad]);

  return null;
}
