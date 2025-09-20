export interface User {
  id: string;
  name: string;
  email: string;
  interests: string[];
  hobbies: string[];
  schedule: ClassSchedule[];
  friends: string[];
}

export interface ClassSchedule {
  id: string;
  name: string;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  location?: string;
}

export interface HangoutSuggestion {
  id: string;
  title: string;
  description: string;
  location: string;
  suggestedTime: Date;
  duration: number; // in minutes
  activity: string;
  participants: string[]; // user IDs
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  responses: { [userId: string]: 'pending' | 'accepted' | 'declined' };
  createdBy: string;
  createdAt: Date;
}

export interface TimeSlot {
  start: Date;
  end: Date;
  available: boolean;
}

export interface Activity {
  name: string;
  category: string;
  duration: number; // in minutes
  location: string;
  description: string;
}
