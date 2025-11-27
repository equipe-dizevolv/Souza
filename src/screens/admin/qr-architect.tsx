import { useState } from "react";
import { QrCode, Sparkles, Save, BarChart, Link2, MessageSquare } from "lucide-react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Label } from "../../components/ui/label";
import { toast } from "sonner@2.0.3";
import { Separator } from "../../components/ui/separator";
import { Textarea } from "../../components/ui/textarea";
import { Badge } from "../../components/ui/badge";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";

type QRConfig = {
  domain: string;
  route: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
};

type CTAOption = {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
};

type AnalyticsData = {
  metric: string;
  value: string;
  change: string;
};

const mockAnalytics: AnalyticsData[] = [
  { metric: "Scans Totais (QR)", value: "1.247", change: "+23%" },
  { metric: "Conversões", value: "342", change: "+18%" },
  { metric: "Taxa de Conversão", value: "27,4%", change: "+5%" },
  { metric: "Origem: Livro Físico", value: "892", change: "+31%" },
];

export function QRArchitect() {
  const [config, setConfig] = useState<QRConfig>({
    domain: "https://plataforma.com",
    route: "/arquiteto",
    utmSource: "livro_fisico",
    utmMedium: "qr_code",
    utmCampaign: "lancamento_2025",
  });

  const [ctaOptions, setCtaOptions] = useState<CTAOption[]>([
    { id: "cta1", label: "Tirar dúvidas", description: "Abrir chat com Agente Arquiteto", enabled: true },
    { id: "cta2", label: "Conhecer os módulos", description: "Navegar para página de produtos", enabled: true },
    { id: "cta3", label: "Comprar o livro", description: "Redirecionar para Amazon/Hotmart", enabled: true },
    { id: "cta4", label: "Agendar demo", description: "Abrir calendário para agendamento", enabled: false },
  ]);

  const [isSaving, setIsSaving] = useState(false);

  const fullUrl = `${config.domain}${config.route}?utm_source=${config.utmSource}&utm_medium=${config.utmMedium}&utm_campaign=${config.utmCampaign}`;

  const handleToggleCTA = (id: string) => {
    setCtaOptions(prev =>
      prev.map(cta => cta.id === id ? { ...cta, enabled: !cta.enabled } : cta)
    );
  };

  const handleSave = () => {
    if (!config.domain.trim() || !config.route.trim()) {
      toast.error("Domínio e rota são obrigatórios");
      return;
    }

    setIsSaving(true);

    setTimeout(() => {
      setIsSaving(false);
      toast.success("Configurações de QR e Arquiteto salvas com sucesso!");
    }, 1000);
  };

  const handleCopyURL = () => {
    navigator.clipboard.writeText(fullUrl);
    toast.success("URL copiada para a área de transferência!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="mb-2">QR Code & Agente Arquiteto</h1>
        <p className="text-muted-foreground">
          Configure o destino dinâmico do QR Code do livro e as opções do Agente "Arquiteto"
        </p>
      </div>

      {/* QR Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            Configuração de Destino do QR Code
          </CardTitle>
          <CardDescription>
            Defina para onde os leitores do livro serão direcionados ao escanear o QR
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="domain">Domínio *</Label>
              <Input
                id="domain"
                placeholder="https://plataforma.com"
                value={config.domain}
                onChange={(e) => setConfig(prev => ({ ...prev, domain: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="route">Rota/Página *</Label>
              <Input
                id="route"
                placeholder="/arquiteto"
                value={config.route}
                onChange={(e) => setConfig(prev => ({ ...prev, route: e.target.value }))}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BarChart className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm">Parâmetros UTM para Tracking</h3>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="utmSource">utm_source</Label>
                <Input
                  id="utmSource"
                  placeholder="livro_fisico"
                  value={config.utmSource}
                  onChange={(e) => setConfig(prev => ({ ...prev, utmSource: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="utmMedium">utm_medium</Label>
                <Input
                  id="utmMedium"
                  placeholder="qr_code"
                  value={config.utmMedium}
                  onChange={(e) => setConfig(prev => ({ ...prev, utmMedium: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="utmCampaign">utm_campaign</Label>
                <Input
                  id="utmCampaign"
                  placeholder="lancamento_2025"
                  value={config.utmCampaign}
                  onChange={(e) => setConfig(prev => ({ ...prev, utmCampaign: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <Alert>
            <Link2 className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>URL Completa:</strong>
              <div className="mt-2 flex items-center gap-2">
                <code className="flex-1 text-xs bg-muted px-2 py-1 rounded">
                  {fullUrl}
                </code>
                <Button size="sm" variant="outline" onClick={handleCopyURL}>
                  Copiar
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Architect Agent CTAs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Agente "Arquiteto" – CTAs Iniciais
          </CardTitle>
          <CardDescription>
            Configure as opções que aparecem para o usuário ao acessar o agente
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {ctaOptions.map((cta) => (
            <div
              key={cta.id}
              className="flex items-start gap-4 p-4 rounded-lg border hover:bg-muted/50 cursor-pointer"
              onClick={() => handleToggleCTA(cta.id)}
            >
              <div className="mt-0.5">
                <input
                  type="checkbox"
                  checked={cta.enabled}
                  onChange={() => handleToggleCTA(cta.id)}
                  className="h-4 w-4"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm">{cta.label}</h4>
                  {cta.enabled && <Badge variant="default" className="text-xs">Ativo</Badge>}
                </div>
                <p className="text-sm text-muted-foreground">{cta.description}</p>
              </div>
            </div>
          ))}

          <Alert>
            <MessageSquare className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>Importante:</strong> As CTAs habilitadas aparecerão como opções rápidas quando o usuário acessar o Agente Arquiteto pela primeira vez.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5" />
            Métricas de Conversão (Últimos 30 dias)
          </CardTitle>
          <CardDescription>Acompanhe o desempenho do QR Code e do Agente Arquiteto</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Métrica</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Variação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockAnalytics.map((metric, index) => (
                  <TableRow key={index}>
                    <TableCell>{metric.metric}</TableCell>
                    <TableCell className="text-2xl">{metric.value}</TableCell>
                    <TableCell>
                      <Badge variant={metric.change.startsWith("+") ? "default" : "secondary"}>
                        {metric.change}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Event Log */}
      <Card>
        <CardHeader>
          <CardTitle>Eventos Recentes</CardTitle>
          <CardDescription>Últimas interações via QR Code</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { timestamp: "2025-11-04 15:42", event: "QR Code escaneado", source: "livro_fisico", action: "Tirar dúvidas" },
              { timestamp: "2025-11-04 14:30", event: "QR Code escaneado", source: "livro_fisico", action: "Conhecer os módulos" },
              { timestamp: "2025-11-04 13:15", event: "QR Code escaneado", source: "livro_fisico", action: "Comprar o livro" },
              { timestamp: "2025-11-04 11:05", event: "QR Code escaneado", source: "livro_fisico", action: "Tirar dúvidas" },
            ].map((log, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border text-sm">
                <div className="space-y-1">
                  <p>{log.event}</p>
                  <p className="text-xs text-muted-foreground">{log.timestamp}</p>
                </div>
                <div className="text-right space-y-1">
                  <Badge variant="outline">{log.action}</Badge>
                  <p className="text-xs text-muted-foreground">{log.source}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "Salvando..." : "Salvar Configurações"}
        </Button>
      </div>
    </div>
  );
}