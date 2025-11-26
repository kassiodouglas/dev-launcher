const { app, BrowserWindow, ipcMain, shell, dialog, Menu } = require("electron");
const path = require("path");
const { spawn, exec, execSync } = require("child_process");
const Store = require("electron-store");

const store = new Store();

// --- LÓGICA DE CRIAÇÃO DO BANCO (MIGRATION) ---
// Inicializa o banco de dados vazio se não existir
// Não cria projetos padrão - o usuário deve criar através do wizard
if (!store.get("projects")) {
  console.log("Banco de dados vazio. Inicializando...");
  store.set("projects", []);
}

// --- NOVOS HANDLERS IPC (CRUD) ---

// 1. Ler Projetos
ipcMain.handle("db-get-projects", () => {
  return store.get("projects") || [];
});

// 2. Adicionar Projeto
ipcMain.handle("db-add-project", (event, newProject) => {
  const projects = store.get("projects") || [];
  // Gera um ID simples baseado no timestamp
  newProject.id = Date.now();
  projects.push(newProject);
  store.set("projects", projects);
  return { success: true, projects };
});

// 3. Remover Projeto
ipcMain.handle("db-delete-project", (event, projectId) => {
  let projects = store.get("projects") || [];
  projects = projects.filter((p) => p.id !== projectId);
  store.set("projects", projects);
  return { success: true, projects };
});

// 4. Editar Projeto
ipcMain.handle("db-update-project", (event, updatedProject) => {
  let projects = store.get("projects") || [];
  const index = projects.findIndex((p) => p.id === updatedProject.id);
  if (index !== -1) {
    projects[index] = updatedProject;
    store.set("projects", projects);
    return { success: true };
  }
  return { success: false, message: "Projeto não encontrado" };
});

let mainWindow;
// Armazena os processos ativos: { 'Nome do Projeto': [ProcessoChild1, ProcessoChild2] }
const activeProcesses = {};

function createWindow() {
  Menu.setApplicationMenu(null);

  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    minWidth: 800,  
    minHeight: 600, 
    maximizable: true,
    title: 'Launcher',
    icon: path.join(__dirname, "build", "logo.png"),
    autoHideMenuBar: true, 
    webPreferences: {
      preload: path.join(__dirname, "renderer.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.maximize();

  mainWindow.loadFile("resources/app/index.html");
}

app.whenReady().then(createWindow);

// --- FUNÇÕES AUXILIARES ---

// Função para matar processos no Windows (mata a árvore de processos)
const killProcess = (pid) => {
  try {
    // /T = Termina a árvore de processos (filhos)
    // /F = Força o encerramento
    execSync(`taskkill /pid ${pid} /T /F`);
    console.log(`Processo ${pid} encerrado.`);
  } catch (e) {
    console.error(`Erro ao matar processo ${pid}:`, e);
  }
};

// Nova função para limpar TUDO
const killAllProcesses = () => {
  console.log("Limpando todos os processos abertos...");

  Object.keys(activeProcesses).forEach((projectName) => {
    const processes = activeProcesses[projectName];

    if (processes && processes.length > 0) {
      processes.forEach((child) => {
        try {
          // Remove todos os ouvintes para evitar que o evento 'close' dispare
          // enquanto estamos matando o processo durante o shutdown
          child.removeAllListeners();

          // Verifica se o processo ainda tem um PID válido antes de matar
          if (child && child.pid && !child.killed) {
            killProcess(child.pid);
          }
        } catch (err) {
          console.error(
            `Erro ao limpar processo do projeto ${projectName}:`,
            err
          );
        }
      });
    }
  });

  // Zera a lista
  for (const key in activeProcesses) delete activeProcesses[key];
};

// --- EVENTOS DE CICLO DE VIDA DO APP ---

app.on("before-quit", () => {
  // Este evento dispara quando o usuário clica no X ou dá Cmd+Q/Alt+F4
  console.log("kill all");
  killAllProcesses();
});

// Seus outros eventos...
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// --- IPC HANDLERS ---

// Função para verificar se uma porta está em uso
const isPortInUse = (port) => {
  try {
    const result = execSync(`netstat -ano | findstr :${port}`, {
      encoding: "utf8",
    });
    return result.trim().length > 0;
  } catch (e) {
    return false;
  }
};

// Função para matar processo usando uma porta
const killProcessByPort = (port) => {
  try {
    // Encontra o PID do processo usando a porta
    const result = execSync(`netstat -ano | findstr :${port}`, {
      encoding: "utf8",
    });
    const lines = result.split("\n").filter((line) => line.trim());

    if (lines.length > 0) {
      // Pega o PID da primeira linha (última coluna)
      const pid = lines[0].trim().split(/\s+/).pop();
      if (pid) {
        killProcess(parseInt(pid));
        return true;
      }
    }
    return false;
  } catch (e) {
    return false;
  }
};

ipcMain.handle("start-project", async (event, project) => {
  const { name, commands, port } = project;

  // Se já existe, não inicia de novo (ou poderia matar o anterior antes)
  if (activeProcesses[name] && activeProcesses[name].length > 0) {
    return { success: false, error: "Projeto já está rodando. Pare-o antes." };
  }

  // Verifica se a porta está em uso
  if (port) {
    if (isPortInUse(port)) {
      // Tenta matar o processo que está usando a porta
      const killed = killProcessByPort(port);
      if (!killed) {
        return {
          success: false,
          error: `Porta ${port} está em uso e não foi possível liberá-la.`,
        };
      }
      // Aguarda um pouco para a porta ser liberada
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  activeProcesses[name] = [];

  try {
    commands.forEach((cmdConfig) => {
      // spawn permite capturar logs em tempo real
      // shell: true é importante para comandos como npm, php, etc no Windows
      const child = spawn(cmdConfig.command, {
        cwd: cmdConfig.cwd,
        shell: true,
      });

      // Salva referência para poder matar depois
      activeProcesses[name].push(child);

      // 1. Captura LOGS de Sucesso/Info
      child.stdout.on("data", (data) => {
        // Envia o log para a janela do Angular
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.webContents.send("project-log", {
            projectName: name,
            log: data.toString(),
          });
        }
      });

      // 2. Captura LOGS de Erro
      child.stderr.on("data", (data) => {
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.webContents.send("project-log", {
            projectName: name,
            log: data.toString(),
            isError: true,
          });
        }
      });

      child.on("close", (code) => {
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.webContents.send("project-log", {
            projectName: name,
            log: `Processo finalizado com código ${code}`,
            isSystem: true,
          });
        }
      });
    });

    // Não abre VS Code automaticamente - usuário deve clicar no botão

    return { success: true, message: `Iniciado ${name}` };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle("stop-project", async (event, projectName) => {
  const processes = activeProcesses[projectName];

  if (!processes || processes.length === 0) {
    return { success: false, message: "Nenhum processo encontrado." };
  }

  processes.forEach((child) => {
    // Mata o processo e seus filhos (necessário no Windows)
    killProcess(child.pid);
  });

  // Limpa a lista
  activeProcesses[projectName] = [];

  return { success: true, message: "Projeto parado com sucesso." };
});

ipcMain.handle("open-browser", async (event, url) => {
  await shell.openExternal(url);
});

// Handler para seleção de pasta
ipcMain.handle("select-folder", async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ["openDirectory"],
    title: "Selecione a pasta do projeto",
  });

  if (!result.canceled && result.filePaths.length > 0) {
    return { success: true, path: result.filePaths[0] };
  }

  return { success: false };
});

// Handler para abrir VS Code
ipcMain.handle("open-vscode", async (event, path) => {
  try {
    exec(`code "${path}"`);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Handler para obter branches do Git
ipcMain.handle("get-git-branches", async (event, projectPath) => {
  try {
    const branchesOutput = execSync(`cd "${projectPath}" && git branch -a`, {
      encoding: "utf8",
    });
    const currentBranchOutput = execSync(
      `cd "${projectPath}" && git branch --show-current`,
      { encoding: "utf8" }
    );

    const branches = branchesOutput
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("*"))
      .map((line) =>
        line.replace(/^remotes\/origin\//, "").replace(/^remotes\//, "")
      )
      .filter((value, index, self) => self.indexOf(value) === index)
      .filter((line) => line);

    return {
      success: true,
      branches,
      current: currentBranchOutput.trim(),
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Handler para fazer checkout de branch
ipcMain.handle("checkout-branch", async (event, projectPath, branch) => {
  try {
    execSync(`cd "${projectPath}" && git checkout ${branch}`, {
      encoding: "utf8",
    });
    return {
      success: true,
      message: `Branch ${branch} selecionada com sucesso`,
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Handler para fazer pull de branch
ipcMain.handle("pull-branch", async (event, projectPath, branch) => {
  try {
    const output = execSync(
      `cd "${projectPath}" && git pull origin ${branch}`,
      { encoding: "utf8" }
    );
    return { success: true, message: output };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Handler para verificar quais projetos estão rodando
ipcMain.handle("get-running-projects", () => {
  const running = [];
  Object.keys(activeProcesses).forEach((projectName) => {
    const processes = activeProcesses[projectName];
    if (processes && processes.length > 0) {
      // Verifica se os processos ainda estão vivos
      const aliveProcesses = processes.filter((p) => p && p.pid && !p.killed);
      if (aliveProcesses.length > 0) {
        running.push(projectName);
      } else {
        // Remove processos mortos
        activeProcesses[projectName] = [];
      }
    }
  });
  return running;
});
