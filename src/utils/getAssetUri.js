import { Asset } from "expo-asset";

export default async function getAssetUri(assetPath) {
  const asset = Asset.fromModule(assetPath);
  await asset.downloadAsync();

  return asset.localUri;
}
