# 📦 CLI Litwo Boilerplate

Sistema de linha de comando para facilitar o desenvolvimento do projeto Angular.

## 🚀 Comandos Disponíveis

### Menu de Ajuda

```bash
npm run cli
```

Exibe o menu completo com todos os comandos disponíveis.

---

## 📦 Gerenciamento de Domínios

### Criar Domínio Completo

```bash
npm run make:domain <nome>
# ou usar o alias
npm run md <nome>
```

**Exemplos:**
```bash
npm run md Users
npm run md Cards --with Modals Panels
npm run md Products --with-readme
```

**Opções:**
- `--with <folders...>` - Adiciona pastas customizadas além das padrões
- `--with-readme` - Cria um arquivo README.md no domínio

**Pastas criadas por padrão:**
- Actions
- Services
- Apis
- Pages
- Components
- Dtos
- Enums

---

### Criar Arquivo em Domínio

```bash
npm run make:domain:file <dominio> <tipo> <nome>
# ou usar o alias
npm run mdf <dominio> <tipo> <nome>
```

**Exemplos:**
```bash
npm run mdf Cards Page list
npm run mdf Users Component user-card
npm run mdf Shared Service auth
npm run mdf Cards Page users/create  # cria em subpasta
```

**Tipos disponíveis:**
- `Page` - Página completa (cria .ts e .html)
- `Modal` - Modal dialog (cria .ts e .html)
- `Panel` - Painel lateral (cria .ts e .html)
- `Component` - Componente reutilizável
- `Service` - Serviço Angular
- `Api` - Cliente de API
- `Action` - Action/Command pattern
- `Dto` - Data Transfer Object
- `Enum` - Enumeração
- `Interface` - Interface TypeScript
- `Form` - Formulário
- `Layout` - Layout component

**Domínios especiais:**
- `Shared` - Cria em `src/app/Shared/`
- `Layout` - Cria em `src/app/Layout/`
- Qualquer outro - Cria em `src/app/domains/<Dominio>/`

---

## 🏗️ Build e Deploy

### Build com Versionamento

```bash
npm run build:deploy [opções]
```

Incrementa automaticamente a versão do projeto e executa o build.

**Exemplos:**
```bash
# Build completo (test + prod) - incrementa build number
npm run build:deploy

# Define nova versão base e faz build
npm run build:deploy -- --version 2.0.0

# Build apenas para produção
npm run build:deploy -- --target prod

# Preview sem executar (útil para testar)
npm run build:deploy -- --dry-run

# Build com target específico
npm run build:deploy -- --target test
```

**Opções:**
- `-v, --version <version>` - Define nova versão base (ex: 2.0.0)
- `-t, --target <target>` - Target do build: `test`, `prod` ou `all` (padrão: `all`)
- `-d, --dry-run` - Mostra preview da nova versão sem executar
- `--skip-tls-check` - Ignora verificação TLS (não recomendado)

**Sistema de Versionamento:**
- Formato: `MAJOR.MINOR.PATCH.BUILD`
- Exemplo: `1.2.3.042`
- Build number incrementa automaticamente a cada deploy
- Versão base pode ser definida manualmente com `--version`
- Não permite versões menores que a atual

---

### Builds Individuais

```bash
# Build apenas teste
npm run build:test

# Build apenas produção
npm run build:prod

# Build ambos (sem versionamento)
npm run build:all
```

---

## 🔧 Desenvolvimento

```bash
npm run serve
```

Inicia o servidor de desenvolvimento na porta 8000.

---

## 📁 Estrutura dos Arquivos CLI

```
cli/
├── index.js              # Menu principal de ajuda
├── utils.js              # Funções utilitárias compartilhadas
├── make-domain.js        # Cria estrutura de domínio
├── make-domain-file.js   # Cria arquivo em domínio
├── build-versioned.js    # Build com versionamento
└── README.md             # Esta documentação
```

---

## 🛠️ Detalhes Técnicos

### Utilitários Disponíveis (utils.js)

```javascript
const { 
  studly,              // Converte para StudlyCase
  kebab,               // Converte para kebab-case
  log,                 // Logger colorido
  validateStubExists,  // Valida existência de stubs
  createDirIfNotExists,// Cria diretório se necessário
  createFileFromStub,  // Cria arquivo a partir de stub
  getStubsList,        // Lista stubs disponíveis
  validateDomainName   // Valida nome de domínio
} = require('./utils');
```

### Logs Coloridos

O sistema usa logs coloridos para melhor visualização:
- 🚀 **Build** - Operações de build (magenta)
- ✅ **Success** - Sucesso (verde)
- ❌ **Error** - Erros (vermelho)
- ⚠️ **Warning** - Avisos (amarelo)
- ℹ️ **Info** - Informações (azul)
- 📝 **Create** - Criação de arquivos (cyan)

---

## 📝 Exemplos de Uso

### Cenário 1: Criar novo módulo de usuários

```bash
# 1. Criar estrutura do domínio
npm run md Users --with-readme

# 2. Criar página de listagem
npm run mdf Users Page list

# 3. Criar serviço
npm run mdf Users Service users

# 4. Criar API client
npm run mdf Users Api users

# 5. Criar componente de card
npm run mdf Users Component user-card
```

### Cenário 2: Deploy para produção

```bash
# 1. Preview da versão
npm run build:deploy -- --dry-run

# 2. Build apenas produção
npm run build:deploy -- --target prod

# 3. Nova versão major
npm run build:deploy -- --version 2.0.0
```

### Cenário 3: Organização em subpastas

```bash
# Criar página em subpasta admin/
npm run mdf Users Page admin/list
npm run mdf Users Page admin/create
npm run mdf Users Page admin/edit
```

---

## 🔍 Troubleshooting

### Comando não encontrado
Certifique-se de estar no diretório `app/`:
```bash
cd app
npm run cli
```

### Stub não encontrado
Verifique se o tipo do arquivo existe em `stubs/domain/`:
```bash
ls stubs/domain/
```

### Erro de versão inválida
O formato deve ser `X.Y.Z`:
```bash
npm run build:deploy -- --version 1.2.3  # ✅ correto
npm run build:deploy -- --version v1.2.3 # ❌ errado
```

---

## 📚 Mais Informações

Para detalhes sobre um comando específico, use `--help`:

```bash
node cli/make-domain.js --help
node cli/make-domain-file.js --help
node cli/build-versioned.js --help
```

---

## ✨ Melhorias Implementadas

- ✅ Código refatorado e organizado
- ✅ Uso consistente de `commander` em todos os comandos
- ✅ Funções utilitárias compartilhadas
- ✅ Logs coloridos e informativos
- ✅ Validações robustas
- ✅ Sistema de versionamento melhorado
- ✅ Dry-run para testes seguros
- ✅ Documentação inline e help integrado
- ✅ Tratamento de erros adequado
