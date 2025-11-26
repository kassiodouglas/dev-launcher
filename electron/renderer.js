const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  startProject: (config) => ipcRenderer.invoke('start-project', config),
  stopProject: (projectName) => ipcRenderer.invoke('stop-project', projectName),
  openBrowser: (url) => ipcRenderer.invoke('open-browser', url),
  
  // Listener: O Angular vai se "inscrever" aqui para receber mensagens
  onProjectLog: (callback) => ipcRenderer.on('project-log', (event, data) => callback(data)),

  // Comandos de Banco de Dados
  getProjects: () => ipcRenderer.invoke('db-get-projects'),
  addProject: (project) => ipcRenderer.invoke('db-add-project', project),
  deleteProject: (id) => ipcRenderer.invoke('db-delete-project', id),
  updateProject: (project) => ipcRenderer.invoke('db-update-project', project),
  
  // Seleção de pasta
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  
  // VS Code
  openVSCode: (path) => ipcRenderer.invoke('open-vscode', path),
  
  // Git
  getGitBranches: (path) => ipcRenderer.invoke('get-git-branches', path),
  checkoutBranch: (path, branch) => ipcRenderer.invoke('checkout-branch', path, branch),
  pullBranch: (path, branch) => ipcRenderer.invoke('pull-branch', path, branch),
  
  // Status
  getRunningProjects: () => ipcRenderer.invoke('get-running-projects')
});