import { useEffect, useState, useCallback } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCursorDirection } from "./CursorContext";

const CustomCursor = () => {
  const isMobile = useIsMobile();
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const { direction } = useCursorDirection();

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setPos({ x: e.clientX, y: e.clientY });
    setMousePos({ x: e.clientX, y: e.clientY });
    if (!visible) setVisible(true);
  }, [visible]);

  useEffect(() => {
    if (isMobile) return;
    window.addEventListener("mousemove", handleMouseMove);
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
    };
  }, [isMobile, handleMouseMove]);

  if (isMobile || !visible) return null;

  // Face geometry in SVG coordinates (viewBox 329x329)
  const faceCenter = 164.44;
  const eyeRadius = 22.363;
  const eyeHalfGap = 52.216; // half the distance between eye centers

  // Default: eyes track mouse relative to viewport center
  const viewCenterX = typeof window !== "undefined" ? window.innerWidth / 2 : 0;
  const viewCenterY = typeof window !== "undefined" ? window.innerHeight / 2 : 0;
  const gdx = mousePos.x - viewCenterX;
  const gdy = mousePos.y - viewCenterY;
  const dist = Math.sqrt(gdx * gdx + gdy * gdy) || 1;
  const maxDist = Math.sqrt(viewCenterX * viewCenterX + viewCenterY * viewCenterY) || 1;
  const normalizedDist = Math.min(dist / maxDist, 1);
  const ux = gdx / dist;
  const uy = gdy / dist;

  // Max shift for the eye pair center from face center
  const maxShift = 45;

  let eyePairCenterX: number;
  let eyePairCenterY = faceCenter; // always vertically centered

  if (direction === "left") {
    // Eyes shifted to left side of face
    eyePairCenterX = faceCenter - maxShift;
  } else if (direction === "right") {
    // Eyes shifted to right side of face
    eyePairCenterX = faceCenter + maxShift;
  } else {
    // Default: subtle tracking based on mouse position
    const subtleShift = ux * maxShift * 0.3 * normalizedDist;
    eyePairCenterX = faceCenter + subtleShift;
  }

  const leftEye = { cx: eyePairCenterX - eyeHalfGap, cy: eyePairCenterY };
  const rightEye = { cx: eyePairCenterX + eyeHalfGap, cy: eyePairCenterY };

  const isOnCarousel = direction !== null;
  const size = isOnCarousel ? 64 : 16;

  return (
    <div
      className="pointer-events-none fixed z-[9999]"
      style={{
        left: pos.x - size / 2,
        top: pos.y - size / 2,
        width: size,
        height: size,
        transition: "width 0.3s cubic-bezier(0.4,0,0.2,1), height 0.3s cubic-bezier(0.4,0,0.2,1), left 0.05s linear, top 0.05s linear",
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 329 329"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M164.44 0C255.258 0.000181425 328.88 73.6228 328.88 164.44C328.88 255.258 255.258 328.88 164.44 328.88C73.6228 328.88 0.000181472 255.258 0 164.44C0 73.6227 73.6227 0 164.44 0Z"
          fill="hsl(var(--foreground))"
        />
        {isOnCarousel && (
          <>
            <circle
              cx={leftEye.cx}
              cy={leftEye.cy}
              r={eyeRadius}
              fill="hsl(var(--background))"
              style={{ transition: "cx 0.25s ease-out" }}
            />
            <circle
              cx={rightEye.cx}
              cy={rightEye.cy}
              r={eyeRadius}
              fill="hsl(var(--background))"
              style={{ transition: "cx 0.25s ease-out" }}
            />
          </>
        )}
      </svg>
    </div>
  );
};

export default CustomCursor;
