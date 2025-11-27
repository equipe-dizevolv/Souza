import { useState } from "react";
import { Search, Filter, Plus, MoreVertical, Edit, Trash2, DollarSign } from "lucide-react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { Skeleton } from "../../components/ui/skeleton";
import { toast } from "sonner@2.0.3";
import { TablePagination } from "../../components/table-pagination";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../../components/ui/alert-dialog";
import { Checkbox } from "../../components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";

type Plan = {
  id: string;
  name: string;
  modules: string[];
  price: string;
  cycle: "Mensal" | "Trimestral" | "Anual";
  status: "Ativo" | "Inativo";
  subscribers: number;
  createdAt: string;
};

const availableModules = [
  "Marketing",
  "Red Hunter",
  "Vendas Online",
  "Automatização WhatsApp",
  "Consultoria Online",
  "Renda Automática",
];

const mockPlans: Plan[] = [
  { id: "PLN001", name: "Starter", modules: ["Marketing", "Vendas Online"], price: "R$ 97,00", cycle: "Mensal", status: "Ativo", subscribers: 45, createdAt: "2025-01-15" },
  { id: "PLN002", name: "Growth", modules: ["Marketing", "Vendas Online", "Automatização WhatsApp", "Red Hunter"], price: "R$ 197,00", cycle: "Mensal", status: "Ativo", subscribers: 28, createdAt: "2025-01-15" },
  { id: "PLN003", name: "Pro", modules: availableModules, price: "R$ 297,00", cycle: "Mensal", status: "Ativo", subscribers: 12, createdAt: "2025-01-15" },
  { id: "PLN004", name: "Growth Anual", modules: ["Marketing", "Vendas Online", "Automatização WhatsApp"], price: "R$ 1.970,00", cycle: "Anual", status: "Ativo", subscribers: 8, createdAt: "2025-02-01" },
];

export function PlansSubscriptions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [plans, setPlans] = useState<Plan[]>(mockPlans);
  const [currentPage, setCurrentPage] = useState(1);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    modules: [] as string[],
    price: "",
    cycle: "Mensal" as "Mensal" | "Trimestral" | "Anual",
  });

  const itemsPerPage = 10;

  const filteredPlans = plans.filter(plan =>
    plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPlans.length / itemsPerPage);
  const paginatedPlans = filteredPlans.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
    setFormData(prev => ({ ...prev, price: formatCurrency(value) }));
  };

  const handleModuleToggle = (module: string) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.includes(module)
        ? prev.modules.filter(m => m !== module)
        : [...prev.modules, module],
    }));
  };

  const handleCreate = () => {
    if (!formData.name.trim() || formData.modules.length === 0 || !formData.price) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const newPlan: Plan = {
        id: `PLN${(plans.length + 1).toString().padStart(3, "0")}`,
        name: formData.name,
        modules: formData.modules,
        price: formData.price,
        cycle: formData.cycle,
        status: "Ativo",
        subscribers: 0,
        createdAt: new Date().toISOString().split("T")[0],
      };

      setPlans(prev => [newPlan, ...prev]);
      setIsLoading(false);
      setCreateDialogOpen(false);
      setFormData({ name: "", modules: [], price: "", cycle: "Mensal" });
      toast.success("Plano criado com sucesso!");
    }, 1000);
  };

  const handleToggleStatus = (id: string) => {
    setPlans(prev =>
      prev.map(plan =>
        plan.id === id
          ? { ...plan, status: plan.status === "Ativo" ? "Inativo" : "Ativo" }
          : plan
      )
    );
    toast.success("Status do plano atualizado");
  };

  const handleDelete = () => {
    if (!selectedPlan) return;

    setPlans(prev => prev.filter(plan => plan.id !== selectedPlan.id));
    setDeleteDialogOpen(false);
    setSelectedPlan(null);
    toast.success("Plano excluído");
  };

  const getStatusBadge = (status: Plan["status"]) => {
    return (
      <Badge variant={status === "Ativo" ? "default" : "secondary"}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="mb-2">Planos & Assinaturas</h1>
        <p className="text-muted-foreground">
          Gerencie planos de assinatura, módulos incluídos e precificação
        </p>
      </div>

      {/* Actions Bar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar planos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filtros
        </Button>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Plano
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Módulos</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Ciclo</TableHead>
              <TableHead>Assinantes</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[70px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                </TableRow>
              ))
            ) : paginatedPlans.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <DollarSign className="h-12 w-12 mb-4 opacity-50" />
                    <p className="mb-1">Nenhum plano encontrado</p>
                    <p>Crie seu primeiro plano de assinatura</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedPlans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell>{plan.id}</TableCell>
                  <TableCell>{plan.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {plan.modules.slice(0, 2).map(mod => (
                        <Badge key={mod} variant="outline" className="text-xs">
                          {mod}
                        </Badge>
                      ))}
                      {plan.modules.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{plan.modules.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{plan.price}</TableCell>
                  <TableCell className="text-muted-foreground">{plan.cycle}</TableCell>
                  <TableCell>{plan.subscribers}</TableCell>
                  <TableCell>{getStatusBadge(plan.status)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => toast.info("Edição será implementada")}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleStatus(plan.id)}>
                          {plan.status === "Ativo" ? "Desativar" : "Ativar"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => {
                            setSelectedPlan(plan);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl" onEscapeKeyDown={(e) => !isLoading && setCreateDialogOpen(false)}>
          <DialogHeader>
            <DialogTitle>Adicionar Novo Plano</DialogTitle>
            <DialogDescription>
              Configure o plano de assinatura com módulos e precificação
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Plano *</Label>
                <Input
                  id="name"
                  placeholder="Ex: Starter, Growth, Pro"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Preço (R$) *</Label>
                <Input
                  id="price"
                  placeholder="R$ 0,00"
                  value={formData.price}
                  onChange={(e) => handleCurrencyChange(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cycle">Ciclo de Cobrança *</Label>
              <Select
                value={formData.cycle}
                onValueChange={(v) => setFormData(prev => ({ ...prev, cycle: v as typeof formData.cycle }))}
              >
                <SelectTrigger id="cycle">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mensal">Mensal</SelectItem>
                  <SelectItem value="Trimestral">Trimestral</SelectItem>
                  <SelectItem value="Anual">Anual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Módulos Incluídos *</Label>
              <div className="grid gap-2 md:grid-cols-2">
                {availableModules.map(module => (
                  <div
                    key={module}
                    className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer"
                    onClick={() => handleModuleToggle(module)}
                  >
                    <Checkbox
                      checked={formData.modules.includes(module)}
                      onCheckedChange={() => handleModuleToggle(module)}
                    />
                    <Label className="cursor-pointer text-sm">{module}</Label>
                  </div>
                ))}
              </div>
            </div>

            {formData.modules.length > 0 && (
              <div className="rounded-lg bg-muted/50 p-4">
                <p className="text-sm mb-2">Módulos selecionados: {formData.modules.length}</p>
                <div className="flex flex-wrap gap-2">
                  {formData.modules.map(mod => (
                    <Badge key={mod} variant="secondary">
                      {mod}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button onClick={handleCreate} disabled={isLoading}>
              {isLoading ? "Criando..." : "Criar Plano"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Plano</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o plano "{selectedPlan?.name}"? 
              {selectedPlan && selectedPlan.subscribers > 0 && (
                <span className="block mt-2 text-destructive">
                  ⚠️ Este plano possui {selectedPlan.subscribers} assinantes ativos!
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}