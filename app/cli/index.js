#!/usr/bin/env node

const { program } = require('commander');
const { log } = require('./utils');

const displayHelp = () => {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║           CLI Litwo Boilerplate - Comandos Disponíveis       ║
╚═══════════════════════════════════════════════════════════════╝

📦 DOMÍNIOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ${log.colors.green}npm run make:domain <nome>${log.colors.reset}
  Cria estrutura completa de um domínio

  Exemplos:
    npm run make:domain Users
    npm run make:domain Cards --with Modals Panels
    npm run make:domain Products --with-readme

  Opções:
    --with <folders...>    Pastas adicionais
    --with-readme          Cria README.md

  Alias: ${log.colors.cyan}npm run md <nome>${log.colors.reset}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ${log.colors.green}npm run make:domain:file <dominio> <tipo> <nome>${log.colors.reset}
  Cria arquivo específico dentro de um domínio

  Exemplos:
    npm run make:domain:file Cards Page list
    npm run make:domain:file Users Component user-card
    npm run make:domain:file Shared Service auth
    npm run make:domain:file Cards Page users/create

  Tipos disponíveis:
    Page, Modal, Panel, Component, Service, Api, Action, 
    Dto, Enum, Interface, Form, Layout

  Alias: ${log.colors.cyan}npm run mdf <dominio> <tipo> <nome>${log.colors.reset}

🚀 BUILD E DEPLOY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ${log.colors.green}npm run build:deploy${log.colors.reset}
  Incrementa versão e faz build completo (test + prod)

  Exemplos:
    npm run build:deploy
    npm run build:deploy -- --version 2.0.0
    npm run build:deploy -- --target prod
    npm run build:deploy -- --dry-run

  Opções:
    -v, --version <version>   Define nova versão (ex: 2.0.0)
    -t, --target <target>     Target: test, prod ou all (padrão: all)
    -d, --dry-run             Preview sem executar
    --skip-tls-check          Ignora verificação TLS

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ${log.colors.green}npm run build:test${log.colors.reset}
  Build para ambiente de teste

  ${log.colors.green}npm run build:prod${log.colors.reset}
  Build para ambiente de produção

  ${log.colors.green}npm run build:all${log.colors.reset}
  Build para test e prod

🔧 DESENVOLVIMENTO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ${log.colors.green}npm run serve${log.colors.reset}
  Inicia servidor de desenvolvimento (porta 8000)

📚 AJUDA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ${log.colors.green}npm run cli${log.colors.reset}
  Exibe este menu de ajuda

  Para mais detalhes sobre um comando específico:
    node cli/make-domain.js --help
    node cli/make-domain-file.js --help
    node cli/build-versioned.js --help

`);
};

program
  .name('cli')
  .description('Menu principal dos comandos CLI do Litwo Boilerplate')
  .action(displayHelp);

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  displayHelp();
}
