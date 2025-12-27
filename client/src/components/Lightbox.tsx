import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Neon's color palette for the glow effect
const NEON_COLORS = [
  { name: "Cyan", color: "rgb(0, 255, 255)", glow: "rgba(0, 255, 255, 0.3)" },
  { name: "Magenta", color: "rgb(255, 0, 255)", glow: "rgba(255, 0, 255, 0.25)" },
  { name: "Gold", color: "rgb(255, 215, 0)", glow: "rgba(255, 215, 0, 0.25)" },
  { name: "Deep Purple", color: "rgb(138, 43, 226)", glow: "rgba(138, 43, 226, 0.3)" },
  { name: "Electric Blue", color: "rgb(0, 191, 255)", glow: "rgba(0, 191, 255, 0.25)" },
  { name: "Coral", color: "rgb(255, 127, 80)", glow: "rgba(255, 127, 80, 0.25)" },
];

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
  title: string;
  subtitle?: string;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
  currentIndex?: number;
  totalCount?: number;
}

export function Lightbox({
  isOpen,
  onClose,
  imageUrl,
  title,
  subtitle,
  onPrev,
  onNext,
  hasPrev = false,
  hasNext = false,
  currentIndex,
  totalCount,
}: LightboxProps) {
  // Random Neon color - only changes when lightbox first opens
  const [neonColor, setNeonColor] = useState(NEON_COLORS[0]);
  
  useEffect(() => {
    if (isOpen) {
      setNeonColor(NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)]);
    }
  }, [isOpen]);

  // Touch/swipe handling
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    setIsTransitioning(false);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    
    const deltaX = e.touches[0].clientX - touchStartX.current;
    const deltaY = e.touches[0].clientY - touchStartY.current;
    
    // Only track horizontal swipes (ignore vertical scrolling)
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      e.preventDefault();
      // Limit swipe offset and add resistance at edges
      const maxOffset = 150;
      const resistance = 0.5;
      let offset = deltaX;
      
      if ((!hasPrev && deltaX > 0) || (!hasNext && deltaX < 0)) {
        offset = deltaX * resistance * 0.3; // More resistance at edges
      } else {
        offset = Math.max(-maxOffset, Math.min(maxOffset, deltaX * resistance));
      }
      
      setSwipeOffset(offset);
    }
  }, [hasPrev, hasNext]);

  const handleTouchEnd = useCallback(() => {
    if (touchStartX.current === null) return;
    
    const threshold = 50; // Minimum swipe distance to trigger navigation
    
    setIsTransitioning(true);
    
    if (swipeOffset > threshold && hasPrev && onPrev) {
      onPrev();
    } else if (swipeOffset < -threshold && hasNext && onNext) {
      onNext();
    }
    
    // Reset
    setSwipeOffset(0);
    touchStartX.current = null;
    touchStartY.current = null;
    
    // Remove transition flag after animation
    setTimeout(() => setIsTransitioning(false), 300);
  }, [swipeOffset, hasPrev, hasNext, onPrev, onNext]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && hasPrev && onPrev) onPrev();
      if (e.key === "ArrowRight" && hasNext && onNext) onNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, onPrev, onNext, hasPrev, hasNext]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Prevent iOS bounce
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center touch-none"
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Solid dark background for better contrast */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at center, ${neonColor.glow} 0%, transparent 60%),
            rgba(0, 0, 0, 0.97)
          `,
        }}
      />

      {/* Close Button - larger touch target on mobile */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 sm:top-4 sm:right-4 z-20 text-white/80 hover:text-white hover:bg-white/10 w-14 h-14 sm:w-12 sm:h-12"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        <X className="w-7 h-7 sm:w-6 sm:h-6" />
      </Button>

      {/* Navigation Arrows - larger on mobile, positioned outside image */}
      {hasPrev && onPrev && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-1 sm:left-4 top-1/2 -translate-y-1/2 z-20 text-white/80 hover:text-white hover:bg-white/20 w-12 h-16 sm:w-12 sm:h-12 rounded-lg"
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
        >
          <ChevronLeft className="w-8 h-8" />
        </Button>
      )}

      {hasNext && onNext && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 sm:right-4 top-1/2 -translate-y-1/2 z-20 text-white/80 hover:text-white hover:bg-white/20 w-12 h-16 sm:w-12 sm:h-12 rounded-lg"
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
        >
          <ChevronRight className="w-8 h-8" />
        </Button>
      )}

      {/* Image Container with swipe transform */}
      <div 
        className="relative w-full h-full flex items-center justify-center px-14 sm:px-20 py-20 sm:py-16"
        onClick={(e) => e.stopPropagation()}
        style={{
          transform: `translateX(${swipeOffset}px)`,
          transition: isTransitioning ? 'transform 0.3s ease-out' : 'none',
        }}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="max-w-full max-h-full object-contain select-none pointer-events-none"
            style={{
              filter: `drop-shadow(0 0 30px ${neonColor.glow})`,
            }}
            draggable={false}
          />
        ) : (
          <div className="w-64 h-64 bg-muted/20 flex items-center justify-center text-muted-foreground font-mono">
            NO IMAGE
          </div>
        )}
      </div>

      {/* Title Bar - simplified for mobile */}
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-black/90 via-black/60 to-transparent pointer-events-none">
        <div className="max-w-4xl mx-auto text-center">
          <h2 
            className="text-base sm:text-xl font-bold text-white tracking-tight line-clamp-2"
            style={{ textShadow: `0 0 20px ${neonColor.glow}` }}
          >
            {title}
          </h2>
          {subtitle && (
            <p className="font-mono text-[10px] sm:text-xs text-white/60 mt-1 line-clamp-1">
              {subtitle}
            </p>
          )}
          {/* Position indicator and color */}
          <div className="flex items-center justify-center gap-3 mt-2">
            {currentIndex !== undefined && totalCount !== undefined && (
              <span className="font-mono text-[10px] sm:text-xs text-white/50">
                {currentIndex + 1} / {totalCount}
              </span>
            )}
            <div className="flex items-center gap-1.5">
              <div 
                className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full"
                style={{ backgroundColor: neonColor.color, boxShadow: `0 0 8px ${neonColor.color}` }}
              />
              <span className="font-mono text-[9px] sm:text-[10px] text-white/40 uppercase tracking-wider">
                {neonColor.name}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Swipe hint for mobile - shows briefly on first open */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none sm:hidden">
        <div className="flex items-center gap-8 text-white/20">
          {hasPrev && <ChevronLeft className="w-6 h-6 animate-pulse" />}
          {hasNext && <ChevronRight className="w-6 h-6 animate-pulse" />}
        </div>
      </div>
    </div>
  );
}
