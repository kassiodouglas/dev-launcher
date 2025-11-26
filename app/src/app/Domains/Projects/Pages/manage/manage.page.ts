import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { iProject } from '@src/app/Core/Interfaces/project.interface';
import { iProjectCommand } from '@src/app/Core/Interfaces/project-command.interface';
import '@src/app/Core/Types/electron-api.types';

@Component({
  selector: 'page-manage',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './manage.page.html',
  styleUrl: './manage.page.scss'
})
export class ManagePage implements OnInit {
  projects: iProject[] = [];
  editingProject: iProject | null = null;
  editForm: FormGroup;
  showEditForm = false;
  loadingBranches = false;
  branches: string[] = [];
  currentBranch: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.editForm = this.fb.group({
      name: ['', [Validators.required]],
      path: ['', [Validators.required]],
      port: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      baseUrl: ['', [Validators.required]],
      browserUrl: [''],
      waitBeforeBrowser: [5000],
      vsCodePaths: this.fb.array([]),
      commands: this.fb.array([]),
      currentBranch: ['']
    });
  }

  ngOnInit() {
    this.loadProjects();
  }

  async loadProjects() {
    this.projects = await window.electronAPI.getProjects();
  }

  async deleteProject(project: iProject) {
    if (confirm(`Deseja remover ${project.name}?`)) {
      await window.electronAPI.deleteProject(project.id!);
      this.loadProjects();
    }
  }

  editProject(project: iProject) {
    this.editingProject = project;
    this.showEditForm = true;
    
    // Preenche o formulário
    this.editForm.patchValue({
      name: project.name,
      path: project.path,
      port: project.port || '',
      baseUrl: project.baseUrl || '',
      browserUrl: project.browserUrl || '',
      waitBeforeBrowser: project.waitBeforeBrowser || 5000,
      currentBranch: project.currentBranch || ''
    });

    // Limpa arrays
    const vsCodePathsArray = this.editForm.get('vsCodePaths') as FormArray;
    const commandsArray = this.editForm.get('commands') as FormArray;
    
    while (vsCodePathsArray.length > 0) vsCodePathsArray.removeAt(0);
    while (commandsArray.length > 0) commandsArray.removeAt(0);

    // Preenche arrays
    (project.vsCodePaths || []).forEach(path => {
      vsCodePathsArray.push(this.fb.control(path));
    });

    (project.commands || []).forEach(cmd => {
      commandsArray.push(this.fb.group({
        cwd: [cmd.cwd || ''],
        command: [cmd.command, [Validators.required]]
      }));
    });

    // Se não tiver comandos, adiciona um vazio
    if (commandsArray.length === 0) {
      this.addCommand();
    }
  }

  cancelEdit() {
    this.showEditForm = false;
    this.editingProject = null;
  }

  async saveProject() {
    if (this.editForm.valid && this.editingProject) {
      const formValue = this.editForm.value;
      
      const updatedProject: iProject = {
        ...this.editingProject,
        name: formValue.name,
        path: formValue.path,
        port: parseInt(formValue.port),
        baseUrl: formValue.baseUrl,
        browserUrl: formValue.browserUrl || formValue.baseUrl,
        waitBeforeBrowser: formValue.waitBeforeBrowser,
        vsCodePaths: formValue.vsCodePaths || [],
        commands: formValue.commands.map((cmd: any) => ({
          cwd: cmd.cwd || formValue.path,
          command: cmd.command
        })) as iProjectCommand[],
        currentBranch: formValue.currentBranch
      };

      await window.electronAPI.updateProject(updatedProject);
      this.loadProjects();
      this.cancelEdit();
    }
  }

  get vsCodePathsArray(): FormArray {
    return this.editForm.get('vsCodePaths') as FormArray;
  }

  get commandsArray(): FormArray {
    return this.editForm.get('commands') as FormArray;
  }

  addVSCodePath() {
    this.vsCodePathsArray.push(this.fb.control(''));
  }

  removeVSCodePath(index: number) {
    this.vsCodePathsArray.removeAt(index);
  }

  addCommand() {
    this.commandsArray.push(this.fb.group({
      cwd: [''],
      command: ['', [Validators.required]]
    }));
  }

  removeCommand(index: number) {
    if (this.commandsArray.length > 1) {
      this.commandsArray.removeAt(index);
    }
  }

  getCommandControl(index: number, field: string): FormControl {
    return this.commandsArray.at(index).get(field) as FormControl;
  }

  async loadBranches(project: iProject) {
    this.loadingBranches = true;
    try {
      const result = await window.electronAPI.getGitBranches(project.path);
      if (result.success) {
        // Atualiza o projeto com as branches
        const updatedProject: iProject = {
          ...project,
          branches: result.branches || [],
          currentBranch: result.current || ''
        };
        
        // Atualiza o projeto no banco de dados
        await window.electronAPI.updateProject(updatedProject);
        
        // Recarrega a lista de projetos para refletir as mudanças
        await this.loadProjects();
      }
    } catch (error) {
      console.error('Erro ao carregar branches:', error);
    } finally {
      this.loadingBranches = false;
    }
  }

  async checkoutBranch(project: iProject, branch: string) {
    try {
      const result = await window.electronAPI.checkoutBranch(project.path, branch);
      if (result.success) {
        project.currentBranch = branch;
        await window.electronAPI.updateProject(project);
        this.loadProjects();
        alert(`Branch ${branch} selecionada com sucesso!`);
      } else {
        alert(`Erro: ${result.error || result.message || 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.error('Erro ao fazer checkout:', error);
    }
  }

  async pullBranch(project: iProject, branch: string) {
    try {
      const result = await window.electronAPI.pullBranch(project.path, branch);
      if (result.success) {
        alert('Pull realizado com sucesso!');
      } else {
        alert(`Erro: ${result.error || result.message || 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.error('Erro ao fazer pull:', error);
    }
  }

  createNewProject() {
    this.router.navigate(['/setup']);
  }

  openVSCode(project: iProject) {
    if (project.vsCodePaths && project.vsCodePaths.length > 0) {
      window.electronAPI.openVSCode(project.vsCodePaths[0]);
    } else if (project.path) {
      window.electronAPI.openVSCode(project.path);
    }
  }
}

