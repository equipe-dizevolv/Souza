import { useState } from "react";
import { Download, Calendar, Target, TrendingUp, CheckCircle, ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { toast } from "sonner@2.0.3";
import { Separator } from "../../components/ui/separator";
import { Progress } from "../../components/ui/progress";
import { Checkbox } from "../../components/ui/checkbox";
import { useNavigate } from "react-router-dom";

type Task = {
  id: string;
  week: number;
  title: string;
  description: string;
  responsible: "Você" | "Automação";
  completed: boolean;
};

type Goal = {
  id: string;
  title: string;
  metric: string;
  target: string;
  current: string;
};

const mockGoals: Goal[] = [
  { id: "G1", title: "Aumentar Leads Qualificados", metric: "Leads/mês", target: "100", current: "45" },
  { id: "G2", title: "Taxa de Conversão", metric: "Percentual", target: "15%", current: "8%" },
  { id: "G3", title: "Receita Mensal Recorrente", metric: "R$", target: "R$ 10.000", current: "R$ 4.500" },
];

const mockTasks: Task[] = [
  // Semana 1-4
  { id: "T1", week: 1, title: "Definir ICP (Ideal Customer Profile)", description: "Documentar perfil detalhado do cliente ideal", responsible: "Você", completed: false },
  { id: "T2", week: 1, title: "Configurar Google Analytics e Meta Pixel", description: "Instalar rastreamento em site/landing page", responsible: "Você", completed: false },
  { id: "T3", week: 2, title: "Criar 3 personas detalhadas", description: "Mapear dores, desejos e objeções", responsible: "Você", completed: false },
  { id: "T4", week: 2, title: "Estruturar funil de vendas", description: "Definir etapas: topo, meio e fundo de funil", responsible: "Você", completed: false },
  { id: "T5", week: 3, title: "Criar 10 peças de conteúdo", description: "Posts para blog e redes sociais", responsible: "Você", completed: false },
  { id: "T6", week: 3, title: "Configurar automação de e-mail", description: "Sequência de boas-vindas e nutrição", responsible: "Automação", completed: false },
  { id: "T7", week: 4, title: "Lançar campanha de tráfego pago", description: "Meta Ads ou Google Ads - R$ 500 inicial", responsible: "Você", completed: false },
  { id: "T8", week: 4, title: "Revisar KPIs da primeira sprint", description: "Analisar métricas e ajustar estratégia", responsible: "Você", completed: false },
  
  // Semana 5-8
  { id: "T9", week: 5, title: "Otimizar landing pages", description: "A/B test de headlines e CTAs", responsible: "Você", completed: false },
  { id: "T10", week: 6, title: "Implementar chat no site", description: "WhatsApp ou chatbot para captura", responsible: "Automação", completed: false },
  { id: "T11", week: 7, title: "Criar webinar ou live", description: "Educar audiência e gerar leads", responsible: "Você", completed: false },
  { id: "T12", week: 8, title: "Revisar KPIs do segundo mês", description: "Ajustar orçamento e estratégias", responsible: "Você", completed: false },
  
  // Semana 9-13
  { id: "T13", week: 9, title: "Expandir canais de aquisição", description: "Testar LinkedIn, TikTok ou Pinterest", responsible: "Você", completed: false },
  { id: "T14", week: 10, title: "Criar programa de indicação", description: "Incentivo para clientes indicarem", responsible: "Você", completed: false },
  { id: "T15", week: 11, title: "Implementar CRM", description: "Organizar pipeline de vendas", responsible: "Automação", completed: false },
  { id: "T16", week: 12, title: "Análise completa dos 90 dias", description: "Documentar aprendizados e próximos passos", responsible: "Você", completed: false },
];

export function ConsultancyActionPlan() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>(mockTasks);

  const handleToggleTask = (taskId: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDownloadPDF = () => {
    toast.success("Gerando PDF do Plano de Ação... Download iniciado!");
  };

  const completedTasks = tasks.filter(t => t.completed).length;
  const progressPercentage = (completedTasks / tasks.length) * 100;

  const groupedByWeek = tasks.reduce((acc, task) => {
    const weekKey = `Semana ${task.week}`;
    if (!acc[weekKey]) acc[weekKey] = [];
    acc[weekKey].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <Button variant="ghost" onClick={() => navigate("/consultancy/chat")} className="mb-2 -ml-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Chat
          </Button>
          <h1 className="mb-2">Plano de Ação – 90 Dias</h1>
          <p className="text-muted-foreground">
            Seu roadmap personalizado com metas, KPIs e cronograma
          </p>
        </div>
        <Button onClick={handleDownloadPDF}>
          <Download className="mr-2 h-4 w-4" />
          Baixar PDF
        </Button>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Visão Geral do Progresso</CardTitle>
          <CardDescription>Acompanhe sua evolução nos próximos 90 dias</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Tarefas Concluídas</span>
              <span>{completedTasks} de {tasks.length}</span>
            </div>
            <Progress value={progressPercentage} />
            <p className="text-sm text-muted-foreground">
              {Math.round(progressPercentage)}% completo
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Metas e KPIs
          </CardTitle>
          <CardDescription>Objetivos mensuráveis para os próximos 90 dias</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockGoals.map((goal) => (
              <div key={goal.id} className="rounded-lg border p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm">{goal.title}</h3>
                    <p className="text-xs text-muted-foreground">{goal.metric}</p>
                  </div>
                  <Badge variant="outline">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    Meta: {goal.target}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Atual:</span>
                  <span>{goal.current}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Cronograma – 13 Semanas
          </CardTitle>
          <CardDescription>Tarefas organizadas semana a semana</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {Object.entries(groupedByWeek).map(([week, weekTasks], index) => (
            <div key={week}>
              {index > 0 && <Separator className="my-6" />}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-sm">
                    {week}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {weekTasks.filter(t => t.completed).length} de {weekTasks.length} concluídas
                  </span>
                </div>

                <div className="space-y-3 ml-4">
                  {weekTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-start gap-3 rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                    >
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => handleToggleTask(task.id)}
                        className="mt-1"
                      />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className={`text-sm ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                            {task.title}
                          </h4>
                          {task.completed && (
                            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{task.description}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {task.responsible}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Observações Importantes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm">
            ✅ <strong>Revise semanalmente:</strong> Acompanhe seu progresso e ajuste prioridades conforme necessário
          </p>
          <p className="text-sm">
            ✅ <strong>Tarefas marcadas como "Automação":</strong> Podem ser delegadas ou automatizadas com ferramentas
          </p>
          <p className="text-sm">
            ✅ <strong>KPIs são vivos:</strong> Atualize suas métricas regularmente para medir evolução real
          </p>
          <p className="text-sm">
            ✅ <strong>Dúvidas?</strong> Retorne ao chat de consultoria para refinar o plano a qualquer momento
          </p>
        </CardContent>
      </Card>
    </div>
  );
}