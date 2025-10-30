# 📦 Projeto de Sistema Distribuído — Dropbox Clone

### 🎓 Autoria
**Nome:** Renan Freitas dos Anjos  
**RA:** 20231tadsjg0229  
**Professor:** Luciano Cabral  

---

## 🧩 1. Introdução

Este projeto apresenta a arquitetura e a implementação de um **sistema distribuído inspirado no Dropbox**.  
A solução consiste em:

- **Backend robusto**, responsável pelo gerenciamento e armazenamento de arquivos.  
- **Frontend moderno e reativo**, voltado para a interação do usuário.

O projeto foi desenvolvido como parte da disciplina **Sistemas Distribuídos**, com foco em:
- Arquitetura de software distribuída;
- Comunicação entre serviços;
- Integração com serviços de nuvem (Azure Blob Storage).

---

## ⚙️ 2. Tecnologias Utilizadas

A escolha das tecnologias priorizou **produtividade, escalabilidade** e **modernidade** no desenvolvimento.

### 🖥️ 2.1 Backend
- **Node.js** — Ambiente de execução para JavaScript no servidor.  
- **NestJS** — Framework progressivo e modular para Node.js com suporte nativo a TypeScript.  
- **TypeScript** — Superset do JavaScript com tipagem estática opcional.  
- **TypeORM** — ORM para interação orientada a objetos com o banco de dados.  
- **PostgreSQL** — Banco de dados relacional open-source.  
- **Swagger (OpenAPI)** — Documentação interativa da API.

### 💻 2.2 Frontend
- **React** — Biblioteca JavaScript para criação de interfaces reativas e componentizadas.  
- **Vite** — Ferramenta de build ultrarrápida para React e TypeScript.  
- **TypeScript** — Consistência e segurança de tipos também no frontend.  
- **Axios** — Cliente HTTP baseado em Promises para comunicação com a API.  
- **Tailwind CSS** — Framework CSS utility-first para criação de interfaces modernas.

---

## 🏗️ 3. Arquitetura do Projeto

O sistema segue o padrão **cliente-servidor**, com responsabilidades bem definidas entre **frontend** e **backend**.

### 🧠 3.1 Arquitetura do Backend (API)

A API foi construída com **NestJS**, estruturada de forma **modular**.  
Cada módulo representa um recurso principal da aplicação, contendo:

- **Controller** → Recebe e trata requisições HTTP, validando dados via **DTOs**.  
- **Service** → Contém a **lógica de negócio** e interações com repositórios e serviços externos.  
- **Repository** → Abstração para o banco de dados utilizando o **TypeORM**.  
- **Entity** → Representação das tabelas do banco em classes.  
- **DTO (Data Transfer Object)** → Estruturas tipadas de dados para entrada e saída da API.

✅ Essa abordagem garante **baixo acoplamento**, **alta coesão** e **organização modular**.

### 🎨 3.2 Arquitetura do Frontend (SPA)

O frontend é uma **Single Page Application (SPA)** desenvolvida com **React**.

- **Components** → Peças de UI reutilizáveis (ex: `Header`, `Footer`, `CardContext`).  
- **Services** → Módulos de integração com o backend (ex: `upload.service.ts`).  
- **State Management** → Estado gerenciado localmente ou via **React Context API**.

Essa estrutura garante uma **UI reativa**, sincronizada com o estado da aplicação.

---

## ☁️ 4. Integração com a Cloud (Azure Blob Storage)

O sistema utiliza o **Azure Blob Storage** para armazenar os arquivos de forma escalável e segura.

### Benefícios:
- **Escalabilidade** — Serviço totalmente gerenciado e elástico.  
- **Alta Disponibilidade** — Redundância e replicação automáticas.  
- **Segurança** — Políticas de acesso refinadas via Azure IAM.

### Implementação:
No backend, o serviço `azure-storage.service.ts` encapsula toda a comunicação com o Azure.  
Utiliza o SDK oficial `@azure/storage-blob` para realizar:
- Upload;
- Download;
- Exclusão de arquivos.

---

## 🚀 5. Execução do Projeto

### 🔧 5.1 Pré-requisitos

Certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) (versão 18 ou superior)  
- **npm** ou **Yarn**  
- **Docker** e **Docker Compose** (para o banco PostgreSQL)  
- Uma conta **Azure** com **Storage Account** configurada  

---

### ⚙️ 5.2 Configuração do Backend

Navegue até a pasta do backend:
```bash
cd backend-dropbox


npm install
Configure as variáveis de ambiente: Crie um arquivo .env na raiz da pasta backend-dropbox e adicione as credenciais do banco de dados e do Azure Storage. Utilize o arquivo .env.example como referência, se houver.

# Exemplo de variáveis de ambiente
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=dropbox_db

AZURE_STORAGE_CONNECTION_STRING="Sua_Connection_String_do_Azure"
AZURE_STORAGE_CONTAINER_NAME="nome-do-seu-container"
Inicie o banco de dados com Docker Compose:

docker-compose up -d
Execute o servidor de desenvolvimento:

npm run start:dev
O servidor estará disponível em http://localhost:3000. A documentação da API (Swagger) pode ser acessada em http://localhost:3000/api.

5.3. Configuração do Frontend
Navegue até a pasta do frontend (em um novo terminal):

cd frontend-dropbox
Instale as dependências:

npm install
Execute o servidor de desenvolvimento:

npm run dev
A aplicação estará disponível em http://localhost:5173 (ou outra porta indicada pelo Vite).

Com esses passos, o ambiente de desenvolvimento completo estará funcional, com o frontend se comunicando com o backend e o backend utilizando os serviços de banco de dados e armazenamento em nuvem.

# Diagrama do Projeto

📁 projeto-dropbox-clone
├── 📂 backend-dropbox
│   ├── src/
│   │   ├── archive/
│   │   │   ├── archive.controller.ts
│   │   │   ├── archive.service.ts
│   │   │   ├── archive.entity.ts
│   │   │   └── dto/
│   │   ├── azure-storage/
│   │   │   └── azure-storage.service.ts
│   │   ├── main.ts
│   │   └── app.module.ts
│   ├── docker-compose.yml
│   ├── .env.example
│   └── package.json
│
└── 📂 frontend-dropbox
    ├── src/
    │   ├── components/
    │   ├── services/
    │   ├── contexts/
    │   └── main.tsx
    ├── vite.config.ts
    ├── package.json
    └── tsconfig.json
