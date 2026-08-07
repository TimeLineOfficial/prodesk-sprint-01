import React, { useState, useRef } from 'react';

export function Tooltip({ text, children, position = 'top' }) {
  const [isVisible, setIsVisible] = useState(false);
  const touchTimerRef = useRef(null);

  const showTooltip = () => setIsVisible(true);
  const hideTooltip = () => {
    setIsVisible(false);
    if (touchTimerRef.current) clearTimeout(touchTimerRef.current);
  };

  const handleTouchStart = () => {
    touchTimerRef.current = setTimeout(() => {
      setIsVisible(true);
    }, 350);
  };

  const handleTouchEnd = () => {
    if (touchTimerRef.current) clearTimeout(touchTimerRef.current);
    setTimeout(() => setIsVisible(false), 2500);
  };

  return (
    <div
      className="tooltip-wrapper"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
    >
      {children}
      {isVisible && text && (
        <div
          className={`tooltip-bubble tooltip-bubble--${position}`}
          role="tooltip"
          aria-live="polite"
        >
          {text}
        </div>
      )}
    </div>
  );
}
