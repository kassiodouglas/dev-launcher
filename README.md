# Launcher

Este projeto é uma aplicação desktop desenvolvida com **Electron** e **Angular**. Ele consiste em um front-end Angular (`app`) encapsulado por um wrapper Electron (`electron`).

## Estrutura do Projeto

- `app/`: Código fonte da aplicação Angular.
- `electron/`: Configuração e scripts do Electron para rodar a aplicação desktop.
- `releases/`: Diretório para armazenamento de versões/builds.

## Pré-requisitos

Certifique-se de ter o Node.js instalado (recomenda-se a versão 20, conforme scripts do projeto).

## Instalação

É necessário instalar as dependências em ambos os diretórios principais:

```bash
# 1. Instalar dependências do Angular
cd app
npm install

# 2. Instalar dependências do Electron
cd ../electron
npm install
```

## Comandos de Utilização

### Desenvolvimento

**Rodar apenas o Front-end (Angular):**
Para desenvolvimento web rápido sem o contexto do Electron.

```bash
cd app
npm run serve
```
A aplicação ficará disponível em `http://localhost:8000`.

**Rodar o App no Electron (Dev):**
Este comando compila o Angular e inicia a janela do Electron.

```bash
cd electron
npm run dev
```

### Build e Produção

**Gerar Executável (Dist):**
Para criar o instalador/executável final da aplicação.

```bash
cd electron
npm run build
```
O processo realiza os seguintes passos:
1. Build de produção do Angular (`npm run build:prod` no diretório `app`).
2. Cópia dos arquivos compilados para `electron/resources/app`.
3. Empacotamento com `electron-builder`.

### Ferramentas CLI (App)

O projeto Angular possui scripts customizados para geração de código (scaffolding):

- **Criar Domínio:**
  ```bash
  cd app
  npm run md
  # ou
  npm run make:domain
  ```

- **Criar Arquivo de Domínio:**
  ```bash
  cd app
  npm run mdf
  # ou
  npm run make:domain:file
  ```

## Tecnologias Principais

- **Angular 20**: Framework para o front-end.
- **Tailwind CSS**: Framework de estilização utilitária.
- **Electron**: Framework para criação da aplicação desktop.
- **Electron Builder**: Ferramenta para empacotamento e distribuição.
