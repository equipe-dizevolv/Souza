import { useState } from "react";
import { DollarSign, Save, History, AlertCircle } from "lucide-react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Label } from "../../components/ui/label";
import { toast } from "sonner@2.0.3";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Separator } from "../../components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";

type ProductConfig = {
  price: string;
  defaultQuantity: number;
  retentionMonths: number;
};

type AuditLog = {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  oldValue: string;
  newValue: string;
};

const mockAuditLogs: AuditLog[] = [
  { id: "A001", timestamp: "2025-11-02 14:30", user: "admin@plataforma.com", action: "Preço alterado", oldValue: "R$ 12,90", newValue: "R$ 14,90" },
  { id: "A002", timestamp: "2025-10-15 10:15", user: "admin@plataforma.com", action: "Retenção atualizada", oldValue: "3 meses", newValue: "6 meses" },
  { id: "A003", timestamp: "2025-09-20 16:45", user: "admin@plataforma.com", action: "Quantidade padrão", oldValue: "5 perfis", newValue: "10 perfis" },
];

export function OneOffProducts() {
  const [config, setConfig] = useState<ProductConfig>({
    price: "R$ 14,90",
    defaultQuantity: 10,
    retentionMonths: 6,
  });
  const [auditLogs] = useState<AuditLog[]>(mockAuditLogs);
  const [isSaving, setIsSaving] = useState(false);

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
    setConfig(prev => ({ ...prev, price: formatCurrency(value) }));
  };

  const handleSave = () => {
    if (!config.price || config.price === "R$ 0,00") {
      toast.error("Defina um preço válido");
      return;
    }

    if (config.defaultQuantity < 1) {
      toast.error("A quantidade mínima é 1 perfil");
      return;
    }

    if (config.retentionMonths < 1) {
      toast.error("A retenção mínima é 1 mês (LGPD)");
      return;
    }

    setIsSaving(true);

    setTimeout(() => {
      setIsSaving(false);
      toast.success("Configurações salvas com sucesso! Checkout atualizado.");
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="mb-2">Produtos Avulsos – Red Hunter</h1>
        <p className="text-muted-foreground">
          Configure preço, quantidade padrão e retenção de dados para buscas pay-per-search
        </p>
      </div>

      {/* Main Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Configuração do Produto "Busca Red Hunter"
          </CardTitle>
          <CardDescription>
            Atualize as configurações de precificação e limites do produto
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="price">Preço por Busca (R$) *</Label>
              <Input
                id="price"
                placeholder="R$ 0,00"
                value={config.price}
                onChange={(e) => handleCurrencyChange(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Valor cobrado por cada execução de busca
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantidade Padrão de Perfis *</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                max="50"
                value={config.defaultQuantity}
                onChange={(e) => setConfig(prev => ({ ...prev, defaultQuantity: parseInt(e.target.value) || 0 }))}
              />
              <p className="text-sm text-muted-foreground">
                Número estimado de perfis retornados por busca
              </p>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="retention">Retenção de Dados LGPD (meses) *</Label>
            <Input
              id="retention"
              type="number"
              min="1"
              max="24"
              value={config.retentionMonths}
              onChange={(e) => setConfig(prev => ({ ...prev, retentionMonths: parseInt(e.target.value) || 0 }))}
            />
            <p className="text-sm text-muted-foreground">
              Período que os dados dos candidatos serão mantidos antes de exclusão automática
            </p>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>LGPD:</strong> Os dados coletados nas buscas serão automaticamente excluídos após o período de retenção configurado. Certifique-se de que os usuários estejam cientes dessa política.
            </AlertDescription>
          </Alert>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={isSaving}>
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Salvando..." : "Salvar Configurações"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Preview do Checkout</CardTitle>
          <CardDescription>Como as informações aparecerão para o usuário</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border p-6 bg-muted/30 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="mb-1">Busca Red Hunter</h3>
                <p className="text-sm text-muted-foreground">
                  Entrega estimada: {config.defaultQuantity} perfis qualificados
                </p>
              </div>
              <Badge variant="default" className="text-base px-3 py-1">
                {config.price}
              </Badge>
            </div>

            <Separator />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Produto:</span>
                <span>Busca Pay-per-Search</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Perfis estimados:</span>
                <span>{config.defaultQuantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Retenção de dados:</span>
                <span>{config.retentionMonths} meses</span>
              </div>
            </div>

            <Separator />

            <p className="text-xs text-muted-foreground">
              * Dados coletados serão automaticamente excluídos após {config.retentionMonths} meses (LGPD)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Audit Log */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Histórico de Alterações
          </CardTitle>
          <CardDescription>Registro de auditoria de mudanças nas configurações</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Ação</TableHead>
                  <TableHead>Valor Anterior</TableHead>
                  <TableHead>Novo Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                      Nenhuma alteração registrada
                    </TableCell>
                  </TableRow>
                ) : (
                  auditLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-sm">{log.timestamp}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{log.user}</TableCell>
                      <TableCell className="text-sm">{log.action}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{log.oldValue}</TableCell>
                      <TableCell className="text-sm">
                        <Badge variant="outline">{log.newValue}</Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Estatísticas de Vendas</CardTitle>
          <CardDescription>Métricas do produto nos últimos 30 dias</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Buscas Vendidas</p>
              <p className="text-2xl">47</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Receita Total</p>
              <p className="text-2xl">R$ 700,30</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Ticket Médio</p>
              <p className="text-2xl">R$ 14,90</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}