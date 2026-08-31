export type BodyId =
  | "sun"
  | "mercury"
  | "venus"
  | "earth"
  | "mars"
  | "jupiter"
  | "saturn"
  | "uranus"
  | "neptune";

export interface CelestialBody {
  id: BodyId;
  name: string;
  type: string;
  tagline: string;
  /** базовый цвет */
  color: string;
  /** светлый блик для градиента */
  light: string;
  /** глубокая тень для градиента */
  deep: string;
  /** линейный градиент (для газовых гигантов) вместо радиального */
  banded?: boolean;
  bandStops?: [string, string, string, string];
  /** визуальный радиус на схеме, px */
  vr: number;
  orbit?: {
    /** радиус орбиты на схеме, px */
    r: number;
    /** орбитальный период в земных сутках */
    period: number;
    /** начальный угол, рад */
    start: number;
  };
  stats: { label: string; value: string }[];
  bars: { label: string; note: string; pct: number; color: string }[];
  fact: string;
  hasRings?: boolean;
  hasMoon?: boolean;
  atmosphere?: string;
}

const EARTH_D = 12756;
const MAX_AU = 30.05;
const MAX_PERIOD = 60190;
const MAX_D = 142984;

const sizeBar = (d: number, color: string) => ({
  label: "Диаметр",
  note: d >= EARTH_D ? `${(d / EARTH_D).toFixed(d / EARTH_D > 10 ? 0 : 1).replace(".", ",")} × Земли` : `${(d / EARTH_D).toFixed(2).replace(".", ",")} × Земли`,
  pct: Math.max(4, (d / MAX_D) * 100),
  color,
});
const distBar = (au: number, color: string) => ({
  label: "Дистанция",
  note: `${au.toFixed(2).replace(".", ",")} а.е. от Солнца`,
  pct: Math.max(3, (au / MAX_AU) * 100),
  color,
});
const periodBar = (p: number, color: string) => ({
  label: "Длина года",
  note: p >= 1000 ? `${(p / 365.25).toFixed(1).replace(".", ",")} земных лет` : `${p} земных суток`,
  pct: Math.max(3, (p / MAX_PERIOD) * 100),
  color,
});

export const BODIES: Record<BodyId, CelestialBody> = {
  sun: {
    id: "sun",
    name: "Солнце",
    type: "Жёлтый карлик · G2V",
    tagline: "Звезда, вокруг которой всё вращается",
    color: "#ffb84d",
    light: "#fff3c4",
    deep: "#e07a1f",
    vr: 34,
    stats: [
      { label: "Диаметр", value: "1 392 700 км" },
      { label: "Масса системы", value: "99,86 %" },
      { label: "Поверхность", value: "+5 500 °C" },
      { label: "Ядро", value: "+15 000 000 °C" },
      { label: "Возраст", value: "4,6 млрд лет" },
      { label: "Свет до Земли", value: "8 мин 20 с" },
    ],
    bars: [
      { label: "Диаметр", note: "109 × Земли", pct: 100, color: "#ffb84d" },
      { label: "Масса", note: "333 000 × Земли", pct: 100, color: "#ffb84d" },
      { label: "Температура поверхности", note: "+5 500 °C", pct: 74, color: "#ffb84d" },
    ],
    fact: "Внутри Солнца поместилось бы 1,3 миллиона планет размером с Землю — и ещё осталось бы место.",
  },
  mercury: {
    id: "mercury",
    name: "Меркурий",
    type: "Каменистая планета",
    tagline: "Ближайшая к Солнцу",
    color: "#a9937f",
    light: "#d9c7b2",
    deep: "#5d5044",
    vr: 5.5,
    orbit: { r: 64, period: 88, start: 0.9 },
    stats: [
      { label: "Диаметр", value: "4 879 км" },
      { label: "Расстояние", value: "57,9 млн км · 0,39 а.е." },
      { label: "Орбитальный период", value: "88 земных суток" },
      { label: "Длина суток", value: "59 земных суток" },
      { label: "Спутники", value: "0" },
      { label: "Температура", value: "−173…+427 °C" },
      { label: "Скорость по орбите", value: "47,4 км/с" },
    ],
    bars: [
      sizeBar(4879, "#a9937f"),
      distBar(0.39, "#a9937f"),
      periodBar(88, "#a9937f"),
    ],
    fact: "Солнечные сутки на Меркурии длятся 176 земных дней — вдвое дольше его года.",
  },
  venus: {
    id: "venus",
    name: "Венера",
    type: "Каменистая планета",
    tagline: "Самая горячая планета",
    color: "#e3b468",
    light: "#f7dfa8",
    deep: "#9c6a2c",
    vr: 8.5,
    orbit: { r: 92, period: 225, start: 2.7 },
    stats: [
      { label: "Диаметр", value: "12 104 км" },
      { label: "Расстояние", value: "108,2 млн км · 0,72 а.е." },
      { label: "Орбитальный период", value: "225 земных суток" },
      { label: "Длина суток", value: "243 земных суток" },
      { label: "Спутники", value: "0" },
      { label: "Температура", value: "+464 °C" },
      { label: "Скорость по орбите", value: "35,0 км/с" },
    ],
    bars: [
      sizeBar(12104, "#e3b468"),
      distBar(0.72, "#e3b468"),
      periodBar(225, "#e3b468"),
    ],
    fact: "Венера вращается в обратную сторону: Солнце там восходит на западе, а сутки длиннее года.",
  },
  earth: {
    id: "earth",
    name: "Земля",
    type: "Каменистая планета",
    tagline: "Наш дом",
    color: "#4f9df7",
    light: "#a8dcff",
    deep: "#123a75",
    atmosphere: "#7fc4ff",
    vr: 9,
    orbit: { r: 120, period: 365.25, start: 4.5 },
    hasMoon: true,
    stats: [
      { label: "Диаметр", value: "12 756 км" },
      { label: "Расстояние", value: "149,6 млн км · 1 а.е." },
      { label: "Орбитальный период", value: "365,25 суток" },
      { label: "Длина суток", value: "23 ч 56 мин" },
      { label: "Спутники", value: "1 — Луна" },
      { label: "Средняя температура", value: "+15 °C" },
      { label: "Скорость по орбите", value: "29,8 км/с" },
    ],
    bars: [
      sizeBar(12756, "#4f9df7"),
      distBar(1, "#4f9df7"),
      periodBar(365.25, "#4f9df7"),
    ],
    fact: "Единственное известное место во Вселенной, где есть жизнь. Пока — единственное.",
  },
  mars: {
    id: "mars",
    name: "Марс",
    type: "Каменистая планета",
    tagline: "Красная планета",
    color: "#e0684b",
    light: "#f5a98c",
    deep: "#8a2f1d",
    vr: 7,
    orbit: { r: 150, period: 687, start: 5.7 },
    stats: [
      { label: "Диаметр", value: "6 792 км" },
      { label: "Расстояние", value: "227,9 млн км · 1,52 а.е." },
      { label: "Орбитальный период", value: "687 земных суток" },
      { label: "Длина суток", value: "24 ч 37 мин" },
      { label: "Спутники", value: "2 — Фобос и Деймос" },
      { label: "Средняя температура", value: "−63 °C" },
      { label: "Скорость по орбите", value: "24,1 км/с" },
    ],
    bars: [
      sizeBar(6792, "#e0684b"),
      distBar(1.52, "#e0684b"),
      periodBar(687, "#e0684b"),
    ],
    fact: "Вулкан Олимп на Марсе — самая высокая гора Солнечной системы: 21 км, почти три Эвереста.",
  },
  jupiter: {
    id: "jupiter",
    name: "Юпитер",
    type: "Газовый гигант",
    tagline: "Самая большая планета",
    color: "#d9a066",
    light: "#f2d4ab",
    deep: "#8a5a2e",
    banded: true,
    bandStops: ["#e8c9a0", "#c08850", "#e3b586", "#a56f3e"],
    vr: 21,
    orbit: { r: 216, period: 4333, start: 1.6 },
    stats: [
      { label: "Диаметр", value: "142 984 км" },
      { label: "Расстояние", value: "778,6 млн км · 5,20 а.е." },
      { label: "Орбитальный период", value: "11,9 года · 4 333 сут" },
      { label: "Длина суток", value: "9 ч 56 мин" },
      { label: "Спутники", value: "95" },
      { label: "Температура облаков", value: "−108 °C" },
      { label: "Скорость по орбите", value: "13,1 км/с" },
    ],
    bars: [
      sizeBar(142984, "#d9a066"),
      distBar(5.2, "#d9a066"),
      periodBar(4333, "#d9a066"),
    ],
    fact: "Большое Красное Пятно — ураган размером с Землю, который бушует уже более 350 лет.",
  },
  saturn: {
    id: "saturn",
    name: "Сатурн",
    type: "Газовый гигант",
    tagline: "Властелин колец",
    color: "#e6c98a",
    light: "#f9e7bb",
    deep: "#97753c",
    banded: true,
    bandStops: ["#f3ddb0", "#d9b878", "#ead29c", "#c09a58"],
    vr: 18,
    orbit: { r: 278, period: 10759, start: 3.7 },
    hasRings: true,
    stats: [
      { label: "Диаметр", value: "120 536 км" },
      { label: "Расстояние", value: "1 433,5 млн км · 9,58 а.е." },
      { label: "Орбитальный период", value: "29,5 года · 10 759 сут" },
      { label: "Длина суток", value: "10 ч 42 мин" },
      { label: "Спутники", value: "146" },
      { label: "Температура облаков", value: "−139 °C" },
      { label: "Скорость по орбите", value: "9,7 км/с" },
    ],
    bars: [
      sizeBar(120536, "#e6c98a"),
      distBar(9.58, "#e6c98a"),
      periodBar(10759, "#e6c98a"),
    ],
    fact: "Сатурн менее плотен, чем вода: в достаточно большом океане он бы не утонул.",
  },
  uranus: {
    id: "uranus",
    name: "Уран",
    type: "Ледяной гигант",
    tagline: "Планета, лежащая на боку",
    color: "#7fd6d0",
    light: "#c8f2ee",
    deep: "#2b7d80",
    vr: 13,
    orbit: { r: 348, period: 30687, start: 0.2 },
    stats: [
      { label: "Диаметр", value: "51 118 км" },
      { label: "Расстояние", value: "2 872,5 млн км · 19,2 а.е." },
      { label: "Орбитальный период", value: "84 года · 30 687 сут" },
      { label: "Длина суток", value: "17 ч 14 мин" },
      { label: "Спутники", value: "28" },
      { label: "Температура облаков", value: "−197 °C" },
      { label: "Скорость по орбите", value: "6,8 км/с" },
    ],
    bars: [
      sizeBar(51118, "#7fd6d0"),
      distBar(19.2, "#7fd6d0"),
      periodBar(30687, "#7fd6d0"),
    ],
    fact: "Ось Урана наклонена на 98°: планета катится по орбите «на боку», и полюса по 42 года смотрят на Солнце.",
  },
  neptune: {
    id: "neptune",
    name: "Нептун",
    type: "Ледяной гигант",
    tagline: "Самая дальняя планета",
    color: "#5b7be6",
    light: "#a9bcff",
    deep: "#1d2f7e",
    vr: 12.5,
    orbit: { r: 414, period: 60190, start: 5.1 },
    stats: [
      { label: "Диаметр", value: "49 528 км" },
      { label: "Расстояние", value: "4 495,1 млн км · 30,1 а.е." },
      { label: "Орбитальный период", value: "164,8 года · 60 190 сут" },
      { label: "Длина суток", value: "16 ч 6 мин" },
      { label: "Спутники", value: "16" },
      { label: "Температура облаков", value: "−201 °C" },
      { label: "Скорость по орбите", value: "5,4 км/с" },
    ],
    bars: [
      sizeBar(49528, "#5b7be6"),
      distBar(30.05, "#5b7be6"),
      periodBar(60190, "#5b7be6"),
    ],
    fact: "На Нептуне дуют самые быстрые ветры в Солнечной системе — до 2 100 км/ч.",
  },
};

/** Порядок для навигации «предыдущая / следующая» */
export const ORDER: BodyId[] = [
  "sun",
  "mercury",
  "venus",
  "earth",
  "mars",
  "jupiter",
  "saturn",
  "uranus",
  "neptune",
];

export const PLANETS = ORDER.filter((id) => id !== "sun");
