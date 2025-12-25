
export const GAME_VERSION = "1.1.0";

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
  npcs: string[]; 
  searches: SearchResult[];
  isInitial?: boolean;
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
  discoveredClues: string[];
  discoveredSuspects: string[]; 
  unlockedLocations: string[];
  witnessInteractions: Record<string, string>;
  migraineLevel: number; 
  isGameOver: boolean;
  gameWon: boolean | null;
}
