import { useCallback, useEffect, useState } from "react";
import { Starfield } from "./components/Starfield";
import { Orrery } from "./components/Orrery";
import { ControlDock } from "./components/ControlDock";
import { InfoPanel } from "./components/InfoPanel";
import { PlanetRail } from "./components/PlanetRail";
import { ORDER, type BodyId } from "./data/solarSystem";

export default function App() {
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(30);
  const [selected, setSelected] = useState<BodyId | null>(null);
  const [hovered, setHovered] = useState<BodyId | null>(null);
  const [showOrbits, setShowOrbits] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [days, setDays] = useState(0);

  const togglePlay = useCallback(() => setPlaying((p) => !p), []);

  const stepSelection = useCallback(
    (dir: 1 | -1) => {
      setSelected((cur) => {
        if (!cur) return dir === 1 ? "mercury" : "neptune";
        const i = ORDER.indexOf(cur);
        return ORDER[(i + dir + ORDER.length) % ORDER.length];
      });
    },
    []
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        togglePlay();
      } else if (e.code === "Escape") {
        setSelected(null);
      } else if (e.code === "ArrowRight") {
        stepSelection(1);
      } else if (e.code === "ArrowLeft") {
        stepSelection(-1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [togglePlay, stepSelection]);

  return (
    <main className="relative h-full w-full overflow-hidden bg-space-950 text-ink-100">
      <Starfield />
      <Orrery
        playing={playing}
        speed={speed}
        selected={selected}
        onSelect={setSelected}
        hovered={hovered}
        onHover={setHovered}
        showOrbits={showOrbits}
        showLabels={showLabels}
        onDayChange={setDays}
      />

      {/* заголовок */}
      <header className="pointer-events-none absolute left-5 top-5 z-20 md:left-7 md:top-7 xl:left-24">
        <div className="flex items-center gap-2.5">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-solar-400">
            <circle cx="12" cy="12" r="3.4" fill="currentColor" />
            <ellipse cx="12" cy="12" rx="10.5" ry="4.4" stroke="currentColor" strokeWidth="1.4" transform="rotate(-18 12 12)" opacity="0.75" />
          </svg>
          <span className="text-[10.5px] font-extrabold uppercase tracking-[0.34em] text-solar-400">
            Интерактивная модель
          </span>
        </div>
        <h1 className="mt-2 font-display text-[26px] font-bold leading-none text-ink-100 md:text-4xl">
          Солнечная
          <span className="block text-solar-400">система</span>
        </h1>
        <p className="mt-2.5 max-w-[290px] text-[12px] font-semibold leading-relaxed text-ink-400">
          Все восемь планет в движении. Расстояния и размеры сжаты — иначе их было бы не разглядеть.
        </p>
      </header>

      {/* подсказка */}
      <div className="pointer-events-none absolute right-5 top-6 z-20 hidden md:block">
        <div className="flex items-center gap-2.5 rounded-full border border-white/10 bg-[#0a1120]/70 px-4 py-2 backdrop-blur-sm">
          <span className="pulse-dot h-2 w-2 rounded-full bg-solar-400" />
          <span className="text-[12px] font-bold text-ink-100">
            Нажмите на планету, чтобы узнать больше
          </span>
          <span className="text-[11px] font-semibold text-ink-400">· пробел — пауза</span>
        </div>
      </div>

      <PlanetRail
        selected={selected}
        hovered={hovered}
        onSelect={(id) => setSelected(id)}
        onHover={setHovered}
      />

      <ControlDock
        playing={playing}
        onTogglePlay={togglePlay}
        speed={speed}
        onSpeedChange={setSpeed}
        days={days}
        showOrbits={showOrbits}
        onToggleOrbits={() => setShowOrbits((v) => !v)}
        showLabels={showLabels}
        onToggleLabels={() => setShowLabels((v) => !v)}
      />

      <InfoPanel bodyId={selected} onClose={() => setSelected(null)} onSelect={setSelected} />

      {/* подпись */}
      <div className="pointer-events-none absolute bottom-5 left-6 z-10 hidden lg:block">
        <p className="text-[10.5px] font-semibold tracking-wide text-ink-400/60">
          Данные: NASA · периоды обращения — относительно Земли
        </p>
      </div>
    </main>
  );
}
