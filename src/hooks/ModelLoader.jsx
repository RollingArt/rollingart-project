import { useEffect } from "react";
import { useGLTF } from "@react-three/drei";

export default function ModelLoader({ modelUri, onLoad }) {
  const gltf = useGLTF(modelUri);

  useEffect(() => {
    if (gltf) {
      onLoad(gltf.scene);
    }
  }, [gltf, onLoad]);

  return null;
}
