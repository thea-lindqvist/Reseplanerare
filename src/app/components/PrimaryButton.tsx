import { ReactNode } from 'react';

interface PrimaryButtonProps {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

export function PrimaryButton({ children, onClick, disabled }: PrimaryButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-4 px-6 rounded-full font-medium text-lg transition-all duration-300 ${
        disabled
          ? 'bg-[var(--sunny-yellow-light)] text-[var(--ocean-blue)]/40 cursor-not-allowed'
          : 'bg-[var(--coral)] text-white shadow-lg hover:shadow-xl hover:bg-[var(--coral-light)] active:scale-[0.98]'
      }`}
    >
      {children}
    </button>
  );
}
