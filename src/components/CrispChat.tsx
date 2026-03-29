'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

type CrispCommand =
  | ["do", "session:reset"]
  | ["set", "user:nickname", [string]]
  | ["set", "user:email", [string]]
  | ["set", "user:phone", [string]]
  | ["set", "session:data", Record<string, unknown>]
  // Add more commands as needed from Crisp documentation
  ;

declare global {
  interface Window {
    CRISP_WEBSITE_ID?: string;
    $crisp?: CrispCommand[];
  }
}

export default function CrispChat() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname?.startsWith('/admin-dashboard')) return;

    window.$crisp = [];
    window.CRISP_WEBSITE_ID = "3a26cdac-030d-4bb1-80eb-00a1c5176077";

    const script = document.createElement('script');
    script.src = "https://client.crisp.chat/l.js";
    script.async = true;
    document.head.appendChild(script);

    return () => {
      if (window.$crisp) {
        window.$crisp.push(["do", "session:reset"]);
        delete window.$crisp;
        delete window.CRISP_WEBSITE_ID;

        document.querySelectorAll('script[src="https://client.crisp.chat/l.js"]').forEach(el => el.remove());
        document.querySelectorAll('.crisp-client').forEach(el => el.remove());
      }
    };
  }, [pathname]);

  return null;
}
