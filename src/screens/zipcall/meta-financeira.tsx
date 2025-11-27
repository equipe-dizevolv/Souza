import { useState } from 'react';
import { ArrowLeft, TrendingUp, Lock, CheckCircle2, Target, Star, Zap } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';

interface TimelineStep {
  id: number;
  title: string;
  description: string;
  isUnlocked: boolean;
  isCompleted: boolean;
  reward?: string;
}

export function ZipCallMetaFinanceira() {
  const [currentProgress] = useState(15); // 15% da meta de 10k
  const [earnedAmount] = useState(1500);
  const goalAmount = 10000;

  const [timelineSteps] = useState<TimelineStep[]>([
    {
      id: 1,
      title: 'Semana 1: Falar com 20 pessoas',
      description: 'Apresente sua solução para pelo menos 20 contatos',
      isUnlocked: true,
      isCompleted: false,
      reward: '+R$ 500',
    },
    {
      id: 2,
      title: 'Semana 2: Enviar propostas',
      description: 'Envie 10 propostas personalizadas',
      isUnlocked: false,
      isCompleted: false,
      reward: '+R$ 1.000',
    },
    {
      id: 3,
      title: 'Semana 3: Fechar vendas',
      description: 'Complete suas primeiras 5 vendas',
      isUnlocked: false,
      isCompleted: false,
      reward: '+R$ 2.500',
    },
    {
      id: 4,
      title: 'Semana 4: Escalar resultados',
      description: 'Aumente seu volume e atinja a meta',
      isUnlocked: false,
      isCompleted: false,
      reward: '+R$ 6.000',
    },
  ]);

  const todayMission = 'Falar com 5 pessoas';
  const todayProgress = 2; // 2 de 5 pessoas

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-white to-blue-50">
      {/* CABEÇALHO */}
      <header className="flex items-center gap-4 border-b border-neutral-100 bg-white p-4">
        <button className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-neutral-50">
          <ArrowLeft className="h-5 w-5 text-neutral-700" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-neutral-900">Sua Jornada</h1>
          <p className="text-sm text-neutral-500">Meta de renda mensal</p>
        </div>
        <button className="flex h-10 items-center gap-1 rounded-full bg-amber-100 px-3">
          <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
          <span className="text-sm font-bold text-amber-700">125 XP</span>
        </button>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="flex-1 overflow-auto px-4 pb-32 pt-6">
        <div className="mx-auto max-w-2xl space-y-6">
          {/* META E PROGRESSO */}
          <div className="rounded-3xl border-2 border-blue-200 bg-gradient-to-br from-blue-500 to-indigo-600 p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-100">Sua Meta</p>
                <h2 className="text-3xl font-bold text-white">
                  R$ {goalAmount.toLocaleString('pt-BR')} / mês
                </h2>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <TrendingUp className="h-7 w-7 text-white" />
              </div>
            </div>

            {/* GRÁFICO DE ROSCA (CIRCULAR) */}
            <div className="mb-4 flex items-center justify-center">
              <div className="relative">
                {/* Círculo de fundo */}
                <svg className="h-36 w-36 -rotate-90 transform">
                  <circle
                    cx="72"
                    cy="72"
                    r="60"
                    stroke="rgba(255, 255, 255, 0.2)"
                    strokeWidth="12"
                    fill="none"
                  />
                  {/* Círculo de progresso */}
                  <circle
                    cx="72"
                    cy="72"
                    r="60"
                    stroke="white"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${currentProgress * 3.77} 377`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
                {/* Texto central */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-white">
                    {currentProgress}%
                  </span>
                  <span className="text-xs text-blue-100">concluído</span>
                </div>
              </div>
            </div>

            {/* Valor atual */}
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-100">Ganho até agora</span>
                <span className="text-2xl font-bold text-white">
                  R$ {earnedAmount.toLocaleString('pt-BR')}
                </span>
              </div>
              <Progress
                value={currentProgress}
                className="mt-3 h-2 bg-white/20"
              />
            </div>
          </div>

          {/* TIMELINE VERTICAL (ROTEIRO) */}
          <div className="space-y-1">
            <h3 className="mb-4 text-lg font-bold text-neutral-900">
              Seu Roteiro
            </h3>

            {timelineSteps.map((step, index) => (
              <div key={step.id} className="relative">
                {/* Linha conectora */}
                {index < timelineSteps.length - 1 && (
                  <div
                    className={`absolute left-[27px] top-[56px] h-full w-0.5 ${
                      step.isCompleted
                        ? 'bg-gradient-to-b from-green-500 to-neutral-200'
                        : step.isUnlocked
                          ? 'bg-gradient-to-b from-blue-500 to-neutral-200'
                          : 'bg-neutral-200'
                    }`}
                  />
                )}

                {/* Card do passo */}
                <div
                  className={`relative rounded-2xl border-2 p-5 transition-all ${
                    step.isCompleted
                      ? 'border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 shadow-sm'
                      : step.isUnlocked
                        ? 'border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg'
                        : 'border-neutral-200 bg-neutral-50 opacity-60'
                  }`}
                >
                  <div className="flex gap-4">
                    {/* Ícone */}
                    <div
                      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${
                        step.isCompleted
                          ? 'bg-green-500'
                          : step.isUnlocked
                            ? 'bg-blue-500'
                            : 'bg-neutral-300'
                      }`}
                    >
                      {step.isCompleted ? (
                        <CheckCircle2 className="h-7 w-7 text-white" />
                      ) : step.isUnlocked ? (
                        <Target className="h-7 w-7 text-white" />
                      ) : (
                        <Lock className="h-7 w-7 text-white" />
                      )}
                    </div>

                    {/* Conteúdo */}
                    <div className="flex-1">
                      <h4
                        className={`mb-1 text-base font-bold ${
                          step.isUnlocked
                            ? 'text-neutral-900'
                            : 'text-neutral-500'
                        }`}
                      >
                        {step.title}
                      </h4>
                      <p
                        className={`text-[15px] leading-relaxed ${
                          step.isUnlocked
                            ? 'text-neutral-600'
                            : 'text-neutral-400'
                        }`}
                      >
                        {step.description}
                      </p>
                      {step.reward && (
                        <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1">
                          <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                          <span className="text-xs font-bold text-amber-700">
                            {step.reward}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Badge de status */}
                  {step.isCompleted && (
                    <div className="absolute right-4 top-4 rounded-full bg-green-500 px-3 py-1 text-xs font-bold text-white">
                      Completo
                    </div>
                  )}
                  {step.isUnlocked && !step.isCompleted && (
                    <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-blue-500 px-3 py-1 text-xs font-bold text-white">
                      <Zap className="h-3 w-3" />
                      Ativo
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CARD DE MISSÃO DO DIA - FLUTUANTE */}
      <div className="fixed bottom-4 left-4 right-4 mx-auto max-w-2xl">
        <div className="rounded-2xl border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50 p-5 shadow-2xl">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-400">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-amber-700">
                Missão de Hoje
              </p>
              <h3 className="text-lg font-bold text-neutral-900">
                {todayMission}
              </h3>
            </div>
          </div>

          {/* Progresso da missão */}
          <div className="mb-3">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium text-neutral-600">
                {todayProgress} de 5 concluídas
              </span>
              <span className="font-bold text-amber-700">
                {(todayProgress / 5) * 100}%
              </span>
            </div>
            <Progress
              value={(todayProgress / 5) * 100}
              className="h-2 bg-amber-200"
            />
          </div>

          <Button className="h-[48px] w-full gap-2 rounded-xl bg-amber-500 text-[16px] font-bold hover:bg-amber-600">
            <Target className="h-5 w-5" />
            Continuar Missão
          </Button>
        </div>
      </div>
    </div>
  );
}
