import { BODIES, ORDER, type BodyId } from "../data/solarSystem";

interface PanelProps {
  bodyId: BodyId | null;
  onClose: () => void;
  onSelect: (id: BodyId) => void;
}

export function InfoPanel({ bodyId, onClose, onSelect }: PanelProps) {
  const open = bodyId !== null;
  const body = bodyId ? BODIES[bodyId] : null;
  const idx = bodyId ? ORDER.indexOf(bodyId) : -1;
  const prev = idx >= 0 ? BODIES[ORDER[(idx + ORDER.length - 1) % ORDER.length]] : null;
  const next = idx >= 0 ? BODIES[ORDER[(idx + 1) % ORDER.length]] : null;

  return (
    <aside
      className={`fixed z-40 transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]
        inset-x-0 bottom-0 max-h-[80vh] rounded-t-[26px] border-t border-white/10
        md:inset-auto md:right-0 md:top-0 md:h-full md:max-h-none md:w-[400px] md:rounded-none md:border-l md:border-t-0
        ${open ? "translate-y-0 md:translate-x-0" : "translate-y-full md:translate-y-0 md:translate-x-full"}`}
      style={{ background: "linear-gradient(160deg, rgba(13,20,38,0.97), rgba(7,11,22,0.97))" }}
      role="dialog"
      aria-label="Данные о небесном теле"
      aria-hidden={!open}
    >
      <div className="panel-scroll h-full overflow-y-auto overscroll-contain p-6 md:p-8">
        {body && (
          <div key={body.id}>
            {/* заголовок */}
            <div className="flex items-start justify-between">
              <div className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-solar-400">
                {body.type}
              </div>
              <button
                onClick={onClose}
                aria-label="Закрыть панель"
                className="-mr-1 -mt-1 grid h-9 w-9 place-items-center rounded-full border border-white/10 text-ink-400 transition-all hover:rotate-90 hover:border-white/30 hover:text-ink-100"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                  <path d="M5 5l14 14M19 5L5 19" />
                </svg>
              </button>
            </div>

            {/* диск планеты */}
            <div className="rise-in mt-4 flex items-center gap-6">
              <div className="relative h-28 w-28 shrink-0" style={{ animationDelay: "0.05s" }}>
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `radial-gradient(circle at 32% 28%, ${body.light}, ${body.color} 55%, ${body.deep})`,
                    boxShadow: `0 0 56px ${body.color}66, inset -10px -12px 26px rgba(0,0,0,0.5)`,
                  }}
                />
                {body.hasRings && (
                  <div
                    className="absolute left-1/2 top-1/2 h-[36%] w-[196%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border-[5px]"
                    style={{ borderColor: "#cbb07a99", transform: "translate(-50%,-50%) rotate(-18deg)" }}
                  />
                )}
              </div>
              <div className="min-w-0">
                <h2 className="font-display text-3xl font-bold leading-tight text-ink-100">
                  {body.name}
                </h2>
                <p className="mt-1.5 text-sm font-semibold text-ink-400">{body.tagline}</p>
              </div>
            </div>

            {/* факт */}
            <div
              className="rise-in mt-6 rounded-r-xl border-l-2 bg-white/[0.045] px-4 py-3.5"
              style={{ borderColor: body.color, animationDelay: "0.12s" }}
            >
              <div className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-ink-400">
                Знаете ли вы?
              </div>
              <p className="mt-1.5 text-[13.5px] font-medium leading-relaxed text-ink-100">
                {body.fact}
              </p>
            </div>

            {/* характеристики */}
            <div className="rise-in mt-6" style={{ animationDelay: "0.18s" }}>
              <h3 className="text-[10px] font-extrabold uppercase tracking-[0.28em] text-ink-400">
                Характеристики
              </h3>
              <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-4">
                {body.stats.map((s) => (
                  <div key={s.label}>
                    <dt className="text-[10.5px] font-bold uppercase tracking-[0.1em] text-ink-400/80">
                      {s.label}
                    </dt>
                    <dd className="mt-0.5 text-[14.5px] font-extrabold leading-snug text-ink-100 tabular-nums">
                      {s.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* сравнение */}
            <div className="rise-in mt-7" style={{ animationDelay: "0.26s" }}>
              <h3 className="text-[10px] font-extrabold uppercase tracking-[0.28em] text-ink-400">
                Сравнение с другими
              </h3>
              <div className="mt-3 space-y-4">
                {body.bars.map((bar, i) => (
                  <div key={bar.label}>
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-400">
                        {bar.label}
                      </span>
                      <span className="text-[12.5px] font-extrabold text-ink-100 tabular-nums">
                        {bar.note}
                      </span>
                    </div>
                    <div className="mt-1.5 h-[7px] overflow-hidden rounded-full bg-white/[0.07]">
                      <div
                        className="bar-grow h-full rounded-full"
                        style={{
                          width: `${Math.min(100, bar.pct)}%`,
                          background: `linear-gradient(90deg, ${bar.color}88, ${bar.color})`,
                          boxShadow: `0 0 10px ${bar.color}55`,
                          animationDelay: `${0.3 + i * 0.1}s`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* навигация */}
            {prev && next && (
              <div className="rise-in mt-8 flex gap-2.5 pb-2" style={{ animationDelay: "0.34s" }}>
                <button
                  onClick={() => onSelect(prev.id)}
                  className="group flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-[12.5px] font-bold text-ink-400 transition-all hover:border-white/25 hover:bg-white/[0.08] hover:text-ink-100"
                >
                  <svg className="transition-transform group-hover:-translate-x-0.5" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5M11 6l-6 6 6 6" />
                  </svg>
                  {prev.name}
                </button>
                <button
                  onClick={() => onSelect(next.id)}
                  className="group flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-[12.5px] font-bold text-ink-400 transition-all hover:border-white/25 hover:bg-white/[0.08] hover:text-ink-100"
                >
                  {next.name}
                  <svg className="transition-transform group-hover:translate-x-0.5" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
