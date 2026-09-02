import { useState, type ReactNode } from "react";
import { BODIES, ORDER, type BodyId } from "../data/solarSystem";
import { GravityLab } from "./GravityLab";

interface Props {
  bodyId: BodyId | null;
  onClose: () => void;
  onSelect: (id: BodyId) => void;
}

function ArrowIcon({ dir }: { dir: "l" | "r" }) {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ transform: dir === "l" ? "rotate(180deg)" : undefined }}
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function TabBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-[11px] font-extrabold uppercase tracking-[0.14em] transition-all duration-200 ${
        active
          ? "bg-white/[0.09] text-ink-100 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]"
          : "text-ink-400 hover:text-ink-200"
      }`}
    >
      {children}
    </button>
  );
}

export function InfoPanel({ bodyId, onClose, onSelect }: Props) {
  const [tab, setTab] = useState<"data" | "gravity">("data");
  const body = bodyId ? BODIES[bodyId] : null;
  const idx = bodyId ? ORDER.indexOf(bodyId) : -1;
  const prev = idx > 0 ? ORDER[idx - 1] : null;
  const next = idx >= 0 && idx < ORDER.length - 1 ? ORDER[idx + 1] : null;

  return (
    <aside
      className={`fixed z-40 flex w-[360px] max-w-[calc(100vw-24px)] flex-col overflow-hidden border border-white/10 bg-[#0a101f]/85 backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] max-md:inset-x-3 max-md:bottom-3 max-md:max-h-[58vh] max-md:rounded-2xl md:right-6 md:top-6 md:bottom-28 md:rounded-3xl ${
        body ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-5 opacity-0"
      }`}
      aria-hidden={!body}
    >
      {body && (
        <>
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-28"
            style={{
              background: `radial-gradient(60% 100% at 50% 0%, ${body.color}2e, transparent 70%)`,
            }}
          />

          {/* шапка */}
          <div className="relative flex items-start gap-4 px-5 pt-5">
            <div className="relative h-16 w-16 shrink-0">
              <div
                className="absolute inset-0 rounded-full"
                style={{ background: body.color, opacity: 0.28, filter: "blur(14px)" }}
              />
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: body.banded
                    ? `linear-gradient(180deg, ${body.bandStops?.join(",")})`
                    : `radial-gradient(circle at 32% 30%, ${body.light}, ${body.color} 58%, ${body.deep})`,
                  boxShadow: `inset -4px -5px 10px rgba(0,0,0,0.45), 0 0 0 1px ${body.color}44`,
                }}
              />
              {body.hasRings && (
                <div
                  className="absolute left-1/2 top-1/2 h-[22px] w-[92px] -translate-x-1/2 -translate-y-1/2 rotate-[-18deg] rounded-[50%]"
                  style={{
                    border: `3px solid ${body.color}bb`,
                    boxShadow: `0 0 0 2px ${body.color}22, inset 0 0 0 2px ${body.color}33`,
                  }}
                />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: body.color, boxShadow: `0 0 8px ${body.color}` }}
                />
                <span className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-ink-300">
                  {body.type}
                </span>
              </div>
              <h2 className="font-display mt-0.5 text-3xl font-extrabold leading-none text-ink-100">
                {body.name}
              </h2>
              <p className="mt-1 text-xs text-ink-400">{body.tagline}</p>
            </div>
            <button
              onClick={onClose}
              aria-label="Закрыть панель"
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.05] text-ink-300 transition-colors duration-200 hover:bg-white/[0.12] hover:text-ink-100"
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          {/* вкладки */}
          <div className="relative mx-5 mt-4 grid grid-cols-2 gap-1 rounded-xl bg-white/[0.04] p-1">
            <TabBtn active={tab === "data"} onClick={() => setTab("data")}>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
              >
                <path d="M4 7h16M4 12h16M4 17h10" />
              </svg>
              Данные
            </TabBtn>
            <TabBtn active={tab === "gravity"} onClick={() => setTab("gravity")}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3v12" />
                <path d="m7 10 5 5 5-5" />
                <path d="M5 21h14" />
              </svg>
              Гравитация
            </TabBtn>
          </div>

          {/* содержимое вкладки */}
          <div className="scroll-slim relative mt-4 flex-1 overflow-y-auto px-5 pb-2">
            {tab === "data" ? (
              <>
                <div className="grid grid-cols-2 gap-2">
                  {body.stats.map((s) => (
                    <div
                      key={s.label}
                      className="rounded-xl border border-white/[0.06] bg-white/[0.04] px-3 py-2 transition-colors duration-200 hover:border-white/[0.14] hover:bg-white/[0.07]"
                    >
                      <div className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-ink-400">
                        {s.label}
                      </div>
                      <div className="mt-0.5 text-[13px] font-bold text-ink-100">{s.value}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 space-y-3">
                  {body.bars.map((b) => (
                    <div key={b.label}>
                      <div className="mb-1 flex items-baseline justify-between">
                        <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-ink-300">
                          {b.label}
                        </span>
                        <span className="text-[11px] font-bold text-ink-200 tabular-nums">{b.note}</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
                        <div
                          className="bar-fill h-full rounded-full"
                          style={{
                            width: `${b.pct}%`,
                            background: `linear-gradient(90deg, ${b.color}88, ${b.color})`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <GravityLab body={body} />
            )}
          </div>

          {/* факт + навигация */}
          <div className="relative border-t border-white/[0.07] px-5 py-3.5">
            <div className="flex items-start gap-2.5">
              <svg
                className="mt-0.5 shrink-0"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill={body.color}
                aria-hidden="true"
              >
                <path d="M12 2l2.4 6.9L21 11l-6.6 2.1L12 20l-2.4-6.9L3 11l6.6-2.1L12 2z" />
              </svg>
              <p className="text-xs leading-relaxed text-ink-300">{body.fact}</p>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <button
                disabled={!prev}
                onClick={() => prev && onSelect(prev)}
                className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.1em] text-ink-200 transition-all duration-200 enabled:hover:bg-white/[0.12] enabled:hover:text-ink-100 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ArrowIcon dir="l" />
                {prev ? BODIES[prev].name : "—"}
              </button>
              <span className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-ink-400">
                {idx + 1} / {ORDER.length}
              </span>
              <button
                disabled={!next}
                onClick={() => next && onSelect(next)}
                className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.1em] text-ink-200 transition-all duration-200 enabled:hover:bg-white/[0.12] enabled:hover:text-ink-100 disabled:cursor-not-allowed disabled:opacity-30"
              >
                {next ? BODIES[next].name : "—"}
                <ArrowIcon dir="r" />
              </button>
            </div>
          </div>
        </>
      )}
    </aside>
  );
}
