export default function findGeometries(object, geometries = []) {
  if (object.isMesh || object.isLine) {
    geometries.push(object);
  }
  if (object.children && object.children.length > 0) {
    object.children.forEach((child) => findGeometries(child, geometries));
  }
  return geometries;
}
