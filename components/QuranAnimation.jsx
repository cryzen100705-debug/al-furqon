"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function CinematicHero() {
  const sectionRef = useRef(null);

  const bgRef = useRef(null);
  const quranRef = useRef(null);
  const glowRef = useRef(null);

  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // =========================
      // INITIAL STATE
      // =========================

      gsap.set(titleRef.current, {
        opacity: 0,
        y: 100,
        filter: "blur(10px)",
      });

      gsap.set(subtitleRef.current, {
        opacity: 0,
        y: 80,
        filter: "blur(10px)",
      });

      gsap.set(textRef.current, {
        opacity: 0,
        y: 60,
      });

      // =========================
      // FLOATING QURAN
      // =========================

      gsap.to(quranRef.current, {
        y: -25,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // =========================
      // GLOW PULSE
      // =========================

      gsap.to(glowRef.current, {
        scale: 1.2,
        opacity: 0.8,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // =========================
      // INTRO ANIMATION
      // =========================

      const intro = gsap.timeline();

      intro.to(titleRef.current, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1.5,
        ease: "power3.out",
      });

      intro.to(
        subtitleRef.current,
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.5,
          ease: "power3.out",
        },
        "-=1"
      );

      intro.to(
        textRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
        },
        "-=1"
      );

      // =========================
      // CINEMATIC PARALLAX
      // =========================

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=3000",
          scrub: 1.5,
          pin: true,
        },
      });

      // Background zoom
      tl.to(
        bgRef.current,
        {
          scale: 1.2,
          duration: 3,
        },
        0
      );

      // Quran cinematic zoom
      tl.to(
        quranRef.current,
        {
          scale: 1.35,
          y: -120,
          rotate: -4,
          duration: 3,
          ease: "power2.out",
        },
        0
      );

      // Glow expansion
      tl.to(
        glowRef.current,
        {
          scale: 1.8,
          opacity: 1,
          duration: 3,
        },
        0
      );

      // Title out
      tl.to(
        titleRef.current,
        {
          opacity: 0,
          y: -100,
          filter: "blur(15px)",
          duration: 2,
        },
        0.5
      );

      // Subtitle in focus
      tl.to(
        subtitleRef.current,
        {
          scale: 1.1,
          color: "#fde68a",
          duration: 2,
        },
        1
      );

      // Text fade
      tl.to(
        textRef.current,
        {
          opacity: 0,
          y: -60,
          duration: 2,
        },
        1.5
      );

      // Final cinematic
      tl.to(
        quranRef.current,
        {
          scale: 1.6,
          y: -180,
          filter:
            "drop-shadow(0 0 80px rgba(255,215,0,0.8))",
          duration: 3,
        },
        2
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="
      relative
      h-screen
      overflow-hidden
      bg-black
      flex
      items-center
      justify-center
      "
    >
      {/* BACKGROUND */}
      <div
        ref={bgRef}
        className="
        absolute
        inset-0
        bg-gradient-to-b
        from-emerald-950
        via-black
        to-black
        "
      />

      {/* ISLAMIC LIGHT */}
      <div
        className="
        absolute
        top-[-250px]
        w-[1200px]
        h-[1200px]
        rounded-full
        bg-emerald-400/10
        blur-3xl
        "
      />

      {/* GLOW */}
      <div
        ref={glowRef}
        className="
        absolute
        w-[700px]
        h-[700px]
        rounded-full
        bg-emerald-300/20
        blur-3xl
        "
      />

      {/* ORNAMENT */}
      <div
        className="
        absolute
        inset-0
        opacity-10
        bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_1px,transparent_1px)]
        bg-[length:40px_40px]
        "
      />

      {/* QURAN */}
      <div
        className="
        relative
        z-20
        flex
        items-center
        justify-center
        "
      >
        <img
          ref={quranRef}
          src="/quran-open.png"
          alt="Quran"
          className="
          w-[320px]
          md:w-[620px]
          object-contain
          pointer-events-none
          select-none
          will-change-transform
          drop-shadow-[0_20px_80px_rgba(0,0,0,0.9)]
          "
        />
      </div>

      {/* CONTENT */}
      <div
        className="
        absolute
        inset-0
        z-30
        flex
        flex-col
        items-center
        justify-end
        pb-24
        text-center
        px-6
        "
      >
        {/* TITLE */}
        <h1
          ref={titleRef}
          className="
          text-white
          text-4xl
          md:text-7xl
          font-black
          tracking-tight
          leading-tight
          drop-shadow-[0_0_25px_rgba(255,255,255,0.25)]
          "
        >
          Selamat Datang
        </h1>

        {/* SUBTITLE */}
        <h2
          ref={subtitleRef}
          className="
          mt-5
          text-emerald-300
          text-2xl
          md:text-5xl
          font-bold
          drop-shadow-[0_0_25px_rgba(16,185,129,0.8)]
          "
        >
          Membentuk Generasi Qurani
        </h2>

        {/* DESCRIPTION */}
        <p
          ref={textRef}
          className="
          mt-6
          max-w-2xl
          text-gray-300
          text-sm
          md:text-lg
          leading-relaxed
          "
        >
          Pondok Pesantren Al Furqon hadir untuk
          membentuk santri yang berilmu, berakhlak,
          dan bertaqwa dengan pendidikan islami modern.
        </p>
      </div>

      {/* SCROLL INDICATOR */}
      <div
        className="
        absolute
        bottom-8
        z-40
        flex
        flex-col
        items-center
        text-gray-400
        text-sm
        animate-bounce
        "
      >
        <span>Scroll</span>

        <div
          className="
          mt-2
          w-[2px]
          h-10
          bg-gradient-to-b
          from-emerald-400
          to-transparent
          "
        />
      </div>
    </section>
  );
}