import { useState } from "react";
import { Search, Eye, Download, FileText, BarChart3, Calendar, TrendingUp } from "lucide-react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { toast } from "sonner@2.0.3";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Separator } from "../../components/ui/separator";

type Account = {
  id: string;
  name: string;
  email: string;
  plan: string;
  status: "Ativo" | "Inativo";
};

type KPI = {
  module: string;
  metric: string;
  value: string;
  change: string;
};

const mockAccounts: Account[] = [
  { id: "ACC001", name: "Empresa Alpha", email: "contato@alpha.com", plan: "Growth", status: "Ativo" },
  { id: "ACC002", name: "Startup Beta", email: "admin@beta.com", plan: "Pro", status: "Ativo" },
  { id: "ACC003", name: "Negócio Gamma", email: "info@gamma.com", plan: "Starter", status: "Inativo" },
];

const mockKPIs: Record<string, KPI[]> = {
  "ACC001": [
    { module: "Marketing", metric: "Briefings criados", value: "24", change: "+18%" },
    { module: "Marketing", metric: "Gerações de conteúdo", value: "67", change: "+32%" },
    { module: "Vendas Online", metric: "Tarefas no funil", value: "42", change: "+12%" },
    { module: "Vendas Online", metric: "Taxa de conclusão", value: "68%", change: "+5%" },
    { module: "Red Hunter", metric: "Buscas pagas", value: "5", change: "0%" },
    { module: "Red Hunter", metric: "Perfis qualificados", value: "38", change: "+15%" },
  ],
  "ACC002": [
    { module: "Marketing", metric: "Briefings criados", value: "15", change: "+8%" },
    { module: "Consultoria", metric: "Planos gerados", value: "3", change: "+100%" },
    { module: "Renda Automática", metric: "Planos 90D ativos", value: "1", change: "Novo" },
  ],
  "ACC003": [
    { module: "Marketing", metric: "Briefings criados", value: "8", change: "-20%" },
    { module: "Vendas Online", metric: "Tarefas no funil", value: "12", change: "-40%" },
  ],
};

export function AccountsPanel() {
  const [selectedAccount, setSelectedAccount] = useState<string>(mockAccounts[0].id);
  const [dateRange, setDateRange] = useState("30d");
  const [searchTerm, setSearchTerm] = useState("");

  const currentAccount = mockAccounts.find(acc => acc.id === selectedAccount);
  const currentKPIs = mockKPIs[selectedAccount] || [];

  const filteredKPIs = currentKPIs.filter(kpi =>
    kpi.module.toLowerCase().includes(searchTerm.toLowerCase()) ||
    kpi.metric.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportPDF = () => {
    toast.success(`Gerando relatório PDF para ${currentAccount?.name}...`);
  };

  const handleExportCSV = () => {
    toast.success(`Exportando dados CSV para ${currentAccount?.name}...`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="mb-2">Painel do Consultor</h1>
        <p className="text-muted-foreground">
          Acompanhe as contas dos clientes (acesso somente leitura)
        </p>
      </div>

      {/* Alert */}
      <Alert>
        <Eye className="h-4 w-4" />
        <AlertDescription>
          <strong>Modo Somente Leitura:</strong> Você pode visualizar e exportar relatórios, mas não pode editar dados das contas.
        </AlertDescription>
      </Alert>

      {/* Account Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Selecionar Conta</CardTitle>
          <CardDescription>Escolha a conta do cliente que deseja acompanhar</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm">Conta do Cliente</label>
              <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {mockAccounts.map(account => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.name} ({account.id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm">Período</label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Últimos 7 dias</SelectItem>
                  <SelectItem value="30d">Últimos 30 dias</SelectItem>
                  <SelectItem value="90d">Últimos 90 dias</SelectItem>
                  <SelectItem value="12m">Últimos 12 meses</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {currentAccount && (
            <div className="rounded-lg border p-4 bg-muted/30 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Conta Selecionada</p>
                  <p>{currentAccount.name}</p>
                </div>
                <Badge variant={currentAccount.status === "Ativo" ? "default" : "secondary"}>
                  {currentAccount.status}
                </Badge>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">E-mail</p>
                  <p>{currentAccount.email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Plano</p>
                  <p>{currentAccount.plan}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* KPIs Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Indicadores-Chave (KPIs)
              </CardTitle>
              <CardDescription>
                Métricas por módulo para o período selecionado
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleExportCSV}>
                <FileText className="mr-2 h-4 w-4" />
                CSV
              </Button>
              <Button size="sm" onClick={handleExportPDF}>
                <Download className="mr-2 h-4 w-4" />
                PDF
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por módulo ou métrica..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          {filteredKPIs.length === 0 ? (
            <div className="h-32 flex items-center justify-center text-muted-foreground">
              <p>Nenhuma métrica disponível para esta conta</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Módulo</TableHead>
                    <TableHead>Métrica</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Variação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredKPIs.map((kpi, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Badge variant="outline">{kpi.module}</Badge>
                      </TableCell>
                      <TableCell>{kpi.metric}</TableCell>
                      <TableCell className="text-lg">{kpi.value}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {kpi.change.startsWith("+") && (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          )}
                          <Badge
                            variant={
                              kpi.change.startsWith("+")
                                ? "default"
                                : kpi.change.startsWith("-")
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {kpi.change}
                          </Badge>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Module Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Marketing</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl mb-1">
              {currentKPIs.find(k => k.module === "Marketing" && k.metric.includes("Briefings"))?.value || "0"}
            </p>
            <p className="text-sm text-muted-foreground">Briefings criados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Vendas Online</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl mb-1">
              {currentKPIs.find(k => k.module === "Vendas Online" && k.metric.includes("Taxa"))?.value || "0%"}
            </p>
            <p className="text-sm text-muted-foreground">Taxa de conclusão</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Red Hunter</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl mb-1">
              {currentKPIs.find(k => k.module === "Red Hunter" && k.metric.includes("Perfis"))?.value || "0"}
            </p>
            <p className="text-sm text-muted-foreground">Perfis qualificados</p>
          </CardContent>
        </Card>
      </div>

      {/* Access Log */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Registro de Acesso
          </CardTitle>
          <CardDescription>Suas últimas visualizações desta conta</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              { timestamp: "2025-11-04 15:30", action: "Visualizou KPIs" },
              { timestamp: "2025-11-03 10:15", action: "Exportou relatório PDF" },
              { timestamp: "2025-11-01 14:20", action: "Visualizou KPIs" },
            ].map((log, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border text-sm">
                <span>{log.action}</span>
                <span className="text-muted-foreground">{log.timestamp}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}