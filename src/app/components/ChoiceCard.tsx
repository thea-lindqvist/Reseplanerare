import { ReactNode } from 'react';

interface ChoiceCardProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  selected?: boolean;
  onClick: () => void;
  delay?: number;
}

export function ChoiceCard({ icon, title, description, selected, onClick, delay = 0 }: ChoiceCardProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full p-5 rounded-2xl text-left transition-all duration-300 animate-fade-in ${
        selected
          ? 'bg-[var(--coral)] text-white shadow-lg scale-[1.02]'
          : 'bg-white text-[var(--ocean-blue)] shadow-sm hover:shadow-md hover:scale-[1.01]'
      }`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start gap-4">
        {icon && (
          <div className={`text-2xl mt-0.5 ${selected ? 'opacity-100' : 'opacity-60'}`}>
            {icon}
          </div>
        )}
        <div className="flex-1">
          <div className={`font-medium mb-0.5 ${selected ? 'text-white' : 'text-[var(--ocean-blue)]'}`}>
            {title}
          </div>
          {description && (
            <div className={`text-sm ${selected ? 'text-white/90' : 'text-[var(--ocean-blue)]/60'}`}>
              {description}
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
