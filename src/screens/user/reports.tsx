import { useState } from 'react';
import { Search, Filter, Plus, Eye, Pencil, Trash2, X, FileText, Calendar, TrendingUp, FileDown } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { Skeleton } from '../../components/ui/skeleton';
import { toast } from 'sonner@2.0.3';
import { MoreVertical } from 'lucide-react';
import jsPDF from 'jspdf';

type Report = {
  id: number;
  name: string;
  period: string;
  module: string;
  total: number;
  completed: number;
  pending: number;
  status: 'Gerado' | 'Concluído' | 'Processando';
};

const mockReports: Report[] = [
  {
    id: 1,
    name: 'Relatório Marketing - Outubro',
    period: '01/10/2025 - 31/10/2025',
    module: 'Marketing IA',
    total: 45,
    completed: 32,
    pending: 13,
    status: 'Gerado',
  },
  {
    id: 2,
    name: 'Relatório Vendas - Q3 2025',
    period: '01/07/2025 - 30/09/2025',
    module: 'Vendas Online IA',
    total: 87,
    completed: 65,
    pending: 22,
    status: 'Concluído',
  },
  {
    id: 3,
    name: 'Relatório Head Hunter - Setembro',
    period: '01/09/2025 - 30/09/2025',
    module: 'Head Hunter IA',
    total: 120,
    completed: 95,
    pending: 25,
    status: 'Processando',
  },
];

export function UserReports() {
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterModule, setFilterModule] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  // View Modal
  const [viewId, setViewId] = useState<number | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  // Edit Modal
  const [editId, setEditId] = useState<number | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<Report>>({});

  // Delete
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const filteredReports = reports.filter((report) => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterModule === 'all' || report.module === filterModule;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: Report['status']) => {
    switch (status) {
      case 'Gerado':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'Concluído':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Processando':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      default:
        return '';
    }
  };

  // VIEW HANDLERS
  const handleViewOpen = (id: number) => {
    setViewId(id);
    setIsViewOpen(true);
  };

  const handleViewClose = () => {
    setViewId(null);
    setIsViewOpen(false);
  };

  // EDIT HANDLERS
  const handleEditOpen = (id: number) => {
    const report = reports.find((r) => r.id === id);
    if (report) {
      setEditId(id);
      setEditFormData({ ...report });
      setIsEditOpen(true);
    }
  };

  const handleEditClose = () => {
    setEditId(null);
    setEditFormData({});
    setIsEditOpen(false);
  };

  const handleEdit = () => {
    if (!editId) return;

    setReports((prev) =>
      prev.map((report) =>
        report.id === editId ? { ...report, ...editFormData } : report
      )
    );

    toast.success('Relatório atualizado com sucesso!', {
      position: 'top-center',
      duration: 3000,
    });

    handleEditClose();
  };

  // DELETE HANDLER
  const handleDelete = (id: number) => {
    setReports((prev) => prev.filter((report) => report.id !== id));
    toast.success('Relatório excluído com sucesso!', {
      position: 'top-center',
      duration: 3000,
    });
  };

  // PDF EXPORT HANDLER
  const handleExportPDF = (report: Report) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(47, 95, 255);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text('MVP Platform', 20, 20);
    
    doc.setFontSize(14);
    doc.text('Relatório de Desempenho', 20, 32);
    
    // Reset colors
    doc.setTextColor(0, 0, 0);
    
    // Report Info
    doc.setFontSize(12);
    doc.text('Informações do Relatório', 20, 55);
    
    doc.setFontSize(10);
    doc.text(`ID: ${report.id}`, 20, 65);
    doc.text(`Nome: ${report.name}`, 20, 72);
    doc.text(`Período: ${report.period}`, 20, 79);
    doc.text(`Módulo: ${report.module}`, 20, 86);
    doc.text(`Status: ${report.status}`, 20, 93);
    
    // Statistics Section
    doc.setFontSize(12);
    doc.text('Estatísticas', 20, 110);
    
    // Stats boxes
    doc.setDrawColor(200, 200, 200);
    doc.setFillColor(245, 245, 245);
    
    // Total box
    doc.rect(20, 118, 50, 30, 'FD');
    doc.setFontSize(9);
    doc.text('Total', 25, 125);
    doc.setFontSize(16);
    doc.text(report.total.toString(), 25, 140);
    
    // Completed box
    doc.setFillColor(220, 252, 231);
    doc.rect(80, 118, 50, 30, 'FD');
    doc.setFontSize(9);
    doc.setTextColor(22, 163, 74);
    doc.text('Concluídos', 85, 125);
    doc.setFontSize(16);
    doc.text(report.completed.toString(), 85, 140);
    
    // Pending box
    doc.setTextColor(217, 119, 6);
    doc.setFillColor(254, 243, 199);
    doc.rect(140, 118, 50, 30, 'FD');
    doc.setFontSize(9);
    doc.text('Pendentes', 145, 125);
    doc.setFontSize(16);
    doc.text(report.pending.toString(), 145, 140);
    
    // Footer
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 20, 280);
    doc.text('MVP Platform - Plataforma Multi-Persona', 105, 280, { align: 'center' });
    
    // Save PDF
    const fileName = `${report.name.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
    doc.save(fileName);
    
    toast.success('PDF gerado com sucesso!', {
      position: 'top-center',
      duration: 3000,
    });
  };

  const viewReport = reports.find((r) => r.id === viewId);
  const editReport = reports.find((r) => r.id === editId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-neutral-900 dark:text-white mb-2">Relatórios</h1>
        <p className="text-[14px] leading-[19.6px] text-neutral-600 dark:text-neutral-400">
          Visualize e gerencie os relatórios gerados pelos módulos de IA
        </p>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-[448px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <Input
            placeholder="Buscar relatórios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-2">
          <Select value={filterModule} onValueChange={setFilterModule}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="Marketing IA">Marketing IA</SelectItem>
              <SelectItem value="Vendas Online IA">Vendas Online IA</SelectItem>
              <SelectItem value="Head Hunter IA">Head Hunter IA</SelectItem>
            </SelectContent>
          </Select>

          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Filtro
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">ID</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Período</TableHead>
              <TableHead>Módulo</TableHead>
              <TableHead className="text-center">Total</TableHead>
              <TableHead className="text-center">Concluídos</TableHead>
              <TableHead className="text-center">Pendentes</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-8" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-48" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-8" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-8" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-8" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-8" />
                  </TableCell>
                </TableRow>
              ))
            ) : filteredReports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <FileText className="h-8 w-8 text-neutral-400" />
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Nenhum relatório encontrado
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.id}</TableCell>
                  <TableCell>{report.name}</TableCell>
                  <TableCell className="text-sm text-neutral-600 dark:text-neutral-400">
                    {report.period}
                  </TableCell>
                  <TableCell>{report.module}</TableCell>
                  <TableCell className="text-center">{report.total}</TableCell>
                  <TableCell className="text-center">
                    <span className="text-green-600 dark:text-green-400">
                      {report.completed}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-amber-600 dark:text-amber-400">
                      {report.pending}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(report.status)} variant="secondary">
                      {report.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewOpen(report.id)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditOpen(report.id)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(report.id)}
                          className="text-red-600 dark:text-red-400"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleExportPDF(report)}
                          className="text-blue-600 dark:text-blue-400"
                        >
                          <FileDown className="mr-2 h-4 w-4" />
                          Exportar PDF
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-neutral-200 px-6 py-4 dark:border-neutral-800">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Exibindo <span className="font-medium">20</span> de{' '}
            <span className="font-medium">3</span> itens
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-neutral-600 dark:text-neutral-400">
              1-3 de 3
            </span>
            <Button variant="outline" size="icon" className="h-8 w-8" disabled>
              <span className="sr-only">Anterior</span>
              ‹
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8" disabled>
              <span className="sr-only">Próximo</span>
              ›
            </Button>
          </div>
        </div>
      </div>

      {/* VIEW MODAL */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Visualizar Relatório
            </DialogTitle>
            <DialogDescription>
              Detalhes completos do relatório (modo somente leitura)
            </DialogDescription>
          </DialogHeader>

          {viewReport && (
            <div className="space-y-6">
              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-neutral-500 dark:text-neutral-400">ID</Label>
                  <p className="font-medium">{viewReport.id}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-neutral-500 dark:text-neutral-400">Status</Label>
                  <Badge className={getStatusColor(viewReport.status)} variant="secondary">
                    {viewReport.status}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-neutral-500 dark:text-neutral-400">Nome do Relatório</Label>
                <p className="font-medium">{viewReport.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-neutral-500 dark:text-neutral-400">Período</Label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-neutral-400" />
                    <p>{viewReport.period}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-neutral-500 dark:text-neutral-400">Módulo</Label>
                  <p>{viewReport.module}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-800/50">
                <h4 className="mb-4 flex items-center gap-2 font-medium">
                  <TrendingUp className="h-4 w-4" />
                  Estatísticas
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">Total</p>
                    <p className="text-2xl font-bold">{viewReport.total}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">Concluídos</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {viewReport.completed}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">Pendentes</p>
                    <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                      {viewReport.pending}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={handleViewClose}>
                  Fechar
                </Button>
                <Button onClick={() => handleExportPDF(viewReport)}>
                  <FileDown className="mr-2 h-4 w-4" />
                  Salvar em PDF
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* EDIT MODAL */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="h-5 w-5" />
              Editar Relatório
            </DialogTitle>
            <DialogDescription>
              Edite as informações do relatório
            </DialogDescription>
          </DialogHeader>

          {editReport && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nome do Relatório</Label>
                <Input
                  id="edit-name"
                  value={editFormData.name || ''}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, name: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-period">Período</Label>
                  <Input
                    id="edit-period"
                    value={editFormData.period || ''}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, period: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-module">Módulo</Label>
                  <Select
                    value={editFormData.module}
                    onValueChange={(value) =>
                      setEditFormData({ ...editFormData, module: value })
                    }
                  >
                    <SelectTrigger id="edit-module">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Marketing IA">Marketing IA</SelectItem>
                      <SelectItem value="Vendas Online IA">Vendas Online IA</SelectItem>
                      <SelectItem value="Head Hunter IA">Head Hunter IA</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-total">Total</Label>
                  <Input
                    id="edit-total"
                    type="number"
                    value={editFormData.total || 0}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, total: parseInt(e.target.value) })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-completed">Concluídos</Label>
                  <Input
                    id="edit-completed"
                    type="number"
                    value={editFormData.completed || 0}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, completed: parseInt(e.target.value) })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-pending">Pendentes</Label>
                  <Input
                    id="edit-pending"
                    type="number"
                    value={editFormData.pending || 0}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, pending: parseInt(e.target.value) })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={editFormData.status}
                  onValueChange={(value: Report['status']) =>
                    setEditFormData({ ...editFormData, status: value })
                  }
                >
                  <SelectTrigger id="edit-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Gerado">Gerado</SelectItem>
                    <SelectItem value="Concluído">Concluído</SelectItem>
                    <SelectItem value="Processando">Processando</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={handleEditClose}>
                  Cancelar
                </Button>
                <Button onClick={handleEdit}>Salvar Alterações</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}