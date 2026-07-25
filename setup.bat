@echo off
echo.
echo ========================================
echo    Instagram Comments Extractor Setup
echo ========================================
echo.

REM Verificar se Python está instalado
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python não encontrado!
    echo.
    echo 💡 Por favor, instale o Python primeiro:
    echo    1. Vá para https://www.python.org/downloads/
    echo    2. Baixe e instale a versão mais recente
    echo    3. Marque "Add Python to PATH" durante a instalação
    echo.
    pause
    exit /b 1
)

echo ✅ Python encontrado!
python --version

echo.
echo 📦 Instalando dependências...
pip install -r requirements.txt

if %errorlevel% equ 0 (
    echo.
    echo ✅ Setup concluído com sucesso!
    echo.
    echo 🚀 Como usar:
    echo    python instagram_extractor.py URL_DO_POST
    echo.
    echo 💡 Exemplo:
    echo    python instagram_extractor.py https://www.instagram.com/p/ABC123/
    echo.
) else (
    echo.
    echo ❌ Erro na instalação das dependências.
    echo 💡 Tente executar manualmente:
    echo    pip install instaloader requests
    echo.
)

pause