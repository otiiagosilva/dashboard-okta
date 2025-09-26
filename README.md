# Dashboard Kanban - Gerenciador de Tarefas

Um dashboard web moderno e responsivo para gerenciamento de tarefas usando metodologia Kanban, desenvolvido com Flask (backend) e React (frontend).

## 🚀 Características

- **Interface Moderna**: Design limpo e responsivo com Tailwind CSS
- **Autenticação Segura**: Sistema de login e cadastro com JWT tokens
- **Quadro Kanban**: Drag & drop para movimentação de tarefas entre colunas
- **Gerenciamento Completo**: CRUD completo para tarefas com prioridades e responsáveis
- **Ícones Temáticos**: Ícones customizados em PNG para cada funcionalidade
- **Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- **Banco de Dados**: SQLite para simplicidade de deploy

## 🛠️ Tecnologias Utilizadas

### Backend
- **Flask**: Framework web Python
- **SQLAlchemy**: ORM para banco de dados
- **SQLite**: Banco de dados
- **JWT**: Autenticação via tokens
- **Flask-CORS**: Suporte a CORS
- **Werkzeug**: Hash de senhas

### Frontend
- **React**: Biblioteca JavaScript
- **Vite**: Build tool e dev server
- **Tailwind CSS**: Framework CSS
- **Shadcn/ui**: Componentes UI
- **Lucide React**: Ícones
- **React Router**: Roteamento

## 📁 Estrutura do Projeto

```
kanban-dashboard/
├── backend/
│   └── kanban-api/
│       ├── src/
│       │   ├── models/          # Modelos do banco de dados
│       │   ├── routes/          # Rotas da API
│       │   ├── static/          # Arquivos estáticos
│       │   ├── database/        # Banco SQLite
│       │   └── main.py          # Arquivo principal
│       ├── venv/                # Ambiente virtual Python
│       └── requirements.txt     # Dependências Python
├── frontend/
│   └── kanban-dashboard/
│       ├── src/
│       │   ├── components/      # Componentes React
│       │   ├── assets/          # Ícones e imagens
│       │   └── App.jsx          # Componente principal
│       ├── public/              # Arquivos públicos
│       └── package.json         # Dependências Node.js
├── icons/                       # Ícones customizados em PNG
└── README.md                    # Este arquivo
```

## 🚀 Como Executar

### Pré-requisitos
- Python 3.11+
- Node.js 18+
- pnpm (ou npm)

### 1. Clone o Repositório
```bash
git clone <url-do-repositorio>
cd kanban-dashboard
```

### 2. Configurar Backend
```bash
cd backend/kanban-api

# Ativar ambiente virtual
source venv/bin/activate

# Instalar dependências
pip install -r requirements.txt

# Executar servidor Flask
python src/main.py
```

O backend estará rodando em `http://localhost:5000`

### 3. Configurar Frontend
```bash
cd frontend/kanban-dashboard

# Instalar dependências
pnpm install

# Executar servidor de desenvolvimento
pnpm run dev --host
```

O frontend estará rodando em `http://localhost:5173`

## 📱 Funcionalidades

### Autenticação
- **Cadastro**: Criar nova conta com username, email e senha
- **Login**: Autenticação segura com JWT tokens
- **Logout**: Encerramento seguro da sessão

### Dashboard
- **Estatísticas**: Cards com contadores de tarefas por status
- **Perfil**: Informações do usuário logado
- **Navegação**: Interface intuitiva e responsiva

### Quadro Kanban
- **Três Colunas**: A Fazer, Em Progresso, Concluído
- **Drag & Drop**: Mover tarefas entre colunas facilmente
- **Contadores**: Número de tarefas em cada coluna
- **Cores Temáticas**: Cada coluna com sua identidade visual

### Gerenciamento de Tarefas
- **Criar**: Modal para criação de novas tarefas
- **Editar**: Modificar tarefas existentes
- **Excluir**: Remover tarefas com confirmação
- **Campos**: Título, descrição, prioridade, status, data de vencimento, responsável
- **Prioridades**: Alta (vermelho), Média (amarelo), Baixa (verde)
- **Responsáveis**: Atribuir tarefas a usuários cadastrados

## 🎨 Design System

### Paleta de Cores
- **Primary**: #3B82F6 (Azul vibrante)
- **Secondary**: #8B5CF6 (Roxo suave)  
- **Success**: #10B981 (Verde)
- **Warning**: #F59E0B (Amarelo)
- **Error**: #EF4444 (Vermelho)
- **Background**: #F8FAFC (Cinza muito claro)

### Componentes
- **Cards**: Sombras suaves, bordas arredondadas
- **Botões**: Gradientes sutis, hover states animados
- **Inputs**: Bordas focadas coloridas
- **Animações**: Transições suaves (200-300ms)

## 🔧 API Endpoints

### Autenticação
- `POST /api/register` - Cadastrar usuário
- `POST /api/login` - Fazer login
- `GET /api/me` - Dados do usuário atual

### Usuários
- `GET /api/users` - Listar usuários
- `GET /api/users/:id` - Obter usuário específico

### Tarefas
- `GET /api/tasks` - Listar todas as tarefas
- `POST /api/tasks` - Criar nova tarefa
- `GET /api/tasks/:id` - Obter tarefa específica
- `PUT /api/tasks/:id` - Atualizar tarefa
- `DELETE /api/tasks/:id` - Excluir tarefa
- `POST /api/tasks/reorder` - Reordenar tarefas
- `GET /api/tasks/by-status/:status` - Tarefas por status
- `GET /api/tasks/stats` - Estatísticas das tarefas

## 📱 Responsividade

O dashboard foi desenvolvido com foco em responsividade:

- **Desktop**: Layout completo com sidebar e múltiplas colunas
- **Tablet**: Adaptação do layout mantendo funcionalidades
- **Mobile**: Interface otimizada para touch, menu hambúrguer

## 🔒 Segurança

- **Autenticação JWT**: Tokens seguros com expiração
- **Hash de Senhas**: Senhas criptografadas com Werkzeug
- **CORS**: Configurado para permitir acesso do frontend
- **Validação**: Validação de dados no frontend e backend

## 🚀 Deploy

### Opção 1: Deploy Manual
1. Configure um servidor com Python e Node.js
2. Clone o repositório
3. Configure as variáveis de ambiente
4. Execute os comandos de build
5. Configure um proxy reverso (nginx)

### Opção 2: Deploy com Docker
```bash
# Em desenvolvimento - Dockerfile será adicionado
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👥 Autores

- **Desenvolvedor Principal** - Desenvolvimento completo do sistema

## 🙏 Agradecimentos

- Shadcn/ui pelos componentes React
- Tailwind CSS pelo framework CSS
- Lucide pelos ícones
- Flask e React pelas tecnologias base

