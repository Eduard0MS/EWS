# Guia Completo de Documentação - Feira Virtual

Este guia explica como gerar e utilizar a documentação automática do sistema.

## Visão Geral

O projeto utiliza **Sphinx** para gerar documentação automática a partir dos **docstrings** do código Python. A documentação inclui todos os módulos, classes, métodos e funções do sistema.

## Pré-requisitos

### 1. Dependências Instaladas

```bash
# As dependências já estão no requirements.txt
pip install -r requirements.txt

# Ou instalar apenas as dependências de documentação:
pip install sphinx sphinx-rtd-theme
```

### 2. Variáveis de Ambiente

Certifique-se que o Django está configurado corretamente:

```bash
# No arquivo backend/.env ou configurar diretamente
DJANGO_SETTINGS_MODULE=feira_system.settings
```

## Comandos de Documentação

### Windows

```bash
# 1. Navegar para o diretório do backend
cd backend/docs

# 2. Gerar documentação HTML
.\make.bat html

# 3. Visualizar documentação
start build/html/index.html

# 4. Limpar documentação anterior (se necessário)
.\make.bat clean
```

### Linux/macOS

```bash
# 1. Navegar para o diretório do backend
cd backend/docs

# 2. Gerar documentação HTML
make html

# 3. Visualizar documentação
open build/html/index.html  # macOS
xdg-open build/html/index.html  # Linux

# 4. Limpar documentação anterior (se necessário)
make clean
```

## Estrutura dos Arquivos

```
backend/docs/
├── Makefile                 # Comandos para Linux/Mac
├── make.bat                # Comandos para Windows
├── source/
│   ├── conf.py             # Configuração do Sphinx
│   ├── index.rst           # Página principal
│   └── _static/            # Arquivos estáticos
└── build/
    └── html/               # Documentação gerada
        ├── index.html      # Página principal
        ├── _modules/       # Código fonte
        └── _static/        # CSS, JS, imagens
```

## Conteúdo da Documentação

### Módulos Documentados

1. **core.models**

   - Feira
   - Expositor
   - Produto
   - Ingresso

2. **core.serializers**

   - Serializers de listagem
   - Serializers detalhados
   - Serializers de criação/atualização

3. **core.views**

   - ViewSets para CRUD
   - Endpoints customizados
   - Permissões

4. **authentication.views**

   - Login/Registro
   - Perfil de usuário
   - Alteração de senha

5. **authentication.serializers**

   - Validação de dados
   - Formatação de resposta

6. **core.permissions**
   - Controles de acesso
   - Regras de propriedade

## Personalizando a Documentação

### 1. Configuração (conf.py)

```python
# Tema da documentação
html_theme = 'sphinx_rtd_theme'

# Extensões habilitadas
extensions = [
    'sphinx.ext.autodoc',      # Documentação automática
    'sphinx.ext.viewcode',     # Links para código fonte
    'sphinx.ext.napoleon',     # Suporte Google/NumPy docstrings
]
```

### 2. Adicionando Novos Módulos

Edite `source/index.rst` para incluir novos módulos:

```rst
.. automodule:: novo_modulo
   :members:
   :undoc-members:
   :show-inheritance:
```

### 3. Melhorando Docstrings

Use o formato Google/NumPy para docstrings:

```python
def minha_funcao(param1, param2):
    """Descrição da função.

    Args:
        param1 (str): Descrição do parâmetro 1
        param2 (int): Descrição do parâmetro 2

    Returns:
        bool: True se sucesso, False caso contrário

    Raises:
        ValueError: Se param1 for vazio
    """
    pass
```

## Solução de Problemas

### Erro: "No module named 'django'"

```bash
# Certifique-se que está no ambiente virtual correto
source .venv/bin/activate  # Linux/Mac
.venv\Scripts\activate     # Windows

# Reinstale as dependências
pip install -r requirements.txt
```

### Erro: Django não configurado

```bash
# No arquivo conf.py, certifique-se que tem:
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'feira_system.settings')
django.setup()
```

### Erro: Módulo não encontrado

```bash
# Verifique o path no conf.py:
sys.path.insert(0, os.path.abspath('../..'))
```

## Comandos Resumidos

### Gerar Documentação (Windows)

```bash
cd backend/docs && .\make.bat html && start build/html/index.html
```

### Gerar Documentação (Linux/Mac)

```bash
cd backend/docs && make html && open build/html/index.html
```

### Limpar e Regenerar

```bash
cd backend/docs && .\make.bat clean && .\make.bat html  # Windows
cd backend/docs && make clean && make html              # Linux/Mac
```

## Integração com Git

A documentação gerada (`build/`) está no `.gitignore`, apenas os arquivos fonte são versionados:

- ✅ `source/conf.py` - Versionado
- ✅ `source/index.rst` - Versionado
- ✅ `Makefile` e `make.bat` - Versionados
- ❌ `build/` - Ignorado pelo Git

## Resultado Final

Após executar os comandos, você terá:

- 📄 **Documentação HTML completa** em `build/html/index.html`
- 🔗 **Links para código fonte** de cada função/classe
- 📚 **Índice automático** de todos os módulos
- 🎨 **Tema profissional** ReadTheDocs
- 🔍 **Busca integrada** na documentação

---

**Para gerar a documentação agora, execute:**

```bash
cd backend/docs && .\make.bat html
```

A documentação estará disponível em `backend/docs/build/html/index.html`
