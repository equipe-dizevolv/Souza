# Guia de Uso - Plataforma MVP Multi-Persona

## 🎯 Visão Geral

Esta plataforma foi desenvolvida seguindo rigorosamente as especificações do PRD, com foco em:
- **3 Personas**: Administrador, Usuário Padrão e Consultor
- **Design System**: Grid 8pt, tipografia Inter, ícones Material mono
- **Temas**: Suporte completo light/dark
- **Responsividade**: Desktop (≥768px) e Mobile (<768px)
- **Acessibilidade**: Padrões AA/AAA
- **Locale**: pt-BR completo

---

## 🚀 Como Usar

### Sidebar Colapsável

A sidebar possui funcionalidade de colapsar/expandir para otimizar o espaço da tela:

1. **Estado Padrão**: A sidebar inicia **colapsada** (apenas ícones)
2. **Expandir**:
   - Clique no ícone de seta (>) quando colapsada
   - OU passe o mouse sobre a sidebar (expansão temporária)
3. **Colapsar**: Clique no ícone de seta (<) quando expandida
4. **Tooltips**: Quando colapsada, passe o mouse sobre os ícones para ver os nomes
5. **Persistência**: O estado é salvo automaticamente no navegador

**Dimensões**:
- Expandida: 260px de largura
- Colapsada: 72px de largura
- Transição suave de 300ms

### Tela Home (Usuário Padrão)

A tela **Home** é a entrada principal para o Usuário Padrão, oferecendo:

1. **Hero Section com IA**: 
   - Campo de comando inteligente que entende linguagem natural
   - Digite o que você quer fazer (ex: "criar campanha de marketing")
   - A IA classifica sua intenção e navega automaticamente para o módulo correto
   - Se ambíguo, exibe diálogo para escolher entre opções

2. **Cards de Atalho Rápido**:
   - Acesso direto a todos os módulos disponíveis
   - Badges com contadores de itens pendentes
   - Ícones coloridos para identificação visual
   - Um clique leva diretamente ao módulo

3. **Exemplos de Comandos**:
   - "criar briefing de marketing" → Marketing IA - Briefing
   - "editar campanha" → Marketing IA - Editor
   - "buscar candidatos" → Head Hunter IA - Busca
   - "qualificar perfis" → Head Hunter IA - Triagem
   - "ver relatórios" → Relatórios

### Navegação entre Personas

1. Clique no **avatar** no canto superior direito da Topbar
2. Selecione a persona desejada:
   - **Ana Admin** (AA) - Administrador → Hub de Módulos
   - **Paulo Padrão** (PP) - Usuário → Home
   - **Clara Consultora** (CC) - Consultor → Dashboard
3. A tela mudará automaticamente para a tela inicial da persona selecionada

### Alternar Tema (Light/Dark)

1. Clique no **ícone de sol/lua** na Topbar (à direita)
2. O tema alternará imediatamente com transição suave
3. A preferência é salva automaticamente no localStorage

### Notificações

1. Clique no **ícone de sino** na Topbar
2. Visualize notificações não lidas (badge vermelho indica quantidade)
3. Clique em "Ver tudo" para acessar página completa (implementação futura)

---

## 📱 Funcionalidades Mobile vs Desktop

### Desktop (≥768px)
- **Tabelas completas** com todas as colunas visíveis
- **Botões de ação** na toolbar superior
- **Modals grandes** com formulários expandidos
- **Paginação completa** com controles avançados
- **Filtros inline** na mesma linha que busca

### Mobile (<768px)
- **Lista de cards** ao invés de tabelas
- **FABs (Floating Action Buttons)** para ações primárias
  - Tamanho: 56px (h-14 w-14)
  - Posição: bottom-4 right-4
  - Shadow elevado
- **Kebab menus** com hit target de 40px (acessibilidade)
- **Bottom sheets** para filtros (implementação futura)
- **Swipe actions** para ações rápidas (implementação futura)

---

## 🎨 Design System

### Grid System (8pt)
Todos os espaçamentos seguem múltiplos de 8px:
- `gap-1` = 4px (0.5 × 8)
- `gap-2` = 8px (1 × 8)
- `gap-3` = 12px (1.5 × 8)
- `gap-4` = 16px (2 × 8)
- `gap-6` = 24px (3 × 8)
- `gap-8` = 32px (4 × 8)

### Topbar
- Altura: **64px** (h-16)
- Padding horizontal: **16px** (px-4)
- Elementos alinhados: título à esquerda, ações à direita

### Cores de Status
```
Ativo/Sucesso: bg-green-500
Inativo: bg-neutral-400
Erro: bg-red-600
Warning: bg-yellow-500
```

### Cores de Perfil
```
Administrador: bg-purple-500
Usuário: bg-blue-500
Consultor: bg-orange-500
```

---

## 🔧 Componentes Principais

### TablePagination
Componente reutilizável para paginação:
```tsx
<TablePagination
  currentPage={1}
  totalPages={5}
  pageSize={20}
  totalItems={100}
  onPageChange={(page) => setCurrentPage(page)}
  onPageSizeChange={(size) => setPageSize(size)}
/>
```

**Características**:
- Opções de tamanho: 10, 20, 50, 100 itens
- Padrão: **20 itens por página**
- Botões anterior/próximo
- Contador de itens (ex: "1-20 de 100")
- Auto-scroll ao topo ao mudar página

### FAB (Floating Action Button)
Botão flutuante para ações primárias em mobile:
```tsx
<FAB
  onClick={() => setIsModalOpen(true)}
  icon={<Plus className="h-6 w-6" />}
  label="Adicionar Item"
/>
```

**Características**:
- Tamanho fixo: 56px × 56px
- Posição: bottom-16px, right-16px
- Shadow elevado
- aria-label para acessibilidade

### PhoneMask Hook
Hook para máscara de telefone pt-BR:
```tsx
const phoneMask = usePhoneMask();

<Input
  value={phoneMask.value}
  onChange={(e) => phoneMask.handleChange(e.target.value)}
  onBlur={() => {
    if (!phoneMask.isValid(phoneMask.value)) {
      setError('Telefone inválido');
    }
  }}
/>
```

**Características**:
- Formato: (99) 99999-9999
- Suporta 8 ou 9 dígitos
- Validação integrada
- Método getDigits() para obter apenas números

---

## ⌨️ Atalhos de Teclado

### Globais
- **ESC**: Fechar modais/dialogs
- **Tab**: Navegar entre campos
- **Shift+Tab**: Navegar para trás
- **Enter**: Submeter formulários

### Específicos (a implementar)
- **Cmd/Ctrl+E**: Editar item selecionado
- **Alt+F**: Focar em filtros
- **1**: Qualificar (Head Hunter)
- **2**: Descartar (Head Hunter)
- **3**: Favoritar (Head Hunter)

---

## ♿ Acessibilidade

### Foco Visível
Todos os elementos interativos têm outline de 2px ao receber foco:
```css
*:focus-visible {
  outline: 2px solid hsl(var(--ring));
  outline-offset: 2px;
}
```

### ARIA Labels
Todos os botões de ícone têm labels descritivos:
```tsx
<Button aria-label="Adicionar usuário">
  <Plus />
</Button>
```

### Campos Obrigatórios
Marcados com asterisco (*) e `aria-required="true"`:
```tsx
<Label htmlFor="nome">Nome *</Label>
<Input id="nome" required aria-required="true" />
```

### Toasts
Notificações com `aria-live="polite"` para leitores de tela:
- Duração: 4 segundos
- Posição: top-center
- Tipos: success, error, warning, info

### Hit Targets Mobile
Áreas clicáveis mínimas de **40px × 40px** para acessibilidade touch:
```tsx
<Button className="h-10 w-10 min-h-[40px] min-w-[40px]">
  <MoreVertical />
</Button>
```

---

## 📈 Telemetria e Analytics

A plataforma registra eventos importantes para análise de uso (via console.log, pronto para integração com analytics):

### Eventos da Tela Home

**hero_search_submitted**
```javascript
{
  texto: "criar campanha de marketing",
  intenção: "marketing-briefing",
  destino: "marketing-briefing"
}
```

**quick_cta_clicked**
```javascript
{
  card_id: "marketing-briefing",
  destino: "marketing-briefing"
}
```

### Como Visualizar
1. Abra o **DevTools** do navegador (F12)
2. Vá para a aba **Console**
3. Navegue pela aplicação e veja os eventos sendo registrados
4. Use filtros para encontrar eventos específicos

### Integração Futura
Os eventos estão prontos para integração com:
- Google Analytics 4
- Mixpanel
- Amplitude
- Segment
- PostHog

---

## 📊 Tabelas e Listas

### Ordenação
Clique nos cabeçalhos das colunas para ordenar:
- **Primeira clique**: Ordem ascendente (↑)
- **Segundo clique**: Ordem descendente (↓)
- **Padrão**: Nome ascendente (A-Z)

### Busca
- Case-insensitive
- Busca em múltiplos campos (nome, email, etc.)
- Atualização em tempo real
- Reset automático para página 1 ao buscar

### Filtros
- Aplicados em conjunto com busca
- Persistem durante navegação
- Botão "Limpar filtros" para resetar tudo

---

## 🔔 Sistema de Notificações (Toasts)

### Tipos de Notificação
```tsx
import { toast } from 'sonner@2.0.3';

// Sucesso
toast.success('Operação realizada com sucesso!');

// Erro
toast.error('Ocorreu um erro ao processar sua solicitação');

// Aviso
toast.warning('Atenção: esta ação requer confirmação');

// Informação
toast.info('Dados atualizados');
```

### Configuração
- **Posição**: top-center
- **Duração**: 4000ms (4 segundos)
- **Auto-dismiss**: Sim
- **Acessibilidade**: aria-live="polite"

---

## 📝 Formulários e Validação

### Campos Obrigatórios
- Marcados com asterisco (*) vermelho
- `required` HTML attribute
- `aria-required="true"` para screen readers
- Mensagem de erro inline ao enviar sem preencher

### Validações
- **Telefone**: Formato (99) 99999-9999
- **Email**: Validação HTML5 type="email"
- **Domínio**: Regex simples (a implementar)
- **On blur**: Validação ao sair do campo
- **On submit**: Validação geral do formulário

### Mensagens de Erro
- Aparecem abaixo do campo
- Cor vermelha (text-red-600)
- Tamanho pequeno (text-[12px])
- Descritivas e em português

---

## 🎨 Personalização de Tema

### Cores Customizáveis (globals.css)
```css
:root {
  --background: #ffffff;
  --foreground: oklch(0.145 0 0);
  --primary: #030213;
  /* ... */
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  /* ... */
}
```

### Scrollbar Customizada
- Largura: 8px
- Cor (light): neutral-400
- Cor (dark): neutral-600
- Hover: neutral-500

---

## 🌐 Internacionalização (pt-BR)

### Formatos Implementados
- **Telefone**: (99) 99999-9999
- **Data**: dd/MM/yyyy HH:mm (a implementar totalmente)
- **Moeda**: R$ 0.000,00 (a implementar)
- **Números**: 1.234,56 (a implementar)

### Textos
- Todos os labels em português
- Mensagens de erro em português
- Placeholders descritivos em português
- Tooltips e hints em português

---

## 🔒 Boas Práticas de Segurança

### Senhas
- Não armazenadas em estado
- Reset envia link por email (mock)
- Validação de força (a implementar)

### Chaves de API
- Mascaradas por padrão (••••••)
- Toggle revelar/ocultar (a implementar)
- Não copiadas automaticamente
- Armazenadas de forma segura (backend)

---

## 🐛 Troubleshooting

### Problema: Topbar muito alta
**Solução**: Verificar se classe h-16 (64px) está aplicada

### Problema: Paginação não está em 20 itens
**Solução**: Verificar useState inicial: `const [pageSize, setPageSize] = useState(20)`

### Problema: Máscara de telefone não funciona
**Solução**: Importar e usar o hook `usePhoneMask()` corretamente

### Problema: FAB não aparece no mobile
**Solução**: Verificar condição `if (isMobile)` e breakpoint 768px

### Problema: Tema não persiste
**Solução**: ThemeProvider usa localStorage com key "app-theme"

### Problema: Toasts não aparecem
**Solução**: Verificar se `<Toaster position="top-center" duration={4000} />` está no App.tsx

---

## 📚 Recursos Adicionais

### Documentação de Componentes
- **Shadcn/ui**: https://ui.shadcn.com/
- **Radix UI**: https://www.radix-ui.com/
- **Lucide Icons**: https://lucide.dev/
- **Tailwind CSS**: https://tailwindcss.com/

### Padrões de Design
- **Material Design (FABs)**: https://m3.material.io/components/floating-action-button
- **WCAG 2.1 (Acessibilidade)**: https://www.w3.org/WAI/WCAG21/quickref/

---

## 🎯 Checklist de Implementação

### ✅ Implementado
- [x] Layout base com Topbar 64px
- [x] Sistema de temas (light/dark)
- [x] Navegação entre personas
- [x] Notificações dropdown com "Ver tudo"
- [x] Toasts centralizados 4s
- [x] Foco visível padronizado (2px)
- [x] Scrollbar customizada
- [x] Admin Hub: Paginação 20 itens
- [x] Admin Hub Mobile: FAB
- [x] Admin Hub Mobile: Kebab 40px
- [x] Admin Users: Máscara telefone pt-BR
- [x] Admin Users: Ordenação por nome
- [x] Admin Users: Chip perfil mobile
- [x] Admin Users: Ação resetar senha
- [x] Componente TablePagination
- [x] Componente FAB
- [x] Hook usePhoneMask

### ⏳ Pendente (Próximas Iterações)
- [ ] Admin Integrations: Mascarar chaves
- [ ] Admin Integrations: Badge status
- [ ] Admin Integrations: Swipe test mobile
- [ ] Admin Reports: Filtro 30 dias
- [ ] Admin Reports: Exportar CSV
- [ ] Admin Settings: Validação domínio
- [ ] Admin Settings: Tabs/Acordeão
- [ ] User Hub: Placeholder busca
- [ ] User Hub: Empty state
- [ ] Marketing: Campos obrigatórios
- [ ] Marketing: Multi-select chips
- [ ] Sales: Drag handles
- [ ] Sales: Tabs mobile
- [ ] HeadHunter: Avatars iniciais
- [ ] HeadHunter: Atalhos teclado
- [ ] Reports: Sticky headers
- [ ] History: Formato data pt-BR
- [ ] Consultant: Comparação contas

---

**Versão**: 1.0  
**Última Atualização**: Implementação inicial  
**Manutenção**: Ativo
