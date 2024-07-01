import { forwardRef } from "react";
import { Box } from "@react-three/drei/native";

const ColliderBox = forwardRef(function ColliderBox({ size, position, rotation }, ref) {
  return (
    <Box ref={ref} args={size} position={position} rotation={rotation}>
      <meshStandardMaterial color="orange" transparent opacity={0} />
    </Box>
  );
});

export default ColliderBox;
