import { useState } from 'react';
import {
  Plus,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Search,
  History as HistoryIcon,
  Clock,
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
import { Input as InputField } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Skeleton } from '../../components/ui/skeleton';
import { Card, CardContent } from '../../components/ui/card';
import { toast } from 'sonner@2.0.3';
import { TablePagination } from '../../components/table-pagination';
import { FAB } from '../../components/fab';
import { useIsMobile } from '../../components/ui/use-mobile';

interface Atividade {
  id: number;
  dataHora: string;
  acao: string;
  modulo: string;
  resultado: string;
  tag?: {
    nome: string;
    cor: string;
  };
}

const initialAtividades: Atividade[] = [
  {
    id: 1,
    dataHora: '28/10/2025 14:32',
    acao: 'Criou briefing',
    modulo: 'Marketing IA',
    resultado: 'Campanha Verão 2025',
    tag: {
      nome: 'Importante',
      cor: 'bg-red-500',
    },
  },
  {
    id: 2,
    dataHora: '28/10/2025 10:15',
    acao: 'Qualificou candidato',
    modulo: 'Head Hunter IA',
    resultado: 'Ana Silva - Desenvolvedor React',
    tag: {
      nome: 'Aprovado',
      cor: 'bg-green-500',
    },
  },
  {
    id: 3,
    dataHora: '27/10/2025 16:48',
    acao: 'Moveu tarefa',
    modulo: 'Vendas Online IA',
    resultado: 'Empresa A para Negociação',
  },
  {
    id: 4,
    dataHora: '27/10/2025 09:22',
    acao: 'Editou versão',
    modulo: 'Marketing IA',
    resultado: 'Versão B - Teste',
  },
  {
    id: 5,
    dataHora: '26/10/2025 15:10',
    acao: 'Executou busca',
    modulo: 'Head Hunter IA',
    resultado: '12 candidatos encontrados',
    tag: {
      nome: 'Sucesso',
      cor: 'bg-blue-500',
    },
  },
];

const modulos = ['Todos', 'Marketing IA', 'Vendas Online IA', 'Head Hunter IA'];
const coresDisponiveis = [
  { value: 'bg-red-500', label: 'Vermelho' },
  { value: 'bg-green-500', label: 'Verde' },
  { value: 'bg-blue-500', label: 'Azul' },
  { value: 'bg-yellow-500', label: 'Amarelo' },
  { value: 'bg-purple-500', label: 'Roxo' },
  { value: 'bg-pink-500', label: 'Rosa' },
];

export function UserHistory() {
  const [atividades, setAtividades] = useState<Atividade[]>(initialAtividades);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterModulo, setFilterModulo] = useState('Todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [selectedAtividade, setSelectedAtividade] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    cor: 'bg-blue-500',
  });

  const isMobile = useIsMobile();

  const filteredAtividades = atividades.filter((ativ) => {
    const matchesSearch =
      ativ.acao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ativ.resultado.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesModulo = filterModulo === 'Todos' || ativ.modulo === filterModulo;
    return matchesSearch && matchesModulo;
  });

  const totalPages = Math.ceil(filteredAtividades.length / pageSize);
  const paginatedAtividades = filteredAtividades.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome) {
      toast.error('Preencha o nome da tag', {
        position: 'top-center',
        duration: 4000,
      });
      return;
    }

    if (selectedAtividade) {
      setAtividades(
        atividades.map((a) =>
          a.id === selectedAtividade
            ? { ...a, tag: { nome: formData.nome, cor: formData.cor } }
            : a
        )
      );
      toast.success('Tag adicionada com sucesso!', {
        position: 'top-center',
        duration: 4000,
      });
    }

    setIsModalOpen(false);
    setSelectedAtividade(null);
    setFormData({ nome: '', cor: 'bg-blue-500' });
  };

  const handleDelete = () => {
    if (deleteId) {
      setAtividades(
        atividades.map((a) =>
          a.id === deleteId ? { ...a, tag: undefined } : a
        )
      );
      toast.success('Tag removida com sucesso!', {
        position: 'top-center',
        duration: 4000,
      });
      setDeleteId(null);
    }
  };

  const handleModalClose = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      setSelectedAtividade(null);
      setFormData({ nome: '', cor: 'bg-blue-500' });
    }
  };

  const openTagModal = (atividadeId: number) => {
    const atividade = atividades.find((a) => a.id === atividadeId);
    if (atividade) {
      setSelectedAtividade(atividadeId);
      setFormData({
        nome: atividade.tag?.nome || '',
        cor: atividade.tag?.cor || 'bg-blue-500',
      });
      setIsModalOpen(true);
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
          <div className="flex flex-col gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
              <Input
                placeholder="Buscar atividades..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterModulo} onValueChange={setFilterModulo}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por módulo" />
              </SelectTrigger>
              <SelectContent>
                {modulos.map((mod) => (
                  <SelectItem key={mod} value={mod}>
                    {mod}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {paginatedAtividades.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <HistoryIcon className="h-12 w-12 text-neutral-400 mb-4" />
                <p className="text-neutral-600 dark:text-neutral-400 text-center">
                  Nenhuma atividade encontrada
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {paginatedAtividades.map((ativ) => (
                <Card key={ativ.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-4 w-4 text-neutral-400 shrink-0" />
                          <span className="text-[13px] text-neutral-500">
                            {ativ.dataHora}
                          </span>
                        </div>
                        <h4 className="font-medium">{ativ.acao}</h4>
                        <p className="text-[13px] text-neutral-600 dark:text-neutral-400 mt-1">
                          {ativ.resultado}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 mt-3">
                          <Badge variant="outline">{ativ.modulo}</Badge>
                          {ativ.tag && (
                            <Badge className={`${ativ.tag.cor} hover:opacity-90`}>
                              {ativ.tag.nome}
                            </Badge>
                          )}
                          <span className="text-[13px] text-neutral-500">ID: {ativ.id}</span>
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
                          <DropdownMenuItem onClick={() => openTagModal(ativ.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            {ativ.tag ? 'Editar Tag' : 'Adicionar Tag'}
                          </DropdownMenuItem>
                          {ativ.tag && (
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => setDeleteId(ativ.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Remover Tag
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {filteredAtividades.length > pageSize && (
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              totalItems={filteredAtividades.length}
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
          label="Adicionar Tag"
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
                placeholder="Buscar atividades..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterModulo} onValueChange={setFilterModulo}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filtrar por módulo" />
              </SelectTrigger>
              <SelectContent>
                {modulos.map((mod) => (
                  <SelectItem key={mod} value={mod}>
                    {mod}
                  </SelectItem>
                ))}
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
                <TableHead>Data/Hora</TableHead>
                <TableHead>Ação</TableHead>
                <TableHead>Módulo</TableHead>
                <TableHead>Resultado</TableHead>
                <TableHead>Tag</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedAtividades.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center py-8">
                      <HistoryIcon className="h-12 w-12 text-neutral-400 mb-2" />
                      <p className="text-neutral-600 dark:text-neutral-400">
                        Nenhuma atividade encontrada
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedAtividades.map((ativ) => (
                  <TableRow key={ativ.id}>
                    <TableCell>{ativ.id}</TableCell>
                    <TableCell className="font-medium">{ativ.dataHora}</TableCell>
                    <TableCell>{ativ.acao}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{ativ.modulo}</Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{ativ.resultado}</TableCell>
                    <TableCell>
                      {ativ.tag && (
                        <Badge className={`${ativ.tag.cor} hover:opacity-90`}>
                          {ativ.tag.nome}
                        </Badge>
                      )}
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
                          <DropdownMenuItem onClick={() => openTagModal(ativ.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            {ativ.tag ? 'Editar Tag' : 'Adicionar Tag'}
                          </DropdownMenuItem>
                          {ativ.tag && (
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => setDeleteId(ativ.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Remover Tag
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          {filteredAtividades.length > 0 && (
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              totalItems={filteredAtividades.length}
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
            {paginatedAtividades.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <HistoryIcon className="h-12 w-12 text-neutral-400 mb-4" />
                  <p className="text-neutral-600 dark:text-neutral-400 text-center">
                    Nenhuma atividade encontrada
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {paginatedAtividades.map((ativ) => (
                    <Card key={ativ.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <Clock className="h-4 w-4 text-neutral-500" />
                              <span className="text-[13px] text-neutral-600 dark:text-neutral-400">
                                {ativ.dataHora}
                              </span>
                            </div>
                            <h4 className="font-medium mb-1">{ativ.acao}</h4>
                            <p className="text-[13px] text-neutral-500">ID: {ativ.id}</p>
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
                              <DropdownMenuItem onClick={() => openTagModal(ativ.id)}>
                                <Edit className="mr-2 h-4 w-4" />
                                {ativ.tag ? 'Editar Tag' : 'Adicionar Tag'}
                              </DropdownMenuItem>
                              {ativ.tag && (
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => setDeleteId(ativ.id)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Remover Tag
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <p className="text-[13px] text-neutral-600 dark:text-neutral-400 mb-3">
                          {ativ.resultado}
                        </p>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="outline">{ativ.modulo}</Badge>
                          {ativ.tag && (
                            <Badge className={`${ativ.tag.cor} hover:opacity-90`}>
                              {ativ.tag.nome}
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {filteredAtividades.length > pageSize && (
                  <TablePagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    pageSize={pageSize}
                    totalItems={filteredAtividades.length}
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
          className="max-w-md"
          onEscapeKeyDown={() => handleModalClose(false)}
        >
          <DialogHeader>
            <DialogTitle>Nova Tag</DialogTitle>
            <DialogDescription>
              Adicione uma tag para organizar suas atividades
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome da Tag *</Label>
                <InputField
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Ex: Importante, Urgente, Concluído"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cor">Cor</Label>
                <Select
                  value={formData.cor}
                  onValueChange={(value) => setFormData({ ...formData, cor: value })}
                >
                  <SelectTrigger id="cor">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {coresDisponiveis.map((cor) => (
                      <SelectItem key={cor.value} value={cor.value}>
                        <div className="flex items-center gap-2">
                          <div className={`h-4 w-4 rounded ${cor.value}`} />
                          <span>{cor.label}</span>
                        </div>
                      </SelectItem>
                    ))}
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

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar remoção</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover esta tag? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
