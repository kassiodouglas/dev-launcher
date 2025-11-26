import { Routes } from "@angular/router";
import { ErrorComponent } from "./Core/Pages/error/error.component";
import { projectsGuard } from "./Core/Guards/projects.guard";


export const routes: Routes = [

  // {
  //   path: '',
  //   loadComponent: () => import('@shared/Layouts/documentation/documentation.layout').then(m => m.DocumentationLayout),
  //   loadChildren:() => import('@domains/Doc/doc.routing').then(m => m.routes)
  // },

  // Rota de Setup (sem layout, página standalone)
  {
    path: 'setup',
    loadChildren: () => import('@domains/Setup/setup.routing').then(m => m.setupRoutes),
  },

  {
    // 1. Rota Pai: Define o Layout
    path: '', // Este path vazio funciona como um prefixo ou raiz
    loadComponent: () => import('@shared/Layouts/default/default.layout').then(m => m.DefaultLayout),
    canActivate: [projectsGuard], // Verifica se há projetos cadastrados
    children: [
      {
        // 2. Rota Filha 1: Dashboard (Acessível em /)
        path: '', // Path vazio herda o path do pai, resultando em: /
        loadChildren: () => import('@domains/Dashboard/dashboard.routing').then(m => m.dashboardRoutes),
        // canActivate: Se necessário, adicione aqui, mas geralmente fica no pai.
      },
      {
        // 3. Rota Filha 2: Config (Acessível em /config)
        path: 'config',
        loadChildren: () => import('@domains/Config/config.routing').then(m => m.configRoutes),
      },
      {
        // 4. Rota Filha 3: Projects (Acessível em /projects)
        path: 'projects',
        loadChildren: () => import('@domains/Projects/projects.routing').then(m => m.projectsRoutes),
      },
      // ... Adicione outras rotas filhas aqui, como 'profile', 'users', etc.
    ]
  },



  {
    path:'config',
    loadComponent: () => import('@shared/Layouts/default/default.layout').then(m => m.DefaultLayout),
    loadChildren:()=>import('@domains/Config/config.routing').then(m => m.configRoutes),
    canActivate: [projectsGuard],
  },

  { path: 'erro/:errorCode', loadComponent: () => ErrorComponent },

  { path: '**', redirectTo: 'erro/404' },

];
