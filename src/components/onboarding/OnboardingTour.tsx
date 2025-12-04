import { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, Sparkles, LayoutDashboard, Zap, Settings } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { motion, AnimatePresence } from 'motion/react';

type UserRole = 'admin' | 'user' | 'consultant';

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  target?: string; // CSS selector do elemento a destacar
  position?: 'top' | 'bottom' | 'left' | 'right';
}

interface OnboardingTourProps {
  userRole: UserRole;
  onComplete: () => void;
}

const getStepsForRole = (role: UserRole): OnboardingStep[] => {
  const commonSteps: OnboardingStep[] = [
    {
      id: 1,
      title: 'Navegação básica da plataforma',
      description: 'Use a sidebar à esquerda para navegar entre os módulos. Clique nos itens para acessar diferentes funcionalidades.',
      icon: <LayoutDashboard className="h-5 w-5" />,
      target: '[data-tour="sidebar"]',
      position: 'right',
    },
    {
      id: 2,
      title: 'Escolha seu primeiro módulo de IA',
      description: 'Explore os módulos de Marketing, Vendas e Head Hunter. Cada um tem ferramentas de IA especializadas para você.',
      icon: <Zap className="h-5 w-5" />,
      target: '[data-tour="modules"]',
      position: 'right',
    },
    {
      id: 3,
      title: 'Configure suas preferências',
      description: 'Acesse seu perfil no canto superior direito para personalizar notificações, tema e outras configurações.',
      icon: <Settings className="h-5 w-5" />,
      target: '[data-tour="user-menu"]',
      position: 'bottom',
    },
  ];

  // Personalização por persona
  switch (role) {
    case 'admin':
      return [
        {
          id: 1,
          title: 'Bem-vindo, Administrador!',
          description: 'Como admin, você tem acesso total à plataforma. Use a sidebar para gerenciar usuários, módulos e configurações globais.',
          icon: <LayoutDashboard className="h-5 w-5" />,
          target: '[data-tour="sidebar"]',
          position: 'right',
        },
        {
          id: 2,
          title: 'Gerencie módulos de IA',
          description: 'Configure e monitore todos os módulos de IA. Você pode ativar/desativar recursos e visualizar métricas de uso.',
          icon: <Zap className="h-5 w-5" />,
          target: '[data-tour="modules"]',
          position: 'right',
        },
        {
          id: 3,
          title: 'Painel administrativo',
          description: 'Acesse relatórios completos, gerencie usuários e configure permissões através do seu painel admin.',
          icon: <Settings className="h-5 w-5" />,
          target: '[data-tour="user-menu"]',
          position: 'bottom',
        },
      ];
    
    case 'consultant':
      return [
        {
          id: 1,
          title: 'Bem-vindo, Consultor!',
          description: 'Navegue pela sidebar para acessar ferramentas especializadas de consultoria e IA para business planning.',
          icon: <LayoutDashboard className="h-5 w-5" />,
          target: '[data-tour="sidebar"]',
          position: 'right',
        },
        {
          id: 2,
          title: 'Chat de Consultoria com IA',
          description: 'Use o módulo de Consultoria Chat para gerar Business Plans completos conversando com a IA. É rápido e profissional!',
          icon: <Zap className="h-5 w-5" />,
          target: '[data-tour="modules"]',
          position: 'right',
        },
        {
          id: 3,
          title: 'Exporte seus planos em PDF',
          description: 'Todos os relatórios e Business Plans podem ser exportados em PDF profissional para entregar aos seus clientes.',
          icon: <Settings className="h-5 w-5" />,
          target: '[data-tour="user-menu"]',
          position: 'bottom',
        },
      ];
    
    default: // 'user'
      return commonSteps;
  }
};

export function OnboardingTour({ userRole, onComplete }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false); // Começa false
  const [isReady, setIsReady] = useState(false); // Novo estado para controlar quando está pronto
  const steps = getStepsForRole(userRole);
  const step = steps[currentStep];

  // Effect para garantir que os elementos DOM estão montados antes de mostrar
  useEffect(() => {
    const checkElementsReady = () => {
      // Verifica se todos os elementos target existem no DOM
      const allTargets = steps.map(s => s.target).filter(Boolean);
      const allElementsExist = allTargets.every(target => document.querySelector(target as string));
      
      if (allElementsExist) {
        setIsReady(true);
        // Pequeno delay para garantir render completo
        setTimeout(() => {
          setIsVisible(true);
        }, 100);
      } else {
        // Tenta novamente após um curto período
        setTimeout(checkElementsReady, 100);
      }
    };

    checkElementsReady();
  }, [steps]);

  useEffect(() => {
    // Adiciona spotlight ao elemento target
    if (step?.target && isReady) {
      const element = document.querySelector(step.target);
      if (element) {
        element.classList.add('onboarding-spotlight');
        
        // Scroll suave até o elemento
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    // Cleanup: remove spotlight de todos os elementos
    return () => {
      document.querySelectorAll('.onboarding-spotlight').forEach((el) => {
        el.classList.remove('onboarding-spotlight');
      });
    };
  }, [currentStep, step, isReady]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    setIsVisible(false);
    onComplete();
  };

  const handleComplete = () => {
    setIsVisible(false);
    onComplete();
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Overlay escuro */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        onClick={handleSkip}
      />

      {/* Tour popup no canto inferior direito */}
      <AnimatePresence>
        <motion.div
          initial={{ scale: 0, opacity: 0, y: 100 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0, opacity: 0, y: 100 }}
          transition={{ type: 'spring', duration: 0.6, bounce: 0.4 }}
          className="fixed bottom-8 right-8 z-50"
        >
          <Card className="relative w-[400px] border-2 border-blue-500 bg-white shadow-2xl dark:bg-neutral-900">
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 h-8 w-8"
              onClick={handleSkip}
            >
              <X className="h-4 w-4" />
            </Button>

            <CardContent className="p-6">
              {/* Progress bar */}
              <div className="mb-4 flex items-center gap-2">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1 flex-1 rounded-full transition-all ${
                      index <= currentStep
                        ? 'bg-blue-500'
                        : 'bg-neutral-200 dark:bg-neutral-700'
                    }`}
                  />
                ))}
              </div>

              {/* Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {/* Icon + Title */}
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                      {step.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                      {step.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                    {step.description}
                  </p>

                  {/* Step counter */}
                  <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-500">
                    <Sparkles className="h-3 w-3" />
                    Passo {currentStep + 1} de {steps.length}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2">
                    <Button variant="ghost" size="sm" onClick={handleSkip}>
                      Pular tour
                    </Button>

                    <div className="flex items-center gap-2">
                      {currentStep > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handlePrevious}
                        >
                          <ChevronLeft className="mr-1 h-4 w-4" />
                          Anterior
                        </Button>
                      )}
                      <Button size="sm" onClick={handleNext}>
                        {currentStep < steps.length - 1 ? (
                          <>
                            Próximo
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </>
                        ) : (
                          <>
                            Concluir
                            <Sparkles className="ml-1 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </>
  );
}