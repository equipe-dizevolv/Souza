import { useState } from 'react';
import { Plus, MoreVertical, Eye, Edit, Trash2, Search, Calendar } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
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
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { toast } from 'sonner@2.0.3';
import { FAB } from '../../components/fab';
import { useIsMobile } from '../../components/ui/use-mobile';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';

interface Task {
  id: number;
  titulo: string;
  descricao: string;
  etapa: string;
  status: 'Pendente' | 'Em Andamento' | 'Concluído';
  deadline: string;
}

const etapas = [
  { value: 'prospecção', label: 'Prospecção' },
  { value: 'qualificação', label: 'Qualificação' },
  { value: 'proposta', label: 'Proposta' },
  { value: 'negociação', label: 'Negociação' },
  { value: 'fechamento', label: 'Fechamento' },
];

const initialTasks: Task[] = [
  {
    id: 1,
    titulo: 'Contato Inicial - Empresa A',
    descricao: 'Primeira reunião de apresentação',
    etapa: 'prospecção',
    status: 'Concluído',
    deadline: '15/11/2025',
  },
  {
    id: 2,
    titulo: 'Análise de Necessidades - Empresa B',
    descricao: 'Levantamento de requisitos',
    etapa: 'qualificação',
    status: 'Em Andamento',
    deadline: '20/11/2025',
  },
  {
    id: 3,
    titulo: 'Envio de Proposta - Empresa C',
    descricao: 'Elaborar e enviar proposta comercial',
    etapa: 'proposta',
    status: 'Pendente',
    deadline: '25/11/2025',
  },
];

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  index: number;
  moveTask: (dragIndex: number, hoverIndex: number, targetEtapa: string) => void;
}

function TaskCard({ task, onEdit, onDelete, index, moveTask }: TaskCardProps) {
  const isMobile = useIsMobile();

  const [{ isDragging }, drag] = useDrag({
    type: 'TASK',
    item: { id: task.id, index, etapa: task.etapa },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'TASK',
    hover: (item: { id: number; index: number; etapa: string }) => {
      if (item.etapa !== task.etapa) {
        moveTask(item.index, index, task.etapa);
        item.index = index;
        item.etapa = task.etapa;
      } else if (item.index !== index) {
        moveTask(item.index, index, task.etapa);
        item.index = index;
      }
    },
  });

  return (
    <div ref={(node) => !isMobile && drag(drop(node))}>
      <Card className={`${isDragging && !isMobile ? 'opacity-50' : ''} ${!isMobile ? 'cursor-move' : ''}`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h4 className="font-medium truncate">{task.titulo}</h4>
              <p className="text-[13px] text-neutral-600 dark:text-neutral-400 line-clamp-2 mt-1">
                {task.descricao}
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <Badge
                  variant={
                    task.status === 'Concluído'
                      ? 'default'
                      : task.status === 'Em Andamento'
                      ? 'secondary'
                      : 'outline'
                  }
                  className={
                    task.status === 'Concluído'
                      ? 'bg-green-500 hover:bg-green-600'
                      : task.status === 'Em Andamento'
                      ? 'bg-blue-500 hover:bg-blue-600'
                      : 'bg-yellow-500 hover:bg-yellow-600'
                  }
                >
                  {task.status}
                </Badge>
                <span className="text-[13px] text-neutral-500 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {task.deadline}
                </span>
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
                <DropdownMenuItem onClick={() => onEdit(task)}>
                  <Eye className="mr-2 h-4 w-4" />
                  Visualizar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(task)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600" onClick={() => onDelete(task.id)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface ColumnDropZoneProps {
  etapa: string;
  children: React.ReactNode;
  moveTask: (dragIndex: number, hoverIndex: number, targetEtapa: string) => void;
}

function ColumnDropZone({ etapa, children, moveTask }: ColumnDropZoneProps) {
  const [, drop] = useDrop({
    accept: 'TASK',
    drop: (item: { id: number; index: number; etapa: string }) => {
      if (item.etapa !== etapa) {
        moveTask(item.index, -1, etapa);
      }
    },
  });

  return (
    <div ref={drop} className="min-h-[200px]">
      {children}
    </div>
  );
}

export function SalesFunnel() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState('prospecção');
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    etapa: '',
    status: 'Pendente' as const,
    deadline: '',
  });

  const isMobile = useIsMobile();
  const DndBackend = isMobile ? TouchBackend : HTML5Backend;

  const formatDate = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
  };

  const handleDateChange = (value: string) => {
    const formatted = formatDate(value);
    setFormData({ ...formData, deadline: formatted });
  };

  const moveTask = (dragIndex: number, hoverIndex: number, targetEtapa: string) => {
    setTasks((prevTasks) => {
      const newTasks = [...prevTasks];
      const draggedTask = newTasks.find((t) => t.etapa === targetEtapa);
      
      // Find all tasks in the target column
      const columnTasks = newTasks.filter((t) => t.etapa === targetEtapa);
      const otherTasks = newTasks.filter((t) => t.etapa !== targetEtapa);
      
      // Update the dragged task's etapa
      const taskToMove = newTasks.find((t, i) => i === dragIndex);
      if (taskToMove) {
        taskToMove.etapa = targetEtapa;
      }
      
      return newTasks;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titulo || !formData.etapa) {
      toast.error('Preencha todos os campos obrigatórios', {
        position: 'top-center',
        duration: 4000,
      });
      return;
    }

    const newTask: Task = {
      id: Math.max(...tasks.map((t) => t.id), 0) + 1,
      ...formData,
    };

    setTasks([...tasks, newTask]);
    setIsModalOpen(false);
    setFormData({
      titulo: '',
      descricao: '',
      etapa: '',
      status: 'Pendente',
      deadline: '',
    });
    toast.success('Tarefa criada com sucesso!', {
      position: 'top-center',
      duration: 4000,
    });
  };

  const handleDelete = () => {
    if (deleteId) {
      setTasks(tasks.filter((t) => t.id !== deleteId));
      toast.success('Tarefa excluída com sucesso!', {
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
        titulo: '',
        descricao: '',
        etapa: '',
        status: 'Pendente',
        deadline: '',
      });
    }
  };

  const filteredTasks = tasks.filter((task) =>
    task.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTasksByEtapa = (etapaValue: string) => {
    return filteredTasks.filter((task) => task.etapa === etapaValue);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-full" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-[300px]" />
          ))}
        </div>
      </div>
    );
  }

  if (isMobile) {
    return (
      <DndProvider backend={DndBackend}>
        <div className="space-y-4 pb-20">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
            <Input
              placeholder="Buscar tarefas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-3">
              {etapas.slice(0, 3).map((etapa) => (
                <TabsTrigger key={etapa.value} value={etapa.value} className="text-[13px]">
                  {etapa.label}
                  <Badge variant="secondary" className="ml-2">
                    {getTasksByEtapa(etapa.value).length}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>
            <div className="mt-4 overflow-x-auto">
              <div className="flex gap-2 pb-2">
                {etapas.slice(3).map((etapa) => (
                  <Button
                    key={etapa.value}
                    variant={selectedTab === etapa.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedTab(etapa.value)}
                  >
                    {etapa.label}
                    <Badge
                      variant="secondary"
                      className="ml-2"
                    >
                      {getTasksByEtapa(etapa.value).length}
                    </Badge>
                  </Button>
                ))}
              </div>
            </div>
            {etapas.map((etapa) => (
              <TabsContent key={etapa.value} value={etapa.value} className="space-y-3 mt-4">
                {getTasksByEtapa(etapa.value).length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <p className="text-neutral-600 dark:text-neutral-400 text-center">
                        Nenhuma tarefa nesta etapa
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  getTasksByEtapa(etapa.value).map((task, index) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      index={index}
                      onEdit={() => {}}
                      onDelete={setDeleteId}
                      moveTask={moveTask}
                    />
                  ))
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>

        <FAB
          onClick={() => setIsModalOpen(true)}
          icon={<Plus className="h-6 w-6" />}
          label="Adicionar Tarefa"
        />
      </DndProvider>
    );
  }

  return (
    <DndProvider backend={DndBackend}>
      <div className="space-y-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
          <Input
            placeholder="Buscar tarefas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
          {etapas.map((etapa) => {
            const etapaTasks = getTasksByEtapa(etapa.value);
            return (
              <Card key={etapa.value} className="flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{etapa.label}</CardTitle>
                    <Badge variant="secondary">{etapaTasks.length}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ColumnDropZone etapa={etapa.value} moveTask={moveTask}>
                    <div className="space-y-3">
                      {etapaTasks.map((task, index) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          index={index}
                          onEdit={() => {}}
                          onDelete={setDeleteId}
                          moveTask={moveTask}
                        />
                      ))}
                      {etapaTasks.length === 0 && (
                        <div className="flex items-center justify-center py-8 text-neutral-400">
                          <p className="text-[13px] text-center">
                            Arraste tarefas aqui
                          </p>
                        </div>
                      )}
                    </div>
                  </ColumnDropZone>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="flex justify-center">
          <Button onClick={() => setIsModalOpen(true)} size="lg">
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Tarefa
          </Button>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={handleModalClose}>
        <DialogContent
          className="max-w-2xl"
          onEscapeKeyDown={() => handleModalClose(false)}
        >
          <DialogHeader>
            <DialogTitle>Nova Tarefa/Peça</DialogTitle>
            <DialogDescription>
              Adicione uma nova tarefa ao funil de vendas
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="titulo">Título *</Label>
                <Input
                  id="titulo"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  placeholder="Ex: Contato Inicial - Empresa A"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  placeholder="Detalhes da tarefa..."
                  rows={3}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="etapa">Etapa *</Label>
                  <Select
                    value={formData.etapa}
                    onValueChange={(value) => setFormData({ ...formData, etapa: value })}
                    required
                  >
                    <SelectTrigger id="etapa">
                      <SelectValue placeholder="Selecione a etapa" />
                    </SelectTrigger>
                    <SelectContent>
                      {etapas.map((etapa) => (
                        <SelectItem key={etapa.value} value={etapa.value}>
                          {etapa.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pendente">Pendente</SelectItem>
                      <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                      <SelectItem value="Concluído">Concluído</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline (dd/MM/yyyy)</Label>
                <Input
                  id="deadline"
                  value={formData.deadline}
                  onChange={(e) => handleDateChange(e.target.value)}
                  placeholder="Ex: 15/11/2025"
                  maxLength={10}
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
              Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser desfeita.
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
    </DndProvider>
  );
}
