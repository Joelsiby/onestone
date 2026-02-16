import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import reveal1 from "../assets/img.jpg";
import reveal2 from "../assets/img.jpg";
import reveal3 from "../assets/img.jpg";
import reveal4 from "../assets/img.jpg";
import "./TextRevealSection.css";

gsap.registerPlugin(ScrollTrigger);

export default function TextRevealSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      document.querySelectorAll(".reveal-line").forEach((line) => {
        const imgSpan = line.querySelector(".reveal-img-span");
        if (imgSpan) {
          gsap.to(imgSpan, {
            width: 300,
            ease: "none",
            scrollTrigger: {
              trigger: line,
              start: "top 90%",
              end: "top 40%",
              scrub: 1,
            },
          });
        }
      });

      const arrow = document.querySelector(".cta-arrow");
      if (arrow) {
        gsap.to(arrow, {
          y: -10,
          duration: 0.6,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
        });
      }

      /* THE TAGLINE ANIMATION WAS COMPLETELY REMOVED HERE TO FIX THE INVISIBLE TEXT BUG */

      const path = document.querySelector(".curvy-arrow-path");
      if (path) {
        const length = path.getTotalLength();
        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });
        gsap.to(path, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: ".curvy-arrow-container",
            start: "top 80%",
            end: "top 50%",
            scrub: 1,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="text-reveal-section" ref={sectionRef}>
      {/* ── Curvy Arrow ── */}
      <div className="curvy-arrow-container">
        <svg
          className="curvy-arrow-svg"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            className="curvy-arrow-path"
            d="M180 10 C 160 60, 120 90, 80 110 C 40 130, 30 150, 40 180"
            stroke="#1a1a1a"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          <polygon points="32,175 48,175 40,190" fill="#1a1a1a" />
        </svg>
        <span className="curvy-arrow-label">click me! 👆</span>
      </div>

      <div className="reveal-container">
        <a href="/contact" className="reveal-line reveal-line-cta">
          <span>Send us</span>
          <span className="reveal-img-span">
            <img src={reveal1} alt="requirements" />
          </span>
          <span>your</span>
          <span className="cta-arrow">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 17L17 7" />
              <path d="M7 7h10v10" />
            </svg>
          </span>
        </a>

        <a href="/contact" className="reveal-line reveal-line-cta">
          <span className="highlight-text">requirements</span>
          <span className="reveal-img-span">
            <img src={reveal2} alt="features" />
          </span>
          <span>🎯</span>
        </a>

        <div className="reveal-line">
          <span>& it's</span>
          <span className="reveal-img-span">
            <img src={reveal3} alt="simple" />
          </span>
          <span> simple.</span>
        </div>

        <div className="reveal-line">
          <span>Demo in</span>
          <span className="reveal-emoji">⚡</span>
          <span className="reveal-bold">72 hrs</span>
        </div>

        <div className="reveal-line">
          <span className="reveal-bold">for free</span>
          <span className="reveal-img-span">
            <img src={reveal4} alt="free demo" />
          </span>
          <span>🎉</span>
        </div>

        <div className="reveal-line">
          <span>then we can </span>
          <span className="reveal-emoji">🤝</span>
          <span>talk</span>
        </div>

        <div className="reveal-line">
          <span>about pricing.</span>
        </div>
      </div>

      <div className="reveal-tagline">
        <p>
          How stress free is that
          <span className="tagline-emoji"> 😌✨</span>
        </p>
      </div>
    </div>
  );
}