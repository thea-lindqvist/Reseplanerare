import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  onClick: () => void;
}

export function BackButton({ onClick }: BackButtonProps) {
  return (
    <button
      onClick={onClick}
      className="p-2 -ml-2 rounded-full hover:bg-[var(--sand)] transition-colors duration-200"
      aria-label="Go back"
    >
      <ArrowLeft className="w-6 h-6 text-[var(--navy)]" />
    </button>
  );
}
