import type { ReactNode } from "react";

interface DockProps {
  playing: boolean;
  onTogglePlay: () => void;
  speed: number;
  onSpeedChange: (v: number) => void;
  days: number;
  showOrbits: boolean;
  onToggleOrbits: () => void;
  showLabels: boolean;
  onToggleLabels: () => void;
}

const PRESETS = [
  { label: "Сутки", v: 1 },
  { label: "Неделя", v: 7 },
  { label: "Месяц", v: 30 },
  { label: "Год", v: 365 },
];

/** слайдер 0..100 <-> скорость 0,25..720 сут/с (логарифмическая) */
const toSlider = (speed: number) =>
  Math.round((100 * Math.log(speed / 0.25)) / Math.log(2880));
const fromSlider = (v: number) => 0.25 * Math.pow(2880, v / 100);

const fmt = (n: number) => n.toLocaleString("ru-RU");

function Toggle({
  on,
  onClick,
  children,
}: {
  on: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-ink-400 transition-colors hover:border-white/25 hover:text-ink-100"
      aria-pressed={on}
    >
      <span
        className={`relative h-[16px] w-[30px] rounded-full transition-colors duration-300 ${
          on ? "bg-solar-400/90" : "bg-white/15"
        }`}
      >
        <span
          className={`absolute top-[2px] h-[12px] w-[12px] rounded-full bg-[#0a1120] shadow transition-all duration-300 ${
            on ? "left-[16px] bg-space-900" : "left-[2px] bg-ink-400"
          }`}
        />
      </span>
      {children}
    </button>
  );
}

export function ControlDock({
  playing,
  onTogglePlay,
  speed,
  onSpeedChange,
  days,
  showOrbits,
  onToggleOrbits,
  showLabels,
  onToggleLabels,
}: DockProps) {
  const years = Math.floor(days / 365.25);
  const rem = Math.floor(days - years * 365.25);
  const elapsed = years > 0 ? `${fmt(years)} г ${rem} сут` : `${fmt(days)} сут`;
  const speedLabel =
    speed < 10
      ? speed.toFixed(1).replace(".", ",")
      : fmt(Math.round(speed));

  return (
    <div className="fixed bottom-4 left-1/2 z-30 w-[min(96vw,980px)] -translate-x-1/2 md:bottom-6">
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 rounded-[22px] border border-white/10 bg-[#0a1120]/85 px-5 py-3.5 shadow-[0_18px_60px_-12px_rgba(0,0,0,0.8)] backdrop-blur-md">
        {/* play / pause */}
        <button
          onClick={onTogglePlay}
          aria-label={playing ? "Пауза" : "Воспроизвести"}
          className="group relative grid h-12 w-12 shrink-0 place-items-center rounded-full bg-solar-400 text-space-900 shadow-[0_0_24px_rgba(245,185,66,0.45)] transition-transform duration-200 hover:scale-105 active:scale-95"
        >
          <span className="absolute inset-0 rounded-full border border-solar-300/60 opacity-0 transition-all duration-300 group-hover:scale-110 group-hover:opacity-100" />
          {playing ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4.5" height="16" rx="1.2" />
              <rect x="13.5" y="4" width="4.5" height="16" rx="1.2" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="translate-x-[1.5px]">
              <path d="M7 4.8c0-1.2 1.3-1.9 2.3-1.3l12 7.2c1 .6 1 2 0 2.6l-12 7.2c-1 .6-2.3-.1-2.3-1.3V4.8z" />
            </svg>
          )}
        </button>

        {/* скорость */}
        <div className="flex min-w-[240px] flex-1 flex-col gap-1.5 md:max-w-[360px]">
          <div className="flex items-baseline justify-between text-[11px] font-bold uppercase tracking-[0.16em] text-ink-400">
            <span>Скорость времени</span>
            <span className="text-solar-300">
              {speedLabel} сут/с
            </span>
          </div>
          <input
            type="range"
            className="speed-slider w-full"
            min={0}
            max={100}
            step={1}
            value={toSlider(speed)}
            style={{ ["--fill" as string]: `${toSlider(speed)}%` }}
            onChange={(e) => onSpeedChange(fromSlider(Number(e.target.value)))}
            aria-label="Скорость симуляции"
          />
          <div className="flex gap-1.5">
            {PRESETS.map((p) => {
              const active = Math.abs(speed - p.v) < 0.6;
              return (
                <button
                  key={p.label}
                  onClick={() => onSpeedChange(p.v)}
                  className={`flex-1 rounded-lg border px-2 py-1 text-[11px] font-bold transition-all duration-200 ${
                    active
                      ? "border-solar-400/70 bg-solar-400/15 text-solar-300"
                      : "border-white/10 bg-white/[0.03] text-ink-400 hover:border-white/25 hover:text-ink-100"
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="hidden h-12 w-px bg-white/10 md:block" />

        {/* прошедшее время */}
        <div className="text-center md:text-left">
          <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink-400">
            Прошло в модели
          </div>
          <div className="font-display text-lg font-bold leading-tight text-ink-100 tabular-nums">
            {elapsed}
          </div>
          <div className="text-[11px] font-semibold text-ink-400 tabular-nums">
            всего {fmt(days)} земных суток
          </div>
        </div>

        <div className="hidden h-12 w-px bg-white/10 lg:block" />

        {/* переключатели */}
        <div className="hidden items-center gap-2 lg:flex">
          <Toggle on={showOrbits} onClick={onToggleOrbits}>
            Орбиты
          </Toggle>
          <Toggle on={showLabels} onClick={onToggleLabels}>
            Подписи
          </Toggle>
        </div>
      </div>
    </div>
  );
}
