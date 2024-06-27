import { useEffect } from "react";
import { useGLTF } from "@react-three/drei/native";
import * as THREE from "three";

const vertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D baseTexture;
  uniform sampler2D dynamicTexture;
  uniform vec3 ballPosition;
  uniform float brushRadius;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;

  uniform vec3 ambientLightColor;
  uniform vec3 directionalLightColor;
  uniform vec3 directionalLightDirection;

  void main() {
    vec4 baseColor = texture2D(baseTexture, vUv);
    vec4 dynamicColor = texture2D(dynamicTexture, vUv);

    vec2 uv = vUv;
    vec2 projectedPosition = vec2(ballPosition.x, ballPosition.z);
    float distanceSquared = dot(uv - projectedPosition, uv - projectedPosition);
    float brushRadiusSquared = brushRadius * brushRadius;

    float mask = step(distanceSquared, brushRadiusSquared);
    dynamicColor = mix(dynamicColor, vec4(1.0, 0.65, 0.0, 1.0), mask);

    vec3 ambient = ambientLightColor;
    vec3 lightDirection = normalize(directionalLightDirection);
    float directional = max(dot(vNormal, lightDirection), 0.0);
    vec3 directionalLight = directionalLightColor * directional;

    vec3 lighting = ambient + directionalLight;
    vec4 color = mix(baseColor, dynamicColor, dynamicColor.a);
    gl_FragColor = vec4(color.rgb * lighting, color.a);
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
          ballPosition: { value: ballPosition },
          brushRadius: { value: brushRadius },
          ambientLightColor: { value: new THREE.Color(0xffd700).multiplyScalar(0.1) },
          directionalLightColor: { value: new THREE.Color(0xffffff) },
          directionalLightDirection: { value: new THREE.Vector3(5, 5, 5).normalize() },
        };

        const landMaterial = new THREE.ShaderMaterial({
          uniforms,
          vertexShader,
          fragmentShader,
          lights: false,
        });

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
  }, [scene, textureUri, onLoad, dynamicTexture, ballPosition, brushRadius]);

  return null;
}
