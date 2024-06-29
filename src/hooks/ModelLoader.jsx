import { useEffect } from "react";
import { useGLTF } from "@react-three/drei/native";
import * as THREE from "three";

const fragmentShader = `
  uniform sampler2D baseTexture;
  uniform sampler2D dynamicTexture;
  uniform vec3 ballPosition;
  uniform float brushRadius;
  varying vec2 vUv;

  void main() {
    vec4 baseColor = texture2D(baseTexture, vUv);
    vec4 dynamicColor = texture2D(dynamicTexture, vUv);
    vec2 uv = vUv;

    vec2 projectedPosition = vec2(ballPosition.x, ballPosition.z);
    float distance = length(uv - projectedPosition);

    if (distance < brushRadius) {
      dynamicColor = vec4(1.0, 0.0, 0.0, 1.0);
    }

    gl_FragColor = mix(baseColor, dynamicColor, dynamicColor.a);
  }
`;

export default function ModelLoader({
  modelUri,
  textureUri,
  onLoad,
  dynamicTexture,
  ballPosition,
  brushRadius,
}) {
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

        const uniforms = {
          baseTexture: { value: texture },
          dynamicTexture: { value: dynamicTexture },
          ballPosition: { value: ballPosition || new THREE.Vector3(0, 0, 0) },
          brushRadius: { value: brushRadius },
        };

        const landMaterial = new THREE.ShaderMaterial({
          uniforms,
          vertexShader: `
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
          fragmentShader,
        });

        scene.traverse((child) => {
          if (child.isMesh) {
            if (child.name === "stageOneLand" || child.name === "land") {
              child.material = landMaterial;
              if (!child.geometry.boundingBox) {
                child.geometry.computeBoundingBox();
              }
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
  }, [scene, textureUri, onLoad, dynamicTexture, ballPosition, brushRadius]);

  return null;
}
