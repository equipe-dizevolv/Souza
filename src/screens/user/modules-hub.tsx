import { useState } from 'react';
import {
  Plus,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Search,
  Lightbulb,
  ShoppingCart,
  UserSearch,
  Star,
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
import { Badge } from '../../components/ui/badge';
import { Skeleton } from '../../components/ui/skeleton';
import { Card, CardContent } from '../../components/ui/card';
import { toast } from 'sonner@2.0.3';
import { TablePagination } from '../../components/table-pagination';
import { FAB } from '../../components/fab';
import { useIsMobile } from '../../components/ui/use-mobile';

interface Favorite {
  id: number;
  nome: string;
  moduloAlvo: string;
  status: 'Ativo' | 'Inativo';
  criadoEm: string;
}

const initialFavorites: Favorite[] = [
  {
    id: 1,
    nome: 'Briefing Rápido',
    moduloAlvo: 'Marketing IA',
    status: 'Ativo',
    criadoEm: '2025-10-20',
  },
  {
    id: 2,
    nome: 'Funil de Vendas',
    moduloAlvo: 'Vendas Online IA',
    status: 'Ativo',
    criadoEm: '2025-10-21',
  },
  {
    id: 3,
    nome: 'Busca Desenvolvedor',
    moduloAlvo: 'Head Hunter IA',
    status: 'Inativo',
    criadoEm: '2025-10-22',
  },
];

const modules = [
  { value: 'marketing', label: 'Marketing IA', icon: Lightbulb },
  { value: 'vendas', label: 'Vendas Online IA', icon: ShoppingCart },
  { value: 'headhunter', label: 'Head Hunter IA', icon: UserSearch },
];

export function UserModulesHub() {
  const [favorites, setFavorites] = useState<Favorite[]>(initialFavorites);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterModule, setFilterModule] = useState('todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [formData, setFormData] = useState({
    nome: '',
    moduloAlvo: '',
  });
  const [viewId, setViewId] = useState<number | null>(null);
  const [editId, setEditId] = useState<number | null>(null);

  const isMobile = useIsMobile();

  const viewFavorite = favorites.find((fav) => fav.id === viewId);
  const editFavorite = favorites.find((fav) => fav.id === editId);

  const filteredFavorites = favorites.filter((fav) => {
    const matchesSearch = fav.nome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesModule = filterModule === 'todos' || fav.moduloAlvo.toLowerCase().includes(filterModule);
    return matchesSearch && matchesModule;
  });

  const totalPages = Math.ceil(filteredFavorites.length / pageSize);
  const paginatedFavorites = filteredFavorites.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome || !formData.moduloAlvo) {
      toast.error('Preencha todos os campos obrigatórios', {
        position: 'top-center',
        duration: 4000,
      });
      return;
    }

    const newFavorite: Favorite = {
      id: Math.max(...favorites.map((f) => f.id), 0) + 1,
      nome: formData.nome,
      moduloAlvo: formData.moduloAlvo,
      status: 'Ativo',
      criadoEm: new Date().toISOString().split('T')[0],
    };

    setFavorites([...favorites, newFavorite]);
    setIsModalOpen(false);
    setFormData({ nome: '', moduloAlvo: '' });
    toast.success('Favorito adicionado com sucesso!', {
      position: 'top-center',
      duration: 4000,
    });
  };

  const handleDelete = () => {
    if (deleteId) {
      setFavorites(favorites.filter((fav) => fav.id !== deleteId));
      toast.success('Favorito excluído com sucesso!', {
        position: 'top-center',
        duration: 4000,
      });
      setDeleteId(null);
    }
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editFavorite) return;

    setFavorites(
      favorites.map((fav) =>
        fav.id === editId
          ? { ...fav, nome: formData.nome, moduloAlvo: formData.moduloAlvo }
          : fav
      )
    );
    setEditId(null);
    setFormData({ nome: '', moduloAlvo: '' });
    toast.success('Favorito atualizado com sucesso!', {
      position: 'top-center',
      duration: 4000,
    });
  };

  const handleEditOpen = (id: number) => {
    const favorite = favorites.find((fav) => fav.id === id);
    if (favorite) {
      setFormData({ nome: favorite.nome, moduloAlvo: favorite.moduloAlvo });
      setEditId(id);
    }
  };

  const handleEditClose = () => {
    setEditId(null);
    setFormData({ nome: '', moduloAlvo: '' });
  };

  const handleModalClose = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      setFormData({ nome: '', moduloAlvo: '' });
    }
  };

  const getModuleIcon = (moduleName: string) => {
    const module = modules.find((m) => moduleName.toLowerCase().includes(m.value));
    if (!module) return Star;
    return module.icon;
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
                placeholder="Buscar favoritos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterModule} onValueChange={setFilterModule}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por módulo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os módulos</SelectItem>
                <SelectItem value="marketing">Marketing IA</SelectItem>
                <SelectItem value="vendas">Vendas Online IA</SelectItem>
                <SelectItem value="headhunter">Head Hunter IA</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {paginatedFavorites.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Star className="h-12 w-12 text-neutral-400 mb-4" />
                <p className="text-neutral-600 dark:text-neutral-400 text-center">
                  Nenhum favorito encontrado
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {paginatedFavorites.map((fav) => {
                const Icon = getModuleIcon(fav.moduloAlvo);
                return (
                  <Card key={fav.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#2f5fff]/10">
                          <Icon className="h-5 w-5 text-[#2f5fff]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium truncate">{fav.nome}</h4>
                              <p className="text-[13px] text-neutral-600 dark:text-neutral-400">
                                {fav.moduloAlvo}
                              </p>
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
                                <DropdownMenuItem onClick={() => setViewId(fav.id)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Visualizar
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleEditOpen(fav.id)}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => setDeleteId(fav.id)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Excluir
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge
                              variant={fav.status === 'Ativo' ? 'default' : 'secondary'}
                              className={
                                fav.status === 'Ativo'
                                  ? 'bg-green-500 hover:bg-green-600'
                                  : 'bg-neutral-500'
                              }
                            >
                              {fav.status}
                            </Badge>
                            <span className="text-[13px] text-neutral-500">
                              ID: {fav.id}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {filteredFavorites.length > pageSize && (
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              totalItems={filteredFavorites.length}
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
          label="Adicionar Favorito"
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
                placeholder="Buscar favoritos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterModule} onValueChange={setFilterModule}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filtrar por módulo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os módulos</SelectItem>
                <SelectItem value="marketing">Marketing IA</SelectItem>
                <SelectItem value="vendas">Vendas Online IA</SelectItem>
                <SelectItem value="headhunter">Head Hunter IA</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Favorito
          </Button>
        </div>

        <div className="rounded-[14px] border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">ID</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Módulo Alvo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedFavorites.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center py-8">
                      <Star className="h-12 w-12 text-neutral-400 mb-2" />
                      <p className="text-neutral-600 dark:text-neutral-400">
                        Nenhum favorito encontrado
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedFavorites.map((fav) => (
                  <TableRow key={fav.id}>
                    <TableCell>{fav.id}</TableCell>
                    <TableCell className="font-medium">{fav.nome}</TableCell>
                    <TableCell>{fav.moduloAlvo}</TableCell>
                    <TableCell>
                      <Badge
                        variant={fav.status === 'Ativo' ? 'default' : 'secondary'}
                        className={
                          fav.status === 'Ativo'
                            ? 'bg-green-500 hover:bg-green-600'
                            : 'bg-neutral-500'
                        }
                      >
                        {fav.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
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
                          <DropdownMenuItem onClick={() => setViewId(fav.id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEditOpen(fav.id)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => setDeleteId(fav.id)}
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
          {filteredFavorites.length > 0 && (
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              totalItems={filteredFavorites.length}
              onPageChange={setCurrentPage}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setCurrentPage(1);
              }}
            />
          )}
        </div>
      </div>

      {/* Modal de Adicionar */}
      <Dialog open={isModalOpen} onOpenChange={handleModalClose}>
        <DialogContent
          className="max-w-md"
          onEscapeKeyDown={() => handleModalClose(false)}
        >
          <DialogHeader>
            <DialogTitle>Novo Favorito</DialogTitle>
            <DialogDescription>
              Adicione um atalho rápido para seu módulo favorito
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do Favorito</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Ex: Briefing Rápido"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="moduloAlvo">Módulo Alvo</Label>
                <Select
                  value={formData.moduloAlvo}
                  onValueChange={(value) => setFormData({ ...formData, moduloAlvo: value })}
                  required
                >
                  <SelectTrigger id="moduloAlvo">
                    <SelectValue placeholder="Selecione um módulo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Marketing IA">Marketing IA</SelectItem>
                    <SelectItem value="Vendas Online IA">Vendas Online IA</SelectItem>
                    <SelectItem value="Head Hunter IA">Head Hunter IA</SelectItem>
                  </SelectContent>
                </Select>
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

      {/* Modal de Excluir */}
      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este favorito? Esta ação não pode ser desfeita.
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

      {/* Modal de Editar */}
      <Dialog open={editId !== null} onOpenChange={handleEditClose}>
        <DialogContent
          className="max-w-md"
          onEscapeKeyDown={() => handleEditClose()}
        >
          <DialogHeader>
            <DialogTitle>Editar Favorito</DialogTitle>
            <DialogDescription>
              Atualize os detalhes do seu favorito
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEdit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-nome">Nome do Favorito</Label>
                <Input
                  id="edit-nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Ex: Briefing Rápido"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-moduloAlvo">Módulo Alvo</Label>
                <Select
                  value={formData.moduloAlvo}
                  onValueChange={(value) => setFormData({ ...formData, moduloAlvo: value })}
                  required
                >
                  <SelectTrigger id="edit-moduloAlvo">
                    <SelectValue placeholder="Selecione um módulo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Marketing IA">Marketing IA</SelectItem>
                    <SelectItem value="Vendas Online IA">Vendas Online IA</SelectItem>
                    <SelectItem value="Head Hunter IA">Head Hunter IA</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleEditClose()}
              >
                Cancelar
              </Button>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal de Visualizar */}
      <Dialog open={viewId !== null} onOpenChange={() => setViewId(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detalhes do Favorito</DialogTitle>
            <DialogDescription>
              Informações completas sobre este favorito
            </DialogDescription>
          </DialogHeader>
          {viewFavorite && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="text-neutral-500">ID</Label>
                <p className="text-[15px]">{viewFavorite.id}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-neutral-500">Nome</Label>
                <p className="text-[15px] font-medium">{viewFavorite.nome}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-neutral-500">Módulo Alvo</Label>
                <p className="text-[15px]">{viewFavorite.moduloAlvo}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-neutral-500">Status</Label>
                <div>
                  <Badge
                    variant={viewFavorite.status === 'Ativo' ? 'default' : 'secondary'}
                    className={
                      viewFavorite.status === 'Ativo'
                        ? 'bg-green-500 hover:bg-green-600'
                        : 'bg-neutral-500'
                    }
                  >
                    {viewFavorite.status}
                  </Badge>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-neutral-500">Criado em</Label>
                <p className="text-[15px]">
                  {new Date(viewFavorite.criadoEm).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewId(null)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}