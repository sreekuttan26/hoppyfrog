'use client';

import { useEffect, useState } from 'react';

export default function useTailwindBreakpoint() {
  const [bp, setBp] = useState('sm');

  const update = () => {
    const w = window.innerWidth;

    if (w >= 1536) setBp('2xl');
    else if (w >= 1280) setBp('xl');
    else if (w >= 1024) setBp('lg');
    else if (w >= 768) setBp('md');
    else setBp('sm');
  };

  useEffect(() => {
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return bp;
}
