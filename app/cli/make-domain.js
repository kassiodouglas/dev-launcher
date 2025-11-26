#!/usr/bin/env node

const { program } = require("commander");
const fs = require("fs/promises");
const path = require("path");
const {
  studly,
  kebab,
  log,
  validateDomainName,
  createFileFromStub,
} = require("./utils");

const baseAppPath = path.join(__dirname, "..", "src", "app", "Domains");
const defaultFolders = [
  "Actions",
  "Services",
  "Apis",
  "Pages",
  "Components",
  "Dtos",
  "Enums",
];

const createDir = async (dir) => {
  try {
    await fs.mkdir(dir, { recursive: true });
    log.create(`Diretório: ${path.relative(process.cwd(), dir)}`);
  } catch (err) {
    log.error(`Erro ao criar ${dir}: ${err.message}`);
  }
};

const createDomainStructure = async (name, options) => {
  if (!validateDomainName(name)) {
    process.exit(1);
  }

  const domainName = studly(name);
  const basePath = path.join(baseAppPath, domainName);

  log.info(`Criando estrutura do domínio ${domainName}...`);

  const folders = [
    ...new Set([...defaultFolders, ...(options.with || []).map(studly)]),
  ];

  for (const folder of folders) {
    await createDir(path.join(basePath, folder));
  }

  const routingPath = path.join(
    basePath,
    `${domainName.toLowerCase()}.routing.ts`
  );
  const stubPath = path.join(
    __dirname,
    "..",
    "src",
    "stubs",
    "domain",
    "Routing.stub"
  );

  createFileFromStub(stubPath, routingPath, {
    name: domainName,
    kebab: kebab(domainName),
  });

  if (options.withReadme) {
    const readmePath = path.join(basePath, "README.md");
    const readmeStubPath = path.join(
      __dirname,
      "..",
      "stubs",
      "domain",
      "Readme.stub"
    );
    createFileFromStub(readmeStubPath, readmePath, {
      name: domainName,
      kebab: kebab(domainName),
    });
  }

  log.success(`Domínio ${domainName} criado com sucesso!`);
};

program
  .name("make:domain")
  .description(
    "Gera a estrutura completa de pastas e arquivos para um domínio Angular"
  )
  .argument("<name>", "Nome do domínio (ex: Cards, Users, Products)")
  .option(
    "--with <folders...>",
    "Pastas adicionais a serem criadas (ex: --with Modals Panels)"
  )
  .option("--with-readme", "Cria arquivo README.md no domínio", false)
  .action(createDomainStructure);

program.parse(process.argv);
