# Corregedoria PMBA — Sistema de Autos de Resistência

Sistema fullstack para registro, acompanhamento e assinatura digital de **Autos de Resistência** da Corregedoria da Polícia Militar da Bahia (COPPM/BA).

![React](https://img.shields.io/badge/React_19-61DAFB?style=flat&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white)

**[Acesse o sistema em produção →](https://corregedoria-pmba.vercel.app)** — login com qualquer matrícula e senha

---

## Sobre o projeto

O **Auto de Resistência** é o documento oficial lavrado quando um policial militar emprega força letal em serviço. A Corregedoria da PMBA (COPPM/BA) é o órgão responsável por receber, analisar e arquivar esses registros, garantindo controle institucional, transparência e conformidade legal no uso da força policial.

Este projeto simula o sistema interno utilizado pelos servidores da corregedoria para gerenciar todo o ciclo de vida de um Auto de Resistência — desde o registro inicial da ocorrência até a assinatura digital do termo e a geração do PDF oficial para arquivamento.

Foi desenvolvido como **projeto de portfólio fullstack**, com o objetivo de demonstrar domínio em desenvolvimento web moderno: SPA com React, API REST com Node.js e Express, banco de dados relacional em nuvem com Prisma ORM e PostgreSQL (Neon), autenticação JWT, geração de documentos PDF e cobertura de testes automatizados com Vitest e Playwright.

---

## Funcionalidades

### Autenticação com JWT
- Login com matrícula e senha — o sistema é demonstrativo e não exige cadastro prévio
- Token JWT gerado pelo backend com validade de 8 horas, armazenado no `localStorage`
- Rotas protegidas redirecionam automaticamente para o login quando o token expira ou está ausente
- Estado de `loading` no `AuthContext` impede redirecionamento prematuro durante a restauração da sessão

### Dashboard com dados reais
- Cards com total de Autos de Resistência registrados e pendências de assinatura, consultados em tempo real do banco de dados
- Gráfico de barras (Recharts) com ocorrências distribuídas por mês no ano atual
- Painel de status com proporção visual entre ocorrências Concluídas, Em Análise e Aguardando Assinatura
- Feed de atividades recentes com menção a ferramentas forenses reais (Cellebrite UFED Touch 2, GrayKey, laudos do IML)
- Cards de Laudos Cellebrite e Fila GrayKey simulando integração com sistemas externos da perícia

### Wizard de registro em 4 etapas
- **Etapa 1 — Dados gerais:** data, hora, BPM, município, bairro, logradouro, narrativa, vítimas fatais e feridos
- **Etapa 2 — Policiais envolvidos:** formulário dinâmico para adicionar e remover policiais com nome, patente, matrícula e BPM. Seletores com todas as patentes reais da PMBA e 21 BPMs + RONDESP, CIPE, BPRv
- **Etapa 3 — Armamento:** tipo de arma, calibre (calibres reais: .40, 9mm, .357, etc.), número de disparos e se a arma foi apreendida
- **Etapa 4 — Revisão e confirmação:** resumo de todos os dados antes do envio
- Protocolo gerado automaticamente no formato `AR-YYYY/NNNN` com numeração sequencial única

### Lista e busca de ocorrências
- Tabela com todas as ocorrências carregadas do banco PostgreSQL
- Filtro de texto em tempo real por protocolo, local e nome de policial
- Filtro por status (Registrada, Em Análise, Aguardando Assinatura, Concluída)
- Colunas: protocolo, data do fato, BPM, município, policiais e status com badge colorido

### Detalhes do processo
- Página individual de cada ocorrência com todos os dados do auto
- Timeline visual do andamento do processo: Registrada → Em Análise → Aguardando Assinatura → Concluída
- Cartões com dados de cada policial envolvido (patente, matrícula, BPM)
- Dados de armamento e informações sobre vítimas

### Assinatura digital e geração de PDF
- Página exibe o documento oficial completo formatado como um termo legal, com todos os dados da ocorrência
- Aviso de responsabilidade legal com referência ao Art. 299 do Código Penal (falsidade ideológica)
- Campo para confirmação de identidade com matrícula antes de assinar
- Após assinatura, o status da ocorrência é atualizado para "Concluída" no banco de dados
- PDF gerado com jsPDF: cabeçalho institucional COPPM/BA, dados completos do auto, lista de policiais, bloco de assinatura digital com data e hora

---

## Stack

### Frontend
| Tecnologia | Uso |
|---|---|
| React 19 + TypeScript | Framework principal da SPA |
| Vite | Bundler e servidor de desenvolvimento |
| Tailwind CSS v4 | Estilização utilitária |
| React Router v6 | Roteamento com rotas protegidas (PrivateRoute) |
| Recharts | Gráfico de barras no dashboard |
| jsPDF | Geração de documentos PDF no cliente |
| react-hook-form | Gerenciamento de formulários |
| Vitest + @testing-library | Testes unitários |
| Playwright | Testes end-to-end |

### Backend
| Tecnologia | Uso |
|---|---|
| Node.js + Express | Servidor HTTP e roteamento |
| TypeScript | Tipagem estática |
| Prisma ORM | Acesso e gerenciamento do banco de dados |
| PostgreSQL (Neon) | Banco de dados relacional em nuvem |
| jsonwebtoken | Geração e validação de tokens JWT |
| tsx | Execução e hot reload em desenvolvimento |

---

## Arquitetura

O projeto segue uma arquitetura cliente-servidor clássica, com frontend e backend completamente separados comunicando-se via API REST.

```
Frontend (React SPA — Vite, porta 5173)
├── src/pages/              → Login, Dashboard, Ocorrencias, DetalhesOcorrencia,
│                              NovaOcorrencia, AssinarTermo
├── src/components/         → Header, layout geral
├── src/services/api.ts     → Camada de comunicação com a API (fetch + Bearer token)
├── src/contexts/           → AuthContext: JWT, localStorage, estado de loading
├── src/utils/              → gerarPDF (jsPDF), gerarProtocolo (AR-YYYY/NNNN)
└── src/routes/             → PrivateRoute, definição de rotas

Backend (Express REST API — porta 3333)
├── POST   /auth/login               → Gera token JWT (aceita qualquer credencial)
├── GET    /ocorrencias              → Lista todas as ocorrências (requer auth)
├── GET    /ocorrencias/stats        → Estatísticas para o dashboard (requer auth)
├── GET    /ocorrencias/:protocolo   → Detalhes de uma ocorrência (requer auth)
├── POST   /ocorrencias              → Cria nova ocorrência (requer auth)
└── PATCH  /ocorrencias/:id/assinar  → Assina o termo e atualiza o status (requer auth)

Banco de dados
└── PostgreSQL na nuvem (Neon) — gerenciado pelo Prisma ORM
    └── Tabela: Ocorrencia (protocolo, status, policiais JSON, arma, vítimas, etc.)
```

O frontend nunca acessa o banco diretamente. Toda comunicação passa pelo backend, que valida o token JWT em cada rota protegida antes de consultar o banco.

---

## Como rodar localmente

### Pré-requisitos
- Node.js 18+
- Um banco PostgreSQL (local ou na nuvem — o projeto usa [Neon](https://neon.tech), gratuito)

### 1. Clone o repositório

```bash
git clone https://github.com/Pedroaruana/Corregedoria-PMBA.git
cd Corregedoria-PMBA
```

### 2. Configure o backend

```bash
cd server
npm install
```

Crie o arquivo `server/.env` baseado no `server/.env.example`:

```env
DATABASE_URL="postgresql://user:password@host/db?sslmode=require"
JWT_SECRET="sua_chave_secreta_aqui"
PORT=3333
```

Execute a migration e o seed com dados de exemplo:

```bash
npx prisma migrate dev
npm run db:seed
```

### 3. Configure o frontend

```bash
cd ..
npm install
```

Crie o arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:3333
```

### 4. Rode os dois servidores

```bash
# Terminal 1 — backend
cd server && npm run dev

# Terminal 2 — frontend
npm run dev
```

Acesse **http://localhost:5173** — qualquer matrícula e senha são aceitos para login.

---

## Variáveis de ambiente

O projeto usa dois arquivos `.env` (ambos ignorados pelo `.gitignore` e nunca commitados):

**`server/.env`** — backend:
```env
DATABASE_URL="postgresql://..."   # String de conexão PostgreSQL
JWT_SECRET="..."                  # Chave para assinar os tokens JWT
PORT=3333                         # Porta do servidor Express
```

**`.env`** — frontend:
```env
VITE_API_URL=http://localhost:3333  # URL base da API
```

---

## Testes

### Unitários (Vitest)

```bash
npm test
```

Cobertura atual:
- `gerarProtocolo` — formato correto, ano atual, range numérico, unicidade entre chamadas
- `api.login` — retorna token em sucesso, lança erro em falha (401)
- `api.getOcorrencias` — envia header Authorization com o token
- `api.assinarTermo` — faz encode correto do protocolo com barra na URL

### E2E (Playwright)

```bash
npx playwright test
```

Cobertura atual:
- Página de login renderiza corretamente (campos e botão visíveis)
- Login com qualquer credencial redireciona para o dashboard
- Campos vazios exibem mensagem de erro
- Acesso a rota protegida sem autenticação redireciona para o login
- Lista de ocorrências carrega e exibe os dados da API
- Campo de busca filtra ocorrências em tempo real
- Página de detalhes exibe as informações da ocorrência corretamente

As chamadas à API real são interceptadas nos testes E2E com `page.route()` do Playwright, usando mocks com dados fixos.

---

## Dificuldades encontradas

### Protocolo com barra na URL

O formato `AR-2026/0342` contém uma barra que o React Router interpreta como separador de rota, redirecionando incorretamente para o login. A solução foi aplicar `encodeURIComponent` ao navegar (`AR-2026%2F0342`) e `decodeURIComponent` no backend ao buscar a ocorrência no banco. A mesma lógica foi replicada nos testes E2E do Playwright.

### Sessão perdida no reload completo

O `PrivateRoute` redirecionava para o login antes mesmo do `useEffect` ter tempo de ler o token do `localStorage`, porque o estado inicial de `user` era `null`. A solução foi adicionar um estado `loading: true` no `AuthContext` que mantém o componente suspenso enquanto a sessão é restaurada — o redirect só acontece depois que o `loading` vira `false`.

### Playwright interceptando o frontend

O padrão de rota `/\/ocorrencias$/` nos testes E2E interceptava tanto as chamadas à API (porta 3333) quanto a navegação SPA (porta 5173), fazendo a página exibir JSON bruto em vez do HTML. Corrigido especificando a porta no padrão: `/localhost:3333\/ocorrencias$/`.

### Vitest executando arquivos do Playwright

O Vitest estava tentando rodar os arquivos `.spec.ts` da pasta `e2e/`, que usam a API do Playwright — incompatível com o ambiente jsdom. Corrigido adicionando `exclude: ['**/e2e/**']` na configuração de `test` do `vite.config.ts`.

### Endpoint `/stats` sendo tratado como ID

A rota `GET /ocorrencias/:id` no Express capturava a requisição para `/ocorrencias/stats` antes do handler correto, retornando 404 ("ocorrência 'stats' não encontrada"). Corrigido registrando a rota `/stats` antes da rota `/:id` no arquivo de rotas.

---

## Deploy

| Serviço | URL |
|---|---|
| Frontend (Vercel) | https://corregedoria-pmba.vercel.app |
| Backend API (Vercel) | https://corregedoria-pmba-api.vercel.app |
| Banco de dados | PostgreSQL — Neon (cloud) |

---

## Autor

**Pedro Aruana**
Desenvolvedor frontend júnior — Bahia, Brasil

- GitHub: [github.com/Pedroaruana](https://github.com/Pedroaruana)
- Email: aruanapedro@gmail.com

---

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

```


THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```
