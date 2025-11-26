#!/usr/bin/env node

const { program } = require('commander');
const path = require('path');
const { studly, kebab, log, createFileFromStub, validateDomainName } = require('./utils');

const PATH_STRATEGIES = {
  shared: (type, subDirs) => path.join('src', 'app', 'Shared', `${type}s`, subDirs),
  layout: (type, subDirs) => path.join('src', 'app', 'Layout', `${type}s`, subDirs),
  domain: (domain, type, subDirs, fileBase) => {
    const basePath = path.join('src', 'app', 'domains', domain, `${type}s`, subDirs);
    return ['Modal', 'Page', 'Panel'].includes(type)
      ? path.join(basePath, fileBase)
      : basePath;
  },
};

const resolveBasePath = (domain, type, subDirs, fileBase) => {
  const domainLower = domain.toLowerCase();

  if (domainLower === 'shared') {
    return PATH_STRATEGIES.shared(type, subDirs);
  }

  if (domainLower === 'layout') {
    return PATH_STRATEGIES.layout(type, subDirs);
  }

  return PATH_STRATEGIES.domain(domain, type, subDirs, fileBase);
};

const createDomainFile = (domainArg, typeArg, nameArg) => {
  if (!validateDomainName(domainArg)) {
    process.exit(1);
  }

  const domain = studly(domainArg);
  const type = studly(typeArg);
  const nameParts = nameArg.split(/[\/\\]/);
  const fileName = nameParts.pop();
  const subDirs = nameParts.map(kebab).join(path.sep);
  const name = studly(fileName);
  const fileBase = kebab(fileName);

  const basePath = resolveBasePath(domain, type, subDirs, fileBase);
  const stubsBasePath = path.join(__dirname, '..', 'src', 'stubs', 'domain');

  const fileTsPath = path.join(basePath, `${fileBase}.${type.toLowerCase()}.ts`);
  const stubTsPath = path.join(stubsBasePath, `${type}.stub`);

  log.info(`Criando arquivo ${type} para o domínio ${domain}...`);

  const tsCreated = createFileFromStub(stubTsPath, fileTsPath, {
    name,
    domain,
    kebab: fileBase,
  });

  if (!tsCreated && !require('fs').existsSync(fileTsPath)) {
    process.exit(1);
  }

  if (['page', 'modal', 'panel'].includes(type.toLowerCase())) {
    const fileHtmlPath = path.join(basePath, `${fileBase}.${type.toLowerCase()}.html`);
    const stubHtmlPath = path.join(stubsBasePath, `${type}.html.stub`);

    createFileFromStub(stubHtmlPath, fileHtmlPath, {
      name,
      domain,
      kebab: fileBase,
    });
  }

  log.success(`Arquivo ${type} criado com sucesso!`);
};

program
  .name('make:domain:file')
  .description('Cria um arquivo específico dentro de um domínio Angular')
  .argument('<domain>', 'Nome do domínio (ex: Cards, Shared, Layout)')
  .argument('<type>', 'Tipo do arquivo (ex: Page, Component, Service, Api, Action, Modal, Panel)')
  .argument('<name>', 'Nome do arquivo com caminho opcional (ex: create ou users/create)')
  .action(createDomainFile);

program.parse(process.argv);
