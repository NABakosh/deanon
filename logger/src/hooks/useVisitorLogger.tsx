import { useEffect, useRef } from 'react';

export function useVisitorLogger() {
  const hasLogged = useRef(false);

  useEffect(() => {
    if (hasLogged.current) return;
    
    async function log() {
      try {
        const data = {
          userAgent: navigator.userAgent,
          language: navigator.language,
          screen: `${window.screen.width}×${window.screen.height}`,
          page: window.location.href,
          timestamp: new Date().toISOString(),
        };

        // Шлем только на свой сервер
        await fetch('/api/log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          mode: 'cors',
          body: JSON.stringify(data),
        });

        hasLogged.current = true;
      } catch (err) {
        console.error('Logger error:', err);
      }
    }

    log();
  }, []);
}