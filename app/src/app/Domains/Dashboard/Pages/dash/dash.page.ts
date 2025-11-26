import { Component, NgZone, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { iProject } from '@src/app/Core/Interfaces/project.interface';
import { iLogMessage } from '@src/app/Core/Interfaces/log-message.interface';
import { AnsiToHtmlPipe } from '@src/app/Shared/Pipes/ansi-to-html.pipe';
import '@src/app/Core/Types/electron-api.types';

@Component({
  selector: 'page-dash',
  imports: [CommonModule, AnsiToHtmlPipe],
  templateUrl: './dash.page.html',
  styleUrl: './dah.page.scss'
})
export class DashPage implements AfterViewInit {

  viewMode: 'grid' | 'list' = (localStorage.getItem('viewMode') as 'grid' | 'list') || 'grid';

  // Variável para armazenar os logs por projeto
  // Ex: { 'Manager': [{text: '...', type: 'info'}] }
  projectLogs: { [key: string]: iLogMessage[] } = {};

  // Para saber qual projeto está rodando
  runningProjects: string[] = [];

  // Para saber qual aba de logs mostrar na tela
  selectedLogTab: string = '';

  // Tradução do seu array $apps e do switch case do PowerShell
  projects: iProject[] = [];

  constructor(private ngZone: NgZone) { }

  ngOnInit() {
    this.loadProjects();

    // Escuta os logs vindos do Electron
    window.electronAPI.onProjectLog((data: any) => {
      // O Electron roda fora da zona do Angular, precisamos forçar a atualização da UI
      this.ngZone.run(() => {
        this.addLog(data.projectName, data.log, data.isError ? 'error' : 'info');
      });
    });
  }

  // Verifica status quando a página é ativada (ao voltar para o dashboard)
  ngAfterViewInit() {
    // Verifica o status dos projetos periodicamente
    setInterval(() => {
      this.checkRunningProjects();
    }, 3000); // Verifica a cada 3 segundos
  }

  async loadProjects() {
    this.projects = await window.electronAPI.getProjects();
    // Verifica quais projetos estão rodando
    await this.checkRunningProjects();
  }

  async checkRunningProjects() {
    const running = await window.electronAPI.getRunningProjects();
    this.runningProjects = running;
  }

  // Exemplo de como deletar (conecte a um botão de lixeira no HTML)
  async deleteProject(project: iProject) {
    if (confirm(`Deseja remover ${project.name}?`)) {
      await window.electronAPI.deleteProject(project.id!);
      this.loadProjects(); // Recarrega a lista
    }
  }

  addLog(projectName: string, text: string, type: 'info' | 'error' | 'system') {
    if (!this.projectLogs[projectName]) {
      this.projectLogs[projectName] = [];
    }

    const timestamp = new Date().toLocaleTimeString();
    // Adiciona log
    this.projectLogs[projectName].push({ timestamp, text, type });

    // Opcional: Limitar tamanho do log para não travar a tela (ex: últimos 500)
    if (this.projectLogs[projectName].length > 500) {
      this.projectLogs[projectName].shift();
    }

    if (this.selectedLogTab === projectName) {
      setTimeout(() => {
        const terminalDiv = document.querySelector('.scrollbar-thin'); // Use ViewChild preferencialmente
        if (terminalDiv) {
          terminalDiv.scrollTop = terminalDiv.scrollHeight;
        }
      }, 50);
    }
  }

  async launchProject(project: iProject) {
    if (this.runningProjects.includes(project.name)) return;

    this.selectedLogTab = project.name; // Foca na aba de logs deste projeto
    this.addLog(project.name, 'Iniciando ambiente...', 'system');

    const result = await window.electronAPI.startProject(project);

    if (result.success) {
      this.runningProjects.push(project.name);
      this.addLog(project.name, 'Projeto iniciado com sucesso!', 'system');
    } else {
      this.addLog(project.name, `Erro ao iniciar: ${result.error}`, 'error');
    }
  }

  async stopProject(project: iProject) {
    this.addLog(project.name, 'Parando serviços...', 'system');

    const result = await window.electronAPI.stopProject(project.name);

    if (result.success) {
      this.runningProjects = this.runningProjects.filter(p => p !== project.name);
      this.addLog(project.name, 'Projeto parado.', 'system');
    }
  }

  async restartProject(project: iProject) {
    await this.stopProject(project);
    // Pequeno delay para garantir que o Windows liberou as portas
    setTimeout(() => {
      this.launchProject(project);
    }, 2000);
  }

  // Helper para o HTML saber se está rodando
  isRunning(project: iProject): boolean {
    return this.runningProjects.includes(project.name);
  }

  toggleViewMode() {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
    localStorage.setItem('viewMode', this.viewMode);
  }

  openVSCode(project: iProject) {
    if (project.vsCodePaths && project.vsCodePaths.length > 0) {
      window.electronAPI.openVSCode(project.vsCodePaths[0]);
    } else if (project.path) {
      window.electronAPI.openVSCode(project.path);
    }
  }

  openBrowser(project: iProject) {
    if (project.baseUrl || project.browserUrl) {
      const url = project.baseUrl || project.browserUrl!;
      const finalUrl = project.port && !url.includes(':')
        ? `${url.replace(/\/$/, '')}:${project.port}`
        : url;
      window.electronAPI.openBrowser(finalUrl);
    }
  }
}


