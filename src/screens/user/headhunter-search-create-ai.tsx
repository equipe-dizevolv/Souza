import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { toast } from 'sonner@2.0.3';
import { ChatInModal } from '../../components/chat-in-modal';

interface BuscaData {
  nome: string;
  palavrasChave: string;
  localizacao: string;
  senioridade: string;
  tags: string[];
}

export function HeadHunterSearchCreateAI() {
  const navigate = useNavigate();
  const [generatedData, setGeneratedData] = useState<Partial<BuscaData> | null>(null);

  const handleGenerate = async (messages: any[]) => {
    // Simulate AI generation
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setGeneratedData({
      nome: 'Desenvolvedor Full Stack Sênior',
      palavrasChave: 'React, TypeScript, Node.js, PostgreSQL, Docker',
      localizacao: 'São Paulo, SP',
      senioridade: 'Sênior',
      tags: ['Remoto', 'CLT', 'Urgente'],
    });
  };

  const handleAccept = () => {
    if (generatedData) {
      toast.success('Busca salva com sucesso', {
        position: 'top-center',
        duration: 3000,
      });

      // Navigate back to list after short delay
      setTimeout(() => {
        navigate('/headhunter/search');
      }, 1000);
    }
  };

  const handleEditManually = () => {
    if (generatedData) {
      toast.info('Abrindo formulário manual...', {
        position: 'top-center',
        duration: 2000,
      });

      // Could navigate to manual form with pre-filled data
      setTimeout(() => {
        navigate('/headhunter/search');
      }, 500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/headhunter/search')}
          className="h-10 w-10"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-[28px] leading-[39.2px] text-neutral-900 dark:text-neutral-50">
            Criar Busca com IA
          </h1>
          <p className="mt-2 text-[14px] leading-[19.6px] text-neutral-600 dark:text-neutral-400">
            Converse com a IA para definir critérios de busca automaticamente
          </p>
        </div>
      </div>

      {/* Chat In Modal Component - Full Screen */}
      <div className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
        <ChatInModal
          title="Descreva a vaga"
          description="Conte sobre o perfil que procura, senioridade, tecnologias e requisitos"
          onGenerate={handleGenerate}
          onAccept={handleAccept}
          onEditManually={handleEditManually}
          suggestedPrompts={[
            'Preciso de um desenvolvedor React sênior com experiência em TypeScript',
            'Designer UX/UI pleno para trabalho remoto em startup',
            'Engenheiro de dados com domínio de Python e AWS',
            'Product Manager com experiência em B2B SaaS',
          ]}
          renderPreview={() => (
            <div className="space-y-4">
              {generatedData ? (
                <>
                  <div>
                    <Label className="text-[12px] text-neutral-600 dark:text-neutral-400">
                      Nome da Busca
                    </Label>
                    <p className="mt-1 text-[14px] leading-[19.6px]">{generatedData.nome}</p>
                  </div>
                  <div>
                    <Label className="text-[12px] text-neutral-600 dark:text-neutral-400">
                      Palavras-chave
                    </Label>
                    <p className="mt-1 text-[14px] leading-[19.6px]">{generatedData.palavrasChave}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-[12px] text-neutral-600 dark:text-neutral-400">
                        Localização
                      </Label>
                      <p className="mt-1 text-[14px] leading-[19.6px]">{generatedData.localizacao}</p>
                    </div>
                    <div>
                      <Label className="text-[12px] text-neutral-600 dark:text-neutral-400">
                        Senioridade
                      </Label>
                      <p className="mt-1 text-[14px] leading-[19.6px]">{generatedData.senioridade}</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-[12px] text-neutral-600 dark:text-neutral-400">
                      Tags Aplicadas
                    </Label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {generatedData.tags?.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="mt-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-950/30">
                    <p className="text-[12px] leading-[16.8px] text-blue-900 dark:text-blue-100">
                      💡 <strong>Dica:</strong> A IA identificou automaticamente as melhores palavras-chave e tags para sua busca. Você pode refinar ou executar a busca imediatamente.
                    </p>
                  </div>
                </>
              ) : (
                <div className="flex h-[400px] items-center justify-center">
                  <div className="text-center">
                    <p className="text-[14px] text-neutral-500 dark:text-neutral-400">
                      Aguardando geração...
                    </p>
                    <p className="mt-2 text-[12px] text-neutral-400 dark:text-neutral-500">
                      Descreva o perfil que procura no chat ao lado
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        />
      </div>

      {/* Quick Save Action */}
      <div className="flex justify-between items-center rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-800/50">
        <div>
          <p className="text-[13px] leading-[18.2px] text-neutral-900 dark:text-neutral-50">
            Autosave ativado
          </p>
          <p className="text-[11px] leading-[15.4px] text-neutral-600 dark:text-neutral-400">
            Suas conversas são salvas automaticamente como rascunho
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => navigate('/headhunter/search')}
        >
          <Save className="h-4 w-4" />
          Salvar e voltar
        </Button>
      </div>
    </div>
  );
}
