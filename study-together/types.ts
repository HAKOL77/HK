
export interface ChartDataPoint {
  time: string;
  value: number; // minutes
}

export interface Member {
  id: string;
  name: string;
  studyTime: number; // seconds
  color?: string;
}

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: Date;
}
