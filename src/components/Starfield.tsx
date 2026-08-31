import { useEffect, useMemo, useRef } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  max: number;
  dur: number;
  delay: number;
}

function makeStars(count: number): Star[] {
  const arr: Star[] = [];
  for (let i = 0; i < count; i++) {
    arr.push({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 0.8 + Math.random() * 1.9,
      max: 0.35 + Math.random() * 0.6,
      dur: 2.6 + Math.random() * 5.5,
      delay: Math.random() * 6,
    });
  }
  return arr;
}

/** Живой фон: три слоя звёзд с параллаксом, туманности и падающие звёзды */
export function Starfield() {
  const farRef = useRef<HTMLDivElement>(null);
  const midRef = useRef<HTMLDivElement>(null);
  const nearRef = useRef<HTMLDivElement>(null);

  const far = useMemo(() => makeStars(90), []);
  const mid = useMemo(() => makeStars(60), []);
  const near = useMemo(() => makeStars(26), []);

  useEffect(() => {
    let raf = 0;
    let tx = 0;
    let ty = 0;
    const onMove = (e: MouseEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    const tick = () => {
      if (farRef.current)
        farRef.current.style.transform = `translate(${tx * -4}px, ${ty * -4}px)`;
      if (midRef.current)
        midRef.current.style.transform = `translate(${tx * -9}px, ${ty * -9}px)`;
      if (nearRef.current)
        nearRef.current.style.transform = `translate(${tx * -16}px, ${ty * -16}px)`;
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  const layer = (stars: Star[]) =>
    stars.map((s, i) => (
      <span
        key={i}
        className="star"
        style={{
          left: `${s.x}%`,
          top: `${s.y}%`,
          width: s.size,
          height: s.size,
          ["--tw-max" as string]: s.max,
          ["--tw-dur" as string]: `${s.dur}s`,
          ["--tw-delay" as string]: `${s.delay}s`,
        }}
      />
    ));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      {/* глубокий градиент космоса */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 42%, #0b1526 0%, #070d1a 46%, #04060d 100%)",
        }}
      />
      {/* туманности */}
      <div
        className="absolute rounded-full blur-3xl"
        style={{
          width: "58vw",
          height: "44vh",
          left: "-12vw",
          top: "-10vh",
          background: "radial-gradient(closest-side, rgba(28,78,96,0.34), transparent 70%)",
        }}
      />
      <div
        className="absolute rounded-full blur-3xl"
        style={{
          width: "48vw",
          height: "52vh",
          right: "-14vw",
          bottom: "-16vh",
          background: "radial-gradient(closest-side, rgba(64,42,74,0.30), transparent 70%)",
        }}
      />
      <div
        className="absolute rounded-full blur-3xl"
        style={{
          width: "40vw",
          height: "34vh",
          left: "34vw",
          bottom: "-12vh",
          background: "radial-gradient(closest-side, rgba(30,52,102,0.28), transparent 72%)",
        }}
      />
      {/* млечный путь */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(112deg, transparent 30%, rgba(148,175,214,0.05) 44%, rgba(148,175,214,0.10) 50%, rgba(148,175,214,0.05) 56%, transparent 70%)",
        }}
      />

      <div ref={farRef} className="absolute inset-[-24px] will-change-transform">
        {layer(far)}
      </div>
      <div ref={midRef} className="absolute inset-[-24px] will-change-transform">
        {layer(mid)}
      </div>
      <div ref={nearRef} className="absolute inset-[-24px] will-change-transform">
        {layer(near)}
      </div>

      {/* падающие звёзды */}
      <div className="shooting-star" style={{ top: "16%", left: "78%" }} />
      <div className="shooting-star s2" style={{ top: "46%", left: "94%" }} />
    </div>
  );
}
