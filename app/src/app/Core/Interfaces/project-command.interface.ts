export interface iProjectCommand {
  cwd?: string; // Caminho específico se for diferente da raiz
  command: string; // O comando exato (ex: php artisan serve)
}
