import { useState } from "react";
import { Search, Filter, Download, Mail, FileText, FileSpreadsheet, Calendar } from "lucide-react";
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
import { MoreVertical, Eye } from "lucide-react";
import { Checkbox } from "../../components/ui/checkbox";

type ExportRecord = {
  id: string;
  searchName: string;
  format: "PDF" | "CSV";
  generatedAt: string;
  sentTo: string | null;
  profilesCount: number;
  status: "Gerado" | "Enviado" | "Erro";
};

const mockExports: ExportRecord[] = [
  { id: "EXP001", searchName: "Desenvolvedores Senior SP", format: "PDF", generatedAt: "2025-11-04 14:32", sentTo: "gestor@empresa.com", profilesCount: 8, status: "Enviado" },
  { id: "EXP002", searchName: "Product Managers Remoto", format: "CSV", generatedAt: "2025-11-03 10:15", sentTo: null, profilesCount: 10, status: "Gerado" },
  { id: "EXP003", searchName: "UX Designers Junior RJ", format: "PDF", generatedAt: "2025-11-02 16:20", sentTo: "rh@startup.com", profilesCount: 6, status: "Enviado" },
];

type Candidate = {
  id: string;
  name: string;
  role: string;
  location: string;
  seniority: string;
  status: "Qualificado" | "Pendente" | "Descartado";
  selected: boolean;
};

const mockCandidates: Candidate[] = [
  { id: "C001", name: "Ana Silva", role: "Desenvolvedora Full Stack", location: "São Paulo, SP", seniority: "Senior", status: "Qualificado", selected: false },
  { id: "C002", name: "Carlos Mendes", role: "Desenvolvedor Backend", location: "São Paulo, SP", seniority: "Pleno", status: "Qualificado", selected: false },
  { id: "C003", name: "Beatriz Santos", role: "Desenvolvedora Frontend", location: "Campinas, SP", seniority: "Senior", status: "Qualificado", selected: false },
];

export function HeadhunterExport() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [exports, setExports] = useState<ExportRecord[]>(mockExports);
  const [currentPage, setCurrentPage] = useState(1);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [candidates, setCandidates] = useState<Candidate[]>(mockCandidates);
  const [exportFormat, setExportFormat] = useState<"PDF" | "CSV">("PDF");
  const [emailTo, setEmailTo] = useState("");
  const itemsPerPage = 10;

  const filteredExports = exports.filter(exp =>
    exp.searchName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exp.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredExports.length / itemsPerPage);
  const paginatedExports = filteredExports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleToggleCandidate = (id: string) => {
    setCandidates(prev =>
      prev.map(c => c.id === id ? { ...c, selected: !c.selected } : c)
    );
  };

  const handleToggleAll = () => {
    const allSelected = candidates.every(c => c.selected);
    setCandidates(prev => prev.map(c => ({ ...c, selected: !allSelected })));
  };

  const handleGenerateExport = () => {
    const selectedCount = candidates.filter(c => c.selected).length;
    if (selectedCount === 0) {
      toast.error("Selecione ao menos 1 candidato para exportar");
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      const newExport: ExportRecord = {
        id: `EXP${(exports.length + 1).toString().padStart(3, "0")}`,
        searchName: "Nova Exportação",
        format: exportFormat,
        generatedAt: new Date().toLocaleString("pt-BR", { 
          year: "numeric", 
          month: "2-digit", 
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit"
        }),
        sentTo: emailTo || null,
        profilesCount: selectedCount,
        status: emailTo ? "Enviado" : "Gerado"
      };

      setExports(prev => [newExport, ...prev]);
      setIsLoading(false);
      setExportDialogOpen(false);
      setEmailTo("");
      setCandidates(prev => prev.map(c => ({ ...c, selected: false })));
      
      if (emailTo) {
        toast.success(`Exportação gerada e enviada para ${emailTo}`);
      } else {
        toast.success("Exportação gerada com sucesso! Download iniciado.");
      }
    }, 1500);
  };

  const handleDelete = (id: string) => {
    setExports(prev => prev.filter(exp => exp.id !== id));
    toast.success("Exportação excluída");
  };

  const handleDownload = (exp: ExportRecord) => {
    toast.success(`Download de ${exp.format} iniciado`);
  };

  const getStatusBadge = (status: ExportRecord["status"]) => {
    const variants = {
      "Gerado": "default" as const,
      "Enviado": "default" as const,
      "Erro": "destructive" as const,
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="mb-2">Red Hunter – Exportar/Enviar</h1>
        <p className="text-muted-foreground">
          Exporte listas de candidatos para PDF ou CSV e envie por e-mail com marca d'água e timestamp
        </p>
      </div>

      {/* Candidates Selection */}
      <div className="rounded-lg border bg-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="mb-1">Candidatos Qualificados</h2>
            <p className="text-muted-foreground">
              Selecione os candidatos que deseja incluir na exportação
            </p>
          </div>
          <Button onClick={() => setExportDialogOpen(true)}>
            <Download className="mr-2 h-4 w-4" />
            Gerar Exportação
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={candidates.length > 0 && candidates.every(c => c.selected)}
                    onCheckedChange={handleToggleAll}
                  />
                </TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Localização</TableHead>
                <TableHead>Senioridade</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {candidates.map((candidate) => (
                <TableRow key={candidate.id}>
                  <TableCell>
                    <Checkbox
                      checked={candidate.selected}
                      onCheckedChange={() => handleToggleCandidate(candidate.id)}
                    />
                  </TableCell>
                  <TableCell>{candidate.name}</TableCell>
                  <TableCell>{candidate.role}</TableCell>
                  <TableCell>{candidate.location}</TableCell>
                  <TableCell>{candidate.seniority}</TableCell>
                  <TableCell>
                    <Badge variant={candidate.status === "Qualificado" ? "default" : "secondary"}>
                      {candidate.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filtros
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nome da Busca</TableHead>
              <TableHead>Formato</TableHead>
              <TableHead>Data/Hora</TableHead>
              <TableHead>Enviado Para</TableHead>
              <TableHead>Perfis</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[70px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                </TableRow>
              ))
            ) : paginatedExports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <FileText className="h-12 w-12 mb-4 opacity-50" />
                    <p className="mb-1">Nenhuma exportação encontrada</p>
                    <p>Gere sua primeira exportação selecionando candidatos acima</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedExports.map((exp) => (
                <TableRow key={exp.id}>
                  <TableCell>{exp.id}</TableCell>
                  <TableCell>{exp.searchName}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="gap-1">
                      {exp.format === "PDF" ? <FileText className="h-3 w-3" /> : <FileSpreadsheet className="h-3 w-3" />}
                      {exp.format}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{exp.generatedAt}</TableCell>
                  <TableCell>
                    {exp.sentTo ? (
                      <span className="text-muted-foreground">{exp.sentTo}</span>
                    ) : (
                      <span className="text-muted-foreground italic">—</span>
                    )}
                  </TableCell>
                  <TableCell>{exp.profilesCount}</TableCell>
                  <TableCell>{getStatusBadge(exp.status)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleDownload(exp)}>
                          <Download className="mr-2 h-4 w-4" />
                          Baixar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.info("Visualização não implementada neste MVP")}>
                          <Eye className="mr-2 h-4 w-4" />
                          Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => handleDelete(exp.id)}
                        >
                          <MoreVertical className="mr-2 h-4 w-4" />
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

      {/* Export Dialog */}
      <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
        <DialogContent onEscapeKeyDown={(e) => !isLoading && setExportDialogOpen(false)}>
          <DialogHeader>
            <DialogTitle>Exportar Resultados</DialogTitle>
            <DialogDescription>
              Configure o formato e destino da exportação. Marca d'água e timestamp são incluídos automaticamente.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="format">Formato de Exportação *</Label>
              <Select value={exportFormat} onValueChange={(v) => setExportFormat(v as "PDF" | "CSV")}>
                <SelectTrigger id="format">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PDF">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      PDF (com marca d'água)
                    </div>
                  </SelectItem>
                  <SelectItem value="CSV">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="h-4 w-4" />
                      CSV (planilha)
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-lg border p-4 space-y-2">
              <div className="flex items-start gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm">Marca d'água e timestamp</p>
                  <p className="text-sm text-muted-foreground">Incluído automaticamente em todas as exportações</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail de Destino (Opcional)</Label>
              <Input
                id="email"
                type="email"
                placeholder="destino@empresa.com"
                value={emailTo}
                onChange={(e) => setEmailTo(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Se preenchido, o arquivo será enviado por e-mail além de ser baixado
              </p>
            </div>

            <div className="rounded-lg bg-muted/50 p-4">
              <p className="text-sm">
                <strong>Candidatos selecionados:</strong> {candidates.filter(c => c.selected).length}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setExportDialogOpen(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button onClick={handleGenerateExport} disabled={isLoading}>
              {isLoading ? (
                <>Gerando...</>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Gerar Exportação
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}