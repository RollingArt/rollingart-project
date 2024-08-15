import { render } from "@testing-library/react-native";
import ColliderBox from "../components/ColliderBox/ColliderBox";

jest.mock("@react-three/drei/native", () => {
  const React = require("react");

  const Box = React.forwardRef(({ args, position, rotation, children }, ref) => (
    <mock-Box ref={ref} args={args} position={position} rotation={rotation} testID="collider-box">
      {children}
    </mock-Box>
  ));
  Box.displayName = "Box";

  return {
    Box,
  };
});

describe("ColliderBox", () => {
  it("renders correctly", () => {
    const { getByTestId } = render(<ColliderBox />);
    const colliderBox = getByTestId("collider-box");
    expect(colliderBox).toBeTruthy();
  });
});
