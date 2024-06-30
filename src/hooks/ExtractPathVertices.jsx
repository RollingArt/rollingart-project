import { useEffect } from "react";
import * as THREE from "three";
import findGeometries from "../utils/findGeometries";

export default function ExtractPathVertices({ model, setCorrectPath }) {
  useEffect(() => {
    if (model) {
      const pathGroup = model.getObjectByName("correctPath");

      if (pathGroup) {
        const geometries = findGeometries(pathGroup);
        const tempVertices = [];

        geometries.forEach((geometryObject) => {
          const { geometry } = geometryObject;
          const positionAttribute = geometry.getAttribute("position");

          if (positionAttribute) {
            for (let i = 0; i < positionAttribute.count; i++) {
              const vertex = new THREE.Vector3();
              vertex.fromBufferAttribute(positionAttribute, i);
              geometryObject.localToWorld(vertex);
              tempVertices.push({
                x: Math.floor(vertex.x),
                z: Math.floor(vertex.z),
              });
            }
          }
        });

        if (tempVertices.length > 0) {
          setCorrectPath(tempVertices);
        }
      }
    }
  }, [model]);

  return null;
}
