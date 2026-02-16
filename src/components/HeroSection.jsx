import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import frontImage from "../assets/front.png";
import backImage from "../assets/back2.png";
import frontMobileImage from "../assets/front-mobile.png";
import backMobileImage from "../assets/back-mobile.png";
import "./HeroSection.css";

const COOLDOWN = 1000;
const TRAIL_LENGTH = 5;
const IDLE_TIMEOUT = 300;
const MOBILE_BREAKPOINT = 768;
const BLOCK_SIZE_DESKTOP = 50;
const BLOCK_SIZE_MOBILE = 40;

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    window.innerWidth < MOBILE_BREAKPOINT
  );

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return isMobile;
}

function useGridConfig() {
  const [config, setConfig] = useState(getGridConfig());

  function getGridConfig() {
    const w = window.innerWidth;
    if (w <= 375) return { rows: 4, cols: 3 };
    if (w <= 430) return { rows: 5, cols: 3 };
    return { rows: 6, cols: 6 };
  }

  useEffect(() => {
    const update = () => setConfig(getGridConfig());
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return config;
}

function Tile({ row, col, tileRef, rows, cols, isMobile }) {
  const bgX = cols > 1 ? (col * 100) / (cols - 1) : 0;
  const bgY = rows > 1 ? (row * 100) / (rows - 1) : 0;
  const bgPosition = `${bgX}% ${bgY}%`;
  const frontImg = isMobile ? frontMobileImage : frontImage;
  const backImg = isMobile ? backMobileImage : backImage;

  return (
    <div
      className="tile"
      ref={tileRef}
      style={{
        "--bg-position": bgPosition,
        "--front-image": `url(${frontImg})`,
        "--back-image": `url(${backImg})`,
        "--bg-size": `${cols * 100}% ${rows * 100}%`,
      }}
    >
      <div className="tile-face tile-front" />
      <div className="tile-face tile-back" />
    </div>
  );
}

function Board({ isFlipped, rows, cols, isMobile }) {
  const tileRefs = useRef([]);
  const lastEnterTimes = useRef([]);
  const isFlippedRef = useRef(false);

  useEffect(() => {
    lastEnterTimes.current = new Array(rows * cols).fill(0);
  }, [rows, cols]);

  useEffect(() => {
    isFlippedRef.current = isFlipped;
  }, [isFlipped]);

  useEffect(() => {
    const tiles = tileRefs.current.filter(Boolean);
    if (tiles.length === 0) return;

    if (isFlipped) {
      gsap.to(tiles, {
        scale: 0.8,
        opacity: 0,
        duration: 0.6,
        stagger: { amount: 0.4, from: "random" },
        ease: "power2.inOut",
      });
    } else {
      tiles.forEach((tile) => {
        gsap.set(tile, { rotateX: 0, rotateY: 0 });
      });
      gsap.to(tiles, {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        stagger: { amount: 0.4, from: "random" },
        ease: "power2.inOut",
      });
    }
  }, [isFlipped]);

  const handleInteraction = useCallback(
    (index) => {
      if (isFlippedRef.current) return;

      const now = Date.now();
      if (now - (lastEnterTimes.current[index] || 0) < COOLDOWN) return;
      lastEnterTimes.current[index] = now;

      const tile = tileRefs.current[index];
      if (!tile) return;

      const colIndex = index % cols;
      const mid = (cols - 1) / 2;
      const offset = colIndex - mid;
      const tiltY = mid !== 0 ? offset * (40 / mid) : 0;

      gsap
        .timeline()
        .set(tile, { rotateX: 0, rotateY: 0 })
        .to(tile, {
          rotateX: 270,
          rotateY: tiltY,
          duration: 0.5,
          ease: "power2.out",
        })
        .to(
          tile,
          {
            rotateX: 360,
            rotateY: 0,
            duration: 0.5,
            ease: "power2.out",
          },
          "-=0.25"
        );
    },
    [cols]
  );

  useEffect(() => {
    const onTouchMove = (e) => {
      if (isFlippedRef.current) return;
      const touch = e.touches[0];
      if (!touch) return;

      const boardEl = document.querySelector(".board");
      if (!boardEl) return;

      const rect = boardEl.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;

      const tileW = rect.width / cols;
      const tileH = rect.height / rows;

      const col = Math.floor(x / tileW);
      const row = Math.floor(y / tileH);

      if (col < 0 || col >= cols || row < 0 || row >= rows) return;

      const index = row * cols + col;
      handleInteraction(index);
    };

    document.addEventListener("touchmove", onTouchMove, { passive: true });
    return () => document.removeEventListener("touchmove", onTouchMove);
  }, [rows, cols, handleInteraction]);

  return (
    <section className="board">
      {Array.from({ length: rows }, (_, rowIndex) => (
        <div className="row" key={rowIndex}>
          {Array.from({ length: cols }, (_, colIndex) => {
            const index = rowIndex * cols + colIndex;
            return (
              <div
                key={colIndex}
                className="tile-wrapper"
                onMouseEnter={() => handleInteraction(index)}
              >
                <Tile
                  row={rowIndex}
                  col={colIndex}
                  rows={rows}
                  cols={cols}
                  isMobile={isMobile}
                  tileRef={(el) => {
                    tileRefs.current[index] = el;
                  }}
                />
              </div>
            );
          })}
        </div>
      ))}
    </section>
  );
}

function BackImage({ isFlipped, isMobile }) {
  const backRef = useRef(null);
  const imgSrc = isMobile ? backMobileImage : backImage;

  useEffect(() => {
    if (!backRef.current) return;

    if (isFlipped) {
      gsap.to(backRef.current, {
        opacity: 1,
        duration: 0.8,
        delay: 0.3,
        ease: "power2.inOut",
      });
    } else {
      gsap.to(backRef.current, {
        opacity: 0,
        duration: 0.4,
        ease: "power2.inOut",
      });
    }
  }, [isFlipped]);

  return (
    <div className="back-image" ref={backRef}>
      <img src={imgSrc} alt="back" />
    </div>
  );
}

function CursorWheel({ isMobile }) {
  const wheelRef = useRef(null);
  const posRef = useRef({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });
  const currentRef = useRef({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,git init
  });
  const rafRef = useRef(null);
  const hasEnteredRef = useRef(false);

  useEffect(() => {
    const text = "SCROLL DOWN • SCROLL DOWN • ";
    const wheel = wheelRef.current;
    if (!wheel) return;

    const textContainer = wheel.querySelector(".cursor-wheel-text");
    textContainer.innerHTML = "";

    const chars = text.split("");
    const totalChars = chars.length;

    chars.forEach((char, i) => {
      const span = document.createElement("span");
      span.innerText = char;
      span.style.position = "absolute";
      span.style.left = "50%";
      span.style.top = "0";
      span.style.transformOrigin = isMobile ? "0 40px" : "0 50px";
      span.style.transform = `rotate(${(i * 360) / totalChars}deg)`;
      textContainer.appendChild(span);
    });

    const showWheel = () => {
      if (!hasEnteredRef.current) {
        hasEnteredRef.current = true;
        wheel.style.opacity = "1";
      }
    };

    const hideWheel = () => {
      hasEnteredRef.current = false;
      wheel.style.opacity = "0";
    };

    const startHideTimer = () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      hideTimerRef.current = setTimeout(() => {
        hideWheel();
      }, 2000);
    };

    const hideTimerRef = { current: null };

    const updatePosition = (x, y) => {
      posRef.current.x = x;
      posRef.current.y = y;
      showWheel();
      if (isMobile) startHideTimer();
    };

    const onMouseMove = (e) => updatePosition(e.clientX, e.clientY);
    const onMouseLeave = () => hideWheel();
    const onMouseEnter = () => showWheel();

    const onTouchStart = (e) => {
      const touch = e.touches[0];
      if (touch) {
        currentRef.current.x = touch.clientX;
        currentRef.current.y = touch.clientY;
        updatePosition(touch.clientX, touch.clientY);
      }
    };
    const onTouchMove = (e) => {
      const touch = e.touches[0];
      if (touch) updatePosition(touch.clientX, touch.clientY);
    };
    const onTouchEnd = () => startHideTimer();

    const animate = () => {
      const lerp = isMobile ? 0.25 : 0.15;
      currentRef.current.x +=
        (posRef.current.x - currentRef.current.x) * lerp;
      currentRef.current.y +=
        (posRef.current.y - currentRef.current.y) * lerp;

      wheel.style.left = `${currentRef.current.x}px`;
      wheel.style.top = `${currentRef.current.y}px`;

      rafRef.current = requestAnimationFrame(animate);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseenter", onMouseEnter);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchmove", onTouchMove, { passive: true });
    document.addEventListener("touchend", onTouchEnd);

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseenter", onMouseEnter);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
      cancelAnimationFrame(rafRef.current);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [isMobile]);

  return (
    <div
      className={`cursor-wheel ${isMobile ? "cursor-wheel-mobile" : ""}`}
      ref={wheelRef}
    >
      <div className="cursor-wheel-text" />
      <div className="cursor-wheel-arrow">↓</div>
    </div>
  );
}

function ScrollIndicator() {
  return (
    <div className="scroll-indicator">
      <div className="scroll-indicator-text">SCROLL DOWN TO BUILD</div>
      <div className="scroll-indicator-arrow">↓</div>
    </div>
  );
}

function getAdjacency(index1, index2, numCols) {
  const row1 = Math.floor(index1 / numCols);
  const col1 = index1 % numCols;
  const row2 = Math.floor(index2 / numCols);
  const col2 = index2 % numCols;

  if (row1 === row2 && col2 === col1 + 1) return "right";
  if (row1 === row2 && col2 === col1 - 1) return "left";
  if (col1 === col2 && row2 === row1 + 1) return "below";
  if (col1 === col2 && row2 === row1 - 1) return "above";
  return null;
}

function BlocksOverlay({ isMobile }) {
  const blocksRef = useRef(null);
  const gridInfoRef = useRef({ numCols: 0, numRows: 0, blockSize: 50 });
  const trailRef = useRef([]);
  const lastIndexRef = useRef(-1);
  const idleTimerRef = useRef(null);
  const shrinkTimerRef = useRef(null);

  const blockSize = isMobile ? BLOCK_SIZE_MOBILE : BLOCK_SIZE_DESKTOP;
  const trailLength = isMobile ? 4 : TRAIL_LENGTH;

  useEffect(() => {
    const generate = () => {
      const container = blocksRef.current;
      if (!container) return;
      container.innerHTML = "";

      const w = window.innerWidth;
      const h = window.innerHeight;

      const numCols = Math.floor(w / blockSize);
      const numRows = Math.floor(h / blockSize);

      gridInfoRef.current = { numCols, numRows, blockSize };

      container.style.width = `${numCols * blockSize}px`;
      container.style.height = `${numRows * blockSize}px`;

      const total = numCols * numRows;
      for (let i = 0; i < total; i++) {
        const block = document.createElement("div");
        block.classList.add("block");
        block.style.width = `${blockSize}px`;
        block.style.height = `${blockSize}px`;
        container.appendChild(block);
      }

      trailRef.current = [];
      lastIndexRef.current = -1;
    };

    generate();
    window.addEventListener("resize", generate);
    return () => window.removeEventListener("resize", generate);
  }, [blockSize]);

  const clearBlock = useCallback((element) => {
    if (!element) return;
    element.classList.remove(
      "trail-active",
      "trail-no-top",
      "trail-no-bottom",
      "trail-no-left",
      "trail-no-right"
    );
  }, []);

  const applyTrailStyles = useCallback(() => {
    const trail = trailRef.current;
    const { numCols } = gridInfoRef.current;

    trail.forEach((item) => {
      item.element.classList.remove(
        "trail-no-top",
        "trail-no-bottom",
        "trail-no-left",
        "trail-no-right"
      );
      item.element.classList.add("trail-active");
    });

    for (let i = 0; i < trail.length; i++) {
      for (let j = 0; j < trail.length; j++) {
        if (i === j) continue;
        const adj = getAdjacency(trail[i].index, trail[j].index, numCols);
        if (adj === "right") trail[i].element.classList.add("trail-no-right");
        if (adj === "left") trail[i].element.classList.add("trail-no-left");
        if (adj === "below") trail[i].element.classList.add("trail-no-bottom");
        if (adj === "above") trail[i].element.classList.add("trail-no-top");
      }
    }
  }, []);

  const startShrink = useCallback(() => {
    if (shrinkTimerRef.current) clearInterval(shrinkTimerRef.current);

    shrinkTimerRef.current = setInterval(() => {
      if (trailRef.current.length <= 0) {
        clearInterval(shrinkTimerRef.current);
        shrinkTimerRef.current = null;
        return;
      }

      const old = trailRef.current.shift();
      if (old) clearBlock(old.element);

      if (trailRef.current.length > 0) {
        applyTrailStyles();
      }
    }, 80);
  }, [clearBlock, applyTrailStyles]);

  const stopShrink = useCallback(() => {
    if (shrinkTimerRef.current) {
      clearInterval(shrinkTimerRef.current);
      shrinkTimerRef.current = null;
    }
  }, []);

  const handlePointer = useCallback(
    (clientX, clientY) => {
      const container = blocksRef.current;
      if (!container) return;

      const { numCols, numRows, blockSize: bs } = gridInfoRef.current;
      if (numCols === 0) return;

      const col = Math.floor(clientX / bs);
      const row = Math.floor(clientY / bs);

      if (col < 0 || col >= numCols || row < 0 || row >= numRows) return;

      const index = row * numCols + col;
      if (index === lastIndexRef.current) return;
      lastIndexRef.current = index;

      const block = container.children[index];
      if (!block) return;

      stopShrink();
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);

      const existingIdx = trailRef.current.findIndex(
        (item) => item.index === index
      );
      if (existingIdx !== -1) {
        const removed = trailRef.current.splice(0, existingIdx + 1);
        removed.forEach((item) => clearBlock(item.element));
      }

      trailRef.current.push({ index, element: block });

      while (trailRef.current.length > trailLength) {
        const old = trailRef.current.shift();
        if (old) clearBlock(old.element);
      }

      applyTrailStyles();

      idleTimerRef.current = setTimeout(() => {
        startShrink();
      }, IDLE_TIMEOUT);
    },
    [trailLength, clearBlock, applyTrailStyles, startShrink, stopShrink]
  );

  useEffect(() => {
    const onMouseMove = (e) => handlePointer(e.clientX, e.clientY);

    const onTouchStart = (e) => {
      const touch = e.touches[0];
      if (touch) handlePointer(touch.clientX, touch.clientY);
    };

    const onTouchMove = (e) => {
      const touch = e.touches[0];
      if (touch) handlePointer(touch.clientX, touch.clientY);
    };

    const onTouchEnd = () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => {
        startShrink();
      }, 100);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchmove", onTouchMove, { passive: true });
    document.addEventListener("touchend", onTouchEnd);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      stopShrink();
    };
  }, [handlePointer, startShrink, stopShrink]);

  return (
    <div className="blocks-container">
      <div id="blocks" ref={blocksRef} />
    </div>
  );
}

export default function HeroSection({ isFlipped }) {
  const isMobile = useIsMobile();
  const { rows, cols } = useGridConfig();

  return (
    <div className="hero-wrapper">
      <BackImage isFlipped={isFlipped} isMobile={isMobile} />
      <Board
        isFlipped={isFlipped}
        rows={rows}
        cols={cols}
        isMobile={isMobile}
      />
      <BlocksOverlay isMobile={isMobile} />

      {!isMobile && <CursorWheel isMobile={isMobile} />}
      <ScrollIndicator />
    </div>
  );
}