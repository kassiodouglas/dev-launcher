export interface iLogMessage {
  timestamp: string;
  text: string;
  type: 'info' | 'error' | 'system';
}
