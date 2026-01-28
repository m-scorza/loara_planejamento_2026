#!/bin/bash

echo "========================================="
echo "  LOARA Planejamento 2026 - Setup"
echo "========================================="
echo ""

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Instale Node.js 22.x primeiro."
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 22 ]; then
    echo "⚠️  Node.js versão $NODE_VERSION detectada. Recomendado: 22.x"
fi

# Verificar pnpm
if ! command -v pnpm &> /dev/null; then
    echo "📦 Instalando pnpm..."
    npm install -g pnpm
fi

echo "✅ Pré-requisitos verificados"
echo ""

# Instalar dependências
echo "📦 Instalando dependências..."
pnpm install

if [ $? -ne 0 ]; then
    echo "❌ Falha ao instalar dependências"
    exit 1
fi

echo "✅ Dependências instaladas"
echo ""

# Configurar banco de dados
echo "🗄️  Configurando banco de dados..."
pnpm db:push

if [ $? -ne 0 ]; then
    echo "⚠️  Falha ao configurar banco. Verifique DATABASE_URL no .env"
fi

echo ""
echo "========================================="
echo "  ✅ Setup concluído com sucesso!"
echo "========================================="
echo ""
echo "Para iniciar o servidor de desenvolvimento:"
echo "  pnpm dev"
echo ""
echo "Para executar testes:"
echo "  pnpm test"
echo ""
echo "Para criar build de produção:"
echo "  pnpm build"
echo ""
