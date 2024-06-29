import { Box } from "@react-three/drei";

export default function EventZone({ zoneRef, position, boxColor, size, rotation }) {
  return (
    <Box ref={zoneRef} args={size} position={position} rotation={rotation}>
      <meshStandardMaterial args={[{ color: boxColor, transparent: true, opacity: 0.3 }]} />
    </Box>
  );
}
