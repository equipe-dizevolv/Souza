# Sistema de Onboarding com Avatar 3D

## 📋 Visão Geral

Sistema completo de onboarding interativo com avatar 3D que guia novos usuários pela plataforma através de um tour guiado em 3 passos.

## ✨ Características

- ✅ **Avatar 3D animado** no canto inferior direito
- ✅ **Tour guiado interativo** com spotlights nos elementos da UI
- ✅ **3 passos personalizados** por persona (Admin, User, Consultor)
- ✅ **Aparece apenas no primeiro login**
- ✅ **Usuário pode pular** o tour a qualquer momento
- ✅ **Botão para reabrir** o tutorial posteriormente
- ✅ **Animações suaves** com Motion/React
- ✅ **Tema claro/escuro** totalmente suportado
- ✅ **LocalStorage** para persistência de estado

## 🎯 Componentes

### 1. OnboardingTour
Componente principal do tour guiado.

**Props:**
- `userRole`: 'admin' | 'user' | 'consultant' - Define qual tour mostrar
- `onComplete`: () => void - Callback quando o usuário completa o tour

**Exemplo de uso:**
```tsx
import { OnboardingTour } from './components/onboarding/OnboardingTour';

function App() {
  const [showOnboarding, setShowOnboarding] = useState(true);
  
  return (
    <>
      {/* Seu app aqui */}
      {showOnboarding && (
        <OnboardingTour 
          userRole="user" 
          onComplete={() => setShowOnboarding(false)} 
        />
      )}
    </>
  );
}
```

### 2. useOnboarding
Hook customizado para gerenciar o estado do onboarding.

**Parâmetros:**
- `userRole`: 'admin' | 'user' | 'consultant' (opcional, padrão: 'user')

**Retorna:**
```typescript
{
  shouldShow: boolean;        // Se deve mostrar o onboarding
  isFirstLogin: boolean;      // Se é o primeiro login
  hasCompleted: boolean;      // Se já completou o tour
  hasSkipped: boolean;        // Se pulou o tour
  reset: () => void;          // Reseta todo o estado
  complete: () => void;       // Marca como completo
  skip: () => void;           // Marca como pulado
  restart: () => void;        // Reinicia o tour
}
```

**Exemplo de uso:**
```tsx
import { useOnboarding } from './hooks/useOnboarding';

function App() {
  const { shouldShow, complete, restart } = useOnboarding('user');
  
  return (
    <>
      {shouldShow && <OnboardingTour userRole="user" onComplete={complete} />}
      <button onClick={restart}>Reabrir Tutorial</button>
    </>
  );
}
```

### 3. OnboardingButton
Botão para reabrir o tutorial (pode ser usado no menu do usuário).

**Props:**
- `onClick`: () => void - Handler para reabrir o tutorial

**Exemplo de uso:**
```tsx
import { OnboardingButton } from './components/onboarding/OnboardingButton';

function UserMenu() {
  const { restart } = useOnboarding();
  
  return (
    <DropdownMenu>
      <DropdownMenuItem>
        <OnboardingButton onClick={restart} />
      </DropdownMenuItem>
    </DropdownMenu>
  );
}
```

## 🎨 Personalização dos Passos

Os passos são personalizados automaticamente baseados no `userRole`:

### Admin (Ana Admin)
1. **Bem-vindo, Administrador!** - Explicação sobre acesso total e gerenciamento
2. **Gerencie módulos de IA** - Como configurar e monitorar módulos
3. **Painel administrativo** - Relatórios e gestão de usuários

### User (Paulo Padrão)
1. **Navegação básica da plataforma** - Como usar a sidebar
2. **Escolha seu primeiro módulo de IA** - Explorar Marketing, Vendas, Head Hunter
3. **Configure suas preferências** - Personalizar notificações e tema

### Consultant (Clara Consultora)
1. **Bem-vindo, Consultor!** - Ferramentas de consultoria e business planning
2. **Chat de Consultoria com IA** - Como gerar Business Plans
3. **Exporte seus planos em PDF** - Entregar documentos profissionais

## 🔧 Como Adicionar Novos Passos

Edite o arquivo `/components/onboarding/OnboardingTour.tsx`:

```tsx
const getStepsForRole = (role: UserRole): OnboardingStep[] => {
  // ...
  case 'user':
    return [
      {
        id: 1,
        title: 'Seu Título',
        description: 'Sua descrição detalhada aqui...',
        icon: <IconName className="h-5 w-5" />,
        target: '[data-tour="seu-selector"]',  // CSS selector do elemento
        position: 'right',  // top | bottom | left | right
      },
      // ... mais passos
    ];
}
```

## 🎯 Data Attributes para Spotlights

Para que o tour destaque elementos da UI, adicione `data-tour` aos elementos:

```tsx
// Exemplo na Sidebar
<aside data-tour="sidebar">
  {/* Conteúdo da sidebar */}
</aside>

// Exemplo em módulos
<div data-tour="modules">
  {/* Cards dos módulos */}
</div>

// Exemplo no menu do usuário
<button data-tour="user-menu">
  {/* Avatar/Menu */}
</button>
```

## 📦 LocalStorage

O sistema salva 3 chaves no localStorage:

1. **`onboarding_completed`**: 'true' quando o usuário completa o tour
2. **`onboarding_skipped`**: 'true' quando o usuário pula o tour
3. **`onboarding_{role}`**: 'true' quando o usuário vê a plataforma pela primeira vez

### Limpar o estado (para testes)
```javascript
localStorage.removeItem('onboarding_completed');
localStorage.removeItem('onboarding_skipped');
localStorage.removeItem('onboarding_user');
localStorage.removeItem('onboarding_admin');
localStorage.removeItem('onboarding_consultant');
```

Ou via hook:
```tsx
const { reset } = useOnboarding();
reset(); // Limpa tudo e reinicia
```

## 🎬 Fluxo Completo

1. **Usuário faz login** pela primeira vez
2. **Sistema verifica** localStorage (nenhuma chave existe)
3. **`shouldShow = true`** no hook
4. **OnboardingTour renderiza** com overlay escuro
5. **Avatar aparece** com animação de entrada (spring)
6. **Passo 1** é mostrado, elemento correspondente recebe spotlight
7. **Usuário clica "Próximo"** → Passo 2 → Passo 3
8. **Usuário clica "Concluir"** ou "Pular"
9. **Estado salvo** no localStorage
10. **Tour fecha** com animação de saída

## 🔄 Ações Disponíveis

- **Pular tour**: Fecha e salva como "skipped"
- **Anterior**: Volta para o passo anterior
- **Próximo**: Avança para o próximo passo
- **Concluir**: Fecha e salva como "completed" (último passo)
- **X (fechar)**: Mesmo comportamento que "Pular"
- **Clicar no overlay**: Fecha o tour (comportamento de skip)

## 🎨 Estilos CSS

O spotlight é aplicado via classe `.onboarding-spotlight` definida em `/styles/globals.css`:

```css
.onboarding-spotlight {
  position: relative;
  z-index: 45 !important;
  animation: onboarding-pulse 2s ease-in-out infinite;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5),
              0 0 0 8px rgba(59, 130, 246, 0.3),
              0 0 20px 12px rgba(59, 130, 246, 0.2) !important;
  border-radius: 8px;
  transition: all 0.3s ease;
}
```

## 📱 Responsividade

- Desktop: Card de 400px de largura no canto inferior direito
- Mobile/Tablet: **Funciona perfeitamente**, avatar se ajusta automaticamente
- Avatar: 96px x 96px (24 tailwind units)

## ♿ Acessibilidade

- ✅ Overlay com `bg-black/60 backdrop-blur-sm`
- ✅ Elementos interativos focáveis
- ✅ Botão de fechar (X) sempre visível
- ✅ Escape para fechar (pode ser adicionado)
- ✅ Cores com contraste adequado

## 🚀 Performance

- **Lazy loading**: Avatar carregado via ImageWithFallback
- **AnimatePresence**: Animações otimizadas pelo Motion
- **Cleanup**: Remove spotlights no useEffect cleanup
- **Minimal re-renders**: Estado local isolado no componente

## 📝 Notas Técnicas

1. **Z-indexes**:
   - Overlay: `z-40`
   - Spotlight elements: `z-45`
   - Tour card: `z-50`

2. **Animações**:
   - Entrada: `scale(0) → scale(1)` com spring bounce
   - Saída: `scale(1) → scale(0)`
   - Transição de passos: fade + slide horizontal

3. **Avatar**:
   - Imagem do Unsplash (robô 3D amigável)
   - Fallback automático via ImageWithFallback
   - Pulse animation na overlay

## 🐛 Troubleshooting

**O tour não aparece:**
- Verifique se `shouldShow` é `true`
- Limpe o localStorage
- Verifique se o componente está renderizado

**Spotlight não destaca elemento:**
- Confirme que o elemento tem `data-tour="nome-correto"`
- Verifique se o seletor CSS está correto
- Certifique-se que o elemento existe no DOM quando o passo é mostrado

**Avatar não carrega:**
- Verifique conexão de internet
- O ImageWithFallback tem fallback automático
- Pode substituir a URL da imagem se necessário

## 🔮 Melhorias Futuras

- [ ] Adicionar mais passos por persona
- [ ] Vídeos curtos em cada passo
- [ ] Narração por voz (TTS)
- [ ] Gamificação (badges ao concluir)
- [ ] Analytics de conclusão/abandono
- [ ] Versioning (mostrar novamente quando houver updates)
- [ ] Tour contextual (baseado na página atual)
- [ ] Customização de avatar por persona

---

**Criado em:** 04/12/2025
**Última atualização:** 04/12/2025
**Versão:** 1.0.0
