import { useState, useEffect } from 'react';

type UserRole = 'admin' | 'user' | 'consultant';

interface OnboardingState {
  shouldShow: boolean;
  isFirstLogin: boolean;
  hasCompleted: boolean;
  hasSkipped: boolean;
}

const ONBOARDING_SESSION_KEY = 'onboarding-completed';

// Helper para verificar se deve mostrar o onboarding
const checkShouldShow = () => {
  const completedInSession = sessionStorage.getItem(ONBOARDING_SESSION_KEY);
  return !completedInSession;
};

export function useOnboarding(userRole: UserRole = 'user') {
  const [state, setState] = useState<OnboardingState>(() => {
    const shouldShow = checkShouldShow();
    return {
      shouldShow,
      isFirstLogin: shouldShow,
      hasCompleted: !shouldShow,
      hasSkipped: false,
    };
  });

  useEffect(() => {
    // Re-verifica sempre que o componente monta ou userRole muda
    const shouldShow = checkShouldShow();
    setState({
      shouldShow,
      isFirstLogin: shouldShow,
      hasCompleted: !shouldShow,
      hasSkipped: false,
    });

    // Listener para re-verificar quando houver storage events
    const handleStorageChange = () => {
      const shouldShow = checkShouldShow();
      setState({
        shouldShow,
        isFirstLogin: shouldShow,
        hasCompleted: !shouldShow,
        hasSkipped: false,
      });
    };

    // Listener customizado para mudanças no onboarding
    window.addEventListener('onboarding-check', handleStorageChange);
    
    // Cleanup
    return () => {
      window.removeEventListener('onboarding-check', handleStorageChange);
    };
  }, [userRole]);

  const reset = () => {
    sessionStorage.removeItem(ONBOARDING_SESSION_KEY);
    setState({
      shouldShow: true,
      isFirstLogin: true,
      hasCompleted: false,
      hasSkipped: false,
    });
  };

  const complete = () => {
    // Salva no sessionStorage que já completou NESTA sessão
    sessionStorage.setItem(ONBOARDING_SESSION_KEY, 'true');
    setState((prev) => ({
      ...prev,
      shouldShow: false,
      hasCompleted: true,
    }));
  };

  const skip = () => {
    // Também salva no sessionStorage ao pular
    sessionStorage.setItem(ONBOARDING_SESSION_KEY, 'true');
    setState((prev) => ({
      ...prev,
      shouldShow: false,
      hasSkipped: true,
    }));
  };

  const restart = () => {
    sessionStorage.removeItem(ONBOARDING_SESSION_KEY);
    setState((prev) => ({
      ...prev,
      shouldShow: true,
    }));
  };

  return {
    ...state,
    reset,
    complete,
    skip,
    restart,
  };
}