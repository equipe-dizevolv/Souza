import { useState, useRef, useEffect } from "react";
import { Send, FileDown, Sparkles, AlertCircle } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { toast } from "sonner@2.0.3";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Skeleton } from "../../components/ui/skeleton";
import { useNavigate } from "react-router-dom";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

type SessionData = {
  objectives: string[];
  painPoints: string[];
  resources: string[];
};

const suggestedQuestions = [
  "Como começar a vender online?",
  "Preciso de ajuda para definir meu público-alvo",
  "Quero aumentar minhas vendas em 30%",
  "Como criar conteúdo para redes sociais?",
];

export function ConsultancyChat() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Olá! Sou seu consultor virtual especializado em marketing digital e vendas online. Estou aqui para ajudar você a diagnosticar desafios e criar um plano de ação personalizado.\n\nPara começar, me conte: qual é o seu principal objetivo neste momento?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionData, setSessionData] = useState<SessionData>({
    objectives: [],
    painPoints: [],
    resources: [],
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const simulateAssistantResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes("vend") || lowerMessage.includes("online")) {
      return "Excelente! Vender online é uma ótima estratégia. Vamos estruturar isso juntos.\n\nPara te ajudar melhor, preciso entender:\n\n1. Você já tem um produto/serviço definido?\n2. Já possui alguma presença digital (site, redes sociais)?\n3. Qual é sua meta de faturamento mensal?\n\nCom essas informações, posso criar um plano de ação específico para você!";
    }

    if (lowerMessage.includes("público") || lowerMessage.includes("target")) {
      return "Definir o público-alvo é fundamental! Vamos fazer isso de forma estratégica.\n\nMe conta:\n\n• Que tipo de problema seu produto/serviço resolve?\n• Qual faixa etária você imagina?\n• Seus clientes ideais são B2B ou B2C?\n\nVou te ajudar a criar uma persona detalhada!";
    }

    if (lowerMessage.includes("aument") && lowerMessage.includes("vend")) {
      return "Ótimo objetivo! Para aumentar vendas em 30%, precisamos trabalhar em alguns pilares:\n\n🎯 **Aquisição**: Trazer mais leads qualificados\n💬 **Conversão**: Melhorar taxa de fechamento\n🔄 **Retenção**: Fidelizar clientes atuais\n\nQual desses pilares você sente que precisa de mais atenção agora?";
    }

    if (lowerMessage.includes("conteúdo") || lowerMessage.includes("redes sociais")) {
      return "Criar conteúdo relevante é essencial para engajar sua audiência!\n\nVou te dar algumas dicas práticas:\n\n📱 Escolha 2-3 redes onde seu público está\n📅 Crie um calendário editorial mensal\n🎨 Varie formatos: posts, stories, vídeos, carrosséis\n💡 Foco em educar e resolver dores, não só vender\n\nQue tipo de negócio você tem? Isso vai influenciar o tom e tipo de conteúdo ideal.";
    }

    return "Entendi. Isso é muito importante!\n\nPara te dar a melhor orientação, me conte mais sobre:\n\n• Qual é seu segmento de atuação?\n• Há quanto tempo está nesse mercado?\n• Qual seu maior desafio atual?\n\nQuanto mais detalhes você compartilhar, mais personalizado será o plano de ação que vou criar para você! 💡";
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate assistant typing
    setTimeout(() => {
      const assistantResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: simulateAssistantResponse(inputValue),
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantResponse]);
      setIsTyping(false);

      // Extract session data (simplified)
      if (inputValue.toLowerCase().includes("objetivo") || inputValue.toLowerCase().includes("meta")) {
        setSessionData(prev => ({
          ...prev,
          objectives: [...prev.objectives, inputValue],
        }));
      }
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const handleGeneratePlan = () => {
    if (messages.length < 6) {
      toast.error("Continue a conversa um pouco mais para gerar um plano completo");
      return;
    }
    navigate("/consultancy/action-plan");
    toast.success("Gerando Plano de Ação personalizado...");
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6">
      {/* Chat Area */}
      <div className="flex-1 flex flex-col rounded-lg border bg-card overflow-hidden">
        {/* Chat Header */}
        <div className="border-b p-4 bg-muted/30">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Consultoria Online
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Agente consultor especializado
              </p>
            </div>
            <Button onClick={handleGeneratePlan} variant="default">
              <FileDown className="mr-2 h-4 w-4" />
              Gerar Business Plan
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-3 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                <p className="text-xs opacity-70 mt-2">
                  {message.timestamp.toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg px-4 py-3 bg-muted">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" />
                  </div>
                  <span className="text-sm text-muted-foreground">Consultor digitando...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        {messages.length <= 2 && (
          <div className="border-t p-4 bg-muted/20">
            <p className="text-sm text-muted-foreground mb-3">Sugestões:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="text-sm"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              placeholder="Digite sua mensagem..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              disabled={isTyping}
            />
            <Button onClick={handleSendMessage} disabled={isTyping || !inputValue.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-80 space-y-4">
        {/* Session Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Resumo da Sessão</CardTitle>
            <CardDescription>Informações coletadas até agora</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm mb-2">Objetivos</p>
              {sessionData.objectives.length > 0 ? (
                <div className="space-y-1">
                  {sessionData.objectives.map((obj, i) => (
                    <Badge key={i} variant="secondary" className="mr-1 mb-1">
                      {obj.slice(0, 30)}...
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  Nenhum objetivo identificado ainda
                </p>
              )}
            </div>

            <div>
              <p className="text-sm mb-2">Dores Identificadas</p>
              {sessionData.painPoints.length > 0 ? (
                <div className="space-y-1">
                  {sessionData.painPoints.map((pain, i) => (
                    <Badge key={i} variant="secondary" className="mr-1 mb-1">
                      {pain}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  Continue a conversa para identificar
                </p>
              )}
            </div>

            <div>
              <p className="text-sm mb-2">Recursos Disponíveis</p>
              {sessionData.resources.length > 0 ? (
                <div className="space-y-1">
                  {sessionData.resources.map((resource, i) => (
                    <Badge key={i} variant="secondary" className="mr-1 mb-1">
                      {resource}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  Não identificados ainda
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs">
            <strong>Aviso Importante:</strong> Esta consultoria virtual não substitui aconselhamento jurídico, financeiro ou contábil profissional. Evite compartilhar informações sensíveis ou de nichos proibidos.
          </AlertDescription>
        </Alert>

        {/* Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Progresso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Mensagens trocadas</span>
                <Badge>{messages.length}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Pronto para Plano de Ação?</span>
                <Badge variant={messages.length >= 6 ? "default" : "secondary"}>
                  {messages.length >= 6 ? "Sim" : "Não"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}