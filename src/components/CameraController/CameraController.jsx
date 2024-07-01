import { useFrame, useThree } from "@react-three/fiber/native";
import { useRef, useEffect } from "react";
import * as THREE from "three";

export default function CameraController({ followTarget, isAnimating, setIsAnimating }) {
  const { camera } = useThree();
  const desiredPosition = useRef(new THREE.Vector3());
  const initialTargetPosition = useRef(new THREE.Vector3());
  const fixedLookAtPosition = useRef(new THREE.Vector3());

  useEffect(() => {
    if (followTarget.current) {
      const checkTargetPosition = setInterval(() => {
        if (followTarget.current) {
          initialTargetPosition.current
            .copy(followTarget.current.position)
            .add(new THREE.Vector3(0, 45, 20));
          fixedLookAtPosition.current.copy(followTarget.current.position);
          const initialPosition = fixedLookAtPosition.current
            .clone()
            .add(new THREE.Vector3(0, 300, 100));
          camera.position.copy(initialPosition);
          camera.lookAt(fixedLookAtPosition.current);
          setIsAnimating(true);
          clearInterval(checkTargetPosition);

          const animationDuration = 3000;
          const pauseDuration = 1500;
          const startTime = performance.now();

          const animate = (time) => {
            const elapsedTime = time - startTime;

            if (elapsedTime < pauseDuration) {
              requestAnimationFrame(animate);
            } else {
              const animationProgress = Math.min(
                (elapsedTime - pauseDuration) / animationDuration,
                1,
              );

              camera.position.lerpVectors(
                initialPosition,
                initialTargetPosition.current,
                animationProgress,
              );
              camera.lookAt(fixedLookAtPosition.current);

              if (animationProgress < 1) {
                requestAnimationFrame(animate);
              } else {
                setIsAnimating(false);
              }
            }
          };

          requestAnimationFrame(animate);
        }
      }, 100);
    }
  }, [camera, followTarget]);

  useFrame(() => {
    if (!isAnimating && followTarget.current) {
      const ballPosition = followTarget.current.position;
      const dynamicHeightOffset = Math.max(0, ballPosition.y + 50);
      desiredPosition.current.set(ballPosition.x, dynamicHeightOffset - 15, ballPosition.z + 30);

      camera.position.lerp(desiredPosition.current, 0.1);
      camera.lookAt(ballPosition);
    }
  });

  return null;
}
