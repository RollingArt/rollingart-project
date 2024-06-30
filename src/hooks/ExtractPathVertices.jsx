import { useEffect } from "react";
import * as THREE from "three";
import findGeometries from "../utils/findGeometries";

export default function ExtractPathVertices({ model, setCorrectPath }) {
  useEffect(() => {
    if (model) {
      const pathGroup = model.getObjectByName("correctPath");

      if (pathGroup) {
        const geometries = findGeometries(pathGroup);
        const tempVertices = new Set();

        geometries.forEach((geometryObject) => {
          const { geometry } = geometryObject;
          const positionAttribute = geometry.getAttribute("position");

          if (positionAttribute) {
            for (let i = 0; i < positionAttribute.count; i++) {
              const vertex = new THREE.Vector3();
              vertex.fromBufferAttribute(positionAttribute, i);
              geometryObject.localToWorld(vertex);

              const newVertex = `${Math.floor(vertex.x)},${Math.floor(vertex.z)}`;
              tempVertices.add(newVertex);
            }
          }
        });

        if (tempVertices.size > 0) {
          const uniqueVertices = Array.from(tempVertices).map((vertex) => {
            const [x, z] = vertex.split(",").map(Number);
            return { x, z };
          });
          setCorrectPath(uniqueVertices);
        }
      }
    }
  }, [model, setCorrectPath]);

  return null;
}
