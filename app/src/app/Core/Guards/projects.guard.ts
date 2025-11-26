import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { iProject } from '../Interfaces/project.interface';
import '@src/app/Core/Types/electron-api.types';

export const projectsGuard: CanActivateFn = async () => {
  const router = inject(Router);
  
  try {
    const projects = await window.electronAPI.getProjects();
    
    // Se não houver projetos, redireciona para a página de cadastro
    if (!projects || projects.length === 0) {
      return router.createUrlTree(['/setup']);
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao verificar projetos:', error);
    // Em caso de erro, redireciona para setup
    return router.createUrlTree(['/setup']);
  }
};

