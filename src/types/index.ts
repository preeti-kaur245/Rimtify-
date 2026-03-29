export type AccessLevel = 'public' | 'private';
export type MaterialCategory = 'Notes' | 'Assignments' | 'Slides' | 'Reference';

export interface Material {
  id: string;
  title: string;
  subject: string;
  category: MaterialCategory;
  semester: string;
  accessLevel: AccessLevel;
  description: string;
  tags: string[];
  fileName: string;
  fileSize: string;
  uploadDate: string;
  downloadCount: number;
}

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  email: string;
  attendance: number; // 0-100
  status: 'active' | 'inactive' | 'on-leave';
}

export interface ScheduleItem {
  id: string;
  subject: string;
  room: string;
  day: number; // 0-4 (Mon-Fri)
  startTime: string;
  endTime: string;
  color: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'urgent' | 'info' | 'success';
  timestamp: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  lastSaved: string;
}

export interface UserProfile {
  name: string;
  email: string;
  department: string;
  university: string;
  anthropicKey?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface FacultyMessage {
  id: string;
  sender: string;
  role: 'faculty' | 'student';
  content: string;
  timestamp: string;
}
