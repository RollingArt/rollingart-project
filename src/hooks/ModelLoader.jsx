import { useEffect } from "react";
import { useGLTF } from "@react-three/drei/native";

export default function ModelLoader({ modelUri, onLoad }) {
  const model = useGLTF(modelUri);

  useEffect(() => {
    if (model) {
      onLoad(model.scene);
    }
  }, [model, onLoad]);

  return null;
}
