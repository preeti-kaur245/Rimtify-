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
  dueDate?: string; // Optional due date for assignments
}

export interface FacultyMember {
  id: string;
  name: string;
  designation: string;
  department: string;
  email: string;
  avatar?: string;
  status: 'online' | 'offline' | 'busy';
  bio?: string;
  researchInterests?: string[];
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
}

export type Theme = 'light' | 'dark';

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
  channelId?: string;
  type?: 'text' | 'file' | 'image';
  fileName?: string;
  fileSize?: string;
  replyTo?: string;
}

export interface Notification {
  id: string;
  title: string;
  content: string;
  type: 'announcement' | 'deadline' | 'system';
  priority: 'high' | 'medium' | 'low';
  timestamp: string;
  read: boolean;
  link?: string;
}
