import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';

interface ViewTransitionProps {
  children: ReactNode;
  viewKey: string;
}

export function ViewTransition({ children, viewKey }: ViewTransitionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentKey, setCurrentKey] = useState(viewKey);

  useEffect(() => {
    if (viewKey !== currentKey) {
      setIsVisible(false);
      const timer = setTimeout(() => {
        setCurrentKey(viewKey);
        setIsVisible(true);
      }, 150);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(true);
    }
  }, [viewKey, currentKey]);

  return (
    <div
      className={`transition-all duration-300 ease-in-out ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-4'
      }`}
    >
      {currentKey === viewKey && children}
    </div>
  );
}