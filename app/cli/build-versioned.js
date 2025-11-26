#!/usr/bin/env node

const { program } = require('commander');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { log } = require('./utils');

const versionFilePath = path.resolve(__dirname, '../../version.json');
const publicVersionFile = path.resolve(__dirname, '../public/version.json');

const initializeVersion = () => {
  if (!fs.existsSync(versionFilePath)) {
    fs.writeFileSync(versionFilePath, JSON.stringify({ version: "1.0.0.000" }, null, 2));
    log.create('Arquivo version.json inicializado com 1.0.0.000');
  }
};

const readCurrentVersion = () => {
  try {
    const versionRaw = fs.readFileSync(versionFilePath, 'utf-8');
    const version = JSON.parse(versionRaw).version;
    
    if (!/^\d+\.\d+\.\d+\.\d+$/.test(version)) {
      log.error(`Versão inválida encontrada: ${version}`);
      process.exit(1);
    }
    
    return version.split('.').map(Number);
  } catch (e) {
    log.error('Não foi possível ler version.json');
    process.exit(1);
  }
};

const validateVersionInput = (base, current) => {
  if (!/^\d+\.\d+\.\d+$/.test(base)) {
    log.error('Formato inválido. Use: --version 1.2.3');
    return false;
  }

  const [newMajor, newMinor, newPatch] = base.split('.').map(Number);
  const [major, minor, patch] = current;

  const currentNumeric = major * 10000 + minor * 100 + patch;
  const inputNumeric = newMajor * 10000 + newMinor * 100 + newPatch;

  if (inputNumeric < currentNumeric) {
    log.error(`A nova versão (${base}) não pode ser menor que a atual (${major}.${minor}.${patch})`);
    return false;
  }

  return true;
};

const calculateNewVersion = (current, versionInput) => {
  let [major, minor, patch, build] = current;

  if (versionInput) {
    if (!validateVersionInput(versionInput, current)) {
      process.exit(1);
    }
    [major, minor, patch] = versionInput.split('.').map(Number);
    build = 0;
  }

  const nextBuild = String(build + 1).padStart(3, '0');
  return `${major}.${minor}.${patch}.${nextBuild}`;
};

const updateVersionFiles = (newVersion) => {
  fs.writeFileSync(versionFilePath, JSON.stringify({ version: newVersion }, null, 2));
  log.success(`version.json atualizado para: ${newVersion}`);

  fs.writeFileSync(publicVersionFile, JSON.stringify({ version: newVersion }, null, 2));
  log.info('Versão copiada para: public/version.json');
};

const executeBuild = (target, skipTlsCheck) => {
  const buildCommands = {
    test: 'npm run build:test',
    prod: 'npm run build:prod',
    all: 'npm run build:all',
  };

  const command = buildCommands[target];
  
  if (!command) {
    log.error(`Target inválido: ${target}. Use: test, prod ou all`);
    process.exit(1);
  }

  try {
    log.build(`Executando build: ${target}...`);
    const env = skipTlsCheck 
      ? { ...process.env, NODE_TLS_REJECT_UNAUTHORIZED: '0' }
      : process.env;
    
    execSync(command, { stdio: 'inherit', env });
    log.success('Build concluído com sucesso!');
  } catch (err) {
    log.error('Erro ao executar o build');
    process.exit(1);
  }
};

const buildVersioned = (options) => {
  initializeVersion();
  
  const currentVersion = readCurrentVersion();
  const newVersion = calculateNewVersion(currentVersion, options.version);

  if (options.dryRun) {
    log.info(`[DRY RUN] Nova versão seria: ${newVersion}`);
    log.info(`[DRY RUN] Target de build: ${options.target}`);
    return;
  }

  updateVersionFiles(newVersion);
  executeBuild(options.target, options.skipTlsCheck);
};

program
  .name('build-versioned')
  .description('Incrementa a versão do projeto e executa o build Angular')
  .option('-v, --version <version>', 'Define uma nova versão base (ex: 1.2.3)')
  .option('-t, --target <target>', 'Target do build: test, prod ou all', 'all')
  .option('-d, --dry-run', 'Mostra preview sem executar', false)
  .option('--skip-tls-check', 'Ignora verificação TLS (não recomendado)', false)
  .action(buildVersioned);

program.parse(process.argv);

