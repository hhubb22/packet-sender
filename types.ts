
export interface NetworkInterface {
  id: string;
  name: string;
  description: string;
}

export interface Packet {
  id: string;
  source: string;
  destination: string;
  protocol: string;
  hexData: string;
  binaryData: string;
  timestamp?: string; 
  length?: number;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  action: string;
  details: string;
}

export enum AppView {
  SERVER_SELECTION = 'SERVER_SELECTION',
  INTERFACE_SELECTION = 'INTERFACE_SELECTION',
  PACKET_EDITOR = 'PACKET_EDITOR',
  LOGS = 'LOGS',
}

export interface NavItem {
  name: string;
  view: AppView;
  disabled?: (serverConnected: boolean, interfaceSelected: boolean) => boolean;
}
