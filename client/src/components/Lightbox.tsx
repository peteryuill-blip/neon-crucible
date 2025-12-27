import { useEffect, useRef, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

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
  // Touch/swipe handling
  const touchStartX = useRef<number>(0);
  const touchDeltaX = useRef<number>(0);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  }, []);

  const handleTouchEnd = useCallback(() => {
    const threshold = 80;
    if (touchDeltaX.current > threshold && hasPrev && onPrev) {
      onPrev();
    } else if (touchDeltaX.current < -threshold && hasNext && onNext) {
      onNext();
    }
    touchDeltaX.current = 0;
  }, [hasPrev, hasNext, onPrev, onNext]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && hasPrev && onPrev) onPrev();
      if (e.key === "ArrowRight" && hasNext && onNext) onNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose, onPrev, onNext, hasPrev, hasNext]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Close button */}
      <button
        className="absolute top-4 right-4 z-10 w-12 h-12 flex items-center justify-center text-white/70 hover:text-white"
        onClick={(e) => { e.stopPropagation(); onClose(); }}
      >
        <X className="w-8 h-8" />
      </button>

      {/* Prev button */}
      {hasPrev && onPrev && (
        <button
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-12 h-20 flex items-center justify-center text-white/60 hover:text-white"
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
        >
          <ChevronLeft className="w-10 h-10" />
        </button>
      )}

      {/* Next button */}
      {hasNext && onNext && (
        <button
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-12 h-20 flex items-center justify-center text-white/60 hover:text-white"
          onClick={(e) => { e.stopPropagation(); onNext(); }}
        >
          <ChevronRight className="w-10 h-10" />
        </button>
      )}

      {/* Image */}
      <div 
        className="w-full h-full flex items-center justify-center p-4 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {imageUrl && (
          <img
            src={imageUrl}
            alt={title}
            className="max-w-full max-h-full object-contain"
            draggable={false}
          />
        )}
      </div>

      {/* Title bar */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
        <div className="text-center">
          <h2 className="text-white text-sm sm:text-lg font-medium">{title}</h2>
          {subtitle && <p className="text-white/50 text-xs mt-1">{subtitle}</p>}
          {currentIndex !== undefined && totalCount !== undefined && (
            <p className="text-white/40 text-xs mt-1 font-mono">{currentIndex + 1} / {totalCount}</p>
          )}
        </div>
      </div>
    </div>
  );
}
