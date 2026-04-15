interface ProgressDotsProps {
  total: number;
  current: number;
}

export function ProgressDots({ total, current }: ProgressDotsProps) {
  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            i === current
              ? 'w-8 bg-[var(--coral)]'
              : i < current
              ? 'w-1.5 bg-[var(--fresh-green)]'
              : 'w-1.5 bg-[var(--sunny-yellow)]'
          }`}
        />
      ))}
    </div>
  );
}
