import { useState, useEffect } from 'react';
import { Plus, MoreVertical, Eye, Edit, Trash2, Search } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { FAB } from '../../components/fab';
import { Input } from '../../components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { toast } from 'sonner@2.0.3';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/ui/alert-dialog';
import { TablePagination } from '../../components/table-pagination';

interface Module {
  id: number;
  nome: string;
  status: 'Ativo' | 'Inativo';
  descricao: string;
}

const initialModules: Module[] = [
  { id: 1, nome: 'Marketing IA', status: 'Ativo', descricao: 'Módulo de geração de conteúdo com IA' },
  { id: 2, nome: 'Vendas Online IA', status: 'Ativo', descricao: 'Gestão de funil de vendas' },
  { id: 3, nome: 'Head Hunter IA', status: 'Ativo', descricao: 'Busca e triagem de candidatos' },
  { id: 4, nome: 'Análises Avançadas', status: 'Inativo', descricao: 'Relatórios e dashboards customizados' },
  { id: 5, nome: 'CRM Inteligente', status: 'Ativo', descricao: 'Gestão de relacionamento com clientes' },
  { id: 6, nome: 'Email Marketing IA', status: 'Ativo', descricao: 'Campanhas automatizadas de email' },
  { id: 7, nome: 'SEO Assistant', status: 'Inativo', descricao: 'Otimização para mecanismos de busca' },
  { id: 8, nome: 'Social Media IA', status: 'Ativo', descricao: 'Agendamento e análise de redes sociais' },
];

export function AdminModulesHub() {
  const [modules, setModules] = useState<Module[]>(initialModules);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20); // Paginação padrão: 20 itens por página
  const [formData, setFormData] = useState({
    nome: '',
    status: 'Ativo' as 'Ativo' | 'Inativo',
    descricao: '',
  });

  // Detectar mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const filteredModules = modules.filter((module) =>
    module.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginação
  const totalPages = Math.ceil(filteredModules.length / pageSize);
  const paginatedModules = filteredModules.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Resetar para primeira página ao mudar filtros ou page size
  useEffect(() => {
    setCurrentPage(1);
    // Scroll para topo da tabela
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [searchTerm, pageSize]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newModule: Module = {
      id: Math.max(...modules.map((m) => m.id), 0) + 1,
      ...formData,
    };
    setModules([...modules, newModule]);
    setIsModalOpen(false);
    setFormData({ nome: '', status: 'Ativo', descricao: '' });
    toast.success('Módulo adicionado com sucesso!');
  };

  const handleDelete = () => {
    if (deleteId) {
      setModules(modules.filter((m) => m.id !== deleteId));
      toast.success('Módulo excluído com sucesso!');
      setDeleteId(null);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Versão Mobile com FAB
  if (isMobile) {
    return (
      <div className="space-y-4 pb-20">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
          <Input
            placeholder="Buscar módulos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Lista Mobile */}
        <div className="space-y-2">
          {paginatedModules.length === 0 ? (
            <div className="text-center py-12 text-neutral-600 dark:text-neutral-400">
              Nenhum módulo encontrado.
            </div>
          ) : (
            paginatedModules.map((module) => (
              <div
                key={module.id}
                className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[12px] text-neutral-500">#{module.id}</span>
                      <Badge
                        variant={module.status === 'Ativo' ? 'default' : 'secondary'}
                        className={module.status === 'Ativo' ? 'bg-green-500' : 'bg-neutral-400'}
                      >
                        {module.status}
                      </Badge>
                    </div>
                    <h3 className="font-medium truncate">{module.nome}</h3>
                    <p className="text-[13px] text-neutral-600 dark:text-neutral-400 line-clamp-2 mt-1">
                      {module.descricao}
                    </p>
                  </div>
                  {/* Kebab com área clicável de 40px (hit target) */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-10 w-10 min-h-[40px] min-w-[40px] -mr-2"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        Visualizar
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => setDeleteId(module.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Paginação Mobile */}
        {filteredModules.length > 0 && (
          <div className="rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              totalItems={filteredModules.length}
              onPageChange={handlePageChange}
              onPageSizeChange={setPageSize}
            />
          </div>
        )}

        {/* FAB - Ancorado no canto inferior direito (56px, bottom=16px, right=16px) */}
        <FAB
          onClick={() => setIsModalOpen(true)}
          icon={<Plus className="h-6 w-6" />}
          label="Adicionar Módulo"
        />

        {/* Modal e Dialogs são compartilhados */}
        <ModuleDialog
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
        />

        <DeleteDialog
          open={deleteId !== null}
          onOpenChange={() => setDeleteId(null)}
          onConfirm={handleDelete}
        />
      </div>
    );
  }

  // Versão Desktop
  return (
    <div className="space-y-6">
      {/* Filters and Actions */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
          <Input
            placeholder="Buscar módulos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Módulo
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-[14px] border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedModules.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Nenhum módulo encontrado.
                </TableCell>
              </TableRow>
            ) : (
              paginatedModules.map((module) => (
                <TableRow key={module.id}>
                  <TableCell>{module.id}</TableCell>
                  <TableCell className="font-medium">{module.nome}</TableCell>
                  <TableCell>
                    <Badge
                      variant={module.status === 'Ativo' ? 'default' : 'secondary'}
                      className={module.status === 'Ativo' ? 'bg-green-500' : 'bg-neutral-400'}
                    >
                      {module.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-md truncate">{module.descricao}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => setDeleteId(module.id)}
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

        {/* Paginação */}
        {filteredModules.length > 0 && (
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={filteredModules.length}
            onPageChange={handlePageChange}
            onPageSizeChange={setPageSize}
          />
        )}
      </div>

      {/* Modals */}
      <ModuleDialog
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
      />

      <DeleteDialog
        open={deleteId !== null}
        onOpenChange={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}

// Componente Modal reutilizável
function ModuleDialog({
  open,
  onOpenChange,
  formData,
  setFormData,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: { nome: string; status: 'Ativo' | 'Inativo'; descricao: string };
  setFormData: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onEscapeKeyDown={() => onOpenChange(false)}>
        <DialogHeader>
          <DialogTitle>Novo Módulo</DialogTitle>
          <DialogDescription>
            Adicione um novo módulo ao sistema
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: 'Ativo' | 'Inativo') =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ativo">Ativo</SelectItem>
                  <SelectItem value="Inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Componente Delete Dialog reutilizável
function DeleteDialog({
  open,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir este módulo? Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-red-600 hover:bg-red-700">
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
