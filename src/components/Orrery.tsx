import { useEffect, useRef } from "react";
import { BODIES, PLANETS, type BodyId, type CelestialBody } from "../data/solarSystem";

export const CX = 800;
export const CY = 500;

interface OrreryProps {
  playing: boolean;
  speed: number; // земных суток за секунду
  selected: BodyId | null;
  onSelect: (id: BodyId | null) => void;
  hovered: BodyId | null;
  onHover: (id: BodyId | null) => void;
  showOrbits: boolean;
  showLabels: boolean;
  onDayChange: (day: number) => void;
}

interface BeltRing {
  period: number;
  dots: { x: number; y: number; s: number; o: number }[];
}

const BELT: BeltRing[] = (() => {
  const spec = [
    { count: 52, r: 176, jitter: 5, period: 1450 },
    { count: 48, r: 184, jitter: 5, period: 1700 },
    { count: 42, r: 192, jitter: 5, period: 1980 },
  ];
  return spec.map((s) => ({
    period: s.period,
    dots: Array.from({ length: s.count }, () => {
      const a = Math.random() * Math.PI * 2;
      const rr = s.r + (Math.random() - 0.5) * 2 * s.jitter;
      return {
        x: CX + rr * Math.cos(a),
        y: CY + rr * Math.sin(a),
        s: 0.6 + Math.random() * 1.3,
        o: 0.16 + Math.random() * 0.34,
      };
    }),
  }));
})();

function PlanetVisual({ body, hovered, selected }: { body: CelestialBody; hovered: boolean; selected: boolean }) {
  const { vr } = body;
  return (
    <>
      {selected && (
        <circle className="halo-ring" r={vr + 9} stroke={body.color} strokeWidth={2} />
      )}
      {hovered && !selected && (
        <circle r={vr + 7} fill="none" stroke={body.color} strokeOpacity={0.55} strokeWidth={1.5} />
      )}
      {body.hasRings && (
        <g transform="rotate(-18)">
          <ellipse rx={vr * 1.85} ry={vr * 0.58} fill="none" stroke="#cbb07a" strokeWidth={5} strokeOpacity={0.45} />
          <ellipse rx={vr * 1.45} ry={vr * 0.44} fill="none" stroke="#a8895a" strokeWidth={2.5} strokeOpacity={0.5} />
        </g>
      )}
      <circle
        r={vr}
        fill={`url(#grad-${body.id})`}
        filter={hovered ? "url(#bodyGlow)" : undefined}
      />
      {body.atmosphere && (
        <circle r={vr + 2.4} fill="none" stroke={body.atmosphere} strokeOpacity={0.4} strokeWidth={1.4} />
      )}
      {body.hasRings && (
        <g transform="rotate(-18)">
          <path
            d={`M ${-vr * 1.85} 0 A ${vr * 1.85} ${vr * 0.58} 0 0 0 ${vr * 1.85} 0`}
            fill="none"
            stroke="#d8c08a"
            strokeWidth={5}
            strokeOpacity={0.75}
            strokeLinecap="round"
          />
          <path
            d={`M ${-vr * 1.45} 0 A ${vr * 1.45} ${vr * 0.44} 0 0 0 ${vr * 1.45} 0`}
            fill="none"
            stroke="#b8975f"
            strokeWidth={2.5}
            strokeOpacity={0.8}
            strokeLinecap="round"
          />
        </g>
      )}
      {body.id === "uranus" && (
        <g transform="rotate(78)">
          <ellipse rx={vr * 1.5} ry={vr * 0.4} fill="none" stroke="#9fe6e0" strokeOpacity={0.3} strokeWidth={1.5} />
        </g>
      )}
    </>
  );
}

export function Orrery({
  playing,
  speed,
  selected,
  onSelect,
  hovered,
  onHover,
  showOrbits,
  showLabels,
  onDayChange,
}: OrreryProps) {
  const playingRef = useRef(playing);
  const speedRef = useRef(speed);
  const onDayRef = useRef(onDayChange);
  playingRef.current = playing;
  speedRef.current = speed;
  onDayRef.current = onDayChange;

  const simDays = useRef(0);
  const planetEls = useRef<Record<string, SVGGElement | null>>({});
  const moonEl = useRef<SVGGElement | null>(null);
  const beltEls = useRef<(SVGGElement | null)[]>([]);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let lastSentDay = -1;
    let lastSentAt = 0;

    const tick = (t: number) => {
      const dt = Math.min((t - last) / 1000, 0.12);
      last = t;
      if (playingRef.current) simDays.current += speedRef.current * dt;
      const d = simDays.current;

      for (const id of PLANETS) {
        const el = planetEls.current[id];
        const orbit = BODIES[id].orbit!;
        if (!el) continue;
        const a = orbit.start + (Math.PI * 2 * d) / orbit.period;
        el.setAttribute(
          "transform",
          `translate(${(CX + orbit.r * Math.cos(a)).toFixed(2)} ${(CY + orbit.r * Math.sin(a)).toFixed(2)})`
        );
      }
      if (moonEl.current) {
        const a = (Math.PI * 2 * d) / 27.3;
        moonEl.current.setAttribute(
          "transform",
          `translate(${(16 * Math.cos(a)).toFixed(2)} ${(16 * Math.sin(a)).toFixed(2)})`
        );
      }
      beltEls.current.forEach((el, i) => {
        if (el) {
          const ang = (d / BELT[i].period) * 360;
          el.setAttribute("transform", `rotate(${(ang % 360).toFixed(2)} ${CX} ${CY})`);
        }
      });

      const day = Math.floor(d);
      if (day !== lastSentDay && t - lastSentAt > 110) {
        lastSentDay = day;
        lastSentAt = t;
        onDayRef.current(day);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const posOf = (id: BodyId) => {
    const o = BODIES[id].orbit!;
    return {
      x: CX + o.r * Math.cos(o.start),
      y: CY + o.r * Math.sin(o.start),
    };
  };

  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 1600 1000"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="Модель Солнечной системы"
    >
      <defs>
        {/* Солнце */}
        <radialGradient id="sunCore">
          <stop offset="0%" stopColor="#fff7d6" />
          <stop offset="45%" stopColor="#ffd166" />
          <stop offset="100%" stopColor="#f28c1b" />
        </radialGradient>
        <radialGradient id="sunGlow">
          <stop offset="0%" stopColor="#ffcf5e" stopOpacity="0.55" />
          <stop offset="45%" stopColor="#ff9d3d" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#ff9d3d" stopOpacity="0" />
        </radialGradient>
        <filter id="bodyGlow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* градиенты планет */}
        {PLANETS.map((id) => {
          const b = BODIES[id];
          return b.banded ? (
            <linearGradient key={id} id={`grad-${id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={b.bandStops![0]} />
              <stop offset="38%" stopColor={b.bandStops![1]} />
              <stop offset="68%" stopColor={b.bandStops![2]} />
              <stop offset="100%" stopColor={b.bandStops![3]} />
            </linearGradient>
          ) : (
            <radialGradient key={id} id={`grad-${id}`} cx="0.35" cy="0.3" r="0.85">
              <stop offset="0%" stopColor={b.light} />
              <stop offset="52%" stopColor={b.color} />
              <stop offset="100%" stopColor={b.deep} />
            </radialGradient>
          );
        })}
      </defs>

      {/* клик по пустоте снимает выделение */}
      <rect x="0" y="0" width="1600" height="1000" fill="transparent" onClick={() => onSelect(null)} />

      {/* орбиты */}
      {PLANETS.map((id) => {
        const b = BODIES[id];
        const hot = hovered === id || selected === id;
        return (
          <circle
            key={`orbit-${id}`}
            className={`orbit-line${hot ? " hot" : ""}`}
            cx={CX}
            cy={CY}
            r={b.orbit!.r}
            stroke={hot ? b.color : undefined}
            style={{ opacity: showOrbits ? 1 : 0 }}
          />
        );
      })}

      {/* пояс астероидов */}
      <g style={{ opacity: showOrbits ? 1 : 0.45, transition: "opacity .3s" }}>
        {BELT.map((ring, i) => (
          <g key={i} ref={(el) => { beltEls.current[i] = el; }}>
            {ring.dots.map((dot, j) => (
              <circle key={j} cx={dot.x} cy={dot.y} r={dot.s} fill="#a5988a" fillOpacity={dot.o} />
            ))}
          </g>
        ))}
      </g>

      {/* Солнце */}
      <g
        className="cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          onSelect("sun");
        }}
        onMouseEnter={() => onHover("sun")}
        onMouseLeave={() => onHover(null)}
      >
        <circle className="sun-corona" cx={CX} cy={CY} r={86} fill="url(#sunGlow)" />
        <circle className="sun-spin" cx={CX} cy={CY} r={52} fill="none" stroke="#ffd98a" strokeOpacity={0.3} strokeWidth={1.6} strokeDasharray="1.5 12" strokeLinecap="round" />
        {selected === "sun" && (
          <circle className="halo-ring" cx={CX} cy={CY} r={46} stroke="#ffd166" strokeWidth={2.5} />
        )}
        <circle cx={CX} cy={CY} r={34} fill="url(#sunCore)" filter={hovered === "sun" ? "url(#bodyGlow)" : undefined} />
        <text className="body-label" x={CX} y={CY + 62} textAnchor="middle" style={{ opacity: showLabels || hovered === "sun" || selected === "sun" ? 1 : 0 }}>
          Солнце
        </text>
      </g>

      {/* планеты */}
      {PLANETS.map((id) => {
        const b = BODIES[id];
        const p = posOf(id);
        const isSel = selected === id;
        const isHot = hovered === id;
        return (
          <g
            key={id}
            ref={(el) => { planetEls.current[id] = el; }}
            transform={`translate(${p.x.toFixed(2)} ${p.y.toFixed(2)})`}
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(id);
            }}
            onMouseEnter={() => onHover(id)}
            onMouseLeave={() => onHover(null)}
          >
            <PlanetVisual body={b} hovered={isHot} selected={isSel} />
            {b.hasMoon && (
              <>
                <circle r={16} fill="none" stroke="#7d99bd" strokeOpacity={0.28} strokeDasharray="2 3" />
                <g ref={moonEl}>
                  <circle r={2.6} fill="#cfd6dd" />
                </g>
              </>
            )}
            {/* невидимая зона клика */}
            <circle r={Math.max(b.vr + 12, 20)} fill="transparent" />
            <text
              className="body-label"
              textAnchor="middle"
              y={-(b.vr + (b.hasRings ? 24 : 16))}
              style={{ opacity: showLabels || isHot || isSel ? 1 : 0 }}
            >
              {b.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
