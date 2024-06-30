import { useState, useEffect } from "react";

import getAssetUri from "../../utils/getAssetUri";
import ModelLoader from "../../hooks/ModelLoader";
import ColliderBox from "../ColliderBox/ColliderBox";
import EventZone from "../EventZone/EventZone";

import ExtractPathVertices from "../../hooks/ExtractPathVertices";
import colliderBoxes from "../../utils/colliderBoxes";

export function Stage1Land({
  setLandRef,
  setColliderRef,
  startZoneRef,
  endZoneRef,
  onGameStart,
  onGameOver,
}) {
  const [landModelUri, setLandModelUri] = useState(null);
  const [landTextureUri, setLandTextureUri] = useState(null);
  const [model, setModel] = useState(null);

  useEffect(() => {
    async function loadModel() {
      const modelUri = await getAssetUri(require("../../../assets/models/stage1.glb"));
      const textureUri = await getAssetUri(require("../../../assets/images/stage1Texture.jpg"));

      if (modelUri && textureUri) {
        setLandModelUri(modelUri);
        setLandTextureUri(textureUri);
      }
    }
    loadModel();
  }, []);

  useEffect(() => {
    if (model) {
      setLandRef(model);
    }
  }, [model, setLandRef]);

  if (!landModelUri || !landTextureUri) return null;

  return (
    <>
      <ModelLoader modelUri={landModelUri} textureUri={landTextureUri} onLoad={setModel} />
      {model && <primitive object={model} position={[0, 0, 0]} receiveShadow />}
      {model && <ExtractPathVertices model={model} />}
      {colliderBoxes.map((box, index) => {
        return (
          <ColliderBox
            key={box.id}
            size={box.size}
            position={box.position}
            rotation={box.rotation}
            ref={setColliderRef(index)}
          />
        );
      })}
      <EventZone
        zoneRef={startZoneRef}
        onGameStart={onGameStart}
        position={[-9, 0, 87]}
        rotation={[0, Math.PI / 1.9, 0]}
        boxColor="red"
        size={[8, 35, 55]}
      />
      <EventZone
        zoneRef={endZoneRef}
        onGameOver={onGameOver}
        position={[48, 0, 105]}
        rotation={[0, Math.PI / 1.87, 0]}
        boxColor="blue"
        size={[7, 32, 53]}
      />
    </>
  );
}

export function Stage2Land({
  setLandRef,
  setColliderRef,
  startZoneRef,
  endZoneRef,
  onGameStart,
  onGameOver,
}) {
  const [landModelUri, setLandModelUri] = useState(null);
  const [landTextureUri, setLandTextureUri] = useState(null);
  const [model, setModel] = useState(null);

  useEffect(() => {
    async function loadModel() {
      const modelUri = await getAssetUri(require("../../../assets/models/stage2.glb"));
      const textureUri = await getAssetUri(require("../../../assets/images/stage2Texture.jpg"));

      if (modelUri && textureUri) {
        setLandModelUri(modelUri);
        setLandTextureUri(textureUri);
      }
    }
    loadModel();
  }, []);

  useEffect(() => {
    if (model) {
      setLandRef(model);
    }
  }, [model, setLandRef]);

  if (!landModelUri || !landTextureUri) return null;

  return (
    <>
      <ModelLoader modelUri={landModelUri} textureUri={landTextureUri} onLoad={setModel} />
      {model && <primitive object={model} position={[0, 0, 0]} receiveShadow />}
      {model && <ExtractPathVertices model={model} />}
      {colliderBoxes.map((box, index) => {
        return (
          <ColliderBox
            key={box.id}
            size={box.size}
            position={box.position}
            rotation={box.rotation}
            ref={setColliderRef(index)}
          />
        );
      })}
      <EventZone
        zoneRef={startZoneRef}
        onGameStart={onGameStart}
        position={[-9, 0, 87]}
        rotation={[0, Math.PI / 1.9, 0]}
        boxColor="red"
        size={[8, 35, 55]}
      />
      <EventZone
        zoneRef={endZoneRef}
        onGameOver={onGameOver}
        position={[48, 0, 105]}
        rotation={[0, Math.PI / 1.87, 0]}
        boxColor="blue"
        size={[7, 32, 53]}
      />
    </>
  );
}

export function TutorialStageLand({ setLandRef }) {
  const [landModelUri, setLandModelUri] = useState(null);
  const [landTextureUri, setLandTextureUri] = useState(null);
  const [model, setModel] = useState(null);

  useEffect(() => {
    async function loadModel() {
      const modelUri = await getAssetUri(require("../../../assets/models/tutorialStage.glb"));
      const textureUri = await getAssetUri(
        require("../../../assets/images/tutorialStageTexture.jpg"),
      );

      if (modelUri && textureUri) {
        setLandModelUri(modelUri);
        setLandTextureUri(textureUri);
      }
    }
    loadModel();
  }, []);

  useEffect(() => {
    if (model) {
      setLandRef(model);
    }
  }, [model, setLandRef]);

  if (!landModelUri || !landTextureUri) return null;

  return (
    <>
      <ModelLoader modelUri={landModelUri} textureUri={landTextureUri} onLoad={setModel} />
      {model && <primitive object={model} position={[0, 0, 0]} receiveShadow />}
      {model && <ExtractPathVertices model={model} />}
    </>
  );
}
