import { useEffect, useMemo, useRef, useState } from "react";
import type { CelestialBody } from "../data/solarSystem";

const SCALE = 230; // px на 1 метр
const TOP = 34; // стартовая высота яблока, px
const EARTH_FALL = Math.sqrt(2 / 9.81);
const G_EARTH = 9.81;

const fmt = (n: number, d = 2) => n.toFixed(d).replace(".", ",");

interface Dust {
  dx: number;
  size: number;
  dur: number;
  delay: number;
}

function AppleSVG() {
  return (
    <svg width="34" height="37" viewBox="0 0 34 37" aria-hidden="true">
      <defs>
        <radialGradient id="appleGrad" cx="35%" cy="28%" r="80%">
          <stop offset="0%" stopColor="#ff9d7e" />
          <stop offset="45%" stopColor="#e8503c" />
          <stop offset="100%" stopColor="#8f1d16" />
        </radialGradient>
      </defs>
      <path
        d="M17 9 C16 6 17 3.5 19.5 1.5"
        stroke="#7a4a21"
        strokeWidth="2.2"
        fill="none"
        strokeLinecap="round"
      />
      <path d="M19 5.5 C22.5 1.8 27.5 2.6 28.6 4 C27.4 7.8 22.6 9 19 7 Z" fill="#5fae52" />
      <path
        d="M17 9 C11 5.6 4 9 4 17 C4 26 10 33.4 14 34.6 C16 35.2 18 35.2 20 34.6 C24 33.4 30 26 30 17 C30 9 23 5.6 17 9 Z"
        fill="url(#appleGrad)"
      />
      <ellipse
        cx="11.6"
        cy="15.4"
        rx="3"
        ry="4.6"
        fill="rgba(255,255,255,0.32)"
        transform="rotate(-18 11.6 15.4)"
      />
    </svg>
  );
}

/** Эксперимент: падение яблока с высоты 1 метр при местной гравитации */
export function GravityLab({ body }: { body: CelestialBody }) {
  const g = body.gravity;
  const fallTime = Math.sqrt(2 / g); // t = √(2h/g), h = 1 м
  const impactV = Math.sqrt(2 * g); // v = √(2gh)
  const ratio = fallTime / EARTH_FALL;

  const [slow, setSlow] = useState(false);
  const [runId, setRunId] = useState(0);
  const [landed, setLanded] = useState(false);
  const appleRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    setLanded(false);
    if (appleRef.current) appleRef.current.style.transform = "translateY(0px)";
    if (timerRef.current) timerRef.current.textContent = "0,00 с";
    let raf = 0;
    let start = 0;
    const rate = slow ? 0.25 : 1;
    const step = (now: number) => {
      if (!start) start = now;
      const simT = ((now - start) / 1000) * rate;
      const y = 0.5 * g * simT * simT; // физика: h = gt²/2
      const clamped = Math.min(y, 1);
      if (appleRef.current)
        appleRef.current.style.transform = `translateY(${(clamped * SCALE).toFixed(1)}px)`;
      if (timerRef.current)
        timerRef.current.textContent = `${fmt(y >= 1 ? fallTime : simT)} с`;
      if (y >= 1) {
        setLanded(true);
        return;
      }
      raf = requestAnimationFrame(step);
    };
    const to = window.setTimeout(() => {
      raf = requestAnimationFrame(step);
    }, 420);
    return () => {
      window.clearTimeout(to);
      cancelAnimationFrame(raf);
    };
  }, [body.id, slow, runId, g, fallTime]);

  const dust = useMemo<Dust[]>(
    () =>
      Array.from({ length: 9 }, () => ({
        dx: (Math.random() - 0.5) * 90,
        size: 3 + Math.random() * 7,
        dur: 0.4 + Math.random() * 0.35,
        delay: Math.random() * 0.06,
      })),
    // новая партия пыли на каждый сброс
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [body.id, runId, slow]
  );

  const groundY = TOP + SCALE; // 264 — верх яблока в момент касания
  const earthPct = Math.round((g / G_EARTH) * 100);

  return (
    <div>
      {/* заголовок лаборатории */}
      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-ink-400">
            Яблоко падает с 1 метра
          </div>
          <div
            className="font-display text-[24px] font-extrabold leading-tight"
            style={{ color: body.color }}
          >
            g = {fmt(g)} м/с²
          </div>
          <div className="text-[11px] font-semibold text-ink-300">
            {g >= G_EARTH
              ? `${fmt(g / G_EARTH, 2)} × земной гравитации`
              : `${earthPct} % земной гравитации`}
          </div>
        </div>
        <div className="flex items-center gap-2 pb-0.5">
          <button
            onClick={() => setSlow((s) => !s)}
            title="Замедлить падение в 4 раза"
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-bold transition-all duration-200 ${
              slow
                ? "border-amber-300/40 bg-amber-300/15 text-amber-200 shadow-[0_0_14px_rgba(252,211,77,0.25)]"
                : "border-white/10 bg-white/[0.06] text-ink-300 hover:bg-white/[0.1] hover:text-ink-100"
            }`}
          >
            <svg width="11" height="11" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
              <path d="M10 6 3 1.8v8.4L10 6Z" />
              <rect x="1" y="1.8" width="1.6" height="8.4" rx="0.8" />
            </svg>
            Замедление
          </button>
          <button
            onClick={() => setRunId((r) => r + 1)}
            title="Сбросить яблоко ещё раз"
            className="group grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.06] text-ink-200 transition-all duration-200 hover:bg-white/[0.14] hover:text-ink-100"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform duration-300 group-hover:rotate-180"
            >
              <path d="M21 12a9 9 0 1 1-2.64-6.36" />
              <path d="M21 3v6h-6" />
            </svg>
          </button>
        </div>
      </div>

      {/* сцена эксперимента */}
      <div
        className={`relative mt-3 overflow-hidden rounded-2xl border border-white/10 ${
          landed ? "scene-thud" : ""
        }`}
        style={{
          height: 334,
          background: "linear-gradient(180deg, #0c1526 0%, #0a101f 65%, #0d1424 100%)",
        }}
      >
        {/* пунктирная траектория */}
        <div
          className="absolute left-1/2 border-l border-dashed border-white/10"
          style={{ top: TOP, height: SCALE }}
        />

        {/* крепление-крюк */}
        <div className="absolute left-1/2 -translate-x-1/2" style={{ top: 10 }}>
          <div className="h-1.5 w-9 rounded-full bg-white/15" />
          <div className="mx-auto h-2 w-px bg-white/20" />
        </div>

        {/* линейка */}
        <div className="absolute" style={{ left: 14, top: TOP, height: SCALE, width: 52 }}>
          {Array.from({ length: 11 }, (_, i) => {
            const major = i % 5 === 0;
            return (
              <div key={i} className="absolute right-0 flex items-center" style={{ top: (i * SCALE) / 10 }}>
                {major && (
                  <span className="mr-2 text-[9px] font-bold tabular-nums text-ink-400">
                    {i === 0 ? "1 м" : i === 5 ? "0,5 м" : "0 м"}
                  </span>
                )}
                <span
                  className="block bg-white/30"
                  style={{ width: major ? 16 : 8, height: 1 }}
                />
              </div>
            );
          })}
          <div className="absolute right-0 top-0 h-full w-px bg-white/20" />
        </div>

        {/* таймер */}
        <div className="absolute right-3 text-right" style={{ top: 12 }}>
          <div className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-ink-400">
            Время падения
          </div>
          <span
            ref={timerRef}
            className="font-display text-[22px] font-extrabold tabular-nums text-ink-100"
          >
            0,00 с
          </span>
        </div>

        {/* бейдж замедления */}
        {slow && (
          <div className="absolute left-3 rounded-md border border-amber-300/30 bg-amber-300/10 px-2 py-0.5 text-[10px] font-extrabold text-amber-200" style={{ top: 12 }}>
            ×0,25
          </div>
        )}

        {/* грунт */}
        <div
          className="absolute inset-x-0"
          style={{
            top: groundY + 37,
            bottom: 0,
            borderTop: `1px solid ${body.color}88`,
            background: `linear-gradient(180deg, ${body.color}30 0%, ${body.color}0a 55%, transparent 100%)`,
          }}
        />

        {/* вспышка удара */}
        {landed && (
          <div
            className="impact-flash pointer-events-none absolute left-1/2"
            style={{
              top: groundY + 24,
              width: 110,
              height: 34,
              background: `radial-gradient(closest-side, ${body.color}b3, transparent 72%)`,
            }}
          />
        )}

        {/* пыль */}
        {landed && (
          <div className="pointer-events-none absolute left-1/2" style={{ top: groundY + 30 }}>
            {dust.map((p, i) => (
              <span
                key={`${runId}-${i}`}
                className="absolute rounded-full"
                style={{
                  width: p.size,
                  height: p.size * 0.7,
                  background: "rgba(203,185,160,0.75)",
                  animation: `dust-pop ${p.dur}s ease-out ${p.delay}s both`,
                  ["--dx" as string]: `${p.dx}px`,
                }}
              />
            ))}
          </div>
        )}

        {/* яблоко */}
        <div className="absolute" style={{ left: "50%", marginLeft: -17, top: TOP }}>
          <div ref={appleRef} className="will-change-transform">
            <div className={landed ? "apple-squash" : ""} style={{ transformOrigin: "50% 100%" }}>
              <AppleSVG />
            </div>
          </div>
        </div>
      </div>

      {/* результаты */}
      <div className="mt-3 grid grid-cols-3 gap-2">
        {[
          { label: "Время падения", value: `${fmt(fallTime)} с` },
          { label: "Скорость удара", value: `${fmt(impactV, 1)} м/с` },
          {
            label: "Против Земли",
            value: ratio >= 1 ? `${fmt(ratio)} × дольше` : `${fmt(1 / ratio)} × быстрее`,
          },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-white/[0.06] bg-white/[0.04] px-3 py-2"
          >
            <div className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-ink-400">
              {s.label}
            </div>
            <div className="mt-0.5 font-display text-[13px] font-extrabold text-ink-100">
              {s.value}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs leading-relaxed text-ink-300">
        {body.id === "earth"
          ? "Эталон: на Земле любое тело с метра падает за 0,45 секунды — именно отсюда «привычная» тяжесть."
          : ratio > 1
            ? `Здесь яблоко приземлится в ${fmt(ratio)} раза медленнее, чем на Земле, — удар почти нежный.`
            : `Здесь яблоко рухнет в ${fmt(1 / ratio)} раза быстрее земного — держите его крепче.`}
      </p>
      {body.id === "sun" && (
        <p className="mt-1.5 text-[10px] italic leading-relaxed text-ink-400">
          * На уровне фотосферы — условной «поверхности». Стоять на звезде всё равно не получится.
        </p>
      )}
    </div>
  );
}
