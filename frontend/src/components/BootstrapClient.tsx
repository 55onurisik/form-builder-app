'use client';

import { useEffect } from 'react';

export default function BootstrapClient() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // jQuery'yi global'e ekle
      const jQuery = require('jquery');
      (window as any).$ = jQuery;
      (window as any).jQuery = jQuery;

      // Bootstrap JS'i yükle
      require('bootstrap/dist/js/bootstrap.bundle.min.js');
    }
  }, []);

  return null;
}
