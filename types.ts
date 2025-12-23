
export const GAME_VERSION = "1.0.1";

export interface DialogueOption {
  text: string;
  nextId: string;
  requirement?: {
    clueId?: string;
    itemId?: string;
  };
  onSelect?: () => void;
}

export interface DialogueNode {
  id: string;
  speaker: string;
  text: string;
  options: DialogueOption[];
}

export interface NPC {
  id: string;
  name: string;
  role: string;
  description: string;
  dialogue: Record<string, DialogueNode>;
  initialNode: string;
}

export interface Clue {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

export interface SearchResult {
  id: string;
  description: string;
  clueId?: string;
  requiresClueId?: string;
}

export interface Location {
  id: string;
  name: string;
  description: string;
  npcs: string[]; // NPC IDs
  searches: SearchResult[];
  connections: string[]; // Location IDs
}

export interface Level {
  id: number;
  title: string;
  caseFile: string;
  locations: Record<string, Location>;
  npcs: Record<string, NPC>;
  clues: Record<string, Clue>;
  solution: {
    killerId: string;
    motive: string;
    evidenceId: string;
  };
}

export interface GameState {
  currentLevelId: number;
  currentLocationId: string;
  inventory: string[]; // Clue IDs
  discoveredClues: string[];
  discoveredSuspects: string[]; // NPC IDs
  witnessInteractions: Record<string, string>; // npcId: lastNodeId
  migraineLevel: number; // 0-100
  isGameOver: boolean;
  gameWon: boolean | null;
}
