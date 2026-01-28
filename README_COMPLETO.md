# 📊 Cartilha de Planejamento Estratégico LOARA 2026

## Visão Geral

Sistema completo de planejamento estratégico para a Área de Parcerias da LOARA, com interface web interativa, cálculos inteligentes, gráficos dinâmicos e gestão de dados.

---

## 🎯 Funcionalidades Principais

### 1. **Planejamento Inteligente**
- Cálculos automáticos de métricas e KPIs
- Edição de valores base com recalculo em tempo real
- 3 cenários (Conservador, Moderado, Agressivo)
- Projeções mensais e trimestrais

### 2. **Visualizações Profissionais**
- 6 gráficos dinâmicos Recharts
- Evolução de carteira com eixos duplos
- Comparação de cenários
- Funil de conversão
- Matriz de riscos
- Distribuição de receita

### 3. **Gestão de Dados**
- Upload de ficheiros para S3
- Banco de dados MySQL/TiDB
- Autenticação Manus OAuth
- Acompanhamento mensal de KPIs

### 4. **Documentação Completa**
- 11 abas navegáveis
- Roadmap trimestral detalhado
- Processos documentados
- Estrutura de compensação
- Governança e KPIs

---

## 🏗️ Arquitetura do Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (React 19)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Home.tsx   │  │  Components  │  │   Charts     │      │
│  │  (11 abas)   │  │  (UI/Cards)  │  │  (Recharts)  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│           │                 │                 │              │
│           └─────────────────┴─────────────────┘              │
│                          │                                    │
│                   ┌──────▼───────┐                          │
│                   │  tRPC Client │                          │
│                   └──────┬───────┘                          │
└──────────────────────────┼──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                   BACKEND (Express + tRPC)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Routers    │  │   Database   │  │   Storage    │      │
│  │  (Procedures)│  │   (Drizzle)  │  │    (S3)      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Estrutura de Diretórios

```
loara_planejamento_2026/
├── client/                      # Frontend React
│   ├── public/
│   │   ├── data.json           # Dados do planejamento
│   │   └── .nojekyll           # Config GitHub Pages
│   └── src/
│       ├── components/
│       │   ├── charts/         # Gráficos Recharts
│       │   │   ├── GraficoEvolucaoCarteira.tsx
│       │   │   ├── GraficoComparacaoCenarios.tsx
│       │   │   ├── GraficoMetasMensais.tsx
│       │   │   ├── GraficoDistribuicaoReceita.tsx
│       │   │   ├── GraficoFunilConversao.tsx
│       │   │   └── GraficoMatrizRiscos.tsx
│       │   ├── dashboard/      # Componentes Dashboard
│       │   ├── ui/             # Componentes shadcn/ui
│       │   ├── EditarValoresBase.tsx
│       │   └── FileUpload.tsx
│       ├── lib/
│       │   ├── planejamentoModel.ts  # Modelo de cálculo
│       │   └── trpc.ts               # Cliente tRPC
│       ├── pages/
│       │   ├── Home.tsx        # Página principal (11 abas)
│       │   ├── Files.tsx       # Gestão de ficheiros
│       │   └── NotFound.tsx
│       └── App.tsx             # Rotas e layout
│
├── server/                      # Backend Express + tRPC
│   ├── _core/                  # Infraestrutura
│   │   ├── context.ts          # Contexto tRPC
│   │   ├── trpc.ts             # Setup tRPC
│   │   ├── oauth.ts            # Autenticação
│   │   ├── llm.ts              # Integração LLM
│   │   └── index.ts            # Servidor Express
│   ├── db.ts                   # Queries banco de dados
│   ├── routers.ts              # Routers tRPC
│   ├── fileRouter.ts           # Router de ficheiros
│   ├── storage.ts              # Helpers S3
│   └── *.test.ts               # Testes unitários
│
├── drizzle/                     # Banco de dados
│   ├── schema.ts               # Schema Drizzle ORM
│   └── migrations/             # Migrações
│
├── shared/                      # Código compartilhado
│   ├── const.ts                # Constantes
│   └── types.ts                # Tipos TypeScript
│
└── docs/                        # Documentação
    ├── README_COMPLETO.md      # Este arquivo
    ├── ARQUITETURA.md          # Arquitetura detalhada
    ├── GUIA_DESENVOLVIMENTO.md # Guia para desenvolvedores
    └── API_REFERENCE.md        # Referência da API
```

---

## 🚀 Instalação e Setup

### Pré-requisitos

- Node.js 22.x
- pnpm 10.x
- MySQL/TiDB (fornecido pela plataforma Manus)
- Conta Manus (para OAuth e S3)

### Passo 1: Clonar o Repositório

```bash
git clone https://github.com/m-scorza/loara_planejamento_2026.git
cd loara_planejamento_2026
```

### Passo 2: Instalar Dependências

```bash
pnpm install
```

### Passo 3: Configurar Variáveis de Ambiente

As variáveis são injetadas automaticamente pela plataforma Manus:

```env
# Banco de Dados
DATABASE_URL=mysql://...

# Autenticação
JWT_SECRET=...
OAUTH_SERVER_URL=...
VITE_OAUTH_PORTAL_URL=...

# Storage S3
BUILT_IN_FORGE_API_URL=...
BUILT_IN_FORGE_API_KEY=...

# Aplicação
VITE_APP_ID=...
VITE_APP_TITLE="Planejamento LOARA 2026"
```

### Passo 4: Inicializar Banco de Dados

```bash
pnpm db:push
```

### Passo 5: Iniciar Desenvolvimento

```bash
pnpm dev
```

Acesse: `http://localhost:3000`

---

## 🧪 Testes

### Executar Todos os Testes

```bash
pnpm test
```

### Executar Testes Específicos

```bash
pnpm test planejamentoModel.test.ts
pnpm test fileRouter.test.ts
```

### Cobertura de Testes

- ✅ Modelo de cálculo inteligente (13 testes)
- ✅ Router de ficheiros (6 testes)
- ✅ Autenticação e logout (1 teste)

---

## 📊 Modelo de Cálculo Inteligente

### Valores Base Editáveis

```typescript
interface ValoresBase {
  // Baseline 2025
  carteira_2025: number;
  churn_2025: number;
  indicacoes_2025: number;
  contratos_2025: number;
  captacao_2025: number;
  receita_2025: number;
  
  // Meta 2026
  carteira_2026: number;
  churn_2026: number;
  indicacoes_2026: number;
  contratos_2026: number;
  captacao_2026: number;
  receita_2026: number;
}
```

### Cálculos Automáticos

```typescript
// Percentuais de crescimento
crescimento_carteira = ((carteira_2026 - carteira_2025) / carteira_2025) * 100
crescimento_indicacoes = ((indicacoes_2026 - indicacoes_2025) / indicacoes_2025) * 100
crescimento_receita = ((receita_2026 - receita_2025) / receita_2025) * 100

// Taxas de conversão
taxa_indicacao_contrato = (contratos_2026 / indicacoes_2026) * 100
taxa_contrato_parceiro = (novos_parceiros / contratos_2026) * 100

// Ticket médio
ticket_medio = receita_2026 / carteira_2026

// Distribuição mensal (progressiva)
metas_mensais = distribuirProgressivamente(total_anual, 12)
```

---

## 🎨 Componentes de Gráficos

### 1. Gráfico de Evolução de Carteira

```tsx
<GraficoEvolucaoCarteira 
  metas_mensais={dadosCalculados.metas_mensais} 
/>
```

**Características:**
- Eixo duplo (carteira + novos/churn)
- Área preenchida sob a linha
- Barras empilhadas
- Anotações de valores

### 2. Gráfico de Comparação de Cenários

```tsx
<GraficoComparacaoCenarios 
  cenarios={dadosCalculados.cenarios} 
/>
```

**Características:**
- 7 métricas comparadas
- Barras agrupadas
- Destaque do cenário recomendado
- Valores nas barras

### 3. Funil de Conversão

```tsx
<GraficoFunilConversao />
```

**Características:**
- Visualização horizontal
- Taxas de conversão entre etapas
- Cores degradê
- Tooltips informativos

### 4. Matriz de Riscos

```tsx
<GraficoMatrizRiscos />
```

**Características:**
- Scatter plot
- Zonas coloridas (baixo/médio/alto)
- Eixos probabilidade vs impacto
- Labels de riscos

---

## 🔧 Customização

### Editar Valores do Planejamento

1. **Via Interface:** Clique em "Editar Valores" no header
2. **Via JSON:** Edite `client/public/data.json`
3. **Via Código:** Modifique `VALORES_BASE_PADRAO` em `planejamentoModel.ts`

### Adicionar Novos Gráficos

1. Crie componente em `client/src/components/charts/`
2. Importe em `Home.tsx`
3. Adicione na aba "Gráficos"

```tsx
import { MeuNovoGrafico } from "@/components/charts/MeuNovoGrafico";

// Na aba Gráficos
<Card>
  <CardHeader>
    <CardTitle>Meu Novo Gráfico</CardTitle>
  </CardHeader>
  <CardContent>
    <MeuNovoGrafico dados={data} />
  </CardContent>
</Card>
```

### Adicionar Novos KPIs

1. Edite `client/public/data.json` → seção `kpis`
2. Adicione na aba "KPIs" em `Home.tsx`

---

## 📦 Deploy

### Deploy na Plataforma Manus

1. Abra o Management UI
2. Clique em "Publish"
3. Acesse o domínio gerado (ex: `seu-projeto.manus.space`)

### Deploy no GitHub Pages

1. Push para branch `main`
2. GitHub Actions faz deploy automaticamente
3. Acesse: `https://m-scorza.github.io/loara_planejamento_2026/`

**Nota:** GitHub Pages é apenas frontend estático (sem backend/auth/upload)

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 19** - Framework UI
- **TypeScript** - Tipagem estática
- **Tailwind CSS 4** - Estilização
- **shadcn/ui** - Componentes UI
- **Recharts** - Gráficos dinâmicos
- **Wouter** - Roteamento
- **tRPC** - Type-safe API

### Backend
- **Express 4** - Servidor HTTP
- **tRPC 11** - API type-safe
- **Drizzle ORM** - ORM TypeScript
- **MySQL/TiDB** - Banco de dados
- **AWS S3** - Armazenamento de ficheiros
- **Manus OAuth** - Autenticação

### DevOps
- **Vite** - Build tool
- **Vitest** - Testes unitários
- **pnpm** - Gerenciador de pacotes
- **GitHub Actions** - CI/CD

---

## 📚 Documentação Adicional

- [Arquitetura Detalhada](./ARQUITETURA.md)
- [Guia de Desenvolvimento](./GUIA_DESENVOLVIMENTO.md)
- [Referência da API](./API_REFERENCE.md)
- [Guia de Fine Tuning](./GUIA_FINE_TUNING.md)

---

## 🤝 Contribuindo

1. Fork o repositório
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

---

## 📝 Licença

Este projeto é proprietário e confidencial da LOARA.

---

## 👥 Autores

- **Manus AI** - Desenvolvimento inicial
- **LOARA** - Requisitos e validação

---

## 📞 Suporte

Para dúvidas ou suporte, entre em contato com a equipe de TI da LOARA.
