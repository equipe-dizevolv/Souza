import { HelpCircle } from 'lucide-react';
import { Button } from '../ui/button';

interface OnboardingButtonProps {
  onClick: () => void;
}

export function OnboardingButton({ onClick }: OnboardingButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className="w-full justify-start"
    >
      <HelpCircle className="mr-2 h-4 w-4" />
      Tutorial
    </Button>
  );
}
