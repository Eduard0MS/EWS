#!/bin/bash

echo "=================================================="
echo "        FEIRA VIRTUAL - GERADOR DE DOCUMENTAÇÃO"
echo "=================================================="
echo ""

echo "[1/4] Navegando para diretório de documentação..."
cd backend/docs || {
    echo "ERRO: Diretório backend/docs não encontrado!"
    exit 1
}

echo "[2/4] Limpando documentação anterior..."
make clean > /dev/null 2>&1

echo "[3/4] Gerando nova documentação..."
make html || {
    echo "ERRO: Falha ao gerar documentação!"
    exit 1
}

echo "[4/4] Abrindo documentação no navegador..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    open build/html/index.html
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    xdg-open build/html/index.html > /dev/null 2>&1 || {
        echo "Para abrir manualmente: build/html/index.html"
    }
fi

echo ""
echo "=================================================="
echo "✅ DOCUMENTAÇÃO GERADA COM SUCESSO!"
echo "=================================================="
echo ""
echo "📄 Documentação disponível em: backend/docs/build/html/index.html"
echo "🌐 Abrindo automaticamente no navegador..."
echo "" 