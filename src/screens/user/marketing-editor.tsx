import { useState } from 'react';
import { Plus, MoreVertical, Eye, Edit, Trash2, Search, Copy, LayoutGrid, Table2 } from 'lucide-react';
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
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { Skeleton } from '../../components/ui/skeleton';
import { Card, CardContent } from '../../components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { TablePagination } from '../../components/table-pagination';
import { FAB } from '../../components/fab';
import { useIsMobile } from '../../components/ui/use-mobile';

interface Versao {
  id: number;
  nome: string;
  titulo: string;
  copy: string;
  cta: string;
  anotacoes: string;
  status: 'Rascunho' | 'Aprovado' | 'Publicado';
}

const initialVersoes: Versao[] = [
  {
    id: 1,
    nome: 'Versão A - Principal',
    titulo: 'Transforme seu verão com estilo!',
    copy: 'Descubra a coleção mais vibrante da temporada. Peças únicas que combinam conforto e tendências.',
    cta: 'Confira a Coleção',
    anotacoes: 'Versão principal aprovada pelo cliente',
    status: 'Aprovado',
  },
  {
    id: 2,
    nome: 'Versão B - Teste',
    titulo: 'Verão 2025: Sua nova identidade',
    copy: 'Peças exclusivas que definem seu estilo. Conforto e sofisticação em cada detalhe.',
    cta: 'Descubra Mais',
    anotacoes: 'Teste A/B em andamento',
    status: 'Rascunho',
  },
];

export function MarketingEditor() {
  const [versoes, setVersoes] = useState<Versao[]>(initialVersoes);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [formData, setFormData] = useState({
    nome: '',
    titulo: '',
    copy: '',
    cta: '',
    anotacoes: '',
  });

  const isMobile = useIsMobile();

  const filteredVersoes = versoes.filter((versao) =>
    versao.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredVersoes.length / pageSize);
  const paginatedVersoes = filteredVersoes.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome || !formData.titulo) {
      toast.error('Preencha todos os campos obrigatórios', {
        position: 'top-center',
        duration: 4000,
      });
      return;
    }

    const newVersao: Versao = {
      id: Math.max(...versoes.map((v) => v.id), 0) + 1,
      ...formData,
      status: 'Rascunho',
    };

    setVersoes([...versoes, newVersao]);
    setIsModalOpen(false);
    setFormData({
      nome: '',
      titulo: '',
      copy: '',
      cta: '',
      anotacoes: '',
    });
    toast.success('Versão criada com sucesso!', {
      position: 'top-center',
      duration: 4000,
    });
  };

  const handleDuplicate = (versao: Versao) => {
    const duplicated: Versao = {
      ...versao,
      id: Math.max(...versoes.map((v) => v.id), 0) + 1,
      nome: `${versao.nome} (cópia)`,
      status: 'Rascunho',
    };
    setVersoes([...versoes, duplicated]);
    toast.success('Versão duplicada com sucesso!', {
      position: 'top-center',
      duration: 4000,
    });
  };

  const handleDelete = () => {
    if (deleteId) {
      setVersoes(versoes.filter((v) => v.id !== deleteId));
      toast.success('Versão excluída com sucesso!', {
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
        titulo: '',
        copy: '',
        cta: '',
        anotacoes: '',
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
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
            <Input
              placeholder="Buscar versões..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {paginatedVersoes.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Edit className="h-12 w-12 text-neutral-400 mb-4" />
                <p className="text-neutral-600 dark:text-neutral-400 text-center">
                  Nenhuma versão encontrada
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {paginatedVersoes.map((versao) => (
                <Collapsible key={versao.id}>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-2">
                            <CollapsibleTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0">
                                <ChevronDown className="h-4 w-4" />
                              </Button>
                            </CollapsibleTrigger>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium truncate">{versao.nome}</h4>
                              <p className="text-[13px] text-neutral-600 dark:text-neutral-400 line-clamp-1">
                                {versao.titulo}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 mt-3 ml-8">
                            <Badge
                              variant={
                                versao.status === 'Publicado'
                                  ? 'default'
                                  : versao.status === 'Aprovado'
                                  ? 'secondary'
                                  : 'outline'
                              }
                              className={
                                versao.status === 'Publicado'
                                  ? 'bg-green-500 hover:bg-green-600'
                                  : versao.status === 'Aprovado'
                                  ? 'bg-blue-500 hover:bg-blue-600'
                                  : 'bg-yellow-500 hover:bg-yellow-600'
                              }
                            >
                              {versao.status}
                            </Badge>
                            <span className="text-[13px] text-neutral-500">ID: {versao.id}</span>
                          </div>
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
                            <DropdownMenuItem onClick={() => handleDuplicate(versao)}>
                              <Copy className="mr-2 h-4 w-4" />
                              Duplicar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => setDeleteId(versao.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <CollapsibleContent className="mt-4 ml-8 space-y-3">
                        <div>
                          <Label className="text-[13px]">Copy</Label>
                          <p className="text-[13px] text-neutral-600 dark:text-neutral-400 mt-1">
                            {versao.copy}
                          </p>
                        </div>
                        <div>
                          <Label className="text-[13px]">CTA</Label>
                          <p className="text-[13px] text-neutral-600 dark:text-neutral-400 mt-1">
                            {versao.cta}
                          </p>
                        </div>
                        {versao.anotacoes && (
                          <div>
                            <Label className="text-[13px]">Anotações</Label>
                            <p className="text-[13px] text-neutral-600 dark:text-neutral-400 mt-1">
                              {versao.anotacoes}
                            </p>
                          </div>
                        )}
                      </CollapsibleContent>
                    </CardContent>
                  </Card>
                </Collapsible>
              ))}
            </div>
          )}

          {filteredVersoes.length > pageSize && (
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              totalItems={filteredVersoes.length}
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
          label="Adicionar Versão"
        />
      </>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
            <Input
              placeholder="Buscar versões..."
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
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Versão
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
                <TableHead>Título</TableHead>
                <TableHead>Copy</TableHead>
                <TableHead>CTA</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedVersoes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center py-8">
                      <Edit className="h-12 w-12 text-neutral-400 mb-2" />
                      <p className="text-neutral-600 dark:text-neutral-400">
                        Nenhuma versão encontrada
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedVersoes.map((versao) => (
                  <TableRow key={versao.id}>
                    <TableCell>{versao.id}</TableCell>
                    <TableCell className="font-medium">{versao.nome}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{versao.titulo}</TableCell>
                    <TableCell className="max-w-[250px] truncate">{versao.copy}</TableCell>
                    <TableCell>{versao.cta}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          versao.status === 'Publicado'
                            ? 'default'
                            : versao.status === 'Aprovado'
                            ? 'secondary'
                            : 'outline'
                        }
                        className={
                          versao.status === 'Publicado'
                            ? 'bg-green-500 hover:bg-green-600'
                            : versao.status === 'Aprovado'
                            ? 'bg-blue-500 hover:bg-blue-600'
                            : 'bg-yellow-500 hover:bg-yellow-600'
                        }
                      >
                        {versao.status}
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
                          <DropdownMenuItem onClick={() => handleDuplicate(versao)}>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => setDeleteId(versao.id)}
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
          {filteredVersoes.length > 0 && (
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              totalItems={filteredVersoes.length}
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
            {paginatedVersoes.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Edit className="h-12 w-12 text-neutral-400 mb-4" />
                  <p className="text-neutral-600 dark:text-neutral-400 text-center">
                    Nenhuma versão encontrada
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {paginatedVersoes.map((versao) => (
                    <Card key={versao.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium truncate mb-1">{versao.nome}</h4>
                            <p className="text-[13px] text-neutral-500">ID: {versao.id}</p>
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
                              <DropdownMenuItem onClick={() => handleDuplicate(versao)}>
                                <Copy className="mr-2 h-4 w-4" />
                                Duplicar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => setDeleteId(versao.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <span className="text-[13px] text-neutral-500">Título</span>
                            <p className="text-[14px] font-medium line-clamp-2">{versao.titulo}</p>
                          </div>
                          <div>
                            <span className="text-[13px] text-neutral-500">Copy</span>
                            <p className="text-[13px] text-neutral-600 dark:text-neutral-400 line-clamp-2">
                              {versao.copy}
                            </p>
                          </div>
                          <div>
                            <span className="text-[13px] text-neutral-500">CTA</span>
                            <p className="text-[13px] font-medium">{versao.cta}</p>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                          <Badge
                            variant={
                              versao.status === 'Publicado'
                                ? 'default'
                                : versao.status === 'Aprovado'
                                ? 'secondary'
                                : 'outline'
                            }
                            className={
                              versao.status === 'Publicado'
                                ? 'bg-green-500 hover:bg-green-600'
                                : versao.status === 'Aprovado'
                                ? 'bg-blue-500 hover:bg-blue-600'
                                : 'bg-yellow-500 hover:bg-yellow-600'
                            }
                          >
                            {versao.status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {filteredVersoes.length > pageSize && (
                  <TablePagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    pageSize={pageSize}
                    totalItems={filteredVersoes.length}
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
            <DialogTitle>Nova Versão</DialogTitle>
            <DialogDescription>
              Crie uma nova variação de conteúdo
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome da Versão *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Ex: Versão A - Principal"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="titulo">Título *</Label>
                <Input
                  id="titulo"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  placeholder="Ex: Transforme seu verão com estilo!"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="copy">Copy</Label>
                <Textarea
                  id="copy"
                  value={formData.copy}
                  onChange={(e) => setFormData({ ...formData, copy: e.target.value })}
                  placeholder="Texto principal do anúncio..."
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cta">CTA (Call-to-Action)</Label>
                <Input
                  id="cta"
                  value={formData.cta}
                  onChange={(e) => setFormData({ ...formData, cta: e.target.value })}
                  placeholder="Ex: Confira a Coleção"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="anotacoes">Anotações</Label>
                <Textarea
                  id="anotacoes"
                  value={formData.anotacoes}
                  onChange={(e) => setFormData({ ...formData, anotacoes: e.target.value })}
                  placeholder="Observações sobre esta versão..."
                  rows={2}
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
              Tem certeza que deseja excluir esta versão? Esta ação não pode ser desfeita.
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
