import React, { useRef, useEffect } from 'react';
// import {type NodeProps } from '@xyflow/react';

export function MagnifierNode() {
  const magnifierRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const magnifier = magnifierRef.current;
    if (magnifier) {
      const handleMouseMove = (e: MouseEvent) => {
        const { left, top } = magnifier.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;
        magnifier.style.setProperty('--x', `${x}px`);
        magnifier.style.setProperty('--y', `${y}px`);
      };

      magnifier.addEventListener('mousemove', handleMouseMove);
      return () => magnifier.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  const magnifierNodeStyle: React.CSSProperties = {
    position: 'relative',
    width: '200px',
    height: '200px',
    overflow: 'hidden',
  };

  const magnifierGlassStyle: React.CSSProperties = {
    position: 'absolute',
    top: 'var(--y, 50%)',
    left: 'var(--x, 50%)',
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    border: '2px solid #000',
    background: 'rgba(255, 255, 255, 0.5)',
    pointerEvents: 'none',
    transform: 'translate(-50%, -50%) scale(2)',
    transformOrigin: 'center',
  };

  return (
    <div style={magnifierNodeStyle} ref={magnifierRef}>
      <div style={magnifierGlassStyle}></div>
    </div>
  );
}