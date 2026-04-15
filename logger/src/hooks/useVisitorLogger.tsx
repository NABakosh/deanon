import { useEffect } from 'react';

export function useVisitorLogger() {
  useEffect(() => {
    async function log() {
      try {
        const geo = await fetch('http://ip-api.com/json/').then(r => r.json());

        const data = {
          ip: geo.query,
          city: geo.city,
          country: geo.country,
          isp: geo.isp,
          userAgent: navigator.userAgent,
          language: navigator.language,
          timezone: geo.timezone,
          screen: `${screen.width}×${screen.height}`,
          page: window.location.pathname,
          timestamp: new Date().toISOString(),
        };

        await fetch('http://34.150.1.210:80/log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

      } catch (err) {
        console.error('Logger error:', err);
      }
    }

    log();
  }, []);
}