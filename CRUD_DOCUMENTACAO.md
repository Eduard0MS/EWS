# 📚 CRUD de Documentação - Feira Virtual

Sistema completo de **Create, Read, Update, Delete** para gerenciamento da documentação do projeto.

## Funcionalidades

### **CREATE** - Criar Documentação

- Gerar documentação completa do projeto
- Criar documentação para módulos específicos
- Adicionar novos arquivos RST automaticamente

### **READ** - Visualizar Documentação

- Abrir documentação no navegador
- Verificar status da documentação
- Listar módulos disponíveis

### **UPDATE** - Atualizar Documentação

- Regenerar documentação quando código muda
- Atualização automática com monitoramento
- Verificação inteligente de necessidade de update

### **DELETE** - Remover Documentação

- Deletar documentação completa
- Remover documentação de módulos específicos
- Limpeza automática de builds antigos

## Como Usar

### **Comando Principal:**

```bash
python crud_docs.py [comando] [opções]
```

### ** Comandos Disponíveis:**

#### **CREATE - Criar/Gerar**

```bash
# Gerar toda a documentação
python crud_docs.py create

# Criar documentação para módulo específico
python crud_docs.py create core.models
python crud_docs.py create authentication.views
```

#### **READ - Visualizar**

```bash
# Abrir documentação no navegador
python crud_docs.py read

# Ver status da documentação
python crud_docs.py status

# Listar módulos disponíveis
python crud_docs.py list
```

#### **UPDATE - Atualizar**

```bash
# Atualizar se necessário (verificação automática)
python crud_docs.py update

# Monitorar arquivos e atualizar automaticamente
python crud_docs.py watch
```

#### **DELETE - Remover**

```bash
# Deletar toda a documentação
python crud_docs.py delete

# Deletar documentação de módulo específico
python crud_docs.py delete core.models
```

## Funcionalidades Avançadas

### ** Auto-Update Inteligente**

O sistema verifica automaticamente se a documentação precisa ser atualizada:

- Compara timestamps dos arquivos fonte vs HTML gerado
- Só regenera quando realmente necessário
- Economia de tempo e processamento

### ** Modo Watch (Monitoramento)**

```bash
python crud_docs.py watch
```

- Monitora alterações em arquivos Python
- Regenera documentação automaticamente
- Ideal para desenvolvimento ativo

### ** Status Detalhado**

```bash
python crud_docs.py status
```

Mostra:

- Localização dos arquivos
- Quantidade de arquivos RST e HTML
- Data da última atualização
- Estado geral da documentação

## Exemplos Práticos

### **Fluxo Típico de Desenvolvimento:**

1. **Primeira vez:**

```bash
python crud_docs.py create
python crud_docs.py read
```

2. **Durante desenvolvimento:**

```bash
python crud_docs.py watch
# Deixa rodando e atualiza automaticamente
```

3. **Adicionando novo módulo:**

```bash
python crud_docs.py create novo_modulo
```

4. **Limpeza geral:**

```bash
python crud_docs.py delete
python crud_docs.py create
```

## 🔧 Estrutura Interna

### **Arquivos Gerenciados:**

```
backend/docs/
├── source/           # Arquivos fonte RST
│   ├── index.rst     # Página principal
│   ├── conf.py       # Configuração Sphinx
│   └── *.rst         # Módulos individuais
└── build/            # HTML gerado
    └── html/
        └── index.html # Documentação final
```

### **Módulos Suportados:**

- `core.models` - Modelos Django
- `core.serializers` - Serializers DRF
- `core.views` - Views e ViewSets
- `core.permissions` - Controles de acesso
- `authentication.views` - Autenticação
- `authentication.serializers` - Auth serializers

## Interface Visual

```
============================================================
         FEIRA VIRTUAL - CRUD DE DOCUMENTAÇÃO
============================================================

🔨 CREATE: Gerando nova documentação...
✅ Documentação gerada com sucesso!
🌐 Documentação aberta no navegador: backend/docs/build/html/index.html
```

## 🚨 Solução de Problemas

### **Erro: Módulo não encontrado**

```bash
# Verifique se está no diretório correto
cd /caminho/para/projeto-ews
python crud_docs.py create
```

### **Erro: make não encontrado**

```bash
# Certifique-se que as dependências estão instaladas
pip install sphinx sphinx-rtd-theme
```

### **Documentação não abrindo**

```bash
# Verificar se foi gerada corretamente
python crud_docs.py status
```

## Scripts de Conveniência

### **Windows:**

```bash
# Script automático
.\gerar_docs.bat

# Ou comando direto
python crud_docs.py create && python crud_docs.py read
```

### **Linux/Mac:**

```bash
# Script automático
./gerar_docs.sh

# Ou comando direto
python3 crud_docs.py create && python3 crud_docs.py read
```

## 📈 Benefícios do Sistema CRUD

### **✅ Vantagens:**

- **Automatização completa** do processo de documentação
- **Monitoramento em tempo real** de alterações
- **Gerenciamento granular** por módulos
- **Interface intuitiva** com comandos claros
- **Verificação inteligente** de necessidade de update
- **Integração perfeita** com workflow de desenvolvimento

### **🎯 Casos de Uso:**

- **Desenvolvimento**: Use `watch` para updates automáticos
- **Deploy**: Use `create` para gerar docs finais
- **Manutenção**: Use `update` para refresh periódico
- **Debug**: Use `status` para diagnosticar problemas

---

## Começar Agora

```bash
# 1. Gerar documentação completa
python crud_docs.py create

# 2. Visualizar no navegador
python crud_docs.py read

# 3. Monitorar alterações (opcional)
python crud_docs.py watch
```

**Sistema CRUD de Documentação pronto para uso!**
