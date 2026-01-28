# 🏗️ Arquitetura do Sistema

## Visão Geral

O sistema de Planejamento Estratégico LOARA 2026 é uma aplicação full-stack moderna com arquitetura cliente-servidor, utilizando React no frontend e Express + tRPC no backend.

---

## Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────────────────┐
│                         USUÁRIO                                  │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ HTTPS
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (React 19)                           │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                      Home.tsx                             │  │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ │  │
│  │  │Sumário │ │Cenários│ │ Metas  │ │Gráficos│ │  ...   │ │  │
│  │  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘ │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           │                                      │
│  ┌────────────────────────┼────────────────────────────────┐   │
│  │         planejamentoModel.ts                            │   │
│  │  ┌──────────────────────────────────────────────────┐  │   │
│  │  │ calcularPlanejamento(valoresBase)                │  │   │
│  │  │  → Retorna todos os dados calculados             │  │   │
│  │  └──────────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                           │                                      │
│  ┌────────────────────────┼────────────────────────────────┐   │
│  │              Components                                 │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │   │
│  │  │ EditarValores│  │  FileUpload  │  │   Charts     │ │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘ │   │
│  └─────────────────────────────────────────────────────────┘   │
│                           │                                      │
│  ┌────────────────────────▼────────────────────────────────┐   │
│  │              tRPC Client (lib/trpc.ts)                  │   │
│  │  ┌──────────────────────────────────────────────────┐  │   │
│  │  │ trpc.auth.me.useQuery()                          │  │   │
│  │  │ trpc.files.list.useQuery()                       │  │   │
│  │  │ trpc.files.upload.useMutation()                  │  │   │
│  │  └──────────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ HTTP/JSON (tRPC)
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                 BACKEND (Express + tRPC)                         │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                   server/_core/index.ts                   │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │ Express Server                                     │  │  │
│  │  │  - Middleware OAuth                                │  │  │
│  │  │  - tRPC Handler (/api/trpc)                       │  │  │
│  │  │  - Vite Dev Server (desenvolvimento)              │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           │                                      │
│  ┌────────────────────────┼────────────────────────────────┐   │
│  │            server/routers.ts                            │   │
│  │  ┌──────────────────────────────────────────────────┐  │   │
│  │  │ appRouter                                        │  │   │
│  │  │  ├─ auth.me                                      │  │   │
│  │  │  ├─ auth.logout                                  │  │   │
│  │  │  ├─ files.list                                   │  │   │
│  │  │  ├─ files.upload                                 │  │   │
│  │  │  └─ files.delete                                 │  │   │
│  │  └──────────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                           │                                      │
│  ┌────────────────────────┼────────────────────────────────┐   │
│  │              server/db.ts                               │   │
│  │  ┌──────────────────────────────────────────────────┐  │   │
│  │  │ getUserByOpenId()                                │  │   │
│  │  │ upsertUser()                                     │  │   │
│  │  │ getUserFiles()                                   │  │   │
│  │  │ createFile()                                     │  │   │
│  │  └──────────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                           │                                      │
│  ┌────────────────────────┼────────────────────────────────┐   │
│  │           server/storage.ts                             │   │
│  │  ┌──────────────────────────────────────────────────┐  │   │
│  │  │ storagePut(key, data, contentType)               │  │   │
│  │  │ storageGet(key, expiresIn)                       │  │   │
│  │  └──────────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   DATABASE   │  │  AWS S3      │  │ MANUS OAUTH  │
│  MySQL/TiDB  │  │  (Storage)   │  │  (Auth)      │
└──────────────┘  └──────────────┘  └──────────────┘
```

---

## Camadas da Aplicação

### 1. Camada de Apresentação (Frontend)

**Responsabilidade:** Interface do usuário e experiência interativa

**Tecnologias:**
- React 19 com TypeScript
- Tailwind CSS 4 para estilização
- shadcn/ui para componentes
- Recharts para gráficos

**Componentes Principais:**

```
client/src/
├── pages/
│   └── Home.tsx              # Página principal com 11 abas
├── components/
│   ├── charts/               # Gráficos Recharts
│   ├── EditarValoresBase.tsx # Editor de valores
│   └── FileUpload.tsx        # Upload de ficheiros
└── lib/
    ├── planejamentoModel.ts  # Lógica de cálculo
    └── trpc.ts               # Cliente API
```

**Fluxo de Dados:**
1. Usuário interage com UI
2. Componente React atualiza estado local
3. `planejamentoModel.ts` recalcula valores
4. UI re-renderiza com novos dados

### 2. Camada de Comunicação (tRPC)

**Responsabilidade:** Comunicação type-safe entre frontend e backend

**Características:**
- Contratos de API tipados
- Validação automática com Zod
- Serialização com SuperJSON
- Batching de requests

**Exemplo de Procedure:**

```typescript
// server/routers.ts
export const appRouter = router({
  files: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await getUserFiles(ctx.user.id);
    }),
    
    upload: protectedProcedure
      .input(z.object({
        filename: z.string(),
        content: z.string(),
        category: z.enum(['documento', 'relatorio', 'dados', 'outro'])
      }))
      .mutation(async ({ ctx, input }) => {
        const buffer = Buffer.from(input.content, 'base64');
        const { url } = await storagePut(key, buffer, mimeType);
        await createFile({ userId: ctx.user.id, ...input, url });
        return { url };
      })
  })
});
```

### 3. Camada de Negócio (Backend)

**Responsabilidade:** Lógica de negócio e orquestração

**Estrutura:**

```
server/
├── _core/                    # Infraestrutura
│   ├── context.ts           # Contexto tRPC (user, req, res)
│   ├── trpc.ts              # Setup tRPC
│   ├── oauth.ts             # Autenticação Manus
│   └── index.ts             # Servidor Express
├── routers.ts               # Definição de rotas
├── db.ts                    # Queries banco de dados
└── storage.ts               # Operações S3
```

**Middleware de Autenticação:**

```typescript
// server/_core/context.ts
export async function createContext({ req, res }: CreateContextOptions) {
  const token = extractTokenFromCookie(req);
  const user = token ? await verifyToken(token) : null;
  
  return { req, res, user };
}

// server/_core/trpc.ts
export const protectedProcedure = publicProcedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({ ctx: { ...ctx, user: ctx.user } });
});
```

### 4. Camada de Dados (Database + Storage)

**Responsabilidade:** Persistência e recuperação de dados

**Banco de Dados (MySQL/TiDB):**

```typescript
// drizzle/schema.ts
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user"),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const files = mysqlTable("files", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  filename: varchar("filename", { length: 255 }).notNull(),
  fileKey: varchar("fileKey", { length: 512 }).notNull(),
  url: text("url").notNull(),
  category: varchar("category", { length: 50 }),
  createdAt: timestamp("createdAt").defaultNow(),
});
```

**Storage S3:**

```typescript
// server/storage.ts
export async function storagePut(
  key: string,
  data: Buffer | Uint8Array | string,
  contentType?: string
): Promise<{ key: string; url: string }> {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: data,
    ContentType: contentType,
  });
  
  await s3Client.send(command);
  const url = `${CDN_URL}/${key}`;
  
  return { key, url };
}
```

---

## Modelo de Cálculo Inteligente

### Arquitetura do Modelo

```
┌─────────────────────────────────────────────────────────────┐
│              planejamentoModel.ts                            │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ VALORES_BASE_PADRAO                                    │ │
│  │  - carteira_2025, carteira_2026                        │ │
│  │  - indicacoes_2025, indicacoes_2026                    │ │
│  │  - receita_2025, receita_2026                          │ │
│  │  - ... (12 valores base)                               │ │
│  └────────────────────────────────────────────────────────┘ │
│                          │                                   │
│                          ▼                                   │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ calcularPlanejamento(valoresBase)                      │ │
│  │                                                         │ │
│  │  1. Calcula percentuais de crescimento                │ │
│  │     crescimento_carteira = (2026 - 2025) / 2025 * 100 │ │
│  │                                                         │ │
│  │  2. Calcula taxas de conversão                        │ │
│  │     taxa_indicacao_contrato = contratos / indicacoes  │ │
│  │                                                         │ │
│  │  3. Calcula ticket médio                              │ │
│  │     ticket_medio = receita / carteira                 │ │
│  │                                                         │ │
│  │  4. Distribui metas mensais (progressiva)             │ │
│  │     metas_mensais = distribuirProgressivamente(...)   │ │
│  │                                                         │ │
│  │  5. Gera cenários (conservador, moderado, agressivo)  │ │
│  │     cenarios = gerarCenarios(valoresBase)             │ │
│  │                                                         │ │
│  │  6. Calcula compensação dos gerentes                  │ │
│  │     compensacao = calcularCompensacao(...)            │ │
│  └────────────────────────────────────────────────────────┘ │
│                          │                                   │
│                          ▼                                   │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ RETORNO: DadosCalculados                               │ │
│  │  - baseline_2025                                       │ │
│  │  - meta_2026                                           │ │
│  │  - crescimento                                         │ │
│  │  - metas_mensais[]                                     │ │
│  │  - metas_trimestrais[]                                 │ │
│  │  - cenarios (conservador, moderado, agressivo)        │ │
│  │  - compensacao_gerentes[]                              │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Fórmulas de Cálculo

**1. Percentuais de Crescimento:**

```typescript
crescimento_carteira = ((carteira_2026 - carteira_2025) / carteira_2025) * 100
crescimento_churn = ((churn_2026 - churn_2025) / churn_2025) * 100
crescimento_indicacoes = ((indicacoes_2026 - indicacoes_2025) / indicacoes_2025) * 100
crescimento_contratos = ((contratos_2026 - contratos_2025) / contratos_2025) * 100
crescimento_captacao = ((captacao_2026 - captacao_2025) / captacao_2025) * 100
crescimento_receita = ((receita_2026 - receita_2025) / receita_2025) * 100
```

**2. Taxas de Conversão:**

```typescript
novos_parceiros = carteira_2026 - carteira_2025 + (carteira_2025 * churn_2026 / 100)
taxa_indicacao_contrato = (contratos_2026 / indicacoes_2026) * 100
taxa_contrato_parceiro = (novos_parceiros / contratos_2026) * 100
```

**3. Ticket Médio:**

```typescript
ticket_medio = receita_2026 / carteira_2026
```

**4. Distribuição Mensal Progressiva:**

```typescript
function distribuirProgressivamente(total: number, meses: number) {
  const fator_crescimento = 1.08; // 8% de crescimento mensal
  let soma_fatores = 0;
  
  for (let i = 0; i < meses; i++) {
    soma_fatores += Math.pow(fator_crescimento, i);
  }
  
  const valor_inicial = total / soma_fatores;
  const metas = [];
  
  for (let i = 0; i < meses; i++) {
    metas.push(valor_inicial * Math.pow(fator_crescimento, i));
  }
  
  return metas;
}
```

---

## Fluxo de Autenticação

```
┌──────────┐                                    ┌──────────────┐
│ Usuário  │                                    │ Manus OAuth  │
└────┬─────┘                                    └──────┬───────┘
     │                                                  │
     │ 1. Acessa /                                     │
     ├────────────────────────────────────────────────▶│
     │                                                  │
     │ 2. Redireciona para login                       │
     │◀────────────────────────────────────────────────┤
     │                                                  │
     │ 3. Faz login no portal Manus                    │
     ├─────────────────────────────────────────────────▶
     │                                                  │
     │ 4. Callback com código                          │
     │◀─────────────────────────────────────────────────┤
     │                                                  │
┌────▼─────┐                                    ┌──────▼───────┐
│ Backend  │                                    │ Manus OAuth  │
└────┬─────┘                                    └──────┬───────┘
     │                                                  │
     │ 5. Troca código por token                       │
     ├─────────────────────────────────────────────────▶
     │                                                  │
     │ 6. Retorna access_token                         │
     │◀─────────────────────────────────────────────────┤
     │                                                  │
     │ 7. Cria sessão JWT                              │
     │ 8. Define cookie httpOnly                       │
     │                                                  │
┌────▼─────┐                                           │
│ Frontend │                                           │
└────┬─────┘                                           │
     │                                                  │
     │ 9. Faz requests com cookie                      │
     ├────────────────────────────────────────────────▶│
     │                                                  │
     │ 10. Backend valida JWT e retorna dados          │
     │◀────────────────────────────────────────────────┤
     │                                                  │
```

---

## Fluxo de Upload de Ficheiros

```
┌──────────┐         ┌──────────┐         ┌──────────┐         ┌──────────┐
│ Frontend │         │ Backend  │         │ Database │         │   S3     │
└────┬─────┘         └────┬─────┘         └────┬─────┘         └────┬─────┘
     │                    │                     │                     │
     │ 1. Seleciona file  │                     │                     │
     │                    │                     │                     │
     │ 2. Converte base64 │                     │                     │
     │                    │                     │                     │
     │ 3. trpc.files.upload.mutate()           │                     │
     ├───────────────────▶│                     │                     │
     │                    │                     │                     │
     │                    │ 4. Valida dados     │                     │
     │                    │                     │                     │
     │                    │ 5. Gera key único   │                     │
     │                    │                     │                     │
     │                    │ 6. storagePut()     │                     │
     │                    ├─────────────────────┼────────────────────▶│
     │                    │                     │                     │
     │                    │ 7. Upload completo  │                     │
     │                    │◀────────────────────┼─────────────────────┤
     │                    │                     │                     │
     │                    │ 8. createFile()     │                     │
     │                    ├────────────────────▶│                     │
     │                    │                     │                     │
     │                    │ 9. Registro salvo   │                     │
     │                    │◀────────────────────┤                     │
     │                    │                     │                     │
     │ 10. Retorna { url }│                     │                     │
     │◀───────────────────┤                     │                     │
     │                    │                     │                     │
     │ 11. Atualiza UI    │                     │                     │
     │                    │                     │                     │
```

---

## Padrões de Design Utilizados

### 1. **Repository Pattern** (Camada de Dados)

```typescript
// server/db.ts
export async function getUserFiles(userId: number) {
  const db = await getDb();
  return await db.select().from(files).where(eq(files.userId, userId));
}

export async function createFile(data: InsertFile) {
  const db = await getDb();
  return await db.insert(files).values(data);
}
```

### 2. **Facade Pattern** (Storage)

```typescript
// server/storage.ts
export async function storagePut(...) { /* S3 complexidade escondida */ }
export async function storageGet(...) { /* S3 complexidade escondida */ }
```

### 3. **Strategy Pattern** (Cálculo de Cenários)

```typescript
// client/src/lib/planejamentoModel.ts
function gerarCenarios(valoresBase: ValoresBase) {
  return {
    conservador: calcularCenario(valoresBase, 0.8),  // 80% da meta
    moderado: calcularCenario(valoresBase, 1.0),     // 100% da meta
    agressivo: calcularCenario(valoresBase, 1.2),    // 120% da meta
  };
}
```

### 4. **Observer Pattern** (React State)

```typescript
// client/src/pages/Home.tsx
const [valoresBase, setValoresBase] = useState(VALORES_BASE_PADRAO);
const dadosCalculados = useMemo(
  () => calcularPlanejamento(valoresBase),
  [valoresBase]
);
```

---

## Segurança

### 1. Autenticação

- OAuth 2.0 via Manus
- JWT armazenado em cookie httpOnly
- Refresh automático de token

### 2. Autorização

- Middleware `protectedProcedure` valida usuário
- Role-based access control (admin/user)
- Validação de ownership de recursos

### 3. Validação de Dados

- Zod schema validation em todas as procedures
- Sanitização de inputs
- Validação de tipos no TypeScript

### 4. Storage Seguro

- Keys S3 não-enumeráveis (com sufixo aleatório)
- Bucket público mas keys imprevisíveis
- Metadata sensível no banco, não no S3

---

## Performance

### 1. Frontend

- **Code splitting** via Vite
- **Lazy loading** de componentes
- **Memoization** de cálculos pesados
- **Debouncing** em inputs

### 2. Backend

- **Batching** de requests tRPC
- **Connection pooling** MySQL
- **Caching** de queries frequentes
- **Compressão** de responses

### 3. Database

- **Indexes** em colunas de busca
- **Prepared statements** via Drizzle
- **Lazy loading** de relações

---

## Escalabilidade

### Horizontal Scaling

- Backend stateless (sessão em JWT)
- S3 para storage distribuído
- Database replication (TiDB)

### Vertical Scaling

- Node.js single-threaded otimizado
- MySQL connection pool configurável
- Vite build optimizations

---

## Monitoramento

### Logs

```typescript
// server/_core/index.ts
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});
```

### Métricas

- Tempo de resposta das procedures
- Taxa de erro de uploads
- Uso de storage S3

---

## Próximos Passos

1. **Implementar Dashboard de Acompanhamento**
2. **Adicionar Exportação PDF**
3. **Implementar Histórico de Revisões**
4. **Adicionar Notificações em Tempo Real**
5. **Implementar Backup Automático**
