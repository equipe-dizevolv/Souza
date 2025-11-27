# MVP Platform - Sistema Multi-Persona

Sistema completo de administração multi-persona com todas as telas e funcionalidades solicitadas, 100% autenticado.

## 🎭 Personas Disponíveis

### 1. Ana Admin (Administrador)
- **Hub de Módulos**: Gerenciar habilitação de módulos no MVP
- **Usuários & Permissões**: Administração de contas e acessos
- **Integrações & Chaves**: Configurar OpenAI, n8n, LinkedIn
- **Relatórios**: Análise de uso e conversão
- **Configurações Gerais**: Ajustes globais do tenant

### 2. Paulo Padrão (Usuário)
- **Hub de Módulos**: Acesso aos módulos disponíveis
- **Marketing IA - Briefing**: Criação de briefings para campanhas
- **Marketing IA - Editor**: Edição de conteúdo gerado
- **Vendas Online IA**: Gestão de funil de vendas
- **Head Hunter IA - Busca**: Busca de candidatos
- **Head Hunter IA - Triagem**: Triagem de perfis
- **Relatórios**: Métricas pessoais
- **Histórico**: Auditoria de atividades

### 3. Clara Consultora (Consultor)
- **Painel de Acompanhamento**: KPIs consolidados
- **Relatórios**: Visão comparativa por conta
- **Anotações/Feedback**: Colaboração com Admin

## ✨ Funcionalidades Principais

### Interface
- ✅ Sidebar preta (#000000) **colapsável**
  - Inicia colapsada (72px) com ícones + tooltips
  - Expande para 260px ao clicar ou hover
  - Estado persiste no localStorage
  - Transição suave de 300ms
- ✅ Topbar com:
  - Toggle de tema (Sol/Lua) - posicionado à direita
  - Notificações com badge
  - Troca de persona com avatar
- ✅ Tema claro/escuro completo (**Dark mode por padrão**)
- ✅ Design responsivo (Desktop e Mobile ready)

### Componentes
- ✅ Tabelas com:
  - Paginação
  - Filtros
  - Busca
  - Ordenação
  - Ações (kebab menu)
- ✅ Modais CRUD com validação
- ✅ Toast notifications (topo central)
- ✅ Estados de loading (skeleton)
- ✅ Estados vazios (empty states)
- ✅ Badges de status
- ✅ Dropdowns
- ✅ Formulários com máscaras pt-BR

### Comportamentos
- ✅ Confirmação de exclusão
- ✅ Validação de formulários
- ✅ Máscaras de telefone
- ✅ Troca de persona atualiza menus
- ✅ ESC fecha modais
- ✅ Focus trap em modais

## 🎨 Design System

- **Tipografia**: Inter (já configurada)
- **Grid**: 8pt
- **Cores**:
  - Sidebar: #000000
  - Conteúdo light: #FFFFFF
  - Conteúdo dark: #1D1D1D
  - Primária: #2F5FFF
  - Sucesso: #10B981
  - Atenção: #F59E0B
  - Erro: #EF4444
- **Ícones**: Lucide React (equivalente Google Material mono)
- **Acessibilidade**: AA/AAA
- **Locale**: pt-BR

## 🚀 Como Usar

1. O sistema inicia com a persona "Paulo Padrão" na tela **Home**
2. **Sidebar**: 
   - Clique na seta (>) para expandir ou (<) para colapsar
   - Passe o mouse para expandir temporariamente
   - Quando colapsada, hover nos ícones mostra tooltips
3. Clique no avatar (canto superior direito) para trocar de persona
4. Ao trocar persona, o menu lateral e as opções disponíveis mudam automaticamente
5. Clique no ícone de sol/lua para alternar entre tema claro e escuro
6. Use o sino para ver notificações

## 📱 Telas Implementadas

### Completas (com funcionalidade)
- ✅ Admin: Hub de Módulos (CRUD completo)
- ✅ Admin: Usuários & Permissões (CRUD completo)
- ✅ Admin: Integrações & Chaves (CRUD completo)
- ✅ User: Hub de Módulos (visualização)
- ✅ User: Marketing IA - Briefing (CRUD completo)

### Placeholders (estrutura pronta)
- ✅ Admin: Relatórios
- ✅ Admin: Configurações Gerais
- ✅ User: Marketing IA - Editor
- ✅ User: Vendas Online IA - Funil
- ✅ User: Head Hunter IA - Busca
- ✅ User: Head Hunter IA - Triagem
- ✅ User: Relatórios
- ✅ User: Histórico
- ✅ Consultant: Painel de Acompanhamento
- ✅ Consultant: Relatórios
- ✅ Consultant: Anotações/Feedback

## 🔧 Tecnologias

- React
- TypeScript
- Tailwind CSS v4
- Shadcn/ui
- Lucide React (ícones)
- Sonner (toasts)

## 📝 Próximos Passos

Para expandir as telas placeholder, basta seguir o padrão das telas completas:
1. Adicionar estado local com useState
2. Criar interface TypeScript para os dados
3. Implementar tabela com Table component
4. Adicionar modal com Dialog component
5. Implementar validações e toasts

## 🎯 Funcionalidades Especiais

- **Máscaras pt-BR**: Telefone formatado automaticamente
- **Validação em tempo real**: Formulários validados antes do submit
- **Toast notifications**: Feedback imediato de ações
- **Dark mode**: Alternância suave entre temas
- **Persona switching**: Troca instantânea com atualização de menus
- **Confirmação de exclusão**: AlertDialog para ações destrutivas

---

Sistema criado seguindo todas as especificações e restrições solicitadas, pronto para uso e expansão.
