import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Copy, CheckCircle, FileText, Download } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Checkbox } from "../../components/ui/checkbox";
import { Badge } from "../../components/ui/badge";
import { toast } from "sonner@2.0.3";
import { Separator } from "../../components/ui/separator";
import { Alert, AlertDescription } from "../../components/ui/alert";

type PlaybookStep = {
  id: string;
  title: string;
  description: string;
  script?: string;
  completed: boolean;
};

type PlaybookData = {
  id: string;
  name: string;
  objective: string;
  channel: string;
  audience: string;
  steps: PlaybookStep[];
  tips: string[];
};

const mockPlaybookData: Record<string, PlaybookData> = {
  "PB001": {
    id: "PB001",
    name: "Boas-vindas Automáticas",
    objective: "Engajar novos contatos",
    channel: "WhatsApp Business",
    audience: "Novos leads",
    steps: [
      {
        id: "S1",
        title: "Configure a mensagem de boas-vindas",
        description: "Acesse WhatsApp Business > Ferramentas > Mensagem de boas-vindas",
        script: `Olá! 👋 Seja muito bem-vindo(a)!

Obrigado por entrar em contato. Estou aqui para ajudar você.

Como posso auxiliar hoje?

🔹 Conhecer nossos produtos
🔹 Tirar dúvidas
🔹 Falar com um consultor

Escolha uma das opções acima ou me diga como posso ajudar! 😊`,
        completed: false,
      },
      {
        id: "S2",
        title: "Defina o horário de envio",
        description: "Configure para enviar sempre que alguém iniciar conversa pela primeira vez",
        completed: false,
      },
      {
        id: "S3",
        title: "Teste a automação",
        description: "Peça para alguém enviar uma mensagem de teste e valide se a resposta automática está funcionando",
        completed: false,
      },
      {
        id: "S4",
        title: "Monitore as respostas",
        description: "Acompanhe diariamente as primeiras interações e ajuste o script conforme necessário",
        completed: false,
      },
    ],
    tips: [
      "Use emojis para deixar a mensagem mais amigável e humanizada",
      "Ofereça opções claras para facilitar a resposta do lead",
      "Evite textos muito longos - seja objetivo",
      "Teste a mensagem em diferentes horários para verificar o tempo de resposta",
    ],
  },
  "PB002": {
    id: "PB002",
    name: "Qualificação de Leads",
    objective: "Filtrar leads quentes",
    channel: "WhatsApp Business",
    audience: "Leads interessados",
    steps: [
      {
        id: "S1",
        title: "Crie o script de qualificação",
        description: "Defina as perguntas-chave para identificar leads qualificados",
        script: `Ótimo! Para eu te ajudar melhor, preciso entender um pouco mais sobre sua necessidade. 

Responda rapidinho:

1️⃣ Qual é o principal desafio que você quer resolver?
2️⃣ Quando você precisa dessa solução?
3️⃣ Já conhece nossos produtos/serviços?

Aguardo suas respostas! 📝`,
        completed: false,
      },
      {
        id: "S2",
        title: "Configure respostas rápidas",
        description: "Crie atalhos para perguntas frequentes e respostas padrão",
        completed: false,
      },
      {
        id: "S3",
        title: "Defina critérios de qualificação",
        description: "Estabeleça o que caracteriza um lead quente (ex: urgência, orçamento, autoridade)",
        completed: false,
      },
      {
        id: "S4",
        title: "Documente as conversas",
        description: "Use etiquetas/tags para classificar leads (Quente, Morno, Frio)",
        completed: false,
      },
    ],
    tips: [
      "Faça no máximo 3-4 perguntas para não cansar o lead",
      "Use linguagem simples e direta",
      "Responda rapidamente após receber as informações",
      "Crie um sistema de pontuação para priorizar atendimentos",
    ],
  },
};

export function WhatsAppPlaybookDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [playbook, setPlaybook] = useState<PlaybookData | null>(
    id ? mockPlaybookData[id] || null : null
  );

  if (!playbook) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate("/whatsapp/playbooks")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
          <FileText className="h-12 w-12 mb-4 opacity-50" />
          <p>Playbook não encontrado</p>
        </div>
      </div>
    );
  }

  const handleToggleStep = (stepId: string) => {
    setPlaybook(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        steps: prev.steps.map(step =>
          step.id === stepId ? { ...step, completed: !step.completed } : step
        ),
      };
    });
  };

  const handleCopyScript = (script: string) => {
    navigator.clipboard.writeText(script);
    toast.success("Script copiado para a área de transferência!");
  };

  const handleGeneratePDF = () => {
    toast.success("Gerando PDF do guia... Download iniciado!");
  };

  const completedSteps = playbook.steps.filter(s => s.completed).length;
  const progressPercentage = (completedSteps / playbook.steps.length) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <Button variant="ghost" onClick={() => navigate("/whatsapp/playbooks")} className="mb-2 -ml-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Playbooks
          </Button>
          <h1 className="mb-2">{playbook.name}</h1>
          <p className="text-muted-foreground">{playbook.objective}</p>
        </div>
        <Button onClick={handleGeneratePDF}>
          <Download className="mr-2 h-4 w-4" />
          Gerar PDF do Guia
        </Button>
      </div>

      {/* Info Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Canal</CardDescription>
          </CardHeader>
          <CardContent>
            <p>{playbook.channel}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Público-Alvo</CardDescription>
          </CardHeader>
          <CardContent>
            <p>{playbook.audience}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Progresso</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>{completedSteps} de {playbook.steps.length} passos</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Passos do Playbook</CardTitle>
          <CardDescription>
            Siga os passos abaixo para implementar a automação no WhatsApp Business
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {playbook.steps.map((step, index) => (
            <div key={step.id}>
              {index > 0 && <Separator className="my-6" />}
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <Checkbox
                    checked={step.completed}
                    onCheckedChange={() => handleToggleStep(step.id)}
                    className="mt-1"
                  />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">Passo {index + 1}</Badge>
                          {step.completed && (
                            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                          )}
                        </div>
                        <h3 className="mt-2">{step.title}</h3>
                        <p className="text-muted-foreground mt-1">{step.description}</p>
                      </div>
                    </div>

                    {step.script && (
                      <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="text-sm">Script sugerido:</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopyScript(step.script!)}
                          >
                            <Copy className="mr-2 h-4 w-4" />
                            Copiar
                          </Button>
                        </div>
                        <pre className="text-sm whitespace-pre-wrap font-sans">{step.script}</pre>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Boas Práticas e Dicas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {playbook.tips.map((tip, index) => (
            <Alert key={index}>
              <AlertDescription className="flex items-start gap-3">
                <span className="text-primary">💡</span>
                <span>{tip}</span>
              </AlertDescription>
            </Alert>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}