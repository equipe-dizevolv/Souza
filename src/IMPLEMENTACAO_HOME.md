# Implementação da Tela Home - Usuário Padrão

## 📋 Visão Geral

A tela **Home** é a entrada principal do Usuário Padrão (Paulo Padrão), implementando uma experiência moderna com comando de IA e acesso rápido aos módulos.

---

## 🎨 Estrutura Visual

### Hero Section (Full-bleed)
- **Gradient**: `from-neutral-900 via-neutral-800 to-neutral-900`
- **Overlay radial**: `rgba(47, 95, 255, 0.3)` com opacidade 40%
- **Padding Desktop**: 16px lateral, 20px vertical
- **Padding Mobile**: 4px lateral, 12px vertical
- Extração negativa de margens (`-mx-8 -mt-8`) para efeito full-bleed

### Campo de Comando IA
- **Altura**: 56px (h-14)
- **Background**: `white/10` com borda `white/20`
- **Text color**: `neutral-50`
- **Placeholder**: Adaptativo (desktop vs mobile)
- **Focus state**: `bg-white/15` + `border-blue-400`

### Grid de Cards
- **Desktop**: 
  - `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`
  - Gap de 24px (gap-6)
- **Mobile**: 
  - `grid-cols-1`
  - Gap de 24px (gap-6)

---

## 🧠 Classificação de Intenção (IA)

### Algoritmo

```typescript
classifyIntent(text: string): {
  destination: Screen | null;
  ambiguous: boolean;
  suggestions: QuickAction[];
}
```

### Keywords por Módulo

| Módulo | Keywords | Navegação |
|--------|----------|-----------|
| **Marketing Briefing** | marketing, campanha, conteúdo, público + (briefing, criar, novo) | Direta |
| **Marketing Editor** | marketing, campanha, conteúdo + (editar, revisar, editor) | Direta |
| **Sales Funnel** | vendas, venda, funil, lead, prospect | Direta |
| **HeadHunter Search** | candidato, recrutamento, perfil, vaga + (buscar, procurar, pesquisar) | Direta |
| **HeadHunter Screening** | candidato, recrutamento, perfil + (qualificar, triar, avaliar) | Direta |
| **Reports** | relatório, análise, dashboard, métricas | Direta |
| **History** | histórico, auditoria, log | Direta |
| **Hub** | hub, módulos, início | Direta |

### Desambiguação

Quando a intenção é ambígua (ex: apenas "marketing"), o sistema:
1. Identifica módulos relacionados
2. Exibe diálogo modal
3. Apresenta opções com ícone, título e descrição
4. Aguarda escolha do usuário

---

## 🎯 Quick Actions (Cards)

### Estrutura de Dados

```typescript
interface QuickAction {
  id: Screen;
  title: string;
  description: string;
  icon: LucideIcon;
  count?: number;        // Badge de contador
  color: string;         // Classe Tailwind para cor do ícone
}
```

### Cards Implementados

1. **Hub de Módulos** (`hub`)
   - Ícone: Package
   - Cor: blue-600
   - Sem contador

2. **Marketing IA - Briefing** (`marketing-briefing`)
   - Ícone: Lightbulb
   - Cor: yellow-600
   - Contador: 5

3. **Marketing IA - Editor** (`marketing-editor`)
   - Ícone: FileText
   - Cor: purple-600
   - Contador: 3

4. **Vendas Online IA** (`sales-funnel`)
   - Ícone: ShoppingCart
   - Cor: green-600
   - Contador: 12

5. **Head Hunter IA - Busca** (`headhunter-search`)
   - Ícone: UserSearch
   - Cor: indigo-600
   - Sem contador

6. **Head Hunter IA - Triagem** (`headhunter-screening`)
   - Ícone: Users
   - Cor: cyan-600
   - Contador: 8

7. **Relatórios** (`reports`)
   - Ícone: BarChart3
   - Cor: orange-600
   - Sem contador

8. **Histórico** (`history`)
   - Ícone: History
   - Cor: neutral-600
   - Sem contador

### Interações

- **Hover**: 
  - `scale-[1.02]` (crescimento 2%)
  - `shadow-lg` (sombra elevada)
  - Background do ícone: `bg-neutral-200`

- **Active**: 
  - `scale-[0.98]` (redução 2%)

- **Click**: 
  - Toast de confirmação
  - Navegação após 300ms (feedback visual)

---

## 📊 Telemetria

### Evento: `hero_search_submitted`

Disparado ao submeter o formulário de comando.

**Payload**:
```javascript
{
  texto: string,           // Texto digitado pelo usuário
  intenção: string,        // Destino identificado ou "ambíguo"
  destino: string | null   // Screen de destino ou null
}
```

**Exemplo**:
```javascript
{
  texto: "criar briefing de marketing",
  intenção: "marketing-briefing",
  destino: "marketing-briefing"
}
```

### Evento: `quick_cta_clicked`

Disparado ao clicar em um card de atalho.

**Payload**:
```javascript
{
  card_id: string,   // ID do módulo (mesmo que Screen)
  destino: string    // Screen de destino
}
```

**Exemplo**:
```javascript
{
  card_id: "marketing-briefing",
  destino: "marketing-briefing"
}
```

---

## ♿ Acessibilidade

### Conformidade

- ✅ **AA/AAA** WCAG 2.1
- ✅ Contraste de cores adequado (hero text sobre dark background)
- ✅ Labels descritivos em todos os botões
- ✅ Trap de foco em modais (diálogo de desambiguação)
- ✅ ESC fecha modal
- ✅ Enter submete formulário
- ✅ Navegação por teclado completa

### ARIA

```tsx
// Campo de comando
<Input
  type="text"
  placeholder="..."
  aria-label="Campo de comando com IA"
/>

// Botão de envio
<Button type="submit" aria-label="Enviar comando">
  <Send />
  Enviar
</Button>

// Cards de atalho
<Card
  role="button"
  tabIndex={0}
  aria-label={`Acessar ${action.title}`}
  onClick={...}
/>
```

---

## 📱 Responsividade

### Breakpoints

- **Mobile**: < 768px
  - Hero: padding reduzido
  - Form: layout vertical (flex-col)
  - Grid: 1 coluna
  - Placeholder: texto curto

- **Desktop**: ≥ 768px
  - Hero: padding expandido
  - Form: layout horizontal
  - Grid: até 4 colunas
  - Placeholder: texto completo

### Hook `useIsMobile`

```typescript
const isMobile = useIsMobile();

// Usado para:
// - Ajustar textos
// - Mudar layout de form
// - Alterar placeholder
```

---

## 🎬 Fluxo de Navegação

### 1. Usuário digita comando
```
"criar campanha de marketing"
  ↓
classifyIntent()
  ↓
destination: "marketing-briefing"
  ↓
Toast: "Navegando para Marketing IA - Briefing"
  ↓
setTimeout(500ms)
  ↓
onNavigate("marketing-briefing")
```

### 2. Comando ambíguo
```
"marketing"
  ↓
classifyIntent()
  ↓
ambiguous: true, suggestions: [briefing, editor]
  ↓
setShowDisambiguationDialog(true)
  ↓
Usuário escolhe opção
  ↓
onNavigate(escolha)
```

### 3. Click em card
```
Click em "Marketing IA - Briefing"
  ↓
handleQuickActionClick()
  ↓
console.log(telemetry)
  ↓
Toast: "Abrindo Marketing IA - Briefing"
  ↓
setTimeout(300ms)
  ↓
onNavigate("marketing-briefing")
```

---

## 🔧 Integração com App.tsx

### Imports

```typescript
import { UserHome } from './screens/user/home';
```

### Renderização

```typescript
case 'home': return <UserHome onNavigate={setCurrentScreen} />;
```

### Estado Inicial

```typescript
const [currentPersona, setCurrentPersona] = useState<Persona>('Paulo Padrão');
const [currentScreen, setCurrentScreen] = useState<Screen>('home');
```

### Sidebar

Nova opção "Home" adicionada ao menu do Usuário Padrão:
```typescript
{ id: 'home', label: 'Home', icon: Home }
```

---

## 🎨 Design Tokens

### Cores do Hero

```css
/* Background gradient */
bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900
dark:from-black dark:via-neutral-900 dark:to-black

/* Radial overlay */
background: radial-gradient(
  circle at 30% 50%,
  rgba(47, 95, 255, 0.3),
  transparent 50%
)

/* Text colors */
text-neutral-50      /* Heading */
text-blue-300        /* Badge */
text-blue-400        /* Icon */
text-neutral-300     /* Description */
text-neutral-400     /* Placeholder */
```

### Cores dos Ícones

| Módulo | Cor |
|--------|-----|
| Hub | `text-blue-600 dark:text-blue-400` |
| Marketing Briefing | `text-yellow-600 dark:text-yellow-400` |
| Marketing Editor | `text-purple-600 dark:text-purple-400` |
| Vendas | `text-green-600 dark:text-green-400` |
| HeadHunter Search | `text-indigo-600 dark:text-indigo-400` |
| HeadHunter Screening | `text-cyan-600 dark:text-cyan-400` |
| Relatórios | `text-orange-600 dark:text-orange-400` |
| Histórico | `text-neutral-600 dark:text-neutral-400` |

---

## 🧪 Casos de Teste

### Teste 1: Navegação direta
1. Digite "criar briefing"
2. Clique em "Enviar"
3. ✅ Deve navegar para Marketing Briefing

### Teste 2: Desambiguação
1. Digite "marketing"
2. Clique em "Enviar"
3. ✅ Deve abrir modal com 2 opções
4. Escolha "Marketing IA - Editor"
5. ✅ Deve navegar para Marketing Editor

### Teste 3: Click em card
1. Clique no card "Vendas Online IA"
2. ✅ Deve exibir toast
3. ✅ Deve navegar após 300ms

### Teste 4: ESC fecha modal
1. Digite "candidato"
2. Clique em "Enviar"
3. ✅ Modal abre
4. Pressione ESC
5. ✅ Modal fecha

### Teste 5: Campo vazio
1. Deixe campo vazio
2. Clique em "Enviar"
3. ✅ Deve exibir erro "Digite um comando"

### Teste 6: Responsividade
1. Redimensione para mobile
2. ✅ Form deve ficar vertical
3. ✅ Grid deve ter 1 coluna
4. ✅ Botão "Enviar" vira "Ir"

---

## 🚀 Melhorias Futuras

### Curto Prazo
- [ ] Adicionar histórico de comandos (últimos 5)
- [ ] Autocompletar baseado em comandos anteriores
- [ ] Atalhos de teclado (Cmd+K para focar no campo)
- [ ] Animação de entrada dos cards (stagger)

### Médio Prazo
- [ ] Integração com analytics real (GA4/Mixpanel)
- [ ] Machine learning para melhorar classificação
- [ ] Sugestões enquanto digita (dropdown)
- [ ] Badges dinâmicos com contadores reais

### Longo Prazo
- [ ] Comandos por voz (Speech Recognition API)
- [ ] IA contextual baseada em histórico
- [ ] Cards customizáveis por usuário
- [ ] Temas personalizados no hero gradient

---

## 📚 Referências

- [PRD Original](./guidelines/Guidelines.md)
- [Guia de Uso](./GUIA_DE_USO.md)
- [Ajustes Implementados](./AJUSTES_IMPLEMENTADOS.md)
- [Lucide Icons](https://lucide.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Shadcn/ui](https://ui.shadcn.com)
