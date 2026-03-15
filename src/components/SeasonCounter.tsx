interface Props {
  seasons: { spring: number; summer: number; autumn: number; winter: number };
}

const SEASON_CONFIG = [
  { key: "spring", icon: "🌸", label: "Springs left" },
  { key: "summer", icon: "☀️", label: "Summers left" },
  { key: "autumn", icon: "🍁", label: "Autumns left" },
  { key: "winter", icon: "❄️", label: "Winters left" },
] as const;

export default function SeasonCounter({ seasons }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {SEASON_CONFIG.map(({ key, icon, label }) => (
        <div
          key={key}
          className="bg-card-bg rounded-card p-4 shadow-card text-center"
        >
          <div className="text-[28px] mb-1">{icon}</div>
          <div className="font-serif text-2xl font-bold">{seasons[key]}</div>
          <div className="text-[11px] text-lc-text-light">{label}</div>
        </div>
      ))}
    </div>
  );
}
