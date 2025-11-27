import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Sparkles, FileText, Target, Users, DollarSign, MessageSquare, Send, RotateCcw } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { Textarea } from '../../components/ui/textarea';
import { ScrollArea } from '../../components/ui/scroll-area';
import { toast } from 'sonner@2.0.3';

interface BriefingData {
  nome: string;
  objetivo: string;
  publico: string;
  canais: string[];
  tom: string;
  orcamento: string;
  descricao?: string;
  kpis?: string[];
  prazo?: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export function MarketingBriefingCreateAI() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedData, setGeneratedData] = useState<Partial<BriefingData> | null>(null);
  const [completionProgress, setCompletionProgress] = useState(0);

  const suggestedPrompts = [
    'Quero lançar um produto para jovens profissionais (25-40 anos) com orçamento de R$ 30k em 90 dias',
    'Preciso criar uma campanha de retenção de clientes para meu e-commerce com foco em email marketing',
    'Campanha de awareness para lançamento de app mobile voltado para fitness',
  ];

  const getCurrentTime = () => {
    const now = new Date();
    return `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isGenerating) return;

    const userMessage: Message = {
      role: 'user',
      content: inputValue,
      timestamp: getCurrentTime(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsGenerating(true);

    // Simulate AI responses
    const aiResponses = [
      'Perfeito! Estou analisando suas informações...',
      'Identificando público-alvo e objetivos estratégicos...',
      'Selecionando os melhores canais para sua campanha...',
      'Definindo KPIs e métricas de sucesso...',
      'Pronto! Confira o briefing completo no painel ao lado. ✨',
    ];

    for (let i = 0; i < aiResponses.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      
      const aiMessage: Message = {
        role: 'assistant',
        content: aiResponses[i],
        timestamp: getCurrentTime(),
      };

      setMessages((prev) => [...prev, aiMessage]);

      // Update progress
      const progress = ((i + 1) / aiResponses.length) * 100;
      setCompletionProgress(progress);

      // Generate data on last message
      if (i === aiResponses.length - 1) {
        setGeneratedData({
          nome: 'Campanha de Marketing Digital - Lançamento Produto',
          objetivo: 'Aumentar reconhecimento de marca e gerar leads qualificados para o lançamento do produto',
          publico: 'Jovens profissionais (25-40 anos) interessados em tecnologia e inovação, com poder aquisitivo médio-alto',
          canais: ['Instagram', 'LinkedIn', 'Google Ads', 'TikTok', 'E-mail Marketing'],
          tom: 'Profissional, inspirador e acessível',
          orcamento: 'R$ 30.000,00',
          descricao: 'Campanha integrada focada em criar awareness e converter leads qualificados através de múltiplos pontos de contato.',
          kpis: [
            'Alcance de 100k pessoas',
            'Gerar 500 leads qualificados',
            'Taxa de conversão de 3%',
            'Engajamento médio de 5%',
          ],
          prazo: '90 dias',
        });
      }
    }

    setIsGenerating(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleAccept = () => {
    if (generatedData) {
      toast.success('Briefing salvo com sucesso!', {
        position: 'top-center',
        duration: 3000,
        description: 'Você pode encontrá-lo na lista de briefings',
      });

      setTimeout(() => {
        navigate('/marketing/briefing');
      }, 1000);
    }
  };

  const handleRegenerate = () => {
    setMessages([]);
    setGeneratedData(null);
    setCompletionProgress(0);
    toast.info('Chat reiniciado', {
      position: 'top-center',
      duration: 2000,
    });
  };

  const calculateFieldsCompleted = () => {
    if (!generatedData) return 0;
    const totalFields = 9;
    let completed = 0;
    if (generatedData.nome) completed++;
    if (generatedData.objetivo) completed++;
    if (generatedData.publico) completed++;
    if (generatedData.canais && generatedData.canais.length > 0) completed++;
    if (generatedData.tom) completed++;
    if (generatedData.orcamento) completed++;
    if (generatedData.descricao) completed++;
    if (generatedData.kpis && generatedData.kpis.length > 0) completed++;
    if (generatedData.prazo) completed++;
    return Math.round((completed / totalFields) * 100);
  };

  return (
    <div className="flex h-full flex-col gap-6">
      {/* Header - PERFECTLY ALIGNED */}
      <div className="flex items-start gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/marketing/briefing')}
          className="mt-1 h-10 w-10 shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        <div className="flex flex-1 items-start justify-between gap-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <Sparkles className="h-7 w-7 shrink-0 text-blue-500" />
              <h1 className="text-[28px] leading-[39.2px]">
                Criar Briefing com IA
              </h1>
            </div>
            <p className="mt-2 text-[14px] leading-[19.6px] text-neutral-600 dark:text-neutral-400">
              Converse com a IA para gerar um briefing completo automaticamente
            </p>
          </div>
          
          {generatedData && (
            <div className="flex shrink-0 items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-2.5 dark:border-green-800 dark:bg-green-950/30">
              <div className="flex flex-col gap-1">
                <span className="text-[11px] leading-none text-green-700 dark:text-green-400">
                  Completude do Briefing
                </span>
                <span className="text-[18px] font-medium leading-none text-green-900 dark:text-green-100">
                  {calculateFieldsCompleted()}%
                </span>
              </div>
              <Progress value={calculateFieldsCompleted()} className="h-2 w-24" />
            </div>
          )}
        </div>
      </div>

      {/* Main Content - PERFECTLY ALIGNED GRID */}
      <div className="flex-1 rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
        <div className="grid h-full grid-cols-1 gap-6 p-6 lg:grid-cols-2">
          {/* LEFT COLUMN: Chat Area - ALIGNED */}
          <div className="flex flex-col gap-4">
            <div className="space-y-1">
              <h3 className="text-[18px] leading-[25.2px]">
                Descreva sua campanha
              </h3>
              <p className="text-[13px] leading-[18.2px] text-neutral-600 dark:text-neutral-400">
                Conte sobre seus objetivos, público-alvo, orçamento e prazo desejado
              </p>
            </div>

            {/* Chat Messages Area - ALIGNED */}
            <div className="flex-1 rounded-lg border border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800/50">
              <ScrollArea className="h-full p-4">
                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <div className="flex h-full min-h-[300px] flex-col items-center justify-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-700">
                        <MessageSquare className="h-6 w-6 text-neutral-500 dark:text-neutral-400" />
                      </div>
                      <div className="text-center">
                        <p className="text-[14px] font-medium text-neutral-600 dark:text-neutral-400">
                          Inicie a conversa
                        </p>
                        <p className="mt-1 text-[12px] text-neutral-500">
                          Use uma das sugestões abaixo ou escreva sua própria mensagem
                        </p>
                      </div>
                      
                      {/* Suggested Prompts - ALIGNED */}
                      <div className="mt-4 w-full space-y-2">
                        {suggestedPrompts.map((prompt, index) => (
                          <button
                            key={index}
                            onClick={() => setInputValue(prompt)}
                            className="w-full rounded-lg border border-neutral-200 bg-white p-3 text-left text-[13px] leading-[18.2px] text-neutral-700 transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                          >
                            {prompt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <>
                      {messages.map((message, index) => (
                        <div
                          key={index}
                          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[85%] rounded-lg px-4 py-3 shadow-sm ${
                              message.role === 'user'
                                ? 'bg-blue-600 text-white'
                                : 'border border-neutral-200 bg-neutral-100 dark:border-neutral-600 dark:bg-neutral-700'
                            }`}
                          >
                            <p
                              className={`text-[13px] leading-[18.2px] ${
                                message.role === 'user' ? 'text-white' : 'text-neutral-900 dark:text-neutral-50'
                              }`}
                            >
                              {message.content}
                            </p>
                            <p
                              className={`mt-1.5 text-[10px] ${
                                message.role === 'user' ? 'text-blue-100' : 'text-neutral-500 dark:text-neutral-400'
                              }`}
                            >
                              {message.timestamp}
                            </p>
                          </div>
                        </div>
                      ))}
                      
                      {/* Typing Indicator */}
                      {isGenerating && (
                        <div className="flex justify-start">
                          <div className="rounded-lg border border-neutral-200 bg-neutral-100 px-4 py-3 dark:border-neutral-600 dark:bg-neutral-700">
                            <div className="flex gap-1">
                              <div className="h-2 w-2 animate-bounce rounded-full bg-neutral-400 [animation-delay:0ms]" />
                              <div className="h-2 w-2 animate-bounce rounded-full bg-neutral-400 [animation-delay:150ms]" />
                              <div className="h-2 w-2 animate-bounce rounded-full bg-neutral-400 [animation-delay:300ms]" />
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* Input Area - ALIGNED */}
            <div className="flex gap-2">
              <Textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Digite sua mensagem... (Enter para enviar)"
                className="min-h-[80px] flex-1 resize-none"
                disabled={isGenerating}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isGenerating}
                size="icon"
                className="h-[80px] w-[80px] shrink-0"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* RIGHT COLUMN: Preview Area - ALIGNED */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-[18px] leading-[25.2px]">
                  Resumo Gerado
                </h3>
                <p className="text-[13px] leading-[18.2px] text-neutral-600 dark:text-neutral-400">
                  Revise as informações geradas pela IA
                </p>
              </div>
              {generatedData && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRegenerate}
                  className="shrink-0"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reiniciar
                </Button>
              )}
            </div>

            {/* Preview Card - ALIGNED */}
            <div className="flex-1 overflow-auto rounded-lg border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-700 dark:bg-neutral-950">
              {generatedData ? (
                <div className="space-y-6">
                  {/* Progress Indicator */}
                  {completionProgress < 100 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 animate-pulse text-blue-500" />
                        <Label className="text-[12px]">
                          Gerando briefing...
                        </Label>
                      </div>
                      <Progress value={completionProgress} className="h-2" />
                    </div>
                  )}

                  {/* Campaign Name */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 shrink-0 text-blue-500" />
                      <Label className="text-[12px] font-medium">
                        Nome da Campanha
                      </Label>
                    </div>
                    <p className="text-[14px] leading-[19.6px]">
                      {generatedData.nome}
                    </p>
                  </div>

                  {/* Objective */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 shrink-0 text-green-500" />
                      <Label className="text-[12px] font-medium">
                        Objetivo Principal
                      </Label>
                    </div>
                    <p className="text-[14px] leading-[19.6px]">
                      {generatedData.objetivo}
                    </p>
                  </div>

                  {/* Description */}
                  {generatedData.descricao && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 shrink-0 text-purple-500" />
                        <Label className="text-[12px] font-medium">
                          Descrição
                        </Label>
                      </div>
                      <p className="text-[14px] leading-[19.6px]">
                        {generatedData.descricao}
                      </p>
                    </div>
                  )}

                  {/* Target Audience */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 shrink-0 text-orange-500" />
                      <Label className="text-[12px] font-medium">
                        Público-alvo
                      </Label>
                    </div>
                    <p className="text-[14px] leading-[19.6px]">
                      {generatedData.publico}
                    </p>
                  </div>

                  {/* Channels */}
                  <div className="space-y-2">
                    <Label className="text-[12px] font-medium">
                      Canais Recomendados
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {generatedData.canais?.map((canal) => (
                        <Badge key={canal} variant="secondary" className="px-3 py-1">
                          {canal}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Tone of Voice */}
                  <div className="space-y-2">
                    <Label className="text-[12px] font-medium">
                      Tom de Voz
                    </Label>
                    <p className="text-[14px] leading-[19.6px]">
                      {generatedData.tom}
                    </p>
                  </div>

                  {/* KPIs */}
                  {generatedData.kpis && generatedData.kpis.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-[12px] font-medium">
                        KPIs e Métricas de Sucesso
                      </Label>
                      <ul className="space-y-1.5 pl-4">
                        {generatedData.kpis.map((kpi, index) => (
                          <li
                            key={index}
                            className="list-disc text-[13px] leading-[18.2px]"
                          >
                            {kpi}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Budget and Timeline - ALIGNED IN GRID */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 shrink-0 text-green-600 dark:text-green-400" />
                        <Label className="text-[12px] font-medium">
                          Orçamento
                        </Label>
                      </div>
                      <p className="text-[14px] leading-[19.6px]">
                        {generatedData.orcamento}
                      </p>
                    </div>
                    {generatedData.prazo && (
                      <div className="space-y-2">
                        <Label className="text-[12px] font-medium">
                          Prazo de Execução
                        </Label>
                        <p className="text-[14px] leading-[19.6px]">
                          {generatedData.prazo}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* AI Tip */}
                  <div className="rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-4 dark:from-blue-950/30 dark:to-indigo-950/30">
                    <div className="flex gap-3">
                      <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
                      <div className="flex-1 space-y-1">
                        <p className="text-[13px] font-medium leading-[18.2px] text-blue-900 dark:text-blue-100">
                          Dica da IA
                        </p>
                        <p className="text-[12px] leading-[16.8px] text-blue-800 dark:text-blue-200">
                          Você pode continuar conversando para refinar o briefing ou clicar em "Salvar" para finalizar.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex h-full min-h-[400px] flex-col items-center justify-center">
                  <div className="space-y-4 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-800">
                      <FileText className="h-8 w-8 text-neutral-400 dark:text-neutral-600" />
                    </div>
                    <div>
                      <p className="text-[14px] font-medium">
                        Aguardando informações
                      </p>
                      <p className="mt-2 text-[12px] text-neutral-500">
                        Descreva sua campanha no chat ao lado para começar
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons - ALIGNED IN GRID */}
            {generatedData && (
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  onClick={handleRegenerate}
                  className="gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Regenerar
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/marketing/briefing')}
                  className="gap-2"
                >
                  Editar
                </Button>
                <Button
                  onClick={handleAccept}
                  className="gap-2 bg-green-600 hover:bg-green-700"
                >
                  <Save className="h-4 w-4" />
                  Salvar
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Actions - PERFECTLY ALIGNED IN GRID */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Autosave Info */}
        <div className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-800/50">
          <Save className="h-5 w-5 shrink-0 text-neutral-600 dark:text-neutral-400" />
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium leading-[18.2px]">
              Salvamento automático
            </p>
            <p className="text-[11px] leading-[15.4px] text-neutral-600 dark:text-neutral-400">
              Suas conversas são salvas automaticamente
            </p>
          </div>
        </div>

        {/* Quick Exit */}
        <div className="flex items-center justify-between gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-800/50">
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium leading-[18.2px]">
              Voltar para lista
            </p>
            <p className="text-[11px] leading-[15.4px] text-neutral-600 dark:text-neutral-400">
              Salva rascunho e retorna
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/marketing/briefing')}
            className="shrink-0"
          >
            Sair
          </Button>
        </div>
      </div>
    </div>
  );
}