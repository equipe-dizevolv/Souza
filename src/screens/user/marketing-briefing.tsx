import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, MoreVertical, Eye, Edit, Trash2, Sparkles } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card } from '../../components/ui/card';
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

interface Briefing {
  id: string;
  nome: string;
  objetivo: string;
  publico: string;
  canais: string[];
  tom: string;
  orcamento: string;
  status: 'rascunho' | 'ativo' | 'concluído';
  criadoEm: Date;
  atualizadoEm: Date;
}

const mockBriefings: Briefing[] = [
  {
    id: '1',
    nome: 'Campanha Lançamento Produto Q1',
    objetivo: 'Aumentar awareness do novo produto em 40%',
    publico: 'Jovens profissionais 25-35 anos',
    canais: ['Instagram', 'LinkedIn', 'Google Ads'],
    tom: 'Profissional e inspirador',
    orcamento: 'R$ 50.000,00',
    status: 'ativo',
    criadoEm: new Date('2024-01-15'),
    atualizadoEm: new Date('2024-01-20'),
  },
  {
    id: '2',
    nome: 'Black Friday 2024',
    objetivo: 'Maximizar conversões durante período promocional',
    publico: 'Clientes existentes e prospects qualificados',
    canais: ['Email', 'WhatsApp', 'Facebook'],
    tom: 'Urgente e persuasivo',
    orcamento: 'R$ 30.000,00',
    status: 'rascunho',
    criadoEm: new Date('2024-01-10'),
    atualizadoEm: new Date('2024-01-18'),
  },
  {
    id: '3',
    nome: 'Retenção de Clientes Q4',
    objetivo: 'Reduzir churn em 25%',
    publico: 'Clientes ativos há mais de 6 meses',
    canais: ['Email', 'In-app'],
    tom: 'Amigável e educativo',
    orcamento: 'R$ 15.000,00',
    status: 'concluído',
    criadoEm: new Date('2023-12-01'),
    atualizadoEm: new Date('2024-01-05'),
  },
];

export function MarketingBriefing() {
  const navigate = useNavigate();
  const [briefings, setBriefings] = useState<Briefing[]>(mockBriefings);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [showManualFormDialog, setShowManualFormDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedBriefing, setSelectedBriefing] = useState<Briefing | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    nome: '',
    objetivo: '',
    publico: '',
    canais: [] as string[],
    tom: '',
    orcamento: '',
  });

  const handleDelete = () => {
    if (selectedBriefing) {
      setBriefings((prev) => prev.filter((b) => b.id !== selectedBriefing.id));
      toast.success('Briefing excluído com sucesso', {
        position: 'top-center',
        duration: 3000,
      });
      setShowDeleteDialog(false);
      setSelectedBriefing(null);
    }
  };

  const handleManualSubmit = () => {
    const newBriefing: Briefing = {
      id: Date.now().toString(),
      ...formData,
      status: 'rascunho',
      criadoEm: new Date(),
      atualizadoEm: new Date(),
    };

    setBriefings((prev) => [newBriefing, ...prev]);
    toast.success('Briefing criado com sucesso', {
      position: 'top-center',
      duration: 3000,
    });

    setShowManualFormDialog(false);
    setFormData({
      nome: '',
      objetivo: '',
      publico: '',
      canais: [],
      tom: '',
      orcamento: '',
    });
  };

  const filteredBriefings = briefings.filter((briefing) => {
    const matchesSearch =
      briefing.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      briefing.objetivo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'todos' || briefing.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Briefing['status']) => {
    const variants = {
      rascunho: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      ativo: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      concluído: 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200',
    };

    return (
      <Badge className={variants[status]} variant="secondary">
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[28px] leading-[39.2px] text-neutral-900 dark:text-neutral-50">
          Marketing — Briefing Rápido
        </h1>
        <p className="mt-2 text-[14px] leading-[19.6px] text-neutral-600 dark:text-neutral-400">
          Crie briefings rapidamente com IA ou preencha o formulário completo
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={() => navigate('/marketing/briefing/criar-com-ia')}
          className="gap-2"
        >
          <Sparkles className="h-4 w-4" />
          Sugerir Briefing com IA
        </Button>
        <Button
          variant="outline"
          onClick={() => setShowManualFormDialog(true)}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Adicionar Briefing (Form)
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[240px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
              <Input
                placeholder="Buscar briefings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os status</SelectItem>
              <SelectItem value="rascunho">Rascunho</SelectItem>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="concluído">Concluído</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Objetivo</TableHead>
              <TableHead>Canais</TableHead>
              <TableHead>Orçamento</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBriefings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center">
                  <p className="text-[14px] text-neutral-500 dark:text-neutral-400">
                    Nenhum briefing encontrado
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              filteredBriefings.map((briefing) => (
                <TableRow key={briefing.id}>
                  <TableCell className="font-mono text-[12px]">
                    #{briefing.id}
                  </TableCell>
                  <TableCell>{briefing.nome}</TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {briefing.objetivo}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {briefing.canais.slice(0, 2).map((canal) => (
                        <Badge key={canal} variant="outline" className="text-[11px]">
                          {canal}
                        </Badge>
                      ))}
                      {briefing.canais.length > 2 && (
                        <Badge variant="outline" className="text-[11px]">
                          +{briefing.canais.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{briefing.orcamento}</TableCell>
                  <TableCell>{getStatusBadge(briefing.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
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
                          className="text-red-600 dark:text-red-400"
                          onClick={() => {
                            setSelectedBriefing(briefing);
                            setShowDeleteDialog(true);
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
      </Card>

      {/* Manual Form Dialog */}
      <Dialog open={showManualFormDialog} onOpenChange={setShowManualFormDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Adicionar Briefing (Formulário)</DialogTitle>
            <DialogDescription>
              Preencha os campos abaixo para criar um novo briefing
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nome">Nome da Campanha*</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Ex: Lançamento Produto Q1"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="objetivo">Objetivo*</Label>
              <Textarea
                id="objetivo"
                value={formData.objetivo}
                onChange={(e) => setFormData({ ...formData, objetivo: e.target.value })}
                placeholder="Descreva o objetivo principal da campanha"
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="publico">Público-alvo*</Label>
              <Input
                id="publico"
                value={formData.publico}
                onChange={(e) => setFormData({ ...formData, publico: e.target.value })}
                placeholder="Ex: Jovens profissionais 25-35 anos"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tom">Tom de Voz*</Label>
              <Select
                value={formData.tom}
                onValueChange={(value) => setFormData({ ...formData, tom: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tom" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="profissional">Profissional</SelectItem>
                  <SelectItem value="descontraído">Descontraído</SelectItem>
                  <SelectItem value="inspirador">Inspirador</SelectItem>
                  <SelectItem value="urgente">Urgente</SelectItem>
                  <SelectItem value="educativo">Educativo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="orcamento">Orçamento*</Label>
              <Input
                id="orcamento"
                value={formData.orcamento}
                onChange={(e) => setFormData({ ...formData, orcamento: e.target.value })}
                placeholder="R$ 0,00"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowManualFormDialog(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleManualSubmit}>Salvar Rascunho</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o briefing "{selectedBriefing?.nome}"?
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
