import { useState, useEffect, useMemo } from "react";
import { X, ChevronLeft, ChevronRight, Info } from "lucide-react";
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
  onShowDetails?: () => void;
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
  onShowDetails,
}: LightboxProps) {
  // Random Neon color for this viewing session
  const neonColor = useMemo(() => {
    return NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)];
  }, [isOpen, imageUrl]); // Changes when lightbox opens or image changes

  // Pulse animation state
  const [pulseIntensity, setPulseIntensity] = useState(1);

  useEffect(() => {
    if (!isOpen) return;
    
    // Subtle pulse animation
    const interval = setInterval(() => {
      setPulseIntensity(prev => {
        const next = prev + 0.02;
        return next > 1.3 ? 0.7 : next;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isOpen]);

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
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[200] flex items-center justify-center"
      onClick={onClose}
    >
      {/* Animated Neon Glow Background */}
      <div 
        className="absolute inset-0 transition-all duration-1000"
        style={{
          background: `
            radial-gradient(ellipse at center, ${neonColor.glow} 0%, transparent 50%),
            radial-gradient(ellipse at 30% 70%, ${neonColor.glow} 0%, transparent 40%),
            radial-gradient(ellipse at 70% 30%, ${neonColor.glow} 0%, transparent 40%),
            rgba(0, 0, 0, 0.95)
          `,
          opacity: pulseIntensity,
        }}
      />

      {/* Subtle animated glow ring around image area */}
      <div 
        className="absolute inset-[10%] pointer-events-none rounded-lg transition-all duration-500"
        style={{
          boxShadow: `
            0 0 ${60 * pulseIntensity}px ${20 * pulseIntensity}px ${neonColor.glow},
            inset 0 0 ${40 * pulseIntensity}px ${10 * pulseIntensity}px ${neonColor.glow}
          `,
          opacity: 0.3,
        }}
      />

      {/* Close Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 z-10 text-white/70 hover:text-white hover:bg-white/10 w-12 h-12"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        <X className="w-6 h-6" />
      </Button>

      {/* Info Button */}
      {onShowDetails && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 left-4 z-10 text-white/70 hover:text-white hover:bg-white/10 w-12 h-12"
          onClick={(e) => {
            e.stopPropagation();
            onShowDetails();
          }}
        >
          <Info className="w-6 h-6" />
        </Button>
      )}

      {/* Navigation Arrows */}
      {hasPrev && onPrev && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white/70 hover:text-white hover:bg-white/10 w-12 h-12"
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
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white/70 hover:text-white hover:bg-white/10 w-12 h-12"
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
        >
          <ChevronRight className="w-8 h-8" />
        </Button>
      )}

      {/* Image Container */}
      <div 
        className="relative max-w-[90vw] max-h-[85vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="max-w-full max-h-[85vh] object-contain select-none"
            style={{
              filter: `drop-shadow(0 0 ${30 * pulseIntensity}px ${neonColor.glow})`,
            }}
            draggable={false}
          />
        ) : (
          <div className="w-64 h-64 bg-muted/20 flex items-center justify-center text-muted-foreground font-mono">
            NO IMAGE
          </div>
        )}
      </div>

      {/* Title Bar */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <h2 
            className="text-xl sm:text-2xl font-bold text-white tracking-tight"
            style={{ textShadow: `0 0 20px ${neonColor.glow}` }}
          >
            {title}
          </h2>
          {subtitle && (
            <p className="font-mono text-xs sm:text-sm text-white/60 mt-1">
              {subtitle}
            </p>
          )}
          {/* Color indicator */}
          <div className="flex items-center justify-center gap-2 mt-3">
            <div 
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: neonColor.color, boxShadow: `0 0 10px ${neonColor.color}` }}
            />
            <span className="font-mono text-[10px] text-white/40 uppercase tracking-wider">
              {neonColor.name} Resonance
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
