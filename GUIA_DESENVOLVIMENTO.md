# 👨‍💻 Guia de Desenvolvimento

## Introdução

Este guia fornece instruções detalhadas para desenvolvedores que desejam contribuir ou estender o sistema de Planejamento Estratégico LOARA 2026.

---

## Setup do Ambiente de Desenvolvimento

### 1. Pré-requisitos

```bash
# Verificar versões
node --version  # deve ser 22.x
pnpm --version  # deve ser 10.x
```

### 2. Clonar e Instalar

```bash
git clone https://github.com/m-scorza/loara_planejamento_2026.git
cd loara_planejamento_2026
pnpm install
```

### 3. Configurar Banco de Dados

```bash
# Gerar e aplicar migrações
pnpm db:push
```

### 4. Iniciar Servidor de Desenvolvimento

```bash
pnpm dev
```

Acesse: `http://localhost:3000`

---

## Estrutura do Código

### Frontend (client/)

```
client/
├── public/
│   ├── data.json           # Dados estáticos do planejamento
│   └── .nojekyll           # Config GitHub Pages
│
├── src/
│   ├── components/
│   │   ├── charts/         # Componentes de gráficos
│   │   │   ├── GraficoEvolucaoCarteira.tsx
│   │   │   ├── GraficoComparacaoCenarios.tsx
│   │   │   ├── GraficoMetasMensais.tsx
│   │   │   ├── GraficoDistribuicaoReceita.tsx
│   │   │   ├── GraficoFunilConversao.tsx
│   │   │   └── GraficoMatrizRiscos.tsx
│   │   │
│   │   ├── ui/             # Componentes shadcn/ui
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── tabs.tsx
│   │   │   └── ...
│   │   │
│   │   ├── EditarValoresBase.tsx    # Editor de valores
│   │   └── FileUpload.tsx           # Upload de ficheiros
│   │
│   ├── lib/
│   │   ├── planejamentoModel.ts     # Modelo de cálculo
│   │   ├── trpc.ts                  # Cliente tRPC
│   │   └── utils.ts                 # Utilitários
│   │
│   ├── pages/
│   │   ├── Home.tsx                 # Página principal
│   │   ├── Files.tsx                # Gestão de ficheiros
│   │   └── NotFound.tsx             # 404
│   │
│   ├── App.tsx                      # Rotas e layout
│   ├── main.tsx                     # Entry point
│   └── index.css                    # Estilos globais
```

### Backend (server/)

```
server/
├── _core/                           # Infraestrutura
│   ├── context.ts                   # Contexto tRPC
│   ├── trpc.ts                      # Setup tRPC
│   ├── oauth.ts                     # Autenticação
│   ├── cookies.ts                   # Gestão de cookies
│   ├── llm.ts                       # Integração LLM
│   ├── voiceTranscription.ts        # Transcrição de voz
│   ├── imageGeneration.ts           # Geração de imagens
│   ├── notification.ts              # Notificações
│   ├── map.ts                       # Integração Maps
│   ├── dataApi.ts                   # APIs de dados
│   ├── vite.ts                      # Dev server Vite
│   └── index.ts                     # Servidor Express
│
├── db.ts                            # Queries banco de dados
├── routers.ts                       # Routers tRPC principais
├── fileRouter.ts                    # Router de ficheiros
├── storage.ts                       # Operações S3
│
└── *.test.ts                        # Testes unitários
```

---

## Adicionando Novas Funcionalidades

### 1. Adicionar Nova Aba na Interface

**Passo 1:** Adicionar trigger na lista de tabs

```tsx
// client/src/pages/Home.tsx
<TabsList>
  {/* ... abas existentes ... */}
  <TabsTrigger value="minha-aba">Minha Aba</TabsTrigger>
</TabsList>
```

**Passo 2:** Adicionar conteúdo da aba

```tsx
// client/src/pages/Home.tsx
<TabsContent value="minha-aba" className="space-y-6">
  <Card>
    <CardHeader>
      <CardTitle>Título da Minha Aba</CardTitle>
      <CardDescription>Descrição</CardDescription>
    </CardHeader>
    <CardContent>
      {/* Seu conteúdo aqui */}
    </CardContent>
  </Card>
</TabsContent>
```

### 2. Adicionar Novo Gráfico

**Passo 1:** Criar componente do gráfico

```tsx
// client/src/components/charts/MeuGrafico.tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface MeuGraficoProps {
  dados: Array<{ mes: string; valor: number }>;
}

export function MeuGrafico({ dados }: MeuGraficoProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={dados}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="mes" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="valor" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  );
}
```

**Passo 2:** Importar e usar no Home.tsx

```tsx
// client/src/pages/Home.tsx
import { MeuGrafico } from "@/components/charts/MeuGrafico";

// Na aba Gráficos
<Card>
  <CardHeader>
    <CardTitle>Meu Gráfico</CardTitle>
  </CardHeader>
  <CardContent>
    <MeuGrafico dados={meusDados} />
  </CardContent>
</Card>
```

### 3. Adicionar Nova Procedure tRPC

**Passo 1:** Definir procedure no backend

```typescript
// server/routers.ts
export const appRouter = router({
  // ... routers existentes ...
  
  minhaFeature: router({
    listar: protectedProcedure.query(async ({ ctx }) => {
      // Lógica de negócio
      return await getMinhasDados(ctx.user.id);
    }),
    
    criar: protectedProcedure
      .input(z.object({
        nome: z.string(),
        valor: z.number()
      }))
      .mutation(async ({ ctx, input }) => {
        // Lógica de negócio
        return await criarMinhaDado(ctx.user.id, input);
      })
  })
});
```

**Passo 2:** Usar no frontend

```tsx
// client/src/pages/MinhaPage.tsx
import { trpc } from "@/lib/trpc";

export default function MinhaPage() {
  const { data, isLoading } = trpc.minhaFeature.listar.useQuery();
  const criarMutation = trpc.minhaFeature.criar.useMutation();
  
  const handleCriar = () => {
    criarMutation.mutate({
      nome: "Teste",
      valor: 123
    });
  };
  
  return (
    <div>
      {isLoading ? "Carregando..." : JSON.stringify(data)}
      <button onClick={handleCriar}>Criar</button>
    </div>
  );
}
```

### 4. Adicionar Nova Tabela no Banco

**Passo 1:** Definir schema

```typescript
// drizzle/schema.ts
export const minhaTabela = mysqlTable("minha_tabela", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  nome: varchar("nome", { length: 255 }).notNull(),
  valor: int("valor").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type MinhaTabela = typeof minhaTabela.$inferSelect;
export type InsertMinhaTabela = typeof minhaTabela.$inferInsert;
```

**Passo 2:** Criar queries

```typescript
// server/db.ts
import { minhaTabela } from "../drizzle/schema";

export async function getMinhasDados(userId: number) {
  const db = await getDb();
  return await db.select().from(minhaTabela).where(eq(minhaTabela.userId, userId));
}

export async function criarMinhaDado(userId: number, data: Omit<InsertMinhaTabela, 'userId'>) {
  const db = await getDb();
  return await db.insert(minhaTabela).values({ ...data, userId });
}
```

**Passo 3:** Aplicar migração

```bash
pnpm db:push
```

---

## Boas Práticas

### 1. Código Limpo

```typescript
// ❌ Evitar
function calc(a, b, c) {
  return a + b * c / 100;
}

// ✅ Preferir
function calcularPercentualCrescimento(
  valorInicial: number,
  valorFinal: number,
  periodos: number
): number {
  return ((valorFinal - valorInicial) / valorInicial) * 100 / periodos;
}
```

### 2. Tipagem Forte

```typescript
// ❌ Evitar
const dados: any = await fetchDados();

// ✅ Preferir
interface Dados {
  id: number;
  nome: string;
  valor: number;
}

const dados: Dados[] = await fetchDados();
```

### 3. Tratamento de Erros

```typescript
// ❌ Evitar
const resultado = await operacaoPerigosa();

// ✅ Preferir
try {
  const resultado = await operacaoPerigosa();
  return resultado;
} catch (error) {
  console.error("Erro na operação:", error);
  throw new TRPCError({
    code: 'INTERNAL_SERVER_ERROR',
    message: 'Falha na operação'
  });
}
```

### 4. Validação de Dados

```typescript
// ❌ Evitar
const email = input.email; // sem validação

// ✅ Preferir
const emailSchema = z.string().email();
const email = emailSchema.parse(input.email);
```

### 5. Componentes Reutilizáveis

```tsx
// ❌ Evitar - código duplicado
<div className="bg-white rounded-lg shadow p-6">
  <h2>Título 1</h2>
  <p>Conteúdo 1</p>
</div>

<div className="bg-white rounded-lg shadow p-6">
  <h2>Título 2</h2>
  <p>Conteúdo 2</p>
</div>

// ✅ Preferir - componente reutilizável
function CardCustom({ titulo, conteudo }: { titulo: string; conteudo: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{titulo}</CardTitle>
      </CardHeader>
      <CardContent>{conteudo}</CardContent>
    </Card>
  );
}

<CardCustom titulo="Título 1" conteudo="Conteúdo 1" />
<CardCustom titulo="Título 2" conteudo="Conteúdo 2" />
```

---

## Testes

### 1. Estrutura de Testes

```typescript
// server/minhaFeature.test.ts
import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";

describe("minhaFeature", () => {
  it("deve listar dados do usuário", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);
    
    const resultado = await caller.minhaFeature.listar();
    
    expect(resultado).toHaveLength(2);
    expect(resultado[0].nome).toBe("Teste");
  });
  
  it("deve criar novo dado", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);
    
    const resultado = await caller.minhaFeature.criar({
      nome: "Novo",
      valor: 456
    });
    
    expect(resultado.nome).toBe("Novo");
  });
});
```

### 2. Executar Testes

```bash
# Todos os testes
pnpm test

# Testes específicos
pnpm test minhaFeature.test.ts

# Com cobertura
pnpm test --coverage

# Modo watch
pnpm test --watch
```

### 3. Criar Mock de Contexto

```typescript
// server/testUtils.ts
import type { TrpcContext } from "./_core/context";

export function createMockContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "test-user",
      email: "test@example.com",
      name: "Test User",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {} as any,
    res: {} as any,
  };
}
```

---

## Debugging

### 1. Frontend (React DevTools)

```bash
# Instalar extensão React DevTools no navegador
# Chrome: https://chrome.google.com/webstore/detail/react-developer-tools/...
```

**Uso:**
1. Abrir DevTools (F12)
2. Aba "Components" para inspecionar árvore React
3. Aba "Profiler" para análise de performance

### 2. Backend (Node.js Debugger)

```bash
# Adicionar breakpoints no código
debugger;

# Iniciar com debugger
node --inspect server/_core/index.ts
```

**VS Code:**
```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Backend",
      "runtimeExecutable": "pnpm",
      "runtimeArgs": ["dev"],
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

### 3. tRPC DevTools

```bash
# Instalar extensão tRPC Panel
# https://github.com/iway1/trpc-panel
```

**Uso:**
Acesse `/api/panel` para interface interativa de teste de procedures

---

## Performance

### 1. Otimizar Renderizações React

```tsx
// ❌ Evitar - re-renderiza sempre
function MeuComponente({ dados }) {
  const processado = processar(dados); // executado toda renderização
  return <div>{processado}</div>;
}

// ✅ Preferir - memoiza resultado
function MeuComponente({ dados }) {
  const processado = useMemo(() => processar(dados), [dados]);
  return <div>{processado}</div>;
}
```

### 2. Lazy Loading de Componentes

```tsx
// ❌ Evitar - carrega tudo no início
import GraficoComplexo from "./GraficoComplexo";

// ✅ Preferir - carrega sob demanda
const GraficoComplexo = lazy(() => import("./GraficoComplexo"));

function MinhaPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <GraficoComplexo />
    </Suspense>
  );
}
```

### 3. Otimizar Queries tRPC

```tsx
// ❌ Evitar - múltiplas queries
const dados1 = trpc.feature1.get.useQuery();
const dados2 = trpc.feature2.get.useQuery();
const dados3 = trpc.feature3.get.useQuery();

// ✅ Preferir - query única combinada
const dados = trpc.combined.getAll.useQuery();
```

---

## Convenções de Código

### 1. Nomenclatura

```typescript
// Variáveis e funções: camelCase
const minhaVariavel = 123;
function minhaFuncao() {}

// Tipos e interfaces: PascalCase
interface MeuTipo {}
type MinhaUniao = string | number;

// Constantes: UPPER_SNAKE_CASE
const API_URL = "https://api.example.com";

// Componentes React: PascalCase
function MeuComponente() {}

// Arquivos de componentes: PascalCase.tsx
// MeuComponente.tsx

// Arquivos utilitários: camelCase.ts
// minhaUtil.ts
```

### 2. Estrutura de Arquivos

```
feature/
├── FeaturePage.tsx          # Página principal
├── FeatureList.tsx          # Componente de lista
├── FeatureItem.tsx          # Componente de item
├── FeatureForm.tsx          # Componente de formulário
├── featureUtils.ts          # Utilitários
├── featureTypes.ts          # Tipos TypeScript
└── feature.test.ts          # Testes
```

### 3. Imports

```typescript
// Ordem de imports:
// 1. Bibliotecas externas
import { useState, useEffect } from "react";
import { z } from "zod";

// 2. Imports internos absolutos
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";

// 3. Imports relativos
import { minhaUtil } from "./utils";
import type { MeuTipo } from "./types";
```

---

## Git Workflow

### 1. Branches

```bash
# main - produção
# develop - desenvolvimento
# feature/* - novas funcionalidades
# bugfix/* - correções de bugs
# hotfix/* - correções urgentes

# Criar nova feature
git checkout -b feature/minha-feature

# Fazer commits
git add .
git commit -m "feat: adiciona nova funcionalidade"

# Push
git push origin feature/minha-feature

# Criar Pull Request no GitHub
```

### 2. Mensagens de Commit

Seguir [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Tipos:
# feat: nova funcionalidade
# fix: correção de bug
# docs: documentação
# style: formatação
# refactor: refatoração
# test: testes
# chore: manutenção

# Exemplos:
git commit -m "feat: adiciona gráfico de funil"
git commit -m "fix: corrige cálculo de churn"
git commit -m "docs: atualiza README"
git commit -m "refactor: simplifica modelo de cálculo"
```

---

## Troubleshooting

### Problema: Erro de compilação TypeScript

```bash
# Limpar cache e reinstalar
rm -rf node_modules .pnpm-store
pnpm install

# Verificar tipos
pnpm check
```

### Problema: Banco de dados fora de sincronia

```bash
# Regenerar schema
pnpm db:push

# Verificar migrações
ls drizzle/migrations/
```

### Problema: tRPC não encontra procedures

```bash
# Verificar se appRouter está exportado
# server/routers.ts
export const appRouter = router({ ... });
export type AppRouter = typeof appRouter;

# Verificar se cliente está configurado
# client/src/lib/trpc.ts
export const trpc = createTRPCReact<AppRouter>();
```

### Problema: Gráficos não renderizam

```bash
# Verificar se Recharts está instalado
pnpm list recharts

# Verificar console do navegador
# Pode ser problema de dados inválidos
```

---

## Recursos Adicionais

### Documentação Oficial

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [tRPC](https://trpc.io/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Recharts](https://recharts.org/)
- [shadcn/ui](https://ui.shadcn.com/)

### Ferramentas Úteis

- [VS Code](https://code.visualstudio.com/)
- [Postman](https://www.postman.com/) - Testar APIs
- [DBeaver](https://dbeaver.io/) - Cliente MySQL
- [React DevTools](https://react.dev/learn/react-developer-tools)

---

## Contato

Para dúvidas ou suporte técnico, entre em contato com a equipe de desenvolvimento da LOARA.
