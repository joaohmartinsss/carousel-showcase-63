import { useEffect, useRef, useCallback } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCursorDirection } from "./CursorContext";

const CustomCursor = () => {
  const isMobile = useIsMobile();
  const cursorRef = useRef<HTMLDivElement>(null);
  const leftEyeRef = useRef<SVGCircleElement>(null);
  const rightEyeRef = useRef<SVGCircleElement>(null);
  const eyeContainerRef = useRef<SVGGElement>(null);
  const mousePos = useRef({ x: -100, y: -100 });
  const rafId = useRef<number>(0);
  const visibleRef = useRef(false);
  const { direction } = useCursorDirection();
  const directionRef = useRef(direction);
  directionRef.current = direction;

  const isOnCarousel = direction !== null;
  const size = isOnCarousel ? 64 : 16;

  // Face geometry
  const faceCenter = 164.44;
  const eyeRadius = 22.363;
  const eyeHalfGap = 52.216;
  const maxShift = 45;

  const updateCursor = useCallback(() => {
    const el = cursorRef.current;
    if (!el) return;

    const { x, y } = mousePos.current;
    const dir = directionRef.current;
    const onCarousel = dir !== null;
    const s = onCarousel ? 64 : 16;

    // Use transform for GPU-accelerated positioning — no layout thrash
    el.style.transform = `translate3d(${x - s / 2}px, ${y - s / 2}px, 0)`;
    el.style.width = `${s}px`;
    el.style.height = `${s}px`;

    // Update eye positions
    if (onCarousel && leftEyeRef.current && rightEyeRef.current) {
      let eyePairCenterX: number;
      if (dir === "left") {
        eyePairCenterX = faceCenter - maxShift;
      } else if (dir === "right") {
        eyePairCenterX = faceCenter + maxShift;
      } else {
        eyePairCenterX = faceCenter;
      }
      leftEyeRef.current.setAttribute("cx", String(eyePairCenterX - eyeHalfGap));
      rightEyeRef.current.setAttribute("cx", String(eyePairCenterX + eyeHalfGap));
    }

    // Show/hide eyes
    if (eyeContainerRef.current) {
      eyeContainerRef.current.style.opacity = onCarousel ? "1" : "0";
    }
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const onMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!visibleRef.current) {
        visibleRef.current = true;
        if (cursorRef.current) cursorRef.current.style.opacity = "1";
      }
      cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(updateCursor);
    };

    const onLeave = () => {
      visibleRef.current = false;
      if (cursorRef.current) cursorRef.current.style.opacity = "0";
    };
    const onEnter = () => {
      visibleRef.current = true;
      if (cursorRef.current) cursorRef.current.style.opacity = "1";
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      cancelAnimationFrame(rafId.current);
    };
  }, [isMobile, updateCursor]);

  // Re-run update when direction changes (carousel enter/leave)
  useEffect(() => {
    updateCursor();
  }, [direction, updateCursor]);

  if (isMobile) return null;

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed top-0 left-0 z-[9999]"
      style={{
        opacity: 0,
        width: size,
        height: size,
        willChange: "transform",
        transition: "width 0.3s cubic-bezier(0.4,0,0.2,1), height 0.3s cubic-bezier(0.4,0,0.2,1)",
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
        <g ref={eyeContainerRef} style={{ opacity: 0, transition: "opacity 0.25s ease-out" }}>
          <circle
            ref={leftEyeRef}
            cx={faceCenter - eyeHalfGap}
            cy={faceCenter}
            r={eyeRadius}
            fill="hsl(var(--background))"
            style={{ transition: "cx 0.25s ease-out" }}
          />
          <circle
            ref={rightEyeRef}
            cx={faceCenter + eyeHalfGap}
            cy={faceCenter}
            r={eyeRadius}
            fill="hsl(var(--background))"
            style={{ transition: "cx 0.25s ease-out" }}
          />
        </g>
      </svg>
    </div>
  );
};

export default CustomCursor;
