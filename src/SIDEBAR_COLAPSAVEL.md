# Sidebar Colapsável - Documentação Técnica

## 📋 Visão Geral

A sidebar possui funcionalidade completa de colapsar/expandir, seguindo as especificações do PRD com tooltips, hover expansion e persistência de estado.

---

## 🎨 Estados Visuais

### Estado Colapsado (Padrão)
- **Largura**: 72px
- **Conteúdo**: Apenas ícones centralizados
- **Logo**: Substituída por botão de expandir (ChevronRight)
- **Tooltips**: Visíveis ao hover nos itens
- **Background**: #000000 (preto)

### Estado Expandido
- **Largura**: 260px
- **Conteúdo**: Ícones + texto + badges
- **Logo**: "MVP Platform" + botão de colapsar (ChevronLeft)
- **Tooltips**: Desabilitados
- **Background**: #000000 (preto)

### Transição
- **Duração**: 300ms
- **Easing**: ease-in-out
- **Propriedade**: width via Tailwind `transition-all`

---

## 🔧 Funcionalidades

### 1. Toggle Manual

**Desktop e Mobile**:
```tsx
<button onClick={toggleCollapsed}>
  {isExpanded ? <ChevronLeft /> : <ChevronRight />}
</button>
```

**Comportamento**:
- Click no botão alterna entre colapsada/expandida
- Estado salvo no localStorage
- Ícone muda conforme estado

### 2. Expansão por Hover

**Apenas Desktop**:
```tsx
onMouseEnter={() => setIsHovered(true)}
onMouseLeave={() => setIsHovered(false)}
```

**Comportamento**:
- Hover sobre sidebar colapsada = expansão temporária
- Ao sair do hover, volta ao estado salvo
- NÃO persiste no localStorage
- Útil para visualizar labels sem fixar expandida

### 3. Persistência de Estado

**LocalStorage**:
```typescript
// Carregar estado salvo
useEffect(() => {
  const savedState = localStorage.getItem('sidebar-collapsed');
  if (savedState !== null) {
    setIsCollapsed(savedState === 'true');
  }
}, []);

// Salvar ao toggle
const toggleCollapsed = () => {
  const newState = !isCollapsed;
  setIsCollapsed(newState);
  localStorage.setItem('sidebar-collapsed', String(newState));
};
```

**Chave**: `sidebar-collapsed`
**Valores**: `"true"` | `"false"` (string)
**Escopo**: Por navegador (não por usuário/persona)

### 4. Tooltips Condicionais

**Quando colapsada**:
```tsx
{!isExpanded && (
  <Tooltip>
    <TooltipTrigger asChild>{menuButton}</TooltipTrigger>
    <TooltipContent side="right">
      {item.label}
      {item.badge && <Badge>{item.badge}</Badge>}
    </TooltipContent>
  </Tooltip>
)}
```

**Quando expandida**:
```tsx
{isExpanded && menuButton}
```

**Características**:
- `side="right"`: Aparecem à direita da sidebar
- `delayDuration={0}`: Sem delay
- Background: `neutral-800`
- Border: `neutral-700`
- Incluem badges se houver

---

## 🎯 Lógica de Expansão

### Determinar se está expandida

```typescript
const isExpanded = !isCollapsed || isHovered;
```

| isCollapsed | isHovered | isExpanded | Descrição |
|-------------|-----------|------------|-----------|
| true | false | false | Colapsada e sem hover |
| true | true | true | Colapsada mas com hover (temporário) |
| false | false | true | Expandida (fixada) |
| false | true | true | Expandida (fixada) |

### Fluxo de Estados

```
┌─────────────────┐
│   COLAPSADA     │  ← Estado inicial (padrão)
│    (72px)       │
└────────┬────────┘
         │
         │ hover
         ├──────────────────┐
         │                  │
         v                  │
┌─────────────────┐         │
│   EXPANDIDA     │         │
│  (temporária)   │         │
│    (260px)      │         │
└────────┬────────┘         │
         │                  │
         │ mouse leave      │
         └──────────────────┘
         │
         │ click toggle
         v
┌─────────────────┐
│   EXPANDIDA     │
│    (fixada)     │
│    (260px)      │
└────────┬────────┘
         │
         │ click toggle
         v
┌─────────────────┐
│   COLAPSADA     │
│    (72px)       │
└─────────────────┘
```

---

## 📐 Dimensões e Espaçamento

### Cabeçalho (Logo Area)

**Expandida**:
```css
height: 88px
padding: 0 16px
justify-content: space-between
```

**Colapsada**:
```css
height: 88px
padding: 0 16px
justify-content: center (apenas botão)
```

### Itens de Menu

**Expandida**:
```css
padding: 10px 12px (py-2.5 px-3)
gap: 10px (gap-2.5)
border-radius: 10px
```

**Colapsada**:
```css
padding: 10px 12px
justify-content: center
ícone centralizado
```

### Botão Toggle

```css
width: 32px (w-8)
height: 32px (h-8)
border-radius: 8px (rounded-lg)
```

---

## ♿ Acessibilidade

### ARIA Labels

```tsx
// Botão de toggle
<button
  aria-label={isCollapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
>
  {/* icon */}
</button>

// Itens de menu (quando colapsados)
<button aria-label={item.label}>
  <item.icon />
</button>
```

### Navegação por Teclado

- ✅ Tab: Navega entre itens
- ✅ Enter/Space: Ativa item
- ✅ Foco visível em todos os botões
- ✅ Outline 2px ao focar

### Contraste

- ✅ Ícones: `text-neutral-50/80` sobre `bg-black`
- ✅ Hover: `bg-white/5` (sutil mas perceptível)
- ✅ Ativo: `bg-[#2f5fff]` (contraste AA)
- ✅ Tooltips: `bg-neutral-800` com texto `neutral-50`

---

## 🎨 Estilização

### Classes Tailwind Principais

```tsx
// Container principal
className={cn(
  'flex h-full flex-col bg-black transition-all duration-300 ease-in-out',
  isExpanded ? 'w-[260px]' : 'w-[72px]'
)}

// Item de menu
className={cn(
  'flex w-full items-center gap-2.5 rounded-[10px] px-3 py-2.5',
  'text-[13px] leading-[16.25px] transition-colors',
  currentScreen === item.id
    ? 'bg-[#2f5fff] text-neutral-50'
    : 'text-neutral-50/80 hover:bg-white/5',
  !isExpanded && 'justify-center'
)}
```

### Cores

| Elemento | Cor Light | Cor Dark |
|----------|-----------|----------|
| Background | `#000000` | `#000000` |
| Texto normal | `rgba(250, 250, 250, 0.8)` | `rgba(250, 250, 250, 0.8)` |
| Texto ativo | `#FAFAFA` | `#FAFAFA` |
| Background ativo | `#2f5fff` | `#2f5fff` |
| Hover | `rgba(255, 255, 255, 0.05)` | `rgba(255, 255, 255, 0.05)` |
| Border | `rgba(255, 255, 255, 0.1)` | `rgba(255, 255, 255, 0.1)` |

---

## 🔍 Badges

### Quando Expandida

```tsx
{item.badge && (
  <span className="ml-auto flex h-[18px] min-w-[22px] items-center justify-center rounded-[9px] bg-neutral-50 px-1.5 text-[11px] font-bold leading-[11px] text-[#161e53]">
    {item.badge}
  </span>
)}
```

### Quando Colapsada

Badges aparecem apenas no tooltip:
```tsx
<TooltipContent>
  <div className="flex items-center gap-2">
    <span>{item.label}</span>
    {item.badge && <Badge>{item.badge}</Badge>}
  </div>
</TooltipContent>
```

---

## 📱 Responsividade

### Desktop (≥768px)

- ✅ Sidebar colapsável
- ✅ Hover para expandir temporariamente
- ✅ Toggle manual persiste
- ✅ Tooltips funcionam

### Mobile (<768px)

**Implementação Atual**:
- Sidebar funciona igual ao desktop
- Colapsada por padrão
- Toggle manual disponível

**Recomendação Futura** (se necessário):
- Considerar Drawer/Sheet para mobile
- Abrir com hambúrguer menu
- Fechar ao selecionar item
- Overlay escuro ao abrir

---

## 🧪 Casos de Teste

### Teste 1: Toggle Manual
1. ✅ Sidebar inicia colapsada
2. ✅ Clicar seta > expande
3. ✅ Clicar seta < colapsa
4. ✅ Estado salvo no localStorage

### Teste 2: Hover Temporário
1. ✅ Sidebar colapsada
2. ✅ Passar mouse expande
3. ✅ Remover mouse colapsa
4. ✅ Não salva no localStorage

### Teste 3: Tooltips
1. ✅ Sidebar colapsada
2. ✅ Hover em item mostra tooltip
3. ✅ Tooltip à direita
4. ✅ Tooltip inclui badge (se houver)

### Teste 4: Persistência
1. ✅ Colapsar sidebar
2. ✅ Recarregar página (F5)
3. ✅ Sidebar permanece colapsada
4. ✅ Expandir e recarregar
5. ✅ Sidebar permanece expandida

### Teste 5: Navegação
1. ✅ Sidebar colapsada
2. ✅ Clicar em item navega
3. ✅ Item fica marcado (bg azul)
4. ✅ Funciona igual expandida/colapsada

### Teste 6: Acessibilidade
1. ✅ Tab navega pelos itens
2. ✅ Enter ativa item
3. ✅ Foco visível
4. ✅ ARIA labels corretos

---

## 🚀 Melhorias Futuras

### Curto Prazo
- [ ] Animação de fade-in/out nos textos
- [ ] Indicador visual de hover (borda esquerda?)
- [ ] Atalho de teclado (Cmd/Ctrl + B) para toggle

### Médio Prazo
- [ ] Drawer para mobile (Sheet component)
- [ ] Grupos colapsáveis de itens (Accordion)
- [ ] Busca de itens quando expandida
- [ ] Itens fixados (pin) no topo

### Longo Prazo
- [ ] Customização de ordem dos itens
- [ ] Temas para sidebar (cores personalizadas)
- [ ] Favoritos/recentes no topo
- [ ] Suporte a sub-menus

---

## 📚 Componentes Utilizados

### Shadcn/ui
- `Tooltip` - Para labels quando colapsada
- `TooltipProvider` - Context provider
- `TooltipTrigger` - Trigger area
- `TooltipContent` - Conteúdo do tooltip

### Lucide Icons
- `ChevronLeft` - Colapsar (←)
- `ChevronRight` - Expandir (→)
- Ícones de menu (Home, Package, etc.)

### Hooks React
- `useState` - Estado local (isCollapsed, isHovered)
- `useEffect` - Carregar/salvar localStorage

### Utilities
- `cn()` - Merge de classes Tailwind
- `localStorage` - Persistência nativa

---

## 🎓 Referências

- [PRD Original - Sidebar Spec](./guidelines/Guidelines.md)
- [Shadcn Tooltip](https://ui.shadcn.com/docs/components/tooltip)
- [Lucide Icons](https://lucide.dev)
- [Tailwind Transitions](https://tailwindcss.com/docs/transition-property)

---

**Status**: ✅ Implementado e funcional
**Versão**: 1.0.0
**Data**: Conforme solicitação do usuário
