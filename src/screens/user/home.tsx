import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  Lightbulb,
  FileText,
  ShoppingCart,
  UserSearch,
  Users,
  BarChart3,
  History,
  Send,
  Sparkles,
  MessageSquare,
  TrendingUp,
  Download,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent } from '../../components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { toast } from 'sonner@2.0.3';
import { useIsMobile } from '../../components/ui/use-mobile';

interface QuickAction {
  path: string;
  title: string;
  description: string;
  icon: any;
  count?: number;
  color: string;
}

const quickActions: QuickAction[] = [
  {
    path: '/hub',
    title: 'Hub de Módulos',
    description: 'Central de acesso a todos os módulos',
    icon: Package,
    color: 'text-blue-600 dark:text-blue-400',
  },
  {
    path: '/marketing/briefing',
    title: 'Marketing IA - Briefing',
    description: 'Entrada de objetivos, público e canais',
    icon: Lightbulb,
    count: 5,
    color: 'text-yellow-600 dark:text-yellow-400',
  },
  {
    path: '/marketing/editor',
    title: 'Marketing IA - Editor',
    description: 'Revisar e editar sugestões geradas',
    icon: FileText,
    count: 3,
    color: 'text-purple-600 dark:text-purple-400',
  },
  {
    path: '/sales/funnel',
    title: 'Vendas Online IA',
    description: 'Gestão de cards por etapa do funil',
    icon: ShoppingCart,
    count: 12,
    color: 'text-green-600 dark:text-green-400',
  },
  {
    path: '/headhunter/search',
    title: 'Red Hunter - Busca',
    description: 'Filtros e execução de pesquisa',
    icon: UserSearch,
    color: 'text-indigo-600 dark:text-indigo-400',
  },
  {
    path: '/headhunter/screening',
    title: 'Red Hunter - Triagem',
    description: 'Qualificar/descartar/favoritar perfis',
    icon: Users,
    count: 8,
    color: 'text-cyan-600 dark:text-cyan-400',
  },
  {
    path: '/headhunter/export',
    title: 'Red Hunter - Exportar',
    description: 'Exportar e enviar listas de candidatos',
    icon: Download,
    color: 'text-pink-600 dark:text-pink-400',
  },
  {
    path: '/whatsapp/playbooks',
    title: 'WhatsApp - Playbooks',
    description: 'Guias de automação para WhatsApp',
    icon: MessageSquare,
    color: 'text-teal-600 dark:text-teal-400',
  },
  {
    path: '/consultancy/chat',
    title: 'Consultoria - Chat',
    description: 'Chat com agente consultor',
    icon: Sparkles,
    color: 'text-violet-600 dark:text-violet-400',
  },
  {
    path: '/income/wizard',
    title: 'Renda Automática',
    description: 'Assistente para gerar renda online',
    icon: TrendingUp,
    color: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    path: '/reports',
    title: 'Relatórios',
    description: 'Visão individual de uso e impacto',
    icon: BarChart3,
    color: 'text-orange-600 dark:text-orange-400',
  },
  {
    path: '/history',
    title: 'Histórico',
    description: 'Auditoria pessoal por ação e módulo',
    icon: History,
    color: 'text-neutral-600 dark:text-neutral-400',
  },
];

export function UserHome() {
  const navigate = useNavigate();
  const [searchCommand, setSearchCommand] = useState('');
  const [showDisambiguationDialog, setShowDisambiguationDialog] = useState(false);
  const [suggestedModules, setSuggestedModules] = useState<QuickAction[]>([]);
  const isMobile = useIsMobile();

  const classifyIntent = (text: string): { destination: string | null; ambiguous: boolean; suggestions: QuickAction[] } => {
    const lowerText = text.toLowerCase();

    // Marketing keywords
    if (
      lowerText.includes('marketing') ||
      lowerText.includes('campanha') ||
      lowerText.includes('conteúdo') ||
      lowerText.includes('público')
    ) {
      if (
        lowerText.includes('editar') ||
        lowerText.includes('revisar') ||
        lowerText.includes('editor')
      ) {
        return { destination: '/marketing/editor', ambiguous: false, suggestions: [] };
      }
      if (
        lowerText.includes('briefing') ||
        lowerText.includes('criar') ||
        lowerText.includes('novo')
      ) {
        return { destination: '/marketing/briefing', ambiguous: false, suggestions: [] };
      }
      // Ambiguous - both marketing modules
      return {
        destination: null,
        ambiguous: true,
        suggestions: quickActions.filter(a => a.path === '/marketing/briefing' || a.path === '/marketing/editor'),
      };
    }

    // Sales keywords
    if (
      lowerText.includes('vendas') ||
      lowerText.includes('venda') ||
      lowerText.includes('funil') ||
      lowerText.includes('lead') ||
      lowerText.includes('prospect')
    ) {
      return { destination: '/sales/funnel', ambiguous: false, suggestions: [] };
    }

    // Head Hunter / Red Hunter keywords
    if (
      lowerText.includes('candidato') ||
      lowerText.includes('recrutamento') ||
      lowerText.includes('perfil') ||
      lowerText.includes('vaga') ||
      lowerText.includes('hunter') ||
      lowerText.includes('rh')
    ) {
      if (
        lowerText.includes('buscar') ||
        lowerText.includes('procurar') ||
        lowerText.includes('pesquisar')
      ) {
        return { destination: '/headhunter/search', ambiguous: false, suggestions: [] };
      }
      if (
        lowerText.includes('qualificar') ||
        lowerText.includes('triar') ||
        lowerText.includes('avaliar')
      ) {
        return { destination: '/headhunter/screening', ambiguous: false, suggestions: [] };
      }
      if (
        lowerText.includes('exportar') ||
        lowerText.includes('enviar')
      ) {
        return { destination: '/headhunter/export', ambiguous: false, suggestions: [] };
      }
      // Ambiguous - all headhunter modules
      return {
        destination: null,
        ambiguous: true,
        suggestions: quickActions.filter(a => a.path.startsWith('/headhunter')),
      };
    }

    // WhatsApp keywords
    if (
      lowerText.includes('whatsapp') ||
      lowerText.includes('automação') ||
      lowerText.includes('playbook')
    ) {
      return { destination: '/whatsapp/playbooks', ambiguous: false, suggestions: [] };
    }

    // Consultancy keywords
    if (
      lowerText.includes('consultoria') ||
      lowerText.includes('consultor') ||
      lowerText.includes('chat') ||
      lowerText.includes('plano de ação')
    ) {
      return { destination: '/consultancy/chat', ambiguous: false, suggestions: [] };
    }

    // Income keywords
    if (
      lowerText.includes('renda') ||
      lowerText.includes('ganhar') ||
      lowerText.includes('dinheiro') ||
      lowerText.includes('90 dias')
    ) {
      return { destination: '/income/wizard', ambiguous: false, suggestions: [] };
    }

    // Reports keywords
    if (
      lowerText.includes('relatório') ||
      lowerText.includes('análise') ||
      lowerText.includes('dashboard') ||
      lowerText.includes('métricas')
    ) {
      return { destination: '/reports', ambiguous: false, suggestions: [] };
    }

    // History keywords
    if (
      lowerText.includes('histórico') ||
      lowerText.includes('auditoria') ||
      lowerText.includes('log')
    ) {
      return { destination: '/history', ambiguous: false, suggestions: [] };
    }

    // Hub keywords
    if (
      lowerText.includes('hub') ||
      lowerText.includes('módulos') ||
      lowerText.includes('início')
    ) {
      return { destination: '/hub', ambiguous: false, suggestions: [] };
    }

    // Default - show all modules if no clear intent
    return {
      destination: null,
      ambiguous: true,
      suggestions: quickActions.slice(0, 6), // Show first 6 as suggestions
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchCommand.trim()) {
      toast.error('Digite um comando ou descrição', {
        position: 'top-center',
        duration: 4000,
      });
      return;
    }

    const { destination, ambiguous, suggestions } = classifyIntent(searchCommand);

    // Telemetry event
    console.log('hero_search_submitted', {
      texto: searchCommand,
      intenção: destination || 'ambíguo',
      destino: destination,
    });

    if (destination) {
      toast.success('Navegando para ' + quickActions.find(a => a.path === destination)?.title, {
        position: 'top-center',
        duration: 3000,
      });
      setTimeout(() => {
        navigate(destination);
      }, 500);
    } else if (ambiguous && suggestions.length > 0) {
      setSuggestedModules(suggestions);
      setShowDisambiguationDialog(true);
    } else {
      toast.error('Não foi possível identificar o módulo. Tente ser mais específico.', {
        position: 'top-center',
        duration: 4000,
      });
    }
  };

  const handleQuickActionClick = (actionPath: string, actionTitle: string) => {
    // Telemetry event
    console.log('quick_cta_clicked', {
      card_path: actionPath,
      destino: actionPath,
    });

    toast.success('Abrindo ' + actionTitle, {
      position: 'top-center',
      duration: 2000,
    });

    setTimeout(() => {
      navigate(actionPath);
    }, 300);
  };

  const handleDisambiguationSelect = (actionPath: string) => {
    setShowDisambiguationDialog(false);
    setSuggestedModules([]);
    setSearchCommand('');
    
    const action = quickActions.find(a => a.path === actionPath);
    if (action) {
      handleQuickActionClick(actionPath, action.title);
    }
  };

  return (
    <>
      {/* Hero Section - Full bleed with gradient */}
      <div className="-mx-8 -mt-8 mb-8">
        <div className="relative overflow-hidden bg-gradient-to-br from-neutral-100 via-neutral-50 to-neutral-100 dark:from-black dark:via-neutral-900 dark:to-black">
          {/* Radial gradient overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.15),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.3),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(139,92,246,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_70%_60%,rgba(139,92,246,0.2),transparent_50%)]" />

          {/* Content */}
          <div className="relative z-10 px-8 py-16">
            <div className="mx-auto max-w-4xl text-center">
              {/* Title */}
              <h1 className="mb-4 text-[40px] leading-[48px] tracking-tight text-black dark:text-neutral-50">
                Bem-vindo à Plataforma MVP
              </h1>
              
              {/* Subtitle */}
              <p className="mb-8 text-[18px] leading-[27px] text-neutral-700 dark:text-neutral-300">
                Escreva em uma frase. A plataforma faz o resto.
              </p>

              {/* Search Form */}
              <form onSubmit={handleSubmit} className="mx-auto max-w-2xl">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Ex: criar campanha de marketing, buscar candidatos, ver relatórios..."
                    value={searchCommand}
                    onChange={(e) => setSearchCommand(e.target.value)}
                    className="h-14 flex-1 rounded-xl border-2 border-neutral-200 bg-white px-6 text-[16px] placeholder:text-neutral-400 focus-visible:border-blue-500 focus-visible:ring-0 dark:border-neutral-700 dark:bg-neutral-800"
                  />
                  <Button
                    type="submit"
                    size="lg"
                    className="h-14 gap-2 rounded-xl px-8 text-[16px]"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </form>

              {/* Hint text */}
              <p className="mt-4 text-[13px] text-neutral-600 dark:text-neutral-400">
                💡 Dica: Descreva o que você quer fazer com suas próprias palavras
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="space-y-4">
        <h2 className="text-[20px] leading-[28px] text-neutral-900 dark:text-neutral-50">
          Atalhos Rápidos
        </h2>

        <div data-tour="modules" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Card
                key={action.path}
                className="group cursor-pointer transition-all hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
                onClick={() => handleQuickActionClick(action.path, action.title)}
              >
                <CardContent className="flex items-start gap-4 p-6">
                  <div className={`rounded-lg bg-neutral-100 p-3 dark:bg-neutral-800 ${action.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-[15px] leading-[21px] text-neutral-900 dark:text-neutral-50">
                        {action.title}
                      </h3>
                      {action.count && (
                        <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[11px] font-medium text-white dark:bg-blue-500">
                          {action.count}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-[13px] leading-[18px] text-neutral-600 dark:text-neutral-400">
                      {action.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Disambiguation Dialog */}
      <Dialog open={showDisambiguationDialog} onOpenChange={setShowDisambiguationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Escolha o módulo</DialogTitle>
            <DialogDescription>
              Encontramos múltiplos módulos relacionados. Qual você gostaria de acessar?
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-4">
            {suggestedModules.map((module) => {
              const Icon = module.icon;
              return (
                <Button
                  key={module.path}
                  variant="outline"
                  className="w-full justify-start gap-3 h-auto py-3"
                  onClick={() => handleDisambiguationSelect(module.path)}
                >
                  <div className={`rounded-lg bg-neutral-100 p-2 dark:bg-neutral-800 ${module.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-[14px]">{module.title}</p>
                    <p className="text-[12px] text-neutral-600 dark:text-neutral-400">
                      {module.description}
                    </p>
                  </div>
                </Button>
              );
            })}
          </div>

          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => {
                setShowDisambiguationDialog(false);
                setSuggestedModules([]);
              }}
            >
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}