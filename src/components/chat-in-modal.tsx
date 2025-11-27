import { useState, useRef, useEffect } from 'react';
import { Send, RotateCcw, Check, Edit, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card } from './ui/card';
import { ScrollArea } from './ui/scroll-area';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatInModalProps {
  title: string;
  description?: string;
  onGenerate: (messages: Message[]) => Promise<void>;
  onAccept: () => void;
  onEditManually: () => void;
  renderPreview: () => React.ReactNode;
  suggestedPrompts?: string[];
  isGenerating?: boolean;
}

export function ChatInModal({
  title,
  description,
  onGenerate,
  onAccept,
  onEditManually,
  renderPreview,
  suggestedPrompts = [],
  isGenerating = false,
}: ChatInModalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [streamingMessage, setStreamingMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamingMessage]);

  const handleSendMessage = async () => {
    if (!input.trim() || isGenerating || isProcessing) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);

    // Simulate streaming response
    const responses = [
      'Perfeito! Estou analisando suas informações...',
      'Identificando público-alvo e objetivos estratégicos...',
      'Selecionando os melhores canais para sua campanha...',
      'Definindo KPIs e métricas de sucesso...',
      'Pronto! Confira o briefing completo no painel ao lado. ✨',
    ];

    for (const response of responses) {
      setStreamingMessage('');
      const words = response.split(' ');
      for (let i = 0; i < words.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 40));
        setStreamingMessage((prev) => prev + (i > 0 ? ' ' : '') + words[i]);
      }

      await new Promise((resolve) => setTimeout(resolve, 300));

      const assistantMessage: Message = {
        id: Date.now().toString() + '-assistant',
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setStreamingMessage('');
    }

    setIsProcessing(false);

    // Call onGenerate with all messages
    await onGenerate([...messages, userMessage]);
  };

  const handleSuggestedPrompt = (prompt: string) => {
    setInput(prompt);
    // Auto-focus textarea after selecting prompt
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);
  };

  const handleRegenerate = () => {
    setMessages([]);
    setStreamingMessage('');
    setInput('');
  };

  const hasGeneratedContent = messages.length > 0;

  return (
    <div className="grid h-[70vh] grid-cols-2 gap-6">
      {/* Left Panel: Chat */}
      <div className="flex flex-col gap-4">
        <div>
          <h3 className="text-[18px] leading-[25.2px] text-neutral-900 dark:text-neutral-50">
            {title}
          </h3>
          {description && (
            <p className="mt-1 text-[13px] leading-[18.2px] text-neutral-600 dark:text-neutral-400">
              {description}
            </p>
          )}
        </div>

        {/* Chat Messages */}
        <ScrollArea className="flex-1 rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-800/50">
          <div ref={scrollRef} className="space-y-4 min-h-full">
            {messages.length === 0 && !streamingMessage && (
              <div className="flex h-full items-center justify-center py-12">
                <div className="text-center space-y-3">
                  <div className="mx-auto h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-center text-[13px] text-neutral-600 dark:text-neutral-400">
                    Descreva o que você precisa para começar...
                  </p>
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-4 py-3 shadow-sm ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-neutral-900 dark:bg-neutral-700 dark:text-neutral-50 border border-neutral-200 dark:border-neutral-600'
                  }`}
                >
                  <p className="text-[13px] leading-[18.2px] whitespace-pre-wrap">{message.content}</p>
                  <p className={`mt-1.5 text-[10px] ${
                    message.role === 'user' ? 'text-blue-100' : 'text-neutral-500 dark:text-neutral-400'
                  }`}>
                    {message.timestamp.toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}

            {streamingMessage && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-lg bg-white px-4 py-3 text-neutral-900 shadow-sm dark:bg-neutral-700 dark:text-neutral-50 border border-neutral-200 dark:border-neutral-600">
                  <p className="text-[13px] leading-[18.2px]">
                    {streamingMessage}
                    <span className="ml-1 inline-block h-3 w-1.5 animate-pulse bg-blue-600 dark:bg-blue-400 rounded-sm" />
                  </p>
                </div>
              </div>
            )}

            {isProcessing && !streamingMessage && (
              <div className="flex justify-start">
                <div className="rounded-lg bg-white px-4 py-3 shadow-sm dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-blue-600 dark:bg-blue-400 [animation-delay:-0.3s]"></span>
                      <span className="h-2 w-2 animate-bounce rounded-full bg-blue-600 dark:bg-blue-400 [animation-delay:-0.15s]"></span>
                      <span className="h-2 w-2 animate-bounce rounded-full bg-blue-600 dark:bg-blue-400"></span>
                    </div>
                    <span className="text-[11px] text-neutral-500 dark:text-neutral-400">IA pensando...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Suggested Prompts */}
        {suggestedPrompts.length > 0 && messages.length === 0 && (
          <div className="space-y-2">
            <p className="text-[12px] font-medium text-neutral-600 dark:text-neutral-400">
              💡 Sugestões para começar:
            </p>
            <div className="grid grid-cols-1 gap-2">
              {suggestedPrompts.map((prompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSuggestedPrompt(prompt)}
                  className="h-auto justify-start whitespace-normal py-2.5 text-left text-[12px] leading-[16.8px] hover:border-blue-400 hover:bg-blue-50 dark:hover:border-blue-600 dark:hover:bg-blue-950/30"
                >
                  {prompt}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="flex gap-2">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Digite sua mensagem... (Enter para enviar)"
            className="min-h-[80px] resize-none"
            disabled={isGenerating || isProcessing}
          />
          <Button
            onClick={handleSendMessage}
            size="icon"
            className="h-[80px] w-[80px] flex-shrink-0"
            disabled={!input.trim() || isGenerating || isProcessing}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Right Panel: Preview & Actions */}
      <div className="flex flex-col gap-4">
        <div>
          <h3 className="text-[18px] leading-[25.2px] text-neutral-900 dark:text-neutral-50">
            Resumo Gerado
          </h3>
          <p className="mt-1 text-[13px] leading-[18.2px] text-neutral-600 dark:text-neutral-400">
            Revise as informações geradas pela IA
          </p>
        </div>

        {/* Preview Card */}
        <Card className="flex-1 overflow-auto p-6">
          {renderPreview()}
        </Card>

        {/* Actions */}
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="outline"
            onClick={handleRegenerate}
            className="gap-2"
            disabled={!hasGeneratedContent}
            title="Começar do zero"
          >
            <RotateCcw className="h-4 w-4" />
            Regenerar
          </Button>
          <Button
            variant="outline"
            onClick={onEditManually}
            className="gap-2"
            disabled={!hasGeneratedContent}
            title="Editar em formulário"
          >
            <Edit className="h-4 w-4" />
            Editar
          </Button>
          <Button
            onClick={onAccept}
            className="gap-2 bg-green-600 hover:bg-green-700"
            disabled={!hasGeneratedContent}
            title="Salvar briefing"
          >
            <Check className="h-4 w-4" />
            Salvar
          </Button>
        </div>
      </div>
    </div>
  );
}