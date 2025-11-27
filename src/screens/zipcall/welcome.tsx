import { useState } from 'react';
import { Send, Sparkles, DollarSign, Megaphone, Users } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Avatar } from '../../components/ui/avatar';
import { ScrollArea } from '../../components/ui/scroll-area';

export function ZipCallWelcome() {
  const [messages, setMessages] = useState([
    {
      role: 'agent',
      content: 'Olá! Sou o Arquiteto. Qual é o seu objetivo hoje? Ganhar uma renda extra ou criar um anúncio?',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');

  const quickActions = [
    { icon: DollarSign, label: '💰 Renda Rápida (10k/mês)', action: 'renda' },
    { icon: Megaphone, label: '📢 Criar Marketing', action: 'marketing' },
    { icon: Users, label: '🤝 Contratar Alguém', action: 'contratar' },
  ];

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        role: 'user',
        content: inputValue,
        timestamp: new Date(),
      },
    ]);
    setInputValue('');

    // Simulate agent response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'agent',
          content: 'Entendi! Vou te ajudar com isso. Deixa eu preparar tudo para você...',
          timestamp: new Date(),
        },
      ]);
    }, 1000);
  };

  const handleQuickAction = (label: string) => {
    setMessages((prev) => [
      ...prev,
      {
        role: 'user',
        content: label,
        timestamp: new Date(),
      },
      {
        role: 'agent',
        content: 'Perfeito! Vamos começar essa jornada juntos. 🚀',
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="flex h-screen flex-col bg-white">
      {/* CABEÇALHO MINIMALISTA */}
      <header className="flex items-center justify-between border-b border-neutral-100 p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-neutral-900">ZipCall</span>
        </div>
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100">
          <div className="h-6 w-6 rounded-full bg-gradient-to-br from-neutral-400 to-neutral-500" />
        </button>
      </header>

      {/* ÁREA CENTRAL - CHAT */}
      <ScrollArea className="flex-1 px-4 pt-8">
        <div className="mx-auto max-w-2xl">
          {/* AVATAR DO ARQUITETO - CENTRALIZADO */}
          <div className="mb-6 flex flex-col items-center">
            <div className="relative mb-4">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                <Sparkles className="h-12 w-12 text-white" />
              </div>
              {/* Indicador online */}
              <div className="absolute bottom-1 right-1 h-5 w-5 rounded-full border-4 border-white bg-green-500" />
            </div>
            <h2 className="text-xl font-semibold text-neutral-900">
              O Arquiteto
            </h2>
            <p className="text-sm text-neutral-500">Seu assistente de IA</p>
          </div>

          {/* MENSAGENS DO CHAT */}
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-3xl px-5 py-4 shadow-sm ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-neutral-50 text-neutral-900'
                  }`}
                >
                  <p className="text-[17px] leading-relaxed">
                    {message.content}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* AÇÕES RÁPIDAS (CHIPS) */}
          {messages.length === 1 && (
            <div className="mt-6 space-y-3">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action.label)}
                  className="flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-neutral-200 bg-white px-6 py-4 text-[17px] font-medium text-neutral-900 shadow-sm transition-all hover:border-blue-500 hover:bg-blue-50 active:scale-[0.98]"
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* ÁREA DE INPUT FIXA (ESTILO WHATSAPP) */}
      <div className="border-t border-neutral-100 bg-white p-4">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-end gap-2">
            <div className="flex-1 rounded-3xl bg-neutral-50 px-5 py-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Digite sua mensagem..."
                className="w-full bg-transparent text-[17px] text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-blue-500 shadow-lg transition-all hover:bg-blue-600 active:scale-95 disabled:bg-neutral-300 disabled:shadow-none"
            >
              <Send className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
