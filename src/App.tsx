import React, { useState, useEffect } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { 
  Material, 
  Student, 
  ScheduleItem, 
  Announcement, 
  Note, 
  UserProfile, 
  FacultyMessage 
} from './types';
import { Sidebar, Header } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Materials } from './pages/Materials';
import { Students } from './pages/Students';
import { Schedule } from './pages/Schedule';
import { Chat } from './pages/Chat';
import { Profile } from './pages/Profile';
import { Login } from './pages/Login';
import { Editor } from './components/Editor';
import { AIAssistant } from './components/AIAssistant';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useLocalStorage('isLoggedIn', false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  // Data State
  const [materials, setMaterials] = useLocalStorage<Material[]>('materials', []);
  const [students, setStudents] = useLocalStorage<Student[]>('students', [
    { id: '1', name: 'Alice Johnson', rollNumber: '2024CS001', email: 'alice@uni.edu', attendance: 85, status: 'active' },
    { id: '2', name: 'Bob Smith', rollNumber: '2024CS002', email: 'bob@uni.edu', attendance: 72, status: 'active' },
    { id: '3', name: 'Charlie Davis', rollNumber: '2024CS003', email: 'charlie@uni.edu', attendance: 45, status: 'inactive' },
  ]);
  const [schedule, setSchedule] = useLocalStorage<ScheduleItem[]>('schedule', [
    { id: '1', subject: 'Advanced Algorithms', room: 'Room 402', day: 0, startTime: '09:00', endTime: '10:30', color: 'bg-orange-500' },
    { id: '2', subject: 'Database Systems', room: 'Lab 2', day: 1, startTime: '11:00', endTime: '12:30', color: 'bg-blue-500' },
  ]);
  const [announcements, setAnnouncements] = useLocalStorage<Announcement[]>('announcements', [
    { id: '1', title: 'Midterm Exam', content: 'The midterm exam will be held next Monday at 10 AM.', type: 'urgent', timestamp: new Date().toISOString() },
  ]);
  const [notes, setNotes] = useLocalStorage<Note[]>('notes', []);
  const [profile, setProfile] = useLocalStorage<UserProfile>('profile', {
    name: 'Dr. Robert Miller',
    email: 'robert.miller@university.edu',
    department: 'Computer Science',
    university: 'Global Tech University'
  });
  const [facultyMessages, setFacultyMessages] = useLocalStorage<FacultyMessage[]>('facultyMessages', [
    { id: '1', sender: 'Prof. James Wilson', role: 'faculty', content: 'Has anyone reviewed the new curriculum proposal?', timestamp: new Date().toISOString() }
  ]);

  const handleLogin = (email: string) => {
    setIsLoggedIn(true);
    setProfile({ ...profile, email });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleAddMaterial = (m: Material) => setMaterials([m, ...materials]);
  const handleDeleteMaterial = (id: string) => setMaterials(materials.filter(m => m.id !== id));
  const handleDownloadMaterial = (id: string) => {
    setMaterials(materials.map(m => m.id === id ? { ...m, downloadCount: m.downloadCount + 1 } : m));
  };

  const handleAddStudent = (s: Student) => setStudents([s, ...students]);
  const handleUpdateStudent = (s: Student) => setStudents(students.map(item => item.id === s.id ? s : item));

  const handleAddSchedule = (item: ScheduleItem) => setSchedule([...schedule, item]);
  const handleDeleteSchedule = (id: string) => setSchedule(schedule.filter(s => s.id !== id));

  const handleAddAnnouncement = (a: Announcement) => setAnnouncements([a, ...announcements]);

  const handleSaveNote = (n: Note) => {
    const exists = notes.find(item => item.id === n.id);
    if (exists) {
      setNotes(notes.map(item => item.id === n.id ? n : item));
    } else {
      setNotes([n, ...notes]);
    }
    setSelectedNote(n);
  };

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Untitled Note',
      content: '',
      lastSaved: new Date().toISOString()
    };
    setSelectedNote(newNote);
    setActiveTab('editor');
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-zinc-50 text-zinc-900 font-sans overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={activeTab === 'editor' ? 'Notes Editor' : activeTab} user={profile} />
        
        <main className="flex-1 overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {activeTab === 'dashboard' && (
                <Dashboard 
                  materials={materials} 
                  students={students} 
                  schedule={schedule} 
                  announcements={announcements}
                  notes={notes}
                  onAddAnnouncement={handleAddAnnouncement}
                  onSelectNote={(n) => { setSelectedNote(n); setActiveTab('editor'); }}
                  onCreateNote={createNewNote}
                />
              )}
              {activeTab === 'materials' && (
                <Materials 
                  materials={materials} 
                  onAdd={handleAddMaterial} 
                  onDelete={handleDeleteMaterial}
                  onDownload={handleDownloadMaterial}
                />
              )}
              {activeTab === 'students' && (
                <Students 
                  students={students} 
                  onAdd={handleAddStudent} 
                  onUpdate={handleUpdateStudent} 
                />
              )}
              {activeTab === 'schedule' && (
                <Schedule 
                  schedule={schedule} 
                  onAdd={handleAddSchedule} 
                  onDelete={handleDeleteSchedule} 
                />
              )}
              {activeTab === 'chat' && (
                <Chat 
                  messages={facultyMessages} 
                  onSendMessage={(m) => setFacultyMessages([...facultyMessages, m])} 
                  userName={profile.name} 
                />
              )}
              {activeTab === 'profile' && (
                <Profile profile={profile} onUpdate={setProfile} />
              )}
              {activeTab === 'editor' && selectedNote && (
                <Editor 
                  note={selectedNote} 
                  onSave={handleSaveNote} 
                  anthropicKey={profile.anthropicKey} 
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <AIAssistant 
        anthropicKey={profile.anthropicKey} 
        materialCount={materials.length} 
        userName={profile.name} 
      />
    </div>
  );
}
