export interface WisdomQuote {
  id: number;
  content: string;
}

export interface LineStroke {
  points: { x: number; y: number }[];
  color: string;
  width: number;
}

export interface DiaryEntry {
  id: string;
  originalText: string;
  krogText: string;
  timestamp: string;
}

export type EmulatorTab = 'wisdom' | 'canvas' | 'crusher' | 'diary' | 'widget';
