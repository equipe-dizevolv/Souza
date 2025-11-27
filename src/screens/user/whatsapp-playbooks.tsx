import { useState } from "react";
import { Search, Filter, Plus, MoreVertical, Eye, Edit, Trash2, BookOpen, Copy, CheckCircle } from "lucide-react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Skeleton } from "../../components/ui/skeleton";
import { toast } from "sonner@2.0.3";
import { TablePagination } from "../../components/table-pagination";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu";
import { Textarea } from "../../components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../../components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";

type Playbook = {
  id: string;
  name: string;
  objective: string;
  channel: string;
  audience: string;
  status: "Rascunho" | "Ativo" | "Arquivado";
  createdAt: string;
};

const mockPlaybooks: Playbook[] = [
  { id: "PB001", name: "Boas-vindas Automáticas", objective: "Engajar novos contatos", channel: "WhatsApp Business", audience: "Novos leads", status: "Ativo", createdAt: "2025-10-15" },
  { id: "PB002", name: "Qualificação de Leads", objective: "Filtrar leads quentes", channel: "WhatsApp Business", audience: "Leads interessados", status: "Ativo", createdAt: "2025-10-20" },
  { id: "PB003", name: "Resposta de Ausência", objective: "Informar horário de atendimento", channel: "WhatsApp Business", audience: "Todos os contatos", status: "Ativo", createdAt: "2025-10-25" },
  { id: "PB004", name: "Envio de Orçamento", objective: "Automatizar envio de propostas", channel: "WhatsApp Business", audience: "Leads qualificados", status: "Rascunho", createdAt: "2025-11-01" },
  { id: "PB005", name: "Follow-up de Fechamento", objective: "Retomar conversas paradas", channel: "WhatsApp Business", audience: "Oportunidades em negociação", status: "Ativo", createdAt: "2025-11-03" },
];

export function WhatsAppPlaybooks() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [playbooks, setPlaybooks] = useState<Playbook[]>(mockPlaybooks);
  const [currentPage, setCurrentPage] = useState(1);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPlaybook, setSelectedPlaybook] = useState<Playbook | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    objective: "",
    channel: "WhatsApp Business",
    audience: "",
  });

  const itemsPerPage = 10;

  const filteredPlaybooks = playbooks.filter(pb =>
    pb.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pb.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pb.objective.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPlaybooks.length / itemsPerPage);
  const paginatedPlaybooks = filteredPlaybooks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCreate = () => {
    if (!formData.name.trim() || !formData.objective.trim() || !formData.audience.trim()) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const newPlaybook: Playbook = {
        id: `PB${(playbooks.length + 1).toString().padStart(3, "0")}`,
        name: formData.name,
        objective: formData.objective,
        channel: formData.channel,
        audience: formData.audience,
        status: "Rascunho",
        createdAt: new Date().toISOString().split("T")[0],
      };

      setPlaybooks(prev => [newPlaybook, ...prev]);
      setIsLoading(false);
      setCreateDialogOpen(false);
      setFormData({ name: "", objective: "", channel: "WhatsApp Business", audience: "" });
      toast.success("Playbook criado com sucesso!");
    }, 1000);
  };

  const handleDelete = () => {
    if (!selectedPlaybook) return;

    setPlaybooks(prev => prev.filter(pb => pb.id !== selectedPlaybook.id));
    setDeleteDialogOpen(false);
    setSelectedPlaybook(null);
    toast.success("Playbook excluído");
  };

  const handleView = (playbook: Playbook) => {
    navigate(`/whatsapp/playbooks/${playbook.id}`);
  };

  const getStatusBadge = (status: Playbook["status"]) => {
    const variants = {
      "Rascunho": "secondary" as const,
      "Ativo": "default" as const,
      "Arquivado": "outline" as const,
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="mb-2">Automatização WhatsApp – Playbooks</h1>
        <p className="text-muted-foreground">
          Crie e gerencie guias passo-a-passo com scripts prontos para automação no WhatsApp Business
        </p>
      </div>

      {/* Actions Bar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar playbooks..."
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
          Criar Playbook
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Objetivo</TableHead>
              <TableHead>Canal</TableHead>
              <TableHead>Público</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead className="w-[70px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                </TableRow>
              ))
            ) : paginatedPlaybooks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <BookOpen className="h-12 w-12 mb-4 opacity-50" />
                    <p className="mb-1">Nenhum playbook encontrado</p>
                    <p>Crie seu primeiro playbook de automação para WhatsApp</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedPlaybooks.map((playbook) => (
                <TableRow key={playbook.id}>
                  <TableCell>{playbook.id}</TableCell>
                  <TableCell>{playbook.name}</TableCell>
                  <TableCell className="text-muted-foreground">{playbook.objective}</TableCell>
                  <TableCell className="text-muted-foreground">{playbook.channel}</TableCell>
                  <TableCell className="text-muted-foreground">{playbook.audience}</TableCell>
                  <TableCell>{getStatusBadge(playbook.status)}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(playbook.createdAt).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleView(playbook)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver Detalhes
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.info("Edição será implementada")}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => {
                            setSelectedPlaybook(playbook);
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
        <DialogContent onEscapeKeyDown={(e) => !isLoading && setCreateDialogOpen(false)}>
          <DialogHeader>
            <DialogTitle>Criar Novo Playbook</DialogTitle>
            <DialogDescription>
              Defina as informações básicas do playbook de automação
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Playbook *</Label>
              <Input
                id="name"
                placeholder="Ex: Boas-vindas Automáticas"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="objective">Objetivo *</Label>
              <Textarea
                id="objective"
                placeholder="Descreva o objetivo deste playbook..."
                value={formData.objective}
                onChange={(e) => setFormData(prev => ({ ...prev, objective: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="channel">Canal *</Label>
              <Select 
                value={formData.channel} 
                onValueChange={(v) => setFormData(prev => ({ ...prev, channel: v }))}
              >
                <SelectTrigger id="channel">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WhatsApp Business">WhatsApp Business</SelectItem>
                  <SelectItem value="WhatsApp API">WhatsApp API</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="audience">Público-Alvo *</Label>
              <Input
                id="audience"
                placeholder="Ex: Novos leads, Clientes ativos..."
                value={formData.audience}
                onChange={(e) => setFormData(prev => ({ ...prev, audience: e.target.value }))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button onClick={handleCreate} disabled={isLoading}>
              {isLoading ? "Criando..." : "Criar Playbook"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Playbook</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o playbook "{selectedPlaybook?.name}"? Esta ação não pode ser desfeita.
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