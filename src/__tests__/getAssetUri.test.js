import { Asset } from "expo-asset";
import getAssetUri from "../utils/getAssetUri";

jest.mock("expo-asset");

describe("getAssetUri", () => {
  it("should return the local URI of the asset", async () => {
    const mockAssetPath = "path/to/asset";
    const mockLocalUri = "file:///path/to/local/asset";

    Asset.fromModule.mockReturnValue({
      downloadAsync: jest.fn().mockResolvedValue(),
      localUri: mockLocalUri,
    });

    const result = await getAssetUri(mockAssetPath);

    expect(Asset.fromModule).toHaveBeenCalledWith(mockAssetPath);
    expect(result).toBe(mockLocalUri);
  });

  it("에셋 다운로드에 실패하면 오류를 발생시켜야 한다.", async () => {
    const mockAssetPath = "path/to/asset";

    Asset.fromModule.mockReturnValue({
      downloadAsync: jest.fn().mockRejectedValue(new Error("Download failed")),
    });

    await expect(getAssetUri(mockAssetPath)).rejects.toThrow("Download failed");
  });
});
