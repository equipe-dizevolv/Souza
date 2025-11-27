import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, MoreVertical, Eye, Edit, Trash2, Search as SearchIcon, Play, LayoutGrid, Table2, Sparkles } from 'lucide-react';
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

interface BuscaSalva {
  id: number;
  nome: string;
  palavrasChave: string;
  localizacao: string;
  senioridade: string;
  tags: string[];
  status: 'Ativo' | 'Inativo';
  criadoEm: string;
}

const initialBuscas: BuscaSalva[] = [
  {
    id: 1,
    nome: 'Desenvolvedor React Sênior',
    palavrasChave: 'React, TypeScript, Node.js',
    localizacao: 'São Paulo, SP',
    senioridade: 'Sênior',
    tags: ['Remoto', 'CLT'],
    status: 'Ativo',
    criadoEm: '2025-10-20',
  },
  {
    id: 2,
    nome: 'Designer UX/UI Pleno',
    palavrasChave: 'Figma, Design System, Prototyping',
    localizacao: 'Rio de Janeiro, RJ',
    senioridade: 'Pleno',
    tags: ['Híbrido', 'PJ'],
    status: 'Ativo',
    criadoEm: '2025-10-21',
  },
];

const senioridadeOptions = ['Júnior', 'Pleno', 'Sênior', 'Especialista'];
const tagsDisponiveis = ['Remoto', 'Híbrido', 'Presencial', 'CLT', 'PJ', 'Urgente', 'Exclusivo'];

export function HeadHunterSearch() {
  const navigate = useNavigate();
  const [buscas, setBuscas] = useState<BuscaSalva[]>(initialBuscas);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [formData, setFormData] = useState({
    nome: '',
    palavrasChave: '',
    localizacao: '',
    senioridade: '',
    tags: [] as string[],
  });

  const isMobile = useIsMobile();

  const filteredBuscas = buscas.filter((busca) =>
    busca.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredBuscas.length / pageSize);
  const paginatedBuscas = filteredBuscas.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const toggleTag = (tag: string) => {
    const newTags = formData.tags.includes(tag)
      ? formData.tags.filter((t) => t !== tag)
      : [...formData.tags, tag];
    setFormData({ ...formData, tags: newTags });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome || !formData.palavrasChave) {
      toast.error('Preencha todos os campos obrigatórios', {
        position: 'top-center',
        duration: 4000,
      });
      return;
    }

    const newBusca: BuscaSalva = {
      id: Math.max(...buscas.map((b) => b.id), 0) + 1,
      ...formData,
      status: 'Ativo',
      criadoEm: new Date().toISOString().split('T')[0],
    };

    setBuscas([...buscas, newBusca]);
    setIsModalOpen(false);
    setFormData({
      nome: '',
      palavrasChave: '',
      localizacao: '',
      senioridade: '',
      tags: [],
    });
    toast.success('Busca criada com sucesso!', {
      position: 'top-center',
      duration: 4000,
    });
  };

  const handleExecutarBusca = (busca: BuscaSalva) => {
    toast.success(`Executando busca: ${busca.nome}`, {
      position: 'top-center',
      duration: 4000,
    });
  };

  const handleDelete = () => {
    if (deleteId) {
      setBuscas(buscas.filter((b) => b.id !== deleteId));
      toast.success('Busca excluída com sucesso!', {
        position: 'top-center',
        duration: 4000,
      });
      setDeleteId(null);
    }
  };

  const handleModalClose = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      setFormData({
        nome: '',
        palavrasChave: '',
        localizacao: '',
        senioridade: '',
        tags: [],
      });
    }
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
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
            <Input
              placeholder="Buscar buscas salvas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {paginatedBuscas.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <SearchIcon className="h-12 w-12 text-neutral-400 mb-4" />
                <p className="text-neutral-600 dark:text-neutral-400 text-center">
                  Nenhuma busca encontrada
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {paginatedBuscas.map((busca) => (
                <Card key={busca.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{busca.nome}</h4>
                        <p className="text-[13px] text-neutral-600 dark:text-neutral-400 mt-1">
                          {busca.palavrasChave}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 mt-3">
                          <Badge
                            variant={busca.status === 'Ativo' ? 'default' : 'secondary'}
                            className={
                              busca.status === 'Ativo'
                                ? 'bg-green-500 hover:bg-green-600'
                                : 'bg-neutral-500'
                            }
                          >
                            {busca.status}
                          </Badge>
                          <span className="text-[13px] text-neutral-500">ID: {busca.id}</span>
                        </div>
                        <div className="mt-2 text-[13px] text-neutral-600 dark:text-neutral-400">
                          <p>Local: {busca.localizacao}</p>
                          <p>Senioridade: {busca.senioridade}</p>
                          {busca.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {busca.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-[11px]">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleExecutarBusca(busca)}
                          className="mt-3 w-full"
                        >
                          <Play className="mr-2 h-4 w-4" />
                          Executar Busca
                        </Button>
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
                            onClick={() => setDeleteId(busca.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {filteredBuscas.length > pageSize && (
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              totalItems={filteredBuscas.length}
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
          label="Adicionar Busca"
        />
      </>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
            <Input
              placeholder="Buscar buscas salvas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
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
            <Button onClick={() => navigate('/headhunter/search/criar-com-ia')} className="gap-2">
              <Sparkles className="h-4 w-4" />
              Criar com IA
            </Button>
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Busca
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
                <TableHead>Palavras-chave</TableHead>
                <TableHead>Localização</TableHead>
                <TableHead>Senioridade</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedBuscas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center py-8">
                      <SearchIcon className="h-12 w-12 text-neutral-400 mb-2" />
                      <p className="text-neutral-600 dark:text-neutral-400">
                        Nenhuma busca encontrada
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedBuscas.map((busca) => (
                  <TableRow key={busca.id}>
                    <TableCell>{busca.id}</TableCell>
                    <TableCell className="font-medium">{busca.nome}</TableCell>
                    <TableCell className="max-w-xs truncate">{busca.palavrasChave}</TableCell>
                    <TableCell>{busca.localizacao}</TableCell>
                    <TableCell>{busca.senioridade}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {busca.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-[11px]">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={busca.status === 'Ativo' ? 'default' : 'secondary'}
                        className={
                          busca.status === 'Ativo'
                            ? 'bg-green-500 hover:bg-green-600'
                            : 'bg-neutral-500'
                        }
                      >
                        {busca.status}
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
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleExecutarBusca(busca)}>
                            <Play className="mr-2 h-4 w-4" />
                            Executar Busca
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => setDeleteId(busca.id)}
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
          {filteredBuscas.length > 0 && (
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              totalItems={filteredBuscas.length}
              onPageChange={setCurrentPage}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setCurrentPage(1);
              }}
            />
          )}
        </div>
        ) : (
          <>
            {paginatedBuscas.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <SearchIcon className="h-12 w-12 text-neutral-400 mb-4" />
                  <p className="text-neutral-600 dark:text-neutral-400 text-center">
                    Nenhuma busca encontrada
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {paginatedBuscas.map((busca) => (
                    <Card key={busca.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium truncate mb-1">{busca.nome}</h4>
                            <p className="text-[13px] text-neutral-500">ID: {busca.id}</p>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 shrink-0"
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
                              <DropdownMenuItem onClick={() => handleExecutarBusca(busca)}>
                                <Play className="mr-2 h-4 w-4" />
                                Executar Busca
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => setDeleteId(busca.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="space-y-2 text-[13px] mb-4">
                          <div>
                            <span className="text-neutral-500">Palavras-chave:</span>
                            <p className="font-medium line-clamp-2">{busca.palavrasChave}</p>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-neutral-500">Localização:</span>
                            <span className="font-medium">{busca.localizacao}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-neutral-500">Senioridade:</span>
                            <span className="font-medium">{busca.senioridade}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {busca.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-[11px]">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
                          <Badge
                            variant={busca.status === 'Ativo' ? 'default' : 'secondary'}
                            className={
                              busca.status === 'Ativo'
                                ? 'bg-green-500 hover:bg-green-600'
                                : 'bg-neutral-500'
                            }
                          >
                            {busca.status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {filteredBuscas.length > pageSize && (
                  <TablePagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    pageSize={pageSize}
                    totalItems={filteredBuscas.length}
                    onPageChange={setCurrentPage}
                    onPageSizeChange={(size) => {
                      setPageSize(size);
                      setCurrentPage(1);
                    }}
                  />
                )}
              </>
            )}
          </>
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={handleModalClose}>
        <DialogContent
          className="max-w-2xl max-h-[90vh] overflow-y-auto"
          onEscapeKeyDown={() => handleModalClose(false)}
        >
          <DialogHeader>
            <DialogTitle>Nova Busca</DialogTitle>
            <DialogDescription>
              Defina os critérios para busca de candidatos
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome da Busca *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Ex: Desenvolvedor React Sênior"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="palavrasChave">Palavras-chave *</Label>
                <Input
                  id="palavrasChave"
                  value={formData.palavrasChave}
                  onChange={(e) => setFormData({ ...formData, palavrasChave: e.target.value })}
                  placeholder="Ex: React, TypeScript, Node.js"
                  required
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="localizacao">Localização</Label>
                  <Input
                    id="localizacao"
                    value={formData.localizacao}
                    onChange={(e) => setFormData({ ...formData, localizacao: e.target.value })}
                    placeholder="Ex: São Paulo, SP"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="senioridade">Senioridade</Label>
                  <Select
                    value={formData.senioridade}
                    onValueChange={(value) => setFormData({ ...formData, senioridade: value })}
                  >
                    <SelectTrigger id="senioridade">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {senioridadeOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2">
                  {tagsDisponiveis.map((tag) => (
                    <Badge
                      key={tag}
                      variant={formData.tags.includes(tag) ? 'default' : 'outline'}
                      className="cursor-pointer select-none"
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
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
              Tem certeza que deseja excluir esta busca? Esta ação não pode ser desfeita.
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