'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

declare global {
  interface Window {
    CRISP_WEBSITE_ID?: string;
    $crisp?: any[];
  }
}

export default function CrispChat() {
  const pathname = usePathname();
  
  useEffect(() => {
    // Don't load Crisp on admin dashboard pages
    if (pathname?.startsWith('/admin-dashboard')) {
      return;
    }
    
    // Load Crisp chat
    window.$crisp = [];
    window.CRISP_WEBSITE_ID = "3a26cdac-030d-4bb1-80eb-00a1c5176077";
    
    const script = document.createElement('script');
    script.src = "https://client.crisp.chat/l.js";
    script.async = true;
    document.head.appendChild(script);
    
    // Cleanup function to remove Crisp when component unmounts
    return () => {
      // If Crisp exists, remove it
      if (window.$crisp) {
        window.$crisp.push(["do", "session:reset"]);
        delete window.$crisp;
        delete window.CRISP_WEBSITE_ID;
        document.querySelectorAll('script[src="https://client.crisp.chat/l.js"]')
          .forEach(el => el.remove());
        
        // Remove Crisp elements from DOM
        document.querySelectorAll('.crisp-client').forEach(el => el.remove());
      }
    };
  }, [pathname]);
  
  // This component doesn't render anything visible
  return null;
}