import { Bell, LightbulbIcon as LightMode, Moon as DarkMode, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { useTheme } from '../theme-provider';
import { AppSidebar } from './app-sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import type { Persona } from '../../App';
import { toast } from 'sonner@2.0.3';

interface AppLayoutProps {
  children: React.ReactNode;
  currentPersona: Persona;
  onPersonaChange: (persona: Persona) => void;
}

export function AppLayout({
  children,
  currentPersona,
  onPersonaChange,
}: AppLayoutProps) {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const getInitials = (name: Persona) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  const personas: Persona[] = ['Ana Admin', 'Paulo Padrão', 'Clara Consultora'];

  const handlePersonaChange = (persona: Persona) => {
    onPersonaChange(persona);
    // Navigate to default route for each persona
    if (persona === 'Ana Admin') {
      navigate('/hub');
    } else if (persona === 'Paulo Padrão') {
      navigate('/home');
    } else if (persona === 'Clara Consultora') {
      navigate('/accounts');
    }
  };

  const handleLogout = () => {
    // Clear auth tokens
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_email');
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('user_email');
    
    // Clear onboarding state para aparecer novamente no próximo login
    sessionStorage.removeItem('onboarding-completed');
    
    toast.success('Sessão encerrada com sucesso!', {
      position: 'top-center',
      duration: 3000,
    });
    
    setTimeout(() => {
      navigate('/auth/login');
    }, 500);
  };

  return (
    <div className="flex h-screen bg-white dark:bg-neutral-900">
      <AppSidebar
        currentPersona={currentPersona}
      />

      <div className="flex flex-1 flex-col">
        {/* TopBar - altura fixada em 64px (h-16), padding horizontal 16px (px-4) */}
        <header className="flex h-16 items-center justify-end border-b border-neutral-200 bg-white px-4 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="relative h-10 w-10 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:focus-visible:outline-neutral-50"
                  aria-label="Notificações"
                >
                  <Bell className="h-4 w-4 text-neutral-700 dark:text-neutral-300" />
                  <Badge className="absolute -right-1 -top-1 h-5 w-5 items-center justify-center rounded-full bg-red-600 p-0 text-[10px]">
                    3
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[320px] max-h-[60vh] overflow-auto">
                <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">Notificações</p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-auto p-0 text-[12px] text-blue-600 hover:text-blue-700 dark:text-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                    >
                      Ver tudo
                    </Button>
                  </div>
                  <p className="text-[12px] text-neutral-600 dark:text-neutral-400">Você tem 3 notificações não lidas</p>
                </div>
                <div className="py-2">
                  <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                    <p className="text-[13px]">Nova integração configurada</p>
                    <p className="text-[11px] text-neutral-600 dark:text-neutral-400">Há 5 minutos</p>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                    <p className="text-[13px]">Usuário adicionado ao sistema</p>
                    <p className="text-[11px] text-neutral-600 dark:text-neutral-400">Há 1 hora</p>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                    <p className="text-[13px]">Relatório exportado com sucesso</p>
                    <p className="text-[11px] text-neutral-600 dark:text-neutral-400">Há 3 horas</p>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Toggle - ícones Material design light_mode/dark_mode com transição 200ms */}
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:focus-visible:outline-neutral-50 transition-transform duration-200"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              aria-label={theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
            >
              {theme === 'light' ? (
                <LightMode className="h-5 w-5 text-neutral-700 dark:text-neutral-300" />
              ) : (
                <DarkMode className="h-5 w-5 text-neutral-300" />
              )}
            </Button>

            {/* Profile / Persona Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  data-tour="user-menu"
                  variant="ghost" 
                  size="icon" 
                  className="h-10 w-10 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:focus-visible:outline-neutral-50"
                  aria-label="Trocar persona"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-[#161e53] text-neutral-50 text-[14px]">
                      {getInitials(currentPersona)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5 text-sm font-medium">
                  Trocar Persona
                </div>
                {personas.map((persona) => (
                  <DropdownMenuItem
                    key={persona}
                    onClick={() => handlePersonaChange(persona)}
                    className={currentPersona === persona ? 'bg-neutral-100 dark:bg-neutral-800' : ''}
                  >
                    <Avatar className="mr-2 h-6 w-6">
                      <AvatarFallback className="bg-[#161e53] text-neutral-50 text-[11px]">
                        {getInitials(persona)}
                      </AvatarFallback>
                    </Avatar>
                    {persona}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-white p-8 dark:bg-neutral-900">
          {children}
        </main>
      </div>
    </div>
  );
}