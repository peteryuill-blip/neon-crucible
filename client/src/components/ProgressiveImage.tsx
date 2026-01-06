import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ProgressiveImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function ProgressiveImage({ src, alt, className }: ProgressiveImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [currentSrc, setCurrentSrc] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setCurrentSrc(null);

    const img = new Image();
    img.src = src;
    
    img.onload = () => {
      setCurrentSrc(src);
      setIsLoading(false);
    };

    img.onerror = () => {
      setIsLoading(false);
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return (
    <div className="relative w-full h-full">
      {/* Loading skeleton */}
      {isLoading && (
        <div className="absolute inset-0 bg-muted/20 animate-pulse" />
      )}
      
      {/* Actual image */}
      {currentSrc && (
        <img
          src={currentSrc}
          alt={alt}
          className={cn(
            "transition-opacity duration-500",
            isLoading ? "opacity-0" : "opacity-100",
            className
          )}
        />
      )}
      
      {/* Fallback placeholder */}
      {!isLoading && !currentSrc && (
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/20 font-mono text-4xl sm:text-6xl font-bold">
          IMG
        </div>
      )}
    </div>
  );
}
