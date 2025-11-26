import { Component, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { iProject } from '@src/app/Core/Interfaces/project.interface';
import { iProjectCommand } from '@src/app/Core/Interfaces/project-command.interface';
import '@src/app/Core/Types/electron-api.types';

@Component({
  selector: 'page-wizard',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './wizard.page.html',
  styleUrl: './wizard.page.scss'
})
export class WizardPage {
  wizardForm: FormGroup;
  currentStep = 1;
  totalSteps = 4;
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone
  ) {
    this.wizardForm = this.fb.group({
      // Etapa 1: Informações Básicas
      name: ['', [Validators.required]],
      path: ['', [Validators.required]],
      
      // Etapa 2: Configurações de Servidor
      port: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      baseUrl: ['', [Validators.required]],
      
      // Etapa 3: Comandos
      commands: this.fb.array([]),
      
      // Etapa 4: Branch
      currentBranch: ['', [Validators.required]]
    });
    
    // Adiciona um comando inicial
    this.addCommand();
  }
  
  get commandsFormArray(): FormArray {
    return this.wizardForm.get('commands') as FormArray;
  }
  
  addCommand() {
    const commandGroup = this.fb.group({
      cwd: [''],
      command: ['', [Validators.required]]
    });
    this.commandsFormArray.push(commandGroup);
  }
  
  removeCommand(index: number) {
    if (this.commandsFormArray.length > 1) {
      this.commandsFormArray.removeAt(index);
    }
  }
  
  getCommandControl(index: number, field: string): FormControl {
    return this.commandsFormArray.at(index).get(field) as FormControl;
  }
  
  nextStep() {
    if (this.currentStep < this.totalSteps) {
      // Valida apenas os campos da etapa atual
      if (this.validateCurrentStep()) {
        this.currentStep++;
      }
    }
  }
  
  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }
  
  validateCurrentStep(): boolean {
    const stepFields: { [key: number]: string[] } = {
      1: ['name', 'path'],
      2: ['port', 'baseUrl'],
      3: ['commands'],
      4: ['currentBranch']
    };
    
    const fields = stepFields[this.currentStep];
    if (!fields) return true;
    
    // Valida campos da etapa atual
    for (const field of fields) {
      if (field === 'commands') {
        // Valida cada comando
        const commandsArray = this.commandsFormArray;
        for (let i = 0; i < commandsArray.length; i++) {
          const commandGroup = commandsArray.at(i) as FormGroup;
          if (commandGroup.get('command')?.invalid) {
            commandGroup.get('command')?.markAsTouched();
            return false;
          }
        }
      } else {
        const control = this.wizardForm.get(field);
        if (control?.invalid) {
          control.markAsTouched();
          return false;
        }
      }
    }
    
    return true;
  }
  
  async selectFolder() {
    try {
      const result = await window.electronAPI.selectFolder();
      if (result.success && result.path) {
        this.wizardForm.patchValue({ path: result.path });
      }
    } catch (error) {
      console.error('Erro ao selecionar pasta:', error);
    }
  }
  
  async submit() {
    if (this.wizardForm.valid) {
      const formValue = this.wizardForm.value;
      
      const project: iProject = {
        name: formValue.name,
        path: formValue.path,
        port: parseInt(formValue.port),
        baseUrl: formValue.baseUrl,
        browserUrl: formValue.baseUrl, // Usa baseUrl como browserUrl também
        vsCodePaths: [formValue.path], // Usa o path como vsCodePath
        commands: formValue.commands.map((cmd: any) => ({
          cwd: cmd.cwd || formValue.path,
          command: cmd.command
        })) as iProjectCommand[],
        currentBranch: formValue.currentBranch,
        branches:[]
      };
      
      try {
        await window.electronAPI.addProject(project);
        // Redireciona para o dashboard após criar o projeto
        this.ngZone.run(() => {
          this.router.navigate(['/']);
        });
      } catch (error) {
        console.error('Erro ao criar projeto:', error);
        alert('Erro ao criar projeto. Tente novamente.');
      }
    } else {
      // Marca todos os campos como touched para mostrar erros
      Object.keys(this.wizardForm.controls).forEach(key => {
        this.wizardForm.get(key)?.markAsTouched();
      });
    }
  }
  
  getStepTitle(): string {
    const titles: { [key: number]: string } = {
      1: 'Informações Básicas',
      2: 'Configurações de Servidor',
      3: 'Comandos de Execução',
      4: 'Branch Atual'
    };
    return titles[this.currentStep] || '';
  }
  
  getStepDescription(): string {
    const descriptions: { [key: number]: string } = {
      1: 'Defina o nome e o caminho do projeto',
      2: 'Configure a porta e URL base do servidor',
      3: 'Adicione os comandos que serão executados',
      4: 'Informe a branch atual do projeto'
    };
    return descriptions[this.currentStep] || '';
  }
  
  getProgressPercentage(): number {
    return Math.round((this.currentStep / this.totalSteps) * 100);
  }
  
  getStepTitleByNumber(step: number): string {
    const titles: { [key: number]: string } = {
      1: 'Informações Básicas',
      2: 'Configurações',
      3: 'Comandos',
      4: 'Branch'
    };
    return titles[step] || '';
  }
}

