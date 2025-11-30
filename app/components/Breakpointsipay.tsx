'use client';

import useTailwindBreakpoint from '../hooks/useTailwindBreakpoint';

export default function BreakpointDisplay() {
  const size = useTailwindBreakpoint();

  return (
    <div className="fixed bottom-4 right-4 bg-black/70 text-white px-4 py-2 rounded-lg text-sm z-[9999]">
      Screen: <span className="font-bold">{size}</span>
    </div>
  );
}
