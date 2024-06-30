import { useEffect } from "react";
import { useGLTF } from "@react-three/drei/native";
import * as THREE from "three";

export default function ModelLoader({ modelUri, textureUri, onLoad }) {
  const { scene } = useGLTF(modelUri);

  useEffect(() => {
    if (scene) {
      const textureLoader = new THREE.TextureLoader();

      textureLoader.load(textureUri, (texture) => {
        texture.flipY = false;
        texture.generateMipmaps = true;
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.magFilter = THREE.LinearFilter;

        scene.traverse((child) => {
          if (child.isMesh) {
            if (child.name === "land") {
              child.material.map = texture;
              child.material.needsUpdate = true;
            } else if (child.name === "fence") {
              child.material = new THREE.MeshStandardMaterial({ color: 0xddd6ca });
              child.material.needsUpdate = true;
            }
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        onLoad(scene);
      });
    }
  }, [scene, textureUri, onLoad]);

  return null;
}
