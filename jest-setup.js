jest.mock("three", () => {
  const actualThree = jest.requireActual("three");
  return {
    ...actualThree,
    Vector3: jest.fn().mockImplementation(() => ({
      x: 0,
      y: 0,
      z: 0,
      set: jest.fn(function (x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
      }),
    })),
    Quaternion: jest.fn().mockImplementation(() => ({
      x: 0,
      y: 0,
      z: 0,
      w: 0,
    })),
    TextureLoader: jest.fn().mockImplementation(() => ({
      load: jest.fn().mockImplementation(() => ({
        wrapS: "",
        wrapT: "",
        repeat: { set: jest.fn() },
      })),
    })),
    RepeatWrapping: "RepeatWrapping",
  };
});
