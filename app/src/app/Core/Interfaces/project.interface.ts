import { iProjectCommand } from "./project-command.interface";

export interface iBranch {
  name:string;
}

export interface iProject {
  id?: number;
  name: string;
  path: string;
  port?: number; // Porta de execução
  baseUrl?: string; // URL base
  browserUrl?: string;
  waitBeforeBrowser?: number; // Tempo em ms
  vsCodePaths: string[];
  commands: iProjectCommand[];
  currentBranch?: string; // Nome da branch atual
  branches?:string[];
}
