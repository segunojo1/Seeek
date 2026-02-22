export interface FileAttachment {
  name: string;
  type: string;
  url?: string;
  size?: number;
}

export interface ChatRecommendedMeal {
  meal_name: string;
  origin: string;
  description: string;
  health_score: number;
  key_benefits: string[];
  why_it_fits: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
  attachments?: FileAttachment[];
  recommended_meals?: ChatRecommendedMeal[];
  follow_up_suggestions?: string[];
}

export interface Chat {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}
