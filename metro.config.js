const { getDefaultConfig } = require("expo/metro-config");

module.exports = (async () => {
  const defaultConfig = await getDefaultConfig(__dirname);

  return {
    ...defaultConfig,
    resolver: {
      ...defaultConfig.resolver,
      assetExts: [
        ...defaultConfig.resolver.assetExts,
        "gltf",
        "glb",
        "jpg",
        "jpeg",
        "png",
        "bmp",
        "tga",
        "bin",
      ],
    },
  };
})();
