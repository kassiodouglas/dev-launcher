import { iProject } from '../Interfaces/project.interface';

declare global {
  interface Window {
    electronAPI: {
      startProject: (config: any) => Promise<any>;
      stopProject: (projectName: string) => Promise<any>;
      openBrowser: (url: string) => Promise<any>;
      onProjectLog: (callback: (data: any) => void) => void;
      getProjects: () => Promise<iProject[]>;
      addProject: (p: iProject) => Promise<any>;
      deleteProject: (id: number) => Promise<any>;
      updateProject: (project: iProject) => Promise<any>;
      selectFolder: () => Promise<{ success: boolean; path?: string }>;
      openVSCode: (path: string) => Promise<any>;
      getGitBranches: (path: string) => Promise<{ success: boolean; branches?: string[]; current?: string; error?: string }>;
      checkoutBranch: (path: string, branch: string) => Promise<{ success: boolean; message?: string; error?: string }>;
      pullBranch: (path: string, branch: string) => Promise<{ success: boolean; message?: string; error?: string }>;
      getRunningProjects: () => Promise<string[]>;
    };
  }
}

export {};

