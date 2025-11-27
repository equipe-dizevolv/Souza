import { useState } from "react";
import { ArrowRight, ArrowLeft, DollarSign, Lightbulb, Clock, AlertTriangle, Target } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import { toast } from "sonner@2.0.3";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Checkbox } from "../../components/ui/checkbox";

type FormData = {
  monthlyGoal: string;
  niche: string;
  availableResources: string[];
  availableTime: string;
  restrictions: string;
};

const steps = [
  { id: 1, title: "Meta Financeira", icon: DollarSign },
  { id: 2, title: "Nicho e Ideia", icon: Lightbulb },
  { id: 3, title: "Recursos", icon: Target },
  { id: 4, title: "Tempo e Restrições", icon: Clock },
];

const resourceOptions = [
  "Tenho capital inicial (R$ 500+)",
  "Possuo conhecimento técnico específico",
  "Tenho audiência em redes sociais",
  "Possuo equipamento (câmera, computador, etc)",
  "Tenho experiência com vendas",
  "Nenhum recurso inicial",
];

export function IncomeWizard() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    monthlyGoal: "",
    niche: "",
    availableResources: [],
    availableTime: "",
    restrictions: "",
  });

  const formatCurrency = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (!numbers) return "";
    const amount = parseInt(numbers) / 100;
    return amount.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const handleCurrencyChange = (value: string) => {
    setFormData(prev => ({ ...prev, monthlyGoal: formatCurrency(value) }));
  };

  const handleResourceToggle = (resource: string) => {
    setFormData(prev => ({
      ...prev,
      availableResources: prev.availableResources.includes(resource)
        ? prev.availableResources.filter(r => r !== resource)
        : [...prev.availableResources, resource],
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.monthlyGoal || formData.monthlyGoal === "R$ 0,00") {
          toast.error("Defina uma meta mensal válida");
          return false;
        }
        const goalValue = parseInt(formData.monthlyGoal.replace(/\D/g, "")) / 100;
        if (goalValue > 10000) {
          toast.error("A meta máxima suportada é R$ 10.000/mês");
          return false;
        }
        return true;
      case 2:
        if (!formData.niche.trim()) {
          toast.error("Descreva seu nicho ou ideia de negócio");
          return false;
        }
        return true;
      case 3:
        if (formData.availableResources.length === 0) {
          toast.error("Selecione ao menos um recurso disponível");
          return false;
        }
        return true;
      case 4:
        if (!formData.availableTime) {
          toast.error("Informe quanto tempo você pode dedicar");
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) return;

    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleGeneratePlan();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleGeneratePlan = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      navigate("/income/plan-90d");
      toast.success("Plano 90D gerado com sucesso!");
    }, 2000);
  };

  const progressPercentage = (currentStep / steps.length) * 100;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="mb-2">Renda Automática – Assistente de Criação</h1>
        <p className="text-muted-foreground">
          Crie sua estratégia personalizada para alcançar até R$ 10.000/mês em 90 dias
        </p>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Progresso</span>
              <span>Etapa {currentStep} de {steps.length}</span>
            </div>
            <Progress value={progressPercentage} />
          </div>

          {/* Steps Indicator */}
          <div className="grid grid-cols-4 gap-2 mt-6">
            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <div
                  key={step.id}
                  className={`flex flex-col items-center gap-2 p-3 rounded-lg border ${
                    isActive ? "bg-primary/10 border-primary" : isCompleted ? "bg-muted" : "bg-card"
                  }`}
                >
                  <div
                    className={`rounded-full p-2 ${
                      isActive ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <p className="text-xs text-center">{step.title}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {currentStep === 1 && (
              <>
                <DollarSign className="h-5 w-5" /> Meta Financeira
              </>
            )}
            {currentStep === 2 && (
              <>
                <Lightbulb className="h-5 w-5" /> Nicho e Ideia
              </>
            )}
            {currentStep === 3 && (
              <>
                <Target className="h-5 w-5" /> Recursos Disponíveis
              </>
            )}
            {currentStep === 4 && (
              <>
                <Clock className="h-5 w-5" /> Tempo e Restrições
              </>
            )}
          </CardTitle>
          <CardDescription>
            {currentStep === 1 && "Defina quanto você quer faturar por mês (até R$ 10.000)"}
            {currentStep === 2 && "Qual área ou produto você quer explorar?"}
            {currentStep === 3 && "Selecione os recursos que você já possui"}
            {currentStep === 4 && "Quanto tempo e quais limitações você tem?"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step 1: Meta Financeira */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="monthlyGoal">Meta Mensal (R$) *</Label>
                <Input
                  id="monthlyGoal"
                  placeholder="R$ 0,00"
                  value={formData.monthlyGoal}
                  onChange={(e) => handleCurrencyChange(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Digite o valor que você deseja alcançar mensalmente
                </p>
              </div>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  <strong>Importante:</strong> Este assistente é voltado para estratégias realistas de até R$ 10.000/mês. Metas maiores exigem planejamento mais complexo.
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Step 2: Nicho/Ideia */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="niche">Nicho ou Ideia de Negócio *</Label>
                <Textarea
                  id="niche"
                  placeholder="Ex: Consultoria para pequenos empreendedores, Criação de conteúdo sobre finanças, Venda de infoprodutos sobre Marketing Digital..."
                  value={formData.niche}
                  onChange={(e) => setFormData(prev => ({ ...prev, niche: e.target.value }))}
                  rows={5}
                />
                <p className="text-sm text-muted-foreground">
                  Descreva brevemente a área que você quer atuar ou o produto/serviço que pretende oferecer
                </p>
              </div>

              <Alert>
                <AlertDescription className="text-sm">
                  💡 <strong>Dica:</strong> Seja específico! Quanto mais claro for seu nicho, melhor será o plano gerado.
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Step 3: Recursos */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="space-y-3">
                <Label>Recursos Disponíveis *</Label>
                {resourceOptions.map((resource) => (
                  <div key={resource} className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50">
                    <Checkbox
                      checked={formData.availableResources.includes(resource)}
                      onCheckedChange={() => handleResourceToggle(resource)}
                      className="mt-0.5"
                    />
                    <Label className="cursor-pointer text-sm">{resource}</Label>
                  </div>
                ))}
              </div>

              {formData.availableResources.length > 0 && (
                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="text-sm mb-2">Recursos selecionados:</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.availableResources.map((resource) => (
                      <Badge key={resource} variant="secondary">
                        {resource}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Tempo e Restrições */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="availableTime">Tempo Disponível *</Label>
                <Select 
                  value={formData.availableTime} 
                  onValueChange={(v) => setFormData(prev => ({ ...prev, availableTime: v }))}
                >
                  <SelectTrigger id="availableTime">
                    <SelectValue placeholder="Selecione quanto tempo você pode dedicar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-2h/dia">1-2 horas por dia</SelectItem>
                    <SelectItem value="3-4h/dia">3-4 horas por dia</SelectItem>
                    <SelectItem value="5-6h/dia">5-6 horas por dia</SelectItem>
                    <SelectItem value="tempo-integral">Tempo integral (8h+)</SelectItem>
                    <SelectItem value="fins-de-semana">Apenas finais de semana</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="restrictions">Restrições ou Limitações (Opcional)</Label>
                <Textarea
                  id="restrictions"
                  placeholder="Ex: Não posso aparecer em vídeos, Preciso de resultados em 60 dias, Não tenho capital inicial..."
                  value={formData.restrictions}
                  onChange={(e) => setFormData(prev => ({ ...prev, restrictions: e.target.value }))}
                  rows={4}
                />
              </div>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  <strong>Disclaimers:</strong> Estratégias de renda não garantem resultados. Evite nichos proibidos (apostas, forex, pirâmides). Este plano não substitui consultoria financeira ou jurídica.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 1 || isLoading}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        <Button onClick={handleNext} disabled={isLoading}>
          {isLoading ? (
            "Gerando Plano..."
          ) : currentStep === steps.length ? (
            <>
              Gerar Plano 90D
              <Target className="ml-2 h-4 w-4" />
            </>
          ) : (
            <>
              Próximo
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
