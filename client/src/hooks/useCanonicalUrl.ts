import { useEffect } from 'react';
import { useLocation } from 'wouter';

/**
 * Hook to dynamically set canonical URL based on current route
 */
export function useCanonicalUrl() {
  const [location] = useLocation();
  
  useEffect(() => {
    const baseUrl = 'https://peter-yuill.manus.space';
    const canonicalUrl = `${baseUrl}${location}`;
    
    // Find existing canonical link or create new one
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    
    canonicalLink.href = canonicalUrl;
    
    // Cleanup function
    return () => {
      // Keep the canonical link, just update it on route change
    };
  }, [location]);
}
