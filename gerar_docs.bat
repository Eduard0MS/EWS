@echo off
echo ==================================================
echo         FEIRA VIRTUAL - GERADOR DE DOCUMENTACAO
echo ==================================================
echo.

echo [1/4] Navegando para diretorio de documentacao...
cd backend\docs
if errorlevel 1 (
    echo ERRO: Diretorio backend\docs nao encontrado!
    pause
    exit /b 1
)

echo [2/4] Limpando documentacao anterior...
.\make.bat clean >nul 2>&1

echo [3/4] Gerando nova documentacao...
.\make.bat html
if errorlevel 1 (
    echo ERRO: Falha ao gerar documentacao!
    pause
    exit /b 1
)

echo [4/4] Abrindo documentacao no navegador...
start build\html\index.html

echo.
echo ==================================================
echo ✅ DOCUMENTACAO GERADA COM SUCESSO!
echo ==================================================
echo.
echo 📄 Documentacao disponivel em: backend\docs\build\html\index.html
echo 🌐 Abrindo automaticamente no navegador...
echo.
pause 