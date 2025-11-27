import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Plug,
  BarChart3,
  Settings,
  Package,
  Lightbulb,
  ShoppingCart,
  UserSearch,
  History,
  FileText,
  StickyNote,
  Home,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  DollarSign,
  QrCode,
  Eye,
  Download,
  Sparkles,
  TrendingUp,
  ChevronDown,
} from 'lucide-react';
import { cn } from '../ui/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../ui/collapsible';
import type { Persona } from '../../App';

interface AppSidebarProps {
  currentPersona: Persona;
}

export function AppSidebar({ currentPersona }: AppSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Initialize collapsed state: true only if on /home, otherwise use localStorage
  const getInitialCollapsedState = () => {
    if (location.pathname === '/home') {
      return true; // Always collapsed on Home
    }
    const stored = localStorage.getItem('sidebar-collapsed');
    return stored ? stored === 'true' : false;
  };
  
  const [isCollapsed, setIsCollapsed] = useState(getInitialCollapsedState);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const stored = localStorage.getItem('sidebar-open-groups');
    return stored ? JSON.parse(stored) : {};
  });

  // Update collapsed state when location changes
  useEffect(() => {
    if (location.pathname === '/home') {
      // Always collapse on Home, but don't save to localStorage
      setIsCollapsed(true);
    }
    // On other routes, keep the user's last choice (already in state)
  }, [location.pathname]);

  // Save collapsed state to localStorage only when user manually toggles (not on Home)
  const handleToggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    
    // Only save to localStorage if not on Home
    if (location.pathname !== '/home') {
      localStorage.setItem('sidebar-collapsed', String(newState));
    }
  };

  const toggleGroup = (groupId: string) => {
    setOpenGroups((prev) => {
      const newSet = { ...prev };
      newSet[groupId] = !prev[groupId];
      localStorage.setItem('sidebar-open-groups', JSON.stringify(newSet));
      return newSet;
    });
  };

  // Determinar se deve mostrar expandida (collapsed=false)
  const isExpanded = !isCollapsed;
  
  const menuItems = getMenuItems(currentPersona);

  return (
    <TooltipProvider delayDuration={0}>
      <div
        className={cn(
          'flex h-full flex-col bg-black transition-all duration-300 ease-in-out',
          isExpanded ? 'w-[260px]' : 'w-[72px]'
        )}
      >
        {/* Logo + Toggle */}
        <div className="flex h-[88px] items-center justify-between border-b border-white/10 px-4">
          {isExpanded ? (
            <>
              <h1 className="text-[24px] font-bold leading-[33.6px] text-neutral-50 whitespace-nowrap">
                MVP Platform
              </h1>
              <button
                onClick={handleToggleCollapse}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-50/60 transition-colors hover:bg-white/10 hover:text-neutral-50"
                aria-label={isCollapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            </>
          ) : (
            <button
              onClick={handleToggleCollapse}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-50/60 transition-colors hover:bg-white/10 hover:text-neutral-50"
              aria-label="Expandir sidebar"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {menuItems.map((item) => {
            if ('items' in item) {
              // Item de grupo
              const isGroupOpen = openGroups[item.id] || false;
              const hasActiveChild = item.items.some(
                (child) =>
                  location.pathname === child.path ||
                  (child.path !== '/' && location.pathname.startsWith(child.path))
              );

              if (!isExpanded) {
                // Quando colapsada, mostrar os sub-items individuais com tooltip
                return item.items.map((child) => {
                  const isActive =
                    location.pathname === child.path ||
                    (child.path !== '/' && location.pathname.startsWith(child.path));

                  const menuButton = (
                    <button
                      key={child.path}
                      onClick={() => navigate(child.path)}
                      className={cn(
                        'flex w-full items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-left text-[13px] leading-[16.25px] transition-colors',
                        isActive
                          ? 'bg-[#2f5fff] text-neutral-50'
                          : 'text-neutral-50/80 hover:bg-white/5',
                        'justify-center'
                      )}
                      aria-label={child.label}
                    >
                      <child.icon className="h-5 w-5 flex-shrink-0" />
                    </button>
                  );

                  return (
                    <Tooltip key={child.path}>
                      <TooltipTrigger asChild>{menuButton}</TooltipTrigger>
                      <TooltipContent side="right" sideOffset={10}>
                        <span>{child.label}</span>
                      </TooltipContent>
                    </Tooltip>
                  );
                });
              }

              // Quando expandida, mostrar o grupo colapsável
              return (
                <Collapsible
                  key={item.id}
                  open={isGroupOpen}
                  onOpenChange={() => toggleGroup(item.id)}
                >
                  <CollapsibleTrigger
                    className={cn(
                      'flex w-full items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-left text-[13px] leading-[16.25px] transition-colors',
                      hasActiveChild
                        ? 'bg-white/5 text-neutral-50'
                        : 'text-neutral-50/80 hover:bg-white/5'
                    )}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    <span className="flex-1 truncate">{item.label}</span>
                    <ChevronDown
                      className={cn(
                        'h-4 w-4 transition-transform',
                        isGroupOpen && 'rotate-180'
                      )}
                    />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-1 pl-4 pt-1">
                    {item.items.map((child) => {
                      const isActive =
                        location.pathname === child.path ||
                        (child.path !== '/' && location.pathname.startsWith(child.path));

                      return (
                        <button
                          key={child.path}
                          onClick={() => navigate(child.path)}
                          className={cn(
                            'flex w-full items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-left text-[13px] leading-[16.25px] transition-colors',
                            isActive
                              ? 'bg-[#2f5fff] text-neutral-50'
                              : 'text-neutral-50/80 hover:bg-white/5'
                          )}
                        >
                          <child.icon className="h-4 w-4 flex-shrink-0" />
                          <span className="flex-1 truncate">{child.label}</span>
                        </button>
                      );
                    })}
                  </CollapsibleContent>
                </Collapsible>
              );
            }

            // Item simples
            const isActive =
              location.pathname === item.path ||
              (item.path !== '/' && location.pathname.startsWith(item.path));

            const menuButton = (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  'flex w-full items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-left text-[13px] leading-[16.25px] transition-colors',
                  isActive
                    ? 'bg-[#2f5fff] text-neutral-50'
                    : 'text-neutral-50/80 hover:bg-white/5',
                  !isExpanded && 'justify-center'
                )}
                aria-label={item.label}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {isExpanded && (
                  <>
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.badge && (
                      <span className="flex h-[18px] min-w-[22px] items-center justify-center rounded-[9px] bg-neutral-50 px-1.5 text-[11px] font-bold leading-[11px] text-[#161e53]">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </button>
            );

            // Se colapsada (e não em hover), mostrar tooltip
            if (!isExpanded) {
              return (
                <Tooltip key={item.path}>
                  <TooltipTrigger asChild>{menuButton}</TooltipTrigger>
                  <TooltipContent side="right" sideOffset={10}>
                    <div className="flex items-center gap-2">
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="flex h-[18px] min-w-[22px] items-center justify-center rounded-[9px] bg-neutral-50 px-1.5 text-[11px] font-bold leading-[11px] text-[#161e53]">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              );
            }

            return menuButton;
          })}
        </nav>
      </div>
    </TooltipProvider>
  );
}

interface MenuItem {
  path: string;
  label: string;
  icon: any;
  badge?: number;
}

interface MenuGroup {
  id: string;
  label: string;
  icon: any;
  items: MenuItem[];
}

type MenuItemOrGroup = MenuItem | MenuGroup;

function getMenuItems(persona: Persona): MenuItemOrGroup[] {
  if (persona === 'Ana Admin') {
    return [
      { path: '/hub', label: 'Hub de Módulos', icon: LayoutDashboard },
      { path: '/users', label: 'Usuários & Permissões', icon: Users },
      { path: '/integrations', label: 'Integrações & Chaves', icon: Plug },
      { path: '/plans', label: 'Planos & Assinaturas', icon: DollarSign },
      { path: '/products', label: 'Produtos Avulsos', icon: Package },
      { path: '/qr-architect', label: 'QR & Arquiteto', icon: QrCode },
      { path: '/reports', label: 'Relatórios', icon: BarChart3 },
      { path: '/settings', label: 'Configurações', icon: Settings },
    ];
  }

  if (persona === 'Paulo Padrão') {
    return [
      { path: '/home', label: 'Home', icon: Home },
      { path: '/hub', label: 'Hub de Módulos', icon: Package },
      {
        id: 'marketing',
        label: 'Marketing',
        icon: Lightbulb,
        items: [
          { path: '/marketing/briefing', label: 'Briefing', icon: Lightbulb },
          { path: '/marketing/editor', label: 'Editor', icon: FileText },
        ],
      },
      { path: '/sales/funnel', label: 'Vendas Online', icon: ShoppingCart },
      {
        id: 'headhunter',
        label: 'Red Hunter',
        icon: UserSearch,
        items: [
          { path: '/headhunter/search', label: 'Busca', icon: UserSearch },
          { path: '/headhunter/screening', label: 'Triagem', icon: Users },
          { path: '/headhunter/export', label: 'Exportar', icon: Download },
        ],
      },
      { path: '/whatsapp/playbooks', label: 'WhatsApp', icon: MessageSquare },
      { path: '/consultancy/chat', label: 'Consultoria - Chat', icon: Sparkles },
      { path: '/income/wizard', label: 'Renda Automática', icon: TrendingUp },
      { path: '/reports', label: 'Relatórios', icon: BarChart3 },
      { path: '/history', label: 'Histórico', icon: History },
    ];
  }

  if (persona === 'Clara Consultora') {
    return [
      { path: '/accounts', label: 'Painel de Contas', icon: Eye },
      { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/reports', label: 'Relatórios', icon: BarChart3 },
      { path: '/notes', label: 'Anotações/Feedback', icon: StickyNote },
    ];
  }

  return [];
}