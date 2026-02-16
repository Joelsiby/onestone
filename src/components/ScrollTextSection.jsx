import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "./ScrollTextSection.css";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollTextSection() {
  const sectionRef = useRef(null);
  const lenisRef = useRef(null);
  const contextRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis();
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    contextRef.current = gsap.context(() => {
      const textElement1 = document.querySelector(
        ".sticky-text-1 .text-container h1"
      );
      const textElement2 = document.querySelector(
        ".sticky-text-2 .text-container h1"
      );
      const textContainer2 = document.querySelector(
        ".sticky-text-2 .text-container"
      );
      const introSection = document.querySelector(".reveal-intro-section");

      if (!textElement1 || !textElement2 || !textContainer2) return;

      const stickyText2Bg = getComputedStyle(document.documentElement)
        .getPropertyValue("--light")
        .trim();

      const targetScales = [];

      function calculateDynamicScale() {
        for (let i = 1; i <= 2; i++) {
          const section = document.querySelector(`.sticky-text-${i}`);
          const text = document.querySelector(
            `.sticky-text-${i} .text-container h1`
          );
          if (!section || !text) continue;
          targetScales[i - 1] = section.offsetHeight / text.offsetHeight;
        }
      }

      calculateDynamicScale();
      window.addEventListener("resize", calculateDynamicScale);

      function setScaleY(element, scale) {
        element.style.transform = `scaleY(${scale})`;
      }

      /* ── Website: scale up ── */
      ScrollTrigger.create({
        trigger: ".sticky-text-1",
        start: "top bottom",
        end: "top top",
        scrub: 1,
        onUpdate: (self) => {
          setScaleY(textElement1, targetScales[0] * self.progress);
        },
      });

      /* ── Website: pin + scale down ── */
      ScrollTrigger.create({
        trigger: ".sticky-text-1",
        start: "top top",
        end: `+=${window.innerHeight}px`,
        pin: true,
        pinSpacing: false,
        scrub: 1,
        onUpdate: (self) => {
          setScaleY(textElement1, targetScales[0] * (1 - self.progress));
        },
      });

      /* ── Webapp: scale up ── */
      ScrollTrigger.create({
        trigger: ".sticky-text-2",
        start: "top bottom",
        end: "top top",
        scrub: 1,
        onUpdate: (self) => {
          setScaleY(textElement2, targetScales[1] * self.progress);
        },
      });

      /* ── Webapp: pin + zoom + fade ── */
      ScrollTrigger.create({
        trigger: ".sticky-text-2",
        start: "top top",
        end: `+=${window.innerHeight * 3}px`,
        pin: true,
        pinSpacing: true,
        scrub: 1,
        onUpdate: (self) => {
          const p = self.progress;

          if (p === 0) {
            textContainer2.style.backgroundColor = stickyText2Bg;
            textContainer2.style.opacity = 1;
          }

          /* Zoom */
          if (p <= 0.4) {
            const s = 1 + 14 * (p / 0.4);
            textContainer2.style.transform = `scale3d(${s}, ${s}, 1)`;
          } else {
            textContainer2.style.transform = `scale3d(15, 15, 1)`;
          }

          /* Fade bg */
          if (p < 0.15) {
            textContainer2.style.backgroundColor = stickyText2Bg;
          } else if (p <= 0.35) {
            const o = 1 - (p - 0.15) / 0.2;
            textContainer2.style.backgroundColor = stickyText2Bg.replace(
              "1)",
              `${Math.max(0, o)})`
            );
          } else {
            textContainer2.style.backgroundColor = stickyText2Bg.replace(
              "1)",
              "0)"
            );
          }

          /* Fade text */
          if (p < 0.25) {
            textContainer2.style.opacity = 1;
          } else if (p <= 0.4) {
            textContainer2.style.opacity = 1 - (p - 0.25) / 0.15;
          } else {
            textContainer2.style.opacity = 0;
          }

          /* Show "What you can do is" during the blank part of the pin */
          if (introSection) {
            if (p >= 0.45 && p <= 0.6) {
              const fadeIn = (p - 0.45) / 0.15;
              introSection.style.opacity = fadeIn;
              introSection.style.transform = `translateY(${30 * (1 - fadeIn)}px)`;
            } else if (p > 0.6 && p <= 0.85) {
              introSection.style.opacity = 1;
              introSection.style.transform = `translateY(0)`;
            } else if (p > 0.85) {
              const fadeOut = (p - 0.85) / 0.15;
              introSection.style.opacity = 1 - fadeOut;
              introSection.style.transform = `translateY(${-30 * fadeOut}px)`;
            } else {
              introSection.style.opacity = 0;
              introSection.style.transform = `translateY(30px)`;
            }
          }
        },
      });
    }, sectionRef);

    return () => {
      if (contextRef.current) contextRef.current.revert();
      if (lenisRef.current) lenisRef.current.destroy();
    };
  }, []);

  return (
    <div className="scroll-section" ref={sectionRef}>
      <section className="sticky-text-1">
        <div className="text-container">
          <h1>Websites</h1>
        </div>
      </section>

      <section className="sticky-text-2">
        <div className="text-container">
          <h1>Webapps</h1>
        </div>

        {/* "What you can do is" lives INSIDE sticky-text-2 so it shows during the pin */}
        <div className="reveal-intro-section">
          <div className="reveal-intro-content">
            <p className="reveal-intro-text">
              <span className="reveal-intro-emoji">🤔</span>
              What you can do is
              <span className="reveal-intro-emoji">👇</span>
            </p>
            <div className="intro-bounce-arrow">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1a1a1a"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 5v14" />
                <path d="M19 12l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}