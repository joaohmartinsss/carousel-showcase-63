import { useRef, useState, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCursorDirection } from "./CursorContext";

interface ProjectCarouselProps {
  title: string;
  index: string;
  role?: string;
  images: string[];
}

const ProjectCarousel = ({ title, index, role, images }: ProjectCarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const scrollStartLeft = useRef(0);
  const hasDragged = useRef(false);
  const isMobile = useIsMobile();
  const { setDirection } = useCursorDirection();

  const isAtLastItem = currentIndex >= images.length - 1;

  const scrollToIndex = useCallback((i: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const child = el.children[i] as HTMLElement;
    if (child) {
      el.scrollTo({ left: child.offsetLeft, behavior: "smooth" });
    }
  }, []);

  const handleNext = useCallback(() => {
    const next = Math.min(currentIndex + 1, images.length - 1);
    setCurrentIndex(next);
    scrollToIndex(next);
  }, [currentIndex, images.length, scrollToIndex]);

  const handlePrev = useCallback(() => {
    const prev = Math.max(currentIndex - 1, 0);
    setCurrentIndex(prev);
    scrollToIndex(prev);
  }, [currentIndex, scrollToIndex]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    // Handle drag
    if (isDragging.current && scrollRef.current) {
      const dx = e.clientX - dragStartX.current;
      if (Math.abs(dx) > 5) hasDragged.current = true;
      scrollRef.current.scrollLeft = scrollStartLeft.current - dx;
    }

    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      setCursorPos({ x, y: e.clientY - rect.top });
      // Don't show right arrow on last item
      if (isAtLastItem && x > rect.width / 2) {
        setDirection(null);
      } else {
        setDirection(x > rect.width / 2 ? "right" : "left");
      }
    }
  }, [setDirection, isAtLastItem]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isMobile) return;
    isDragging.current = true;
    hasDragged.current = false;
    dragStartX.current = e.clientX;
    scrollStartLeft.current = scrollRef.current?.scrollLeft || 0;
    e.preventDefault();
  }, [isMobile]);

  const handleMouseUp = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    // Snap to nearest slide
    const el = scrollRef.current;
    if (el && hasDragged.current) {
      const childWidth = (el.children[0] as HTMLElement)?.offsetWidth || 1;
      const nearest = Math.round(el.scrollLeft / childWidth);
      const clamped = Math.max(0, Math.min(nearest, images.length - 1));
      setCurrentIndex(clamped);
      scrollToIndex(clamped);
    }
  }, [images.length, scrollToIndex]);

  // Update currentIndex on scroll
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleScroll = () => {
      if (isDragging.current) return;
      const scrollLeft = el.scrollLeft;
      const childWidth = (el.children[0] as HTMLElement)?.offsetWidth || 1;
      setCurrentIndex(Math.round(scrollLeft / childWidth));
    };
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  // Global mouseup listener for drag release
  useEffect(() => {
    const onUp = () => { if (isDragging.current) handleMouseUp(); };
    window.addEventListener("mouseup", onUp);
    return () => window.removeEventListener("mouseup", onUp);
  }, [handleMouseUp]);

  const isRightHalf = cursorPos.x > (containerRef.current?.offsetWidth || 0) / 2;

  const handleContainerClick = useCallback(() => {
    if (isMobile || hasDragged.current) return;
    if (isRightHalf && isAtLastItem) return; // no forward click on last item
    isRightHalf ? handleNext() : handlePrev();
  }, [isMobile, isRightHalf, isAtLastItem, handleNext, handlePrev]);

  return (
    <>
      <section className="w-full mb-32 md:mb-40">
        {/* Header */}
        <div className="flex justify-between items-end px-8 md:px-16 mb-6">
          <div>
            <h2 className="tracking-tighter font-semibold md:text-base text-sm">{title}</h2>
            {role && <p className="text-muted-foreground mt-1 uppercase tracking-tight font-sans font-normal text-xs">{role}</p>}
          </div>
          <span className="text-muted-foreground font-sans font-normal text-xs">
            {String(currentIndex + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
          </span>
        </div>

        {/* Carousel */}
        <div
          ref={containerRef}
          className="relative select-none"
          onMouseMove={!isMobile ? handleMouseMove : undefined}
          onMouseDown={!isMobile ? handleMouseDown : undefined}
          onMouseLeave={!isMobile ? () => { setDirection(null); handleMouseUp(); } : undefined}
          onClick={handleContainerClick}>

          <div
            ref={scrollRef}
            className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar gap-4 pl-8 md:pl-16"
            style={{ cursor: isMobile ? undefined : 'grab' }}>
            
            {images.map((src, i) =>
            <div
              key={i}
              className="w-[85vw] shrink-0 snap-start bg-muted"
              onClick={(e) => {
                if (isMobile) {
                  e.stopPropagation();
                  setLightboxSrc(src);
                }
              }}>
              
                <img
                src={src}
                className="w-full h-auto block transition-all duration-700"
                alt={`${title} ${i + 1}`}
                loading="lazy" />
              
              </div>
            )}
            {/* Peek spacer */}
            <div className="w-[10vw] shrink-0" />
          </div>
        </div>

        {/* Navigation dots */}
        <div className="flex gap-2 px-8 md:px-16 mt-4">
          {images.map((_, i) =>
          <button
            key={i}
            onClick={() => {setCurrentIndex(i);scrollToIndex(i);}}
            className={`h-0.5 transition-all duration-300 ${
            i === currentIndex ? "w-8 bg-foreground" : "w-4 bg-muted-foreground/30"}`
            } />

          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxSrc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-background/95 flex items-center justify-center p-4"
            onClick={() => setLightboxSrc(null)}>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              src={lightboxSrc}
              alt={title}
              className="max-w-full max-h-full object-contain" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProjectCarousel;
