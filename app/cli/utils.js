const fs = require('fs');
const path = require('path');

const studly = (str) =>
  str
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\s+/g, '');

const kebab = (str) =>
  str
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

const log = {
  error: (msg) => console.error(`${colors.red}❌ ${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  warning: (msg) => console.warn(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  create: (msg) => console.log(`${colors.cyan}📝 ${msg}${colors.reset}`),
  build: (msg) => console.log(`${colors.magenta}🚀 ${msg}${colors.reset}`),
  colors,
};

const validateStubExists = (stubPath) => {
  if (!fs.existsSync(stubPath)) {
    log.error(`Stub não encontrado: ${stubPath}`);
    return false;
  }
  return true;
};

const createDirIfNotExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    log.create(`Diretório criado: ${dirPath}`);
    return true;
  }
  return false;
};

const createFileFromStub = (stubPath, outputPath, replacements = {}) => {
  if (!validateStubExists(stubPath)) {
    return false;
  }

  if (fs.existsSync(outputPath)) {
    log.warning(`Arquivo já existe: ${outputPath}`);
    return false;
  }

  let content = fs.readFileSync(stubPath, 'utf-8');
  
  Object.entries(replacements).forEach(([key, value]) => {
    const regex = new RegExp(`{{ ${key} }}`, 'g');
    content = content.replace(regex, value);
  });

  const dir = path.dirname(outputPath);
  createDirIfNotExists(dir);

  fs.writeFileSync(outputPath, content);
  log.success(`Arquivo criado: ${outputPath}`);
  return true;
};

const getStubsList = () => {
  const stubsPath = path.join(__dirname, '..', 'stubs', 'domain');
  if (!fs.existsSync(stubsPath)) {
    return [];
  }
  
  return fs.readdirSync(stubsPath)
    .filter(file => file.endsWith('.stub'))
    .map(file => file.replace('.stub', ''));
};

const validateDomainName = (name) => {
  if (!name || name.trim() === '') {
    log.error('Nome do domínio não pode ser vazio');
    return false;
  }
  
  if (!/^[a-zA-Z0-9_-]+$/.test(name)) {
    log.error('Nome do domínio deve conter apenas letras, números, hífens e underscores');
    return false;
  }
  
  return true;
};

module.exports = {
  studly,
  kebab,
  log,
  validateStubExists,
  createDirIfNotExists,
  createFileFromStub,
  getStubsList,
  validateDomainName,
};
