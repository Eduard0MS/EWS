# FeiraSystem - Sistema de Gestão de Feiras

Um sistema completo para gestão de feiras virtuais, desenvolvido com **Django REST Framework** no backend e **React** no frontend.

## Funcionalidades

### **Gestão Completa**

- **Feiras**: Criar, editar e gerenciar feiras com preços de ingresso
- **Expositores**: Cadastro e gerenciamento de expositores por feira
- **Produtos**: Gerenciamento de produtos por expositor
- **Ingressos**: Sistema de compra e gestão de ingressos

### **Avatares Únicos**

- Avatares de robôs únicos para cada usuário (estilo Reddit)
- Gerados automaticamente usando Dicebear API
- Avatares consistentes em todo o sistema

### **Autenticação & Perfil**

- Sistema completo de login/registro
- Página de perfil com avatares personalizados
- Alteração de dados pessoais e senha

## Tecnologias

### Backend

- **Django 5.1**
- **Django REST Framework**
- **SQLite** (desenvolvimento)
- **CORS Headers**
- **Django Filter**

### Frontend

- **React 18**
- **React Router**
- **Tailwind CSS**
- **Axios**
- **Context API**

## Instalação e Execução

### Backend (Django)

```bash
# Navegar para o diretório do backend
cd backend

# Instalar dependências
pip install -r requirements.txt

# Executar migrações
python manage.py migrate

# Criar superusuário (opcional)
python manage.py createsuperuser

# Iniciar servidor
python manage.py runserver
```

### Frontend (React)

```bash
# Navegar para o diretório do frontend
cd frontend

# Instalar dependências
npm install

# Iniciar aplicação
npm start
```

## Páginas do Sistema

### **Dashboard**

- Visão geral do sistema
- Acesso rápido às funcionalidades

### **Feiras**

- Listagem de todas as feiras
- Criar/editar feiras
- Definir preços de ingresso
- Visualizar expositores

### **Expositores**

- Gerenciar expositores por feira
- Informações de contato
- Acessar produtos do expositor

### **Produtos**

- Catálogo de produtos
- Filtrar por expositor
- Preços e descrições

### **Ingressos**

- Comprar ingressos para feiras
- Visualizar ingressos adquiridos
- Códigos únicos de ingresso

### **Perfil**

- Avatar personalizado
- Editar informações pessoais
- Alterar senha

## Design System

### Cores Principais

- **Azul**: `#2563eb` (Primária)
- **Verde**: `#16a34a` (Sucesso)
- **Amarelo**: `#eab308` (Atenção)
- **Vermelho**: `#dc2626` (Erro)

### Componentes

- Cards responsivos
- Modais para formulários
- Avatares de robôs únicos
- Navegação intuitiva

## API Endpoints

### Autenticação

- `POST /auth/login/` - Login
- `POST /auth/register/` - Registro
- `GET /auth/profile/` - Perfil do usuário
- `PUT /auth/profile/` - Atualizar perfil

### Recursos

- `GET|POST /api/feiras/` - Feiras
- `GET|POST /api/expositores/` - Expositores
- `GET|POST /api/produtos/` - Produtos
- `GET|POST /api/ingressos/` - Ingressos

## Links Úteis

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api/
- **Admin Django**: http://localhost:8000/admin/

## Desenvolvedor

**Eduardo Silva** - [GitHub](https://github.com/Eduard0MS)

## Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

**Deixe uma estrela se você gostou do projeto!**
