import { useEffect } from "react";
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

export default function DynamicTextureApplier({
  scene,
  dynamicTexture,
  ballPosition,
  brushRadius,
}) {
  useEffect(() => {
    if (scene) {
      const uniforms = {
        baseTexture: { value: null },
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
        if (child.isMesh && child.name === "land") {
          uniforms.baseTexture.value = child.material.map;
          child.material = landMaterial;
          child.material.needsUpdate = true;
        }
      });
    }
  }, [scene, dynamicTexture, ballPosition, brushRadius]);

  return null;
}
