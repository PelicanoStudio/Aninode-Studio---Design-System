export enum NodeType {
  PICKER = 'PICKER',
  OSCILLATOR = 'OSCILLATOR',
  TRANSFORM = 'TRANSFORM',
  OUTPUT = 'OUTPUT',
  LOGIC = 'LOGIC'
}

export enum ConnectionType {
  BEZIER = 'BEZIER',
  STRAIGHT = 'STRAIGHT',
  STEP = 'STEP',
  DOUBLE = 'DOUBLE',
  DOTTED = 'DOTTED'
}

export interface Position {
  x: number;
  y: number;
}

export interface NodeData {
  id: string;
  type: NodeType;
  label: string;
  position: Position;
  collapsed?: boolean;
  // Specific data properties
  value?: number | string | boolean;
  previewUrl?: string;
  config: Record<string, any>;
}

export interface Connection {
  id: string;
  source: string;
  target: string;
  type: ConnectionType;
}

export interface ThemePalette {
  background: string;
  surface: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
}