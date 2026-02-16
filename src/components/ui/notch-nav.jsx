"use client"

import * as React from "react"

export function NotchNav({
  items,
  value,
  defaultValue,
  onValueChange,
  ariaLabel = "Primary",
  className,
}) {
  const isControlled = value !== undefined;
  const [active, setActive] = React.useState(value ?? defaultValue ?? items[0]?.value ?? "");
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    if (isControlled && value !== undefined) setActive(value);
  }, [isControlled, value]);

  const containerRef = React.useRef(null);
  const itemRefs = React.useRef([]);
  const [notchRect, setNotchRect] = React.useState(null);

  const activeIndex = React.useMemo(
    () => Math.max(0, items.findIndex((i) => i.value === active)),
    [items, active]
  );

  const updateNotch = React.useCallback(() => {
    const c = containerRef.current;
    const el = itemRefs.current[activeIndex];
    if (!c || !el) return;
    const cRect = c.getBoundingClientRect();
    const eRect = el.getBoundingClientRect();
    setNotchRect({ left: eRect.left - cRect.left, width: eRect.width });
    setReady(true);
  }, [activeIndex]);

  React.useLayoutEffect(() => {
    updateNotch();
    window.addEventListener("resize", updateNotch);
    return () => window.removeEventListener("resize", updateNotch);
  }, [updateNotch]);

  return (
    <nav aria-label={ariaLabel} className={`w-fit mx-auto ${className || ""}`}>
      <div 
        ref={containerRef} 
        className="relative rounded-full border border-white/10 bg-black/80 backdrop-blur-md text-white shadow-xl"
        style={{ display: 'flex', alignItems: 'center', borderRadius: '9999px' }}
      >
        <ul
          role="menubar"
          className="flex flex-row items-center justify-center gap-1 p-1 list-none m-0"
          style={{ 
            display: 'flex', 
            flexDirection: 'row', 
            listStyle: 'none', 
            margin: 0, 
            padding: '6px',
            alignItems: 'center' 
          }}
        >
          {items.map((item, idx) => {
            const isActive = item.value === active;
            return (
              <li key={item.value} role="none" style={{ listStyle: 'none' }}>
                <button
                  ref={(el) => (itemRefs.current[idx] = el)}
                  onClick={() => {
                    if (!isControlled) setActive(item.value);
                    onValueChange?.(item.value);
                    if (item.onClick) item.onClick();
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: isActive ? '#fff' : 'rgba(255,255,255,0.6)',
                    padding: '8px 16px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'color 0.2s'
                  }}
                >
                  <span style={{ whiteSpace: 'nowrap' }}>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>

        {notchRect && (
          <div
            className="absolute transition-all duration-300 ease-out"
            style={{
              transform: `translateX(${notchRect.left}px)`,
              width: notchRect.width,
              bottom: '-2px',
              height: '8px',
              opacity: ready ? 1 : 0,
              pointerEvents: 'none'
            }}
          >
            <svg width="100%" height="100%" viewBox="0 0 100 20" preserveAspectRatio="none" style={{ display: 'block', color: 'white' }}>
              <path d="M 10 0 H 90 Q 95 0 95 5 V 10 H 5 V 5 Q 5 0 10 0 Z" fill="currentColor" />
            </svg>
          </div>
        )}
      </div>
    </nav>
  );
}