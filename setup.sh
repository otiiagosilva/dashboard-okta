#!/bin/bash

echo "🚀 Dashboard Kanban - Setup Script"
echo "=================================="

# Verificar se Python está instalado
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 não encontrado. Por favor, instale Python 3.11+"
    exit 1
fi

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Por favor, instale Node.js 18+"
    exit 1
fi

echo "✅ Pré-requisitos verificados"

# Setup Backend
echo ""
echo "🔧 Configurando Backend..."
cd backend/kanban-api

# Ativar ambiente virtual
if [ ! -d "venv" ]; then
    echo "Criando ambiente virtual Python..."
    python3 -m venv venv
fi

source venv/bin/activate

# Instalar dependências Python
echo "Instalando dependências Python..."
pip install -r requirements.txt

echo "✅ Backend configurado"

# Voltar para raiz
cd ../../

# Setup Frontend
echo ""
echo "🔧 Configurando Frontend..."
cd frontend/kanban-dashboard

# Verificar se pnpm está instalado
if command -v pnpm &> /dev/null; then
    echo "Instalando dependências com pnpm..."
    pnpm install
elif command -v yarn &> /dev/null; then
    echo "Instalando dependências com yarn..."
    yarn install
else
    echo "Instalando dependências com npm..."
    npm install
fi

echo "✅ Frontend configurado"

# Voltar para raiz
cd ../../

echo ""
echo "🎉 Setup concluído com sucesso!"
echo ""
echo "Para executar o projeto:"
echo "1. Backend: cd backend/kanban-api && source venv/bin/activate && python src/main.py"
echo "2. Frontend: cd frontend/kanban-dashboard && pnpm run dev --host"
echo ""
echo "Acesse: http://localhost:5173"

