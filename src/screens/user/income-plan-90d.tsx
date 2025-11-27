import { useState } from "react";
import { Download, Calendar, TrendingUp, CheckCircle, ArrowLeft, FileSpreadsheet } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { toast } from "sonner@2.0.3";
import { Separator } from "../../components/ui/separator";
import { Progress } from "../../components/ui/progress";
import { Checkbox } from "../../components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";

type WeeklyGoal = {
  week: number;
  revenueTarget: string;
  tasks: Task[];
  metrics: {
    leadsTarget: number;
    conversionRate: string;
    avgTicket: string;
  };
};

type Task = {
  id: string;
  title: string;
  category: "Aquisição" | "Produto" | "Vendas" | "Marketing" | "Operação";
  completed: boolean;
};

const mockPlan: WeeklyGoal[] = [
  {
    week: 1,
    revenueTarget: "R$ 500",
    metrics: { leadsTarget: 20, conversionRate: "10%", avgTicket: "R$ 250" },
    tasks: [
      { id: "W1T1", title: "Criar oferta inicial (produto/serviço)", category: "Produto", completed: false },
      { id: "W1T2", title: "Configurar landing page simples", category: "Marketing", completed: false },
      { id: "W1T3", title: "Definir preço e forma de pagamento", category: "Vendas", completed: false },
      { id: "W1T4", title: "Criar conteúdo de lançamento (3 posts)", category: "Marketing", completed: false },
    ],
  },
  {
    week: 2,
    revenueTarget: "R$ 800",
    metrics: { leadsTarget: 35, conversionRate: "12%", avgTicket: "R$ 250" },
    tasks: [
      { id: "W2T1", title: "Lançar primeira campanha de tráfego (R$ 100)", category: "Aquisição", completed: false },
      { id: "W2T2", title: "Criar sequência de e-mails de follow-up", category: "Vendas", completed: false },
      { id: "W2T3", title: "Produzir 5 posts de autoridade", category: "Marketing", completed: false },
      { id: "W2T4", title: "Fazer 10 vendas diretas (DM/WhatsApp)", category: "Vendas", completed: false },
    ],
  },
  {
    week: 3,
    revenueTarget: "R$ 1.200",
    metrics: { leadsTarget: 50, conversionRate: "15%", avgTicket: "R$ 300" },
    tasks: [
      { id: "W3T1", title: "Ajustar oferta com base no feedback", category: "Produto", completed: false },
      { id: "W3T2", title: "Criar urgência/escassez na oferta", category: "Vendas", completed: false },
      { id: "W3T3", title: "Aumentar budget de tráfego para R$ 200", category: "Aquisição", completed: false },
      { id: "W3T4", title: "Implementar automação de vendas básica", category: "Operação", completed: false },
    ],
  },
  {
    week: 4,
    revenueTarget: "R$ 1.500",
    metrics: { leadsTarget: 60, conversionRate: "15%", avgTicket: "R$ 350" },
    tasks: [
      { id: "W4T1", title: "Revisar métricas do primeiro mês", category: "Operação", completed: false },
      { id: "W4T2", title: "Criar upsell ou complemento da oferta", category: "Produto", completed: false },
      { id: "W4T3", title: "Testar novo canal de aquisição", category: "Aquisição", completed: false },
      { id: "W4T4", title: "Coletar depoimentos de clientes", category: "Marketing", completed: false },
    ],
  },
  // Adicionar mais semanas...
  {
    week: 8,
    revenueTarget: "R$ 3.500",
    metrics: { leadsTarget: 100, conversionRate: "20%", avgTicket: "R$ 400" },
    tasks: [
      { id: "W8T1", title: "Lançar segundo produto/serviço", category: "Produto", completed: false },
      { id: "W8T2", title: "Criar programa de afiliados simples", category: "Aquisição", completed: false },
      { id: "W8T3", title: "Implementar CRM para pipeline", category: "Operação", completed: false },
      { id: "W8T4", title: "Escalar budget de tráfego para R$ 500", category: "Aquisição", completed: false },
    ],
  },
  {
    week: 12,
    revenueTarget: "R$ 7.000",
    metrics: { leadsTarget: 180, conversionRate: "25%", avgTicket: "R$ 450" },
    tasks: [
      { id: "W12T1", title: "Contratar primeiro freelancer/VA", category: "Operação", completed: false },
      { id: "W12T2", title: "Criar webinar/workshop de vendas", category: "Vendas", completed: false },
      { id: "W12T3", title: "Diversificar canais (orgânico + pago)", category: "Aquisição", completed: false },
      { id: "W12T4", title: "Análise completa de ROI e otimizações", category: "Operação", completed: false },
    ],
  },
  {
    week: 13,
    revenueTarget: "R$ 10.000",
    metrics: { leadsTarget: 200, conversionRate: "28%", avgTicket: "R$ 500" },
    tasks: [
      { id: "W13T1", title: "Atingir meta de R$ 10k/mês 🎯", category: "Vendas", completed: false },
      { id: "W13T2", title: "Documentar processos para escalar", category: "Operação", completed: false },
      { id: "W13T3", title: "Planejar próximos 90 dias (R$ 20k+)", category: "Operação", completed: false },
      { id: "W13T4", title: "Celebrar conquista e aprendizados! 🎉", category: "Operação", completed: false },
    ],
  },
];

export function IncomePlan90D() {
  const navigate = useNavigate();
  const [plan, setPlan] = useState<WeeklyGoal[]>(mockPlan);

  const allTasks = plan.flatMap(week => week.tasks);
  const completedTasks = allTasks.filter(t => t.completed).length;
  const progressPercentage = (completedTasks / allTasks.length) * 100;

  const handleToggleTask = (taskId: string) => {
    setPlan(prev =>
      prev.map(week => ({
        ...week,
        tasks: week.tasks.map(task =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        ),
      }))
    );
  };

  const handleExportPDF = () => {
    toast.success("Exportando Plano 90D em PDF... Download iniciado!");
  };

  const handleExportCSV = () => {
    toast.success("Exportando Plano 90D em CSV... Download iniciado!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <Button variant="ghost" onClick={() => navigate("/income/wizard")} className="mb-2 -ml-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Assistente
          </Button>
          <h1 className="mb-2">Plano 90 Dias – Renda Automática</h1>
          <p className="text-muted-foreground">
            Seu roadmap personalizado para alcançar R$ 10.000/mês
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportCSV}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Exportar CSV
          </Button>
          <Button onClick={handleExportPDF}>
            <Download className="mr-2 h-4 w-4" />
            Exportar PDF
          </Button>
        </div>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Progresso Geral</CardTitle>
          <CardDescription>Acompanhe sua evolução rumo aos R$ 10k/mês</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Tarefas Concluídas</p>
              <p className="text-2xl">{completedTasks} / {allTasks.length}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Progresso</p>
              <p className="text-2xl">{Math.round(progressPercentage)}%</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Meta Final</p>
              <p className="text-2xl">R$ 10.000/mês</p>
            </div>
          </div>
          <Progress value={progressPercentage} />
        </CardContent>
      </Card>

      {/* Weekly Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Cronograma Semanal
          </CardTitle>
          <CardDescription>Metas e tarefas organizadas semana a semana</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {plan.map((week, index) => {
            const weekCompletedTasks = week.tasks.filter(t => t.completed).length;
            const weekProgress = (weekCompletedTasks / week.tasks.length) * 100;

            return (
              <div key={week.week}>
                {index > 0 && <Separator className="my-8" />}
                
                <div className="space-y-4">
                  {/* Week Header */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="text-base px-3 py-1">
                          Semana {week.week}
                        </Badge>
                        <Badge variant="default" className="gap-1">
                          <TrendingUp className="h-3 w-3" />
                          Meta: {week.revenueTarget}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                        <span>Leads: {week.metrics.leadsTarget}</span>
                        <span>•</span>
                        <span>Conv.: {week.metrics.conversionRate}</span>
                        <span>•</span>
                        <span>Ticket: {week.metrics.avgTicket}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Progresso</p>
                      <p className="text-sm">{weekCompletedTasks}/{week.tasks.length} tarefas</p>
                    </div>
                  </div>

                  {/* Week Progress */}
                  <Progress value={weekProgress} className="h-2" />

                  {/* Tasks */}
                  <div className="space-y-2 ml-4">
                    {week.tasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-start gap-3 rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                      >
                        <Checkbox
                          checked={task.completed}
                          onCheckedChange={() => handleToggleTask(task.id)}
                          className="mt-1"
                        />
                        <div className="flex-1 flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className={`text-sm ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                              {task.title}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {task.category}
                            </Badge>
                            {task.completed && (
                              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Summary Table */}
      <Card>
        <CardHeader>
          <CardTitle>Visão Consolidada de Metas</CardTitle>
          <CardDescription>Resumo das metas de receita e métricas-chave</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Semana</TableHead>
                  <TableHead>Meta de Receita</TableHead>
                  <TableHead>Leads</TableHead>
                  <TableHead>Taxa de Conversão</TableHead>
                  <TableHead>Ticket Médio</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plan.map((week) => {
                  const weekCompleted = week.tasks.every(t => t.completed);
                  return (
                    <TableRow key={week.week}>
                      <TableCell>Semana {week.week}</TableCell>
                      <TableCell>{week.revenueTarget}</TableCell>
                      <TableCell>{week.metrics.leadsTarget}</TableCell>
                      <TableCell>{week.metrics.conversionRate}</TableCell>
                      <TableCell>{week.metrics.avgTicket}</TableCell>
                      <TableCell>
                        {weekCompleted ? (
                          <Badge variant="default" className="gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Completa
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Em Andamento</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Orientações Importantes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm">
            ✅ <strong>Acompanhe semanalmente:</strong> Revise suas metas e ajuste estratégias conforme necessário
          </p>
          <p className="text-sm">
            ✅ <strong>Seja realista:</strong> Nem todas as semanas atingirão 100% da meta. O importante é a consistência
          </p>
          <p className="text-sm">
            ✅ <strong>Teste e otimize:</strong> Use dados reais para melhorar conversões e reduzir custos de aquisição
          </p>
          <p className="text-sm">
            ✅ <strong>Reinvista lucros:</strong> Nos primeiros meses, reinvista parte do faturamento em marketing
          </p>
          <p className="text-sm">
            ⚠️ <strong>Disclaimer:</strong> Resultados não são garantidos. Este plano é uma orientação estratégica, não uma promessa financeira.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}