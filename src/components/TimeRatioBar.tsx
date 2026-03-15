interface Props {
  ratio: number;
}

export default function TimeRatioBar({ ratio }: Props) {
  const percent = Math.round(ratio * 100);

  return (
    <div className="bg-card-bg rounded-card p-5 shadow-card">
      <div className="font-serif text-base font-semibold mb-3">
        Time Spent Together vs. Remaining
      </div>
      <div className="h-4 bg-empty rounded-lg overflow-hidden mb-2">
        <div
          className="h-full rounded-lg bg-gradient-to-r from-coral to-filled-alt transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-lc-text-light">
        <span>{percent}% of time together already passed</span>
        <span>{100 - percent}% remaining</span>
      </div>
    </div>
  );
}
