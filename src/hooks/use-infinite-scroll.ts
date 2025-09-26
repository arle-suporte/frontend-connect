'use client'

import { useEffect, useRef } from "react";

// Hook personalizado para Intersection Observer
export const useInfiniteScroll = (callback: () => void, hasNext: boolean, loading: boolean) => {
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNext && !loading) {
          callback();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px', // Triggera um pouco antes de chegar ao final
      }
    );

    const currentRef = observerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [callback, hasNext, loading]);

  return observerRef;
};