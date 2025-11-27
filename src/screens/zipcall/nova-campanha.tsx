import { useState } from 'react';
import { Wand2, ArrowLeft, Sparkles, Check, Rocket } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';

export function ZipCallNovaCampanha() {
  const [userPrompt, setUserPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [campaignData, setCampaignData] = useState<any>(null);

  const handleGenerateCampaign = async () => {
    if (!userPrompt.trim()) return;

    setIsGenerating(true);
    setGenerationProgress(0);

    // Simulate AI generation with progress
    const progressInterval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 15;
      });
    }, 200);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    clearInterval(progressInterval);
    setGenerationProgress(100);

    // Simulate generated data
    setCampaignData({
      nome: 'Lançamento - Curso de Marketing Digital',
      objetivo: 'Gerar 500 leads qualificados em 30 dias',
      publicoAlvo: 'Empreendedores iniciantes de 25-45 anos interessados em marketing digital',
      orcamento: 'R$ 3.000,00',
      canais: ['Instagram', 'Facebook', 'Google Ads'],
      duracao: '30 dias',
      mensagemPrincipal: 'Aprenda marketing digital do zero e multiplique seus resultados',
    });

    setIsGenerating(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* CABEÇALHO */}
      <header className="flex items-center gap-4 border-b border-neutral-100 p-4">
        <button className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-neutral-50">
          <ArrowLeft className="h-5 w-5 text-neutral-700" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-neutral-900">Nova Campanha</h1>
          <p className="text-sm text-neutral-500">
            A IA vai criar tudo para você
          </p>
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="flex-1 overflow-auto px-4 pb-24 pt-6">
        <div className="mx-auto max-w-2xl space-y-6">
          {/* ÁREA DO PROMPT (DESTAQUE) */}
          <div className="rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 shadow-lg">
            <div className="mb-3 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-600" />
              <label className="text-base font-semibold text-neutral-900">
                Conte para o Agente
              </label>
            </div>
            <p className="mb-4 text-[15px] leading-relaxed text-neutral-600">
              O que você quer vender e qual a dor do seu cliente?
            </p>
            <textarea
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="Ex: Quero vender um curso de marketing digital para pessoas que querem aprender a vender online mas não sabem por onde começar..."
              className="w-full rounded-xl border-2 border-neutral-200 bg-white px-4 py-3 text-[17px] leading-relaxed text-neutral-900 placeholder:text-neutral-400 focus:border-blue-500 focus:outline-none"
              rows={5}
            />
            <Button
              onClick={handleGenerateCampaign}
              disabled={!userPrompt.trim() || isGenerating}
              className="mt-4 h-[52px] w-full gap-2 rounded-xl bg-blue-500 text-[17px] font-semibold shadow-lg hover:bg-blue-600"
            >
              <Wand2 className="h-5 w-5" />
              {isGenerating ? 'IA está criando...' : 'Criar com IA'}
            </Button>
          </div>

          {/* FEEDBACK VISUAL DE GERAÇÃO */}
          {isGenerating && (
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                  <Sparkles className="h-5 w-5 animate-pulse text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-base font-semibold text-neutral-900">
                    IA pensando e preenchendo campos...
                  </p>
                  <p className="text-sm text-neutral-500">
                    Analisando sua proposta
                  </p>
                </div>
              </div>
              <Progress value={generationProgress} className="h-2" />
            </div>
          )}

          {/* FORMULÁRIO PREENCHIDO PELA IA */}
          {campaignData && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <p className="text-base font-semibold text-neutral-900">
                  Campanha criada com sucesso!
                </p>
              </div>

              {/* CAMPOS PREENCHIDOS */}
              <div className="space-y-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
                {/* Nome da Campanha */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-600">
                    Nome da Campanha
                  </label>
                  <input
                    type="text"
                    value={campaignData.nome}
                    onChange={(e) =>
                      setCampaignData({ ...campaignData, nome: e.target.value })
                    }
                    className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-[17px] text-neutral-900 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                {/* Objetivo */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-600">
                    Objetivo Principal
                  </label>
                  <input
                    type="text"
                    value={campaignData.objetivo}
                    onChange={(e) =>
                      setCampaignData({
                        ...campaignData,
                        objetivo: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-[17px] text-neutral-900 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                {/* Público-Alvo */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-600">
                    Público-Alvo
                  </label>
                  <textarea
                    value={campaignData.publicoAlvo}
                    onChange={(e) =>
                      setCampaignData({
                        ...campaignData,
                        publicoAlvo: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-[17px] text-neutral-900 focus:border-blue-500 focus:outline-none"
                    rows={2}
                  />
                </div>

                {/* Grid 2 colunas */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-neutral-600">
                      Orçamento
                    </label>
                    <input
                      type="text"
                      value={campaignData.orcamento}
                      onChange={(e) =>
                        setCampaignData({
                          ...campaignData,
                          orcamento: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-[17px] text-neutral-900 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-neutral-600">
                      Duração
                    </label>
                    <input
                      type="text"
                      value={campaignData.duracao}
                      onChange={(e) =>
                        setCampaignData({
                          ...campaignData,
                          duracao: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-[17px] text-neutral-900 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Canais */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-600">
                    Canais Recomendados
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {campaignData.canais.map((canal: string) => (
                      <span
                        key={canal}
                        className="inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-[15px] font-medium text-blue-700"
                      >
                        {canal}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Mensagem Principal */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-600">
                    Mensagem Principal
                  </label>
                  <input
                    type="text"
                    value={campaignData.mensagemPrincipal}
                    onChange={(e) =>
                      setCampaignData({
                        ...campaignData,
                        mensagemPrincipal: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-[17px] text-neutral-900 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* DICA */}
              <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
                <p className="text-[15px] leading-relaxed text-blue-900">
                  💡 <strong>Dica:</strong> A IA preencheu tudo automaticamente,
                  mas você pode editar qualquer campo se quiser ajustar.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* BOTÃO DE AÇÃO FIXO */}
      {campaignData && (
        <div className="fixed bottom-0 left-0 right-0 border-t border-neutral-100 bg-white p-4 shadow-lg">
          <div className="mx-auto max-w-2xl">
            <Button className="h-[56px] w-full gap-2 rounded-xl bg-green-500 text-[18px] font-bold shadow-lg hover:bg-green-600">
              <Rocket className="h-5 w-5" />
              Lançar Campanha
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
