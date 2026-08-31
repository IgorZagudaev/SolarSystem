import { BODIES, ORDER, type BodyId } from "../data/solarSystem";

interface RailProps {
  selected: BodyId | null;
  hovered: BodyId | null;
  onSelect: (id: BodyId) => void;
  onHover: (id: BodyId | null) => void;
}

export function PlanetRail({ selected, hovered, onSelect, onHover }: RailProps) {
  return (
    <nav
      className="fixed left-5 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-1 xl:flex"
      aria-label="Выбор небесного тела"
    >
      <div className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.28em] text-ink-400/70">
        Объекты
      </div>
      {ORDER.map((id, idx) => {
        const b = BODIES[id];
        const active = selected === id;
        const hot = hovered === id;
        return (
          <button
            key={id}
            onClick={() => onSelect(id)}
            onMouseEnter={() => onHover(id)}
            onMouseLeave={() => onHover(null)}
            className={`group flex items-center gap-3 rounded-xl px-3 py-[7px] text-left transition-all duration-200 ${
              active
                ? "bg-white/[0.07] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14)]"
                : "hover:bg-white/[0.05]"
            }`}
          >
            <span className="relative grid w-5 place-items-center">
              <span
                className="rounded-full transition-transform duration-200 group-hover:scale-125"
                style={{
                  width: id === "sun" ? 13 : Math.max(6, b.vr * 0.62),
                  height: id === "sun" ? 13 : Math.max(6, b.vr * 0.62),
                  background: `radial-gradient(circle at 32% 30%, ${b.light}, ${b.color} 60%, ${b.deep})`,
                  boxShadow: active || hot ? `0 0 10px ${b.color}` : "none",
                }}
              />
            </span>
            <span
              className={`text-[13px] font-bold transition-colors duration-200 ${
                active ? "text-ink-100" : hot ? "text-ink-100" : "text-ink-400"
              }`}
            >
              {b.name}
            </span>
            <span className="ml-auto hidden pl-4 text-[10px] font-bold text-ink-400/50 tabular-nums min-[1400px]:block">
              {String(idx).padStart(2, "0")}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
