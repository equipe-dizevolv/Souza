import { useState, useEffect, useMemo } from 'react';
import { Plus, MoreVertical, Eye, Edit, Trash2, Search, KeyRound, ArrowUpDown } from 'lucide-react';
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
import { Badge } from '../../components/ui/badge';
import { Checkbox } from '../../components/ui/checkbox';
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
import { usePhoneMask } from '../../hooks/use-phone-mask';

interface User {
  id: number;
  nome: string;
  email: string;
  perfil: string;
  modulos: string[];
  telefone: string;
  status: 'Ativo' | 'Inativo';
}

const initialUsers: User[] = [
  {
    id: 1,
    nome: 'Ana Admin',
    email: 'ana@empresa.com',
    perfil: 'Administrador',
    modulos: ['Todos'],
    telefone: '(11) 98765-4321',
    status: 'Ativo',
  },
  {
    id: 2,
    nome: 'Paulo Padrão',
    email: 'paulo@empresa.com',
    perfil: 'Usuário',
    modulos: ['Marketing IA', 'Vendas IA'],
    telefone: '(11) 91234-5678',
    status: 'Ativo',
  },
  {
    id: 3,
    nome: 'Clara Consultora',
    email: 'clara@empresa.com',
    perfil: 'Consultor',
    modulos: ['Relatórios'],
    telefone: '(11) 99999-8888',
    status: 'Ativo',
  },
  {
    id: 4,
    nome: 'Bruno Silva',
    email: 'bruno@empresa.com',
    perfil: 'Usuário',
    modulos: ['Head Hunter IA'],
    telefone: '(21) 97777-6666',
    status: 'Ativo',
  },
];

type SortField = 'id' | 'nome' | 'email';
type SortOrder = 'asc' | 'desc';

export function AdminUsers() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [resetPasswordId, setResetPasswordId] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sortField, setSortField] = useState<SortField>('nome'); // Ordenação padrão por Nome
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    perfil: 'Usuário',
    modulos: [] as string[],
    telefone: '',
    status: 'Ativo' as 'Ativo' | 'Inativo',
  });
  const [phoneError, setPhoneError] = useState('');

  const phoneMask = usePhoneMask();

  // Detectar mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Filtro e Ordenação
  const sortedAndFilteredUsers = useMemo(() => {
    let filtered = users.filter(
      (user) =>
        user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Aplicar ordenação
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [users, searchTerm, sortField, sortOrder]);

  // Paginação
  const totalPages = Math.ceil(sortedAndFilteredUsers.length / pageSize);
  const paginatedUsers = sortedAndFilteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, pageSize]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handlePhoneChange = (value: string) => {
    const formatted = phoneMask.handleChange(value);
    setFormData({ ...formData, telefone: formatted });
    setPhoneError('');
  };

  const handlePhoneBlur = () => {
    if (formData.telefone && !phoneMask.isValid(formData.telefone)) {
      setPhoneError('Por favor, insira um telefone válido no formato (99) 99999-9999');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar telefone
    if (formData.telefone && !phoneMask.isValid(formData.telefone)) {
      setPhoneError('Por favor, insira um telefone válido');
      return;
    }

    const newUser: User = {
      id: Math.max(...users.map((u) => u.id), 0) + 1,
      ...formData,
    };
    setUsers([...users, newUser]);
    setIsModalOpen(false);
    setFormData({
      nome: '',
      email: '',
      perfil: 'Usuário',
      modulos: [],
      telefone: '',
      status: 'Ativo',
    });
    setPhoneError('');
    toast.success('Usuário adicionado com sucesso!');
  };

  const handleDelete = () => {
    if (deleteId) {
      setUsers(users.filter((u) => u.id !== deleteId));
      toast.success('Usuário excluído com sucesso!');
      setDeleteId(null);
    }
  };

  const handleResetPassword = () => {
    if (resetPasswordId) {
      const user = users.find((u) => u.id === resetPasswordId);
      toast.success(`Senha de ${user?.nome} redefinida com sucesso!`);
      setResetPasswordId(null);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPerfilBadgeColor = (perfil: string) => {
    switch (perfil) {
      case 'Administrador':
        return 'bg-purple-500';
      case 'Usuário':
        return 'bg-blue-500';
      case 'Consultor':
        return 'bg-orange-500';
      default:
        return 'bg-neutral-400';
    }
  };

  // Versão Mobile
  if (isMobile) {
    return (
      <div className="space-y-4 pb-20">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
          <Input
            placeholder="Buscar usuários..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Lista Mobile */}
        <div className="space-y-2">
          {paginatedUsers.length === 0 ? (
            <div className="text-center py-12 text-neutral-600 dark:text-neutral-400">
              Nenhum usuário encontrado.
            </div>
          ) : (
            paginatedUsers.map((user) => (
              <div
                key={user.id}
                className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[12px] text-neutral-500">#{user.id}</span>
                    </div>
                    <h3 className="font-medium truncate">{user.nome}</h3>
                    {/* Chip de Perfil logo abaixo do Nome */}
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={getPerfilBadgeColor(user.perfil)}>
                        {user.perfil}
                      </Badge>
                      <Badge
                        variant={user.status === 'Ativo' ? 'default' : 'secondary'}
                        className={user.status === 'Ativo' ? 'bg-green-500' : 'bg-neutral-400'}
                      >
                        {user.status}
                      </Badge>
                    </div>
                    <p className="text-[13px] text-neutral-600 dark:text-neutral-400 truncate mt-1">
                      {user.email}
                    </p>
                    <p className="text-[12px] text-neutral-500 mt-0.5">
                      {user.telefone}
                    </p>
                  </div>
                  {/* Kebab com hit target de 40px */}
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
                      {/* Ação "Resetar senha" na posição 2 */}
                      <DropdownMenuItem onClick={() => setResetPasswordId(user.id)}>
                        <KeyRound className="mr-2 h-4 w-4" />
                        Resetar senha
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => setDeleteId(user.id)}
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
        {sortedAndFilteredUsers.length > 0 && (
          <div className="rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              totalItems={sortedAndFilteredUsers.length}
              onPageChange={handlePageChange}
              onPageSizeChange={setPageSize}
            />
          </div>
        )}

        {/* FAB */}
        <FAB
          onClick={() => setIsModalOpen(true)}
          icon={<Plus className="h-6 w-6" />}
          label="Adicionar Usuário"
        />

        {/* Modals */}
        <UserDialog
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          phoneError={phoneError}
          onPhoneChange={handlePhoneChange}
          onPhoneBlur={handlePhoneBlur}
        />

        <DeleteDialog
          open={deleteId !== null}
          onOpenChange={() => setDeleteId(null)}
          onConfirm={handleDelete}
          title="Confirmar Exclusão"
          description="Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita."
        />

        <ResetPasswordDialog
          open={resetPasswordId !== null}
          onOpenChange={() => setResetPasswordId(null)}
          onConfirm={handleResetPassword}
          userName={users.find((u) => u.id === resetPasswordId)?.nome || ''}
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
            placeholder="Buscar usuários..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Usuário
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-[14px] border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer select-none"
                onClick={() => handleSort('id')}
              >
                <div className="flex items-center gap-1">
                  ID
                  {sortField === 'id' && (
                    <ArrowUpDown className="h-3 w-3" />
                  )}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer select-none"
                onClick={() => handleSort('nome')}
              >
                <div className="flex items-center gap-1">
                  Nome
                  {sortField === 'nome' && (
                    <ArrowUpDown className="h-3 w-3" />
                  )}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer select-none"
                onClick={() => handleSort('email')}
              >
                <div className="flex items-center gap-1">
                  E-mail
                  {sortField === 'email' && (
                    <ArrowUpDown className="h-3 w-3" />
                  )}
                </div>
              </TableHead>
              <TableHead>Perfil</TableHead>
              <TableHead>Módulos</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  Nenhum usuário encontrado.
                </TableCell>
              </TableRow>
            ) : (
              paginatedUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell className="font-medium">{user.nome}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge className={getPerfilBadgeColor(user.perfil)}>
                      {user.perfil}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {user.modulos.map((modulo, idx) => (
                        <Badge key={idx} variant="outline">
                          {modulo}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{user.telefone}</TableCell>
                  <TableCell>
                    <Badge
                      variant={user.status === 'Ativo' ? 'default' : 'secondary'}
                      className={user.status === 'Ativo' ? 'bg-green-500' : 'bg-neutral-400'}
                    >
                      {user.status}
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
                        <DropdownMenuItem onClick={() => setResetPasswordId(user.id)}>
                          <KeyRound className="mr-2 h-4 w-4" />
                          Resetar senha
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => setDeleteId(user.id)}
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
        {sortedAndFilteredUsers.length > 0 && (
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={sortedAndFilteredUsers.length}
            onPageChange={handlePageChange}
            onPageSizeChange={setPageSize}
          />
        )}
      </div>

      {/* Modals */}
      <UserDialog
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        phoneError={phoneError}
        onPhoneChange={handlePhoneChange}
        onPhoneBlur={handlePhoneBlur}
      />

      <DeleteDialog
        open={deleteId !== null}
        onOpenChange={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Confirmar Exclusão"
        description="Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita."
      />

      <ResetPasswordDialog
        open={resetPasswordId !== null}
        onOpenChange={() => setResetPasswordId(null)}
        onConfirm={handleResetPassword}
        userName={users.find((u) => u.id === resetPasswordId)?.nome || ''}
      />
    </div>
  );
}

// Componente User Dialog
function UserDialog({
  open,
  onOpenChange,
  formData,
  setFormData,
  onSubmit,
  phoneError,
  onPhoneChange,
  onPhoneBlur,
}: any) {
  const modulosDisponiveis = ['Marketing IA', 'Vendas IA', 'Head Hunter IA', 'Relatórios'];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl" onEscapeKeyDown={() => onOpenChange(false)}>
        <DialogHeader>
          <DialogTitle>Novo Usuário</DialogTitle>
          <DialogDescription>
            Adicione um novo usuário ao sistema
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  required
                  aria-required="true"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  aria-required="true"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone (99) 99999-9999</Label>
                <Input
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) => onPhoneChange(e.target.value)}
                  onBlur={onPhoneBlur}
                  placeholder="(11) 98765-4321"
                  className={phoneError ? 'border-red-500' : ''}
                />
                {phoneError && (
                  <p className="text-[12px] text-red-600 mt-1">{phoneError}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="perfil">Perfil *</Label>
                <Select
                  value={formData.perfil}
                  onValueChange={(value) => setFormData({ ...formData, perfil: value })}
                  required
                >
                  <SelectTrigger id="perfil">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Administrador">Administrador</SelectItem>
                    <SelectItem value="Usuário">Usuário</SelectItem>
                    <SelectItem value="Consultor">Consultor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Módulos *</Label>
              <div className="grid grid-cols-2 gap-3">
                {modulosDisponiveis.map((modulo) => (
                  <div key={modulo} className="flex items-center space-x-2">
                    <Checkbox
                      id={modulo}
                      checked={formData.modulos.includes(modulo)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData({
                            ...formData,
                            modulos: [...formData.modulos, modulo],
                          });
                        } else {
                          setFormData({
                            ...formData,
                            modulos: formData.modulos.filter((m: string) => m !== modulo),
                          });
                        }
                      }}
                    />
                    <Label htmlFor={modulo} className="cursor-pointer">
                      {modulo}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
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

// Delete Dialog Component
function DeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
}: any) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
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

// Reset Password Dialog Component
function ResetPasswordDialog({
  open,
  onOpenChange,
  onConfirm,
  userName,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  userName: string;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Resetar Senha</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja resetar a senha de <strong>{userName}</strong>?
            <br />
            Uma nova senha temporária será enviada por e-mail.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            Resetar Senha
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
