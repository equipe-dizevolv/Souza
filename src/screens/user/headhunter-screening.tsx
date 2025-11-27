import { useState } from 'react';
import {
  Plus,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Search,
  Check,
  X,
  Star,
  FileText,
  LayoutGrid,
  Table2,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/ui/alert-dialog';
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
import { Skeleton } from '../../components/ui/skeleton';
import { Card, CardContent } from '../../components/ui/card';
import { toast } from 'sonner@2.0.3';
import { TablePagination } from '../../components/table-pagination';
import { FAB } from '../../components/fab';
import { useIsMobile } from '../../components/ui/use-mobile';

interface Perfil {
  id: number;
  nome: string;
  cargo: string;
  localizacao: string;
  senioridade: string;
  status: 'Pendente' | 'Qualificado' | 'Descartado' | 'Favorito';
  nota?: string;
  tag?: string;
}

const initialPerfis: Perfil[] = [
  {
    id: 1,
    nome: 'Ana Silva',
    cargo: 'Desenvolvedor React Sênior',
    localizacao: 'São Paulo, SP',
    senioridade: 'Sênior',
    status: 'Qualificado',
    nota: 'Excelente experiência com TypeScript',
    tag: 'Destaque',
  },
  {
    id: 2,
    nome: 'Carlos Santos',
    cargo: 'Desenvolvedor Full Stack',
    localizacao: 'Rio de Janeiro, RJ',
    senioridade: 'Pleno',
    status: 'Pendente',
  },
  {
    id: 3,
    nome: 'Maria Oliveira',
    cargo: 'Frontend Developer',
    localizacao: 'Belo Horizonte, MG',
    senioridade: 'Júnior',
    status: 'Descartado',
    nota: 'Experiência insuficiente para a vaga',
  },
];

export function HeadHunterScreening() {
  const [perfis, setPerfis] = useState<Perfil[]>(initialPerfis);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [selectedPerfil, setSelectedPerfil] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    anotacao: '',
    tag: '',
  });

  const isMobile = useIsMobile();

  const filteredPerfis = perfis.filter((perfil) => {
    const matchesSearch = perfil.nome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'todos' || perfil.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredPerfis.length / pageSize);
  const paginatedPerfis = filteredPerfis.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleQualificar = (id: number) => {
    setPerfis(
      perfis.map((p) => (p.id === id ? { ...p, status: 'Qualificado' as const } : p))
    );
    toast.success('Candidato qualificado!', {
      position: 'top-center',
      duration: 4000,
    });
  };

  const handleDescartar = (id: number) => {
    setPerfis(
      perfis.map((p) => (p.id === id ? { ...p, status: 'Descartado' as const } : p))
    );
    toast.success('Candidato descartado!', {
      position: 'top-center',
      duration: 4000,
    });
  };

  const handleFavoritar = (id: number) => {
    setPerfis(
      perfis.map((p) => (p.id === id ? { ...p, status: 'Favorito' as const } : p))
    );
    toast.success('Candidato favoritado!', {
      position: 'top-center',
      duration: 4000,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.anotacao && !selectedPerfil) {
      toast.error('Preencha a anotação', {
        position: 'top-center',
        duration: 4000,
      });
      return;
    }

    if (selectedPerfil) {
      setPerfis(
        perfis.map((p) =>
          p.id === selectedPerfil
            ? { ...p, nota: formData.anotacao, tag: formData.tag }
            : p
        )
      );
      toast.success('Nota adicionada com sucesso!', {
        position: 'top-center',
        duration: 4000,
      });
    }

    setIsModalOpen(false);
    setSelectedPerfil(null);
    setFormData({ anotacao: '', tag: '' });
  };

  const handleDelete = () => {
    if (deleteId) {
      setPerfis(perfis.filter((p) => p.id !== deleteId));
      toast.success('Perfil excluído com sucesso!', {
        position: 'top-center',
        duration: 4000,
      });
      setDeleteId(null);
    }
  };

  const handleModalClose = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      setSelectedPerfil(null);
      setFormData({ anotacao: '', tag: '' });
    }
  };

  const openNotaModal = (perfilId: number) => {
    const perfil = perfis.find((p) => p.id === perfilId);
    if (perfil) {
      setSelectedPerfil(perfilId);
      setFormData({
        anotacao: perfil.nota || '',
        tag: perfil.tag || '',
      });
      setIsModalOpen(true);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      Qualificado: 'bg-green-500 hover:bg-green-600',
      Descartado: 'bg-red-500 hover:bg-red-600',
      Favorito: 'bg-yellow-500 hover:bg-yellow-600',
      Pendente: 'bg-neutral-500 hover:bg-neutral-600',
    };
    return variants[status as keyof typeof variants] || variants.Pendente;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-[180px]" />
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (isMobile) {
    return (
      <>
        <div className="space-y-4 pb-20">
          <div className="flex flex-col gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
              <Input
                placeholder="Buscar candidatos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os status</SelectItem>
                <SelectItem value="Pendente">Pendente</SelectItem>
                <SelectItem value="Qualificado">Qualificado</SelectItem>
                <SelectItem value="Descartado">Descartado</SelectItem>
                <SelectItem value="Favorito">Favorito</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {paginatedPerfis.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Eye className="h-12 w-12 text-neutral-400 mb-4" />
                <p className="text-neutral-600 dark:text-neutral-400 text-center">
                  Nenhum perfil encontrado
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {paginatedPerfis.map((perfil) => (
                <Card key={perfil.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{perfil.nome}</h4>
                        <p className="text-[13px] text-neutral-600 dark:text-neutral-400">
                          {perfil.cargo}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-[11px]">
                            {perfil.senioridade}
                          </Badge>
                          <span className="text-[13px] text-neutral-500">
                            {perfil.localizacao}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className={getStatusBadge(perfil.status)}>
                            {perfil.status}
                          </Badge>
                          {perfil.tag && (
                            <Badge variant="outline" className="text-[11px]">
                              {perfil.tag}
                            </Badge>
                          )}
                        </div>
                        {perfil.nota && (
                          <p className="text-[13px] text-neutral-600 dark:text-neutral-400 mt-2 line-clamp-2">
                            {perfil.nota}
                          </p>
                        )}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 shrink-0"
                            aria-label="Ações"
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
                            onClick={() => setDeleteId(perfil.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleQualificar(perfil.id)}
                      >
                        <Check className="mr-1 h-4 w-4" />
                        Qualificar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleDescartar(perfil.id)}
                      >
                        <X className="mr-1 h-4 w-4" />
                        Descartar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleFavoritar(perfil.id)}
                      >
                        <Star className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {filteredPerfis.length > pageSize && (
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              totalItems={filteredPerfis.length}
              onPageChange={setCurrentPage}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setCurrentPage(1);
              }}
            />
          )}
        </div>

        <FAB
          onClick={() => setIsModalOpen(true)}
          icon={<Plus className="h-6 w-6" />}
          label="Adicionar Nota"
        />
      </>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
              <Input
                placeholder="Buscar candidatos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os status</SelectItem>
                <SelectItem value="Pendente">Pendente</SelectItem>
                <SelectItem value="Qualificado">Qualificado</SelectItem>
                <SelectItem value="Descartado">Descartado</SelectItem>
                <SelectItem value="Favorito">Favorito</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center rounded-lg border border-neutral-200 dark:border-neutral-800">
            <Button
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('table')}
              className="h-9 w-9 rounded-r-none"
              aria-label="Visualização em tabela"
            >
              <Table2 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'card' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('card')}
              className="h-9 w-9 rounded-l-none"
              aria-label="Visualização em cards"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {viewMode === 'table' ? (
          <div className="rounded-[14px] border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Local</TableHead>
                  <TableHead>Senioridade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedPerfis.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center py-8">
                        <Eye className="h-12 w-12 text-neutral-400 mb-2" />
                        <p className="text-neutral-600 dark:text-neutral-400">
                          Nenhum perfil encontrado
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedPerfis.map((perfil) => (
                    <TableRow key={perfil.id}>
                      <TableCell>{perfil.id}</TableCell>
                      <TableCell className="font-medium">{perfil.nome}</TableCell>
                      <TableCell>{perfil.cargo}</TableCell>
                      <TableCell>{perfil.localizacao}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{perfil.senioridade}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusBadge(perfil.status)}>
                            {perfil.status}
                          </Badge>
                          {perfil.tag && (
                            <Badge variant="outline" className="text-[11px]">
                              {perfil.tag}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleQualificar(perfil.id)}
                            title="Qualificar"
                          >
                            <Check className="h-4 w-4 text-green-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleDescartar(perfil.id)}
                            title="Descartar"
                          >
                            <X className="h-4 w-4 text-red-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleFavoritar(perfil.id)}
                            title="Favoritar"
                          >
                            <Star className="h-4 w-4 text-yellow-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => openNotaModal(perfil.id)}
                            title="Adicionar Nota"
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10"
                                aria-label="Ações"
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
                                onClick={() => setDeleteId(perfil.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            {filteredPerfis.length > 0 && (
              <TablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                totalItems={filteredPerfis.length}
                onPageChange={setCurrentPage}
                onPageSizeChange={(size) => {
                  setPageSize(size);
                  setCurrentPage(1);
                }}
              />
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {paginatedPerfis.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Eye className="h-16 w-16 text-neutral-400 mb-4" />
                  <p className="text-neutral-600 dark:text-neutral-400">
                    Nenhum perfil encontrado
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedPerfis.map((perfil) => (
                    <Card key={perfil.id} className="flex flex-col">
                      <CardContent className="flex flex-col flex-1 p-6">
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium mb-1">{perfil.nome}</h4>
                            <p className="text-[14px] text-neutral-600 dark:text-neutral-400 mb-2">
                              {perfil.cargo}
                            </p>
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge variant="outline" className="text-[11px]">
                                {perfil.senioridade}
                              </Badge>
                              <span className="text-[13px] text-neutral-500">
                                {perfil.localizacao}
                              </span>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 shrink-0"
                                aria-label="Ações"
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
                                onClick={() => setDeleteId(perfil.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                          <Badge className={getStatusBadge(perfil.status)}>
                            {perfil.status}
                          </Badge>
                          {perfil.tag && (
                            <Badge variant="outline" className="text-[11px]">
                              {perfil.tag}
                            </Badge>
                          )}
                        </div>

                        {perfil.nota && (
                          <p className="text-[13px] text-neutral-600 dark:text-neutral-400 mb-4 line-clamp-3">
                            {perfil.nota}
                          </p>
                        )}

                        <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-neutral-200 dark:border-neutral-800">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={() => handleQualificar(perfil.id)}
                          >
                            <Check className="mr-1 h-4 w-4" />
                            Qualificar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={() => handleDescartar(perfil.id)}
                          >
                            <X className="mr-1 h-4 w-4" />
                            Descartar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleFavoritar(perfil.id)}
                            title="Favoritar"
                          >
                            <Star className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openNotaModal(perfil.id)}
                            title="Adicionar Nota"
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredPerfis.length > pageSize && (
                  <TablePagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    pageSize={pageSize}
                    totalItems={filteredPerfis.length}
                    onPageChange={setCurrentPage}
                    onPageSizeChange={(size) => {
                      setPageSize(size);
                      setCurrentPage(1);
                    }}
                  />
                )}
              </>
            )}
          </div>
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={handleModalClose}>
        <DialogContent
          className="max-w-md"
          onEscapeKeyDown={() => handleModalClose(false)}
        >
          <DialogHeader>
            <DialogTitle>Nova Nota</DialogTitle>
            <DialogDescription>
              Adicione uma anotação sobre este candidato
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="anotacao">Anotação *</Label>
                <Textarea
                  id="anotacao"
                  value={formData.anotacao}
                  onChange={(e) => setFormData({ ...formData, anotacao: e.target.value })}
                  placeholder="Observações sobre o candidato..."
                  rows={4}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tag">Tag</Label>
                <Input
                  id="tag"
                  value={formData.tag}
                  onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                  placeholder="Ex: Destaque, Urgente"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleModalClose(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este perfil? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
