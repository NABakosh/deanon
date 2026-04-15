import { useEffect, useRef } from 'react';

export function useVisitorLogger() {
  const hasLogged = useRef(false);

  useEffect(() => {
    if (hasLogged.current) return;
    
    async function log() {
      try {
        const geoResponse = await fetch('https://ipapi.co/json/');
        const geo = await geoResponse.json();

        const data = {
          ip: geo.ip, 
          city: geo.city,
          country: geo.country_name,
          isp: geo.org,
          userAgent: navigator.userAgent,
          language: navigator.language,
          timezone: geo.timezone,
          screen: `${window.screen.width}×${window.screen.height}`,
          page: window.location.href,
          timestamp: new Date().toISOString(),
        };

        
        await fetch('http://34.150.1.210/log', {
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