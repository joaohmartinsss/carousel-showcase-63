import { useEffect, useState, useCallback } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const CustomCursor = () => {
  const isMobile = useIsMobile();
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setPos({ x: e.clientX, y: e.clientY });
    setMousePos({ x: e.clientX, y: e.clientY });
    if (!visible) setVisible(true);
  }, [visible]);

  useEffect(() => {
    if (isMobile) return;
    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", () => setVisible(false));
    document.addEventListener("mouseenter", () => setVisible(true));
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", () => setVisible(false));
      document.removeEventListener("mouseenter", () => setVisible(true));
    };
  }, [isMobile, handleMouseMove]);

  if (isMobile || !visible) return null;

  // SVG viewBox is 329x329, center is at 164.44, 164.44
  // Left eye center: 164.44, 164.44 (radius ~22.36)
  // Right eye center: 268.872, 164.44 (radius ~22.36)
  // Distance between eye centers: 104.432
  // Eye radius: 22.363

  const svgCenter = { x: 164.44, y: 164.44 };
  const eyeRadius = 22.363;
  const maxPupilShift = eyeRadius * 0.4; // pupils move within eye bounds

  // Calculate direction from cursor center to actual mouse (for eye tracking)
  // We use the screen-level mouse position relative to cursor center
  const dx = mousePos.x - pos.x;
  const dy = mousePos.y - pos.y;
  // Since the cursor IS at the mouse, we use a global reference instead
  // Track based on mouse position relative to viewport center
  const viewCenterX = typeof window !== "undefined" ? window.innerWidth / 2 : 0;
  const viewCenterY = typeof window !== "undefined" ? window.innerHeight / 2 : 0;
  const gdx = mousePos.x - viewCenterX;
  const gdy = mousePos.y - viewCenterY;
  const dist = Math.sqrt(gdx * gdx + gdy * gdy) || 1;
  const maxDist = Math.sqrt(viewCenterX * viewCenterX + viewCenterY * viewCenterY) || 1;
  const normalizedDist = Math.min(dist / maxDist, 1);
  
  // Direction unit vector
  const ux = gdx / dist;
  const uy = gdy / dist;
  
  // Pupil offset - keep eyes horizontally aligned (only shift X uniformly, Y uniformly)
  const shiftX = ux * maxPupilShift * normalizedDist;
  const shiftY = uy * maxPupilShift * normalizedDist;

  // Eye positions in SVG coordinates
  const leftEye = { cx: 164.44 + shiftX, cy: 164.44 + shiftY };
  const rightEye = { cx: 268.872 + shiftX, cy: 164.44 + shiftY };

  const size = 64; // same as carousel arrow circle (w-16 h-16)

  return (
    <div
      className="pointer-events-none fixed z-[9999]"
      style={{
        left: pos.x - size / 2,
        top: pos.y - size / 2,
        width: size,
        height: size,
        transition: "left 0.05s linear, top 0.05s linear",
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 329 329"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M164.44 0C255.258 0.000181425 328.88 73.6228 328.88 164.44C328.88 255.258 255.258 328.88 164.44 328.88C73.6228 328.88 0.000181472 255.258 0 164.44C0 73.6227 73.6227 0 164.44 0Z"
          fill="hsl(var(--foreground))"
        />
        <circle
          cx={leftEye.cx}
          cy={leftEye.cy}
          r={eyeRadius}
          fill="hsl(var(--background))"
        />
        <circle
          cx={rightEye.cx}
          cy={rightEye.cy}
          r={eyeRadius}
          fill="hsl(var(--background))"
        />
      </svg>
    </div>
  );
};

export default CustomCursor;
