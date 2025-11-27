import { useState } from 'react';
import { Plus, MoreVertical, Eye, Edit, Trash2, Search, Zap } from 'lucide-react';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { toast } from 'sonner';

interface Integration {
  id: number;
  nome: string;
  provedor: string;
  ambiente: string;
  status: 'Ativo' | 'Inativo';
}

const initialIntegrations: Integration[] = [
  { id: 1, nome: 'OpenAI GPT-4', provedor: 'OpenAI', ambiente: 'Produção', status: 'Ativo' },
  { id: 2, nome: 'n8n Workflow', provedor: 'n8n', ambiente: 'Produção', status: 'Ativo' },
  { id: 3, nome: 'LinkedIn API', provedor: 'LinkedIn', ambiente: 'Desenvolvimento', status: 'Inativo' },
];

export function AdminIntegrations() {
  const [integrations, setIntegrations] = useState<Integration[]>(initialIntegrations);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    provedor: 'OpenAI',
    ambiente: 'Produção',
    chave: '',
  });

  const filteredIntegrations = integrations.filter((integration) =>
    integration.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newIntegration: Integration = {
      id: Math.max(...integrations.map((i) => i.id), 0) + 1,
      nome: formData.nome,
      provedor: formData.provedor,
      ambiente: formData.ambiente,
      status: 'Ativo',
    };
    setIntegrations([...integrations, newIntegration]);
    setIsModalOpen(false);
    setFormData({ nome: '', provedor: 'OpenAI', ambiente: 'Produção', chave: '' });
    toast.success('Integração adicionada com sucesso!');
  };

  const handleTest = (integration: Integration) => {
    toast.loading('Testando integração...', { duration: 1500 });
    setTimeout(() => {
      toast.success(`Integração ${integration.nome} testada com sucesso!`);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
          <Input
            placeholder="Buscar integrações..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Integração
        </Button>
      </div>

      <div className="rounded-[14px] border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Provedor</TableHead>
              <TableHead>Ambiente</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredIntegrations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Nenhuma integração encontrada.
                </TableCell>
              </TableRow>
            ) : (
              filteredIntegrations.map((integration) => (
                <TableRow key={integration.id}>
                  <TableCell>{integration.id}</TableCell>
                  <TableCell className="font-medium">{integration.nome}</TableCell>
                  <TableCell>{integration.provedor}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{integration.ambiente}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={integration.status === 'Ativo' ? 'default' : 'secondary'}
                      className={integration.status === 'Ativo' ? 'bg-green-500' : 'bg-neutral-400'}
                    >
                      {integration.status}
                    </Badge>
                  </TableCell>
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
                        <DropdownMenuItem onClick={() => handleTest(integration)}>
                          <Zap className="mr-2 h-4 w-4" />
                          Testar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
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
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Integração</DialogTitle>
            <DialogDescription>Configure uma nova integração externa</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
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
                <Label htmlFor="provedor">Provedor</Label>
                <Select
                  value={formData.provedor}
                  onValueChange={(value) => setFormData({ ...formData, provedor: value })}
                >
                  <SelectTrigger id="provedor">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OpenAI">OpenAI</SelectItem>
                    <SelectItem value="n8n">n8n</SelectItem>
                    <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="chave">Chave de API</Label>
                <Input
                  id="chave"
                  type="password"
                  value={formData.chave}
                  onChange={(e) => setFormData({ ...formData, chave: e.target.value })}
                  placeholder="sk-..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ambiente">Ambiente</Label>
                <Select
                  value={formData.ambiente}
                  onValueChange={(value) => setFormData({ ...formData, ambiente: value })}
                >
                  <SelectTrigger id="ambiente">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Desenvolvimento">Desenvolvimento</SelectItem>
                    <SelectItem value="Homologação">Homologação</SelectItem>
                    <SelectItem value="Produção">Produção</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
