import { Button } from './ui/button';
import { cn } from './ui/utils';

interface FABProps {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  className?: string;
}

/**
 * Floating Action Button (FAB)
 * Padrão Material Design: 56px (14/14), bottom=16px, right=16px
 * Usado em versões mobile para ações primárias
 */
export function FAB({ onClick, icon, label, className }: FABProps) {
  return (
    <Button
      onClick={onClick}
      className={cn(
        'fixed bottom-4 right-4 h-14 w-14 rounded-full shadow-lg z-10',
        'hover:shadow-xl transition-shadow',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
        className
      )}
      size="icon"
      aria-label={label}
    >
      {icon}
    </Button>
  );
}
