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
              ? 'w-8 bg-[var(--terracotta)]'
              : i < current
              ? 'w-1.5 bg-[var(--olive)]'
              : 'w-1.5 bg-[var(--sand)]'
          }`}
        />
      ))}
    </div>
  );
}
