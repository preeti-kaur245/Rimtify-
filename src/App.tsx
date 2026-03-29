import React, { useState, useEffect } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { 
  Material, 
  FacultyMember, 
  ScheduleItem, 
  Announcement, 
  Note, 
  UserProfile, 
  FacultyMessage,
  Notification,
  Task,
  Theme
} from './types';
import { Sidebar, Header } from './components/Layout';
import { cn } from './lib/utils';
import { Dashboard } from './pages/Dashboard';
import { Materials } from './pages/Materials';
import { Faculty } from './pages/Faculty';
import { Research } from './pages/Research';
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [theme, setTheme] = useLocalStorage<Theme>('theme', 'light');

  // Data State
  const [materials, setMaterials] = useLocalStorage<Material[]>('materials', []);
  const [faculty, setFaculty] = useLocalStorage<FacultyMember[]>('faculty', [
    { id: '1', name: 'Dr. Sarah Connor', designation: 'Associate Professor', department: 'Computer Science', email: 'sarah@uni.edu', status: 'online', bio: 'Expert in AI and Robotics.', researchInterests: ['AI', 'Robotics', 'Ethics'] },
    { id: '2', name: 'Dr. John Doe', designation: 'Professor', department: 'Mathematics', email: 'john@uni.edu', status: 'busy', bio: 'Specializing in Number Theory.', researchInterests: ['Number Theory', 'Cryptography'] },
    { id: '3', name: 'Dr. Jane Smith', designation: 'Assistant Professor', department: 'Physics', email: 'jane@uni.edu', status: 'offline', bio: 'Quantum Mechanics researcher.', researchInterests: ['Quantum Computing', 'Particle Physics'] },
  ]);
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', [
    { id: '1', title: 'Review curriculum proposal', completed: false, priority: 'high' },
    { id: '2', title: 'Submit research paper', completed: true, priority: 'medium' },
    { id: '3', title: 'Grade assignment 4', completed: false, priority: 'high' },
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
    { id: '1', sender: 'Prof. James Wilson', role: 'faculty', content: 'Has anyone reviewed the new curriculum proposal?', timestamp: new Date(Date.now() - 86400000).toISOString(), channelId: 'faculty-general' },
    { id: '2', sender: 'Dr. Sarah Smith', role: 'faculty', content: 'I have some notes on the department meeting.', timestamp: new Date(Date.now() - 3600000).toISOString(), channelId: 'department-news' },
    { id: '3', sender: 'Dean Office', role: 'faculty', content: 'Reminder: Faculty retreat is this Friday.', timestamp: new Date(Date.now() - 1800000).toISOString(), channelId: 'faculty-general' },
    { id: '4', sender: 'Prof. James Wilson', role: 'faculty', content: 'Can we discuss the student feedback for CS101?', timestamp: new Date().toISOString(), channelId: 'student-queries' },
    { id: 'dm1', sender: 'Dr. Sarah Smith', role: 'faculty', content: 'Hi Robert, do you have the minutes from yesterday?', timestamp: new Date(Date.now() - 7200000).toISOString(), channelId: 'dm-sarah' },
    { id: 'dm2', sender: 'Prof. James Wilson', role: 'faculty', content: 'The algorithm paper looks great!', timestamp: new Date(Date.now() - 14400000).toISOString(), channelId: 'dm-james' }
  ]);
  const [notifications, setNotifications] = useLocalStorage<Notification[]>('notifications', [
    { id: '1', title: 'Welcome to Rimtify', content: 'Explore your new faculty dashboard.', type: 'system', priority: 'low', timestamp: new Date().toISOString(), read: false }
  ]);

  // Check for upcoming classes and assignment deadlines and generate notifications
  useEffect(() => {
    const checkScheduleAndDeadlines = () => {
      const now = new Date();
      const currentDay = (now.getDay() + 6) % 7; // Adjust to 0-6 (Mon-Sun)
      const currentTime = now.getHours() * 60 + now.getMinutes();

      // Check Schedule
      schedule.forEach(item => {
        if (item.day === currentDay) {
          const [hours, minutes] = item.startTime.split(':').map(Number);
          const startTimeInMinutes = hours * 60 + minutes;
          const diff = startTimeInMinutes - currentTime;

          // Notify 15 minutes before class
          if (diff > 0 && diff <= 15) {
            const notificationId = `schedule-${item.id}-${now.toDateString()}`;
            if (!notifications.find(n => n.id === notificationId)) {
              const newNotification: Notification = {
                id: notificationId,
                title: 'Upcoming Class',
                content: `Your class "${item.subject}" starts in ${diff} minutes in ${item.room}.`,
                type: 'deadline',
                priority: 'high',
                timestamp: now.toISOString(),
                read: false,
                link: 'schedule'
              };
              setNotifications(prev => [newNotification, ...prev]);
            }
          }
        }
      });

      // Check Assignment Deadlines
      materials.forEach(m => {
        if (m.category === 'Assignments' && m.dueDate) {
          const dueDate = new Date(m.dueDate);
          const diffTime = dueDate.getTime() - now.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          // Notify if deadline is within 2 days
          if (diffDays > 0 && diffDays <= 2) {
            const notificationId = `deadline-${m.id}`;
            if (!notifications.find(n => n.id === notificationId)) {
              const newNotification: Notification = {
                id: notificationId,
                title: 'Upcoming Deadline',
                content: `The deadline for "${m.title}" is in ${diffDays} day${diffDays > 1 ? 's' : ''}.`,
                type: 'deadline',
                priority: 'high',
                timestamp: now.toISOString(),
                read: false,
                link: 'materials'
              };
              setNotifications(prev => [newNotification, ...prev]);
            }
          }
        }
      });
    };

    checkScheduleAndDeadlines();
    const interval = setInterval(checkScheduleAndDeadlines, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [schedule, materials, notifications]);

  const handleLogin = (email: string) => {
    setIsLoggedIn(true);
    setProfile({ ...profile, email });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  const handleAddMaterial = (m: Material) => setMaterials([m, ...materials]);
  const handleDeleteMaterial = (id: string) => setMaterials(materials.filter(m => m.id !== id));
  const handleDownloadMaterial = (id: string) => {
    setMaterials(materials.map(m => m.id === id ? { ...m, downloadCount: m.downloadCount + 1 } : m));
  };

  const handleAddFaculty = (f: FacultyMember) => setFaculty([f, ...faculty]);
  const handleUpdateFaculty = (f: FacultyMember) => setFaculty(faculty.map(item => item.id === f.id ? f : item));

  const handleAddTask = (t: Task) => setTasks([t, ...tasks]);
  const handleToggleTask = (id: string) => setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  const handleDeleteTask = (id: string) => setTasks(tasks.filter(t => t.id !== id));

  const handleAddSchedule = (item: ScheduleItem) => setSchedule([...schedule, item]);
  const handleDeleteSchedule = (id: string) => setSchedule(schedule.filter(s => s.id !== id));

  const handleAddAnnouncement = (a: Announcement) => {
    setAnnouncements([a, ...announcements]);
    // Create notification for new announcement
    const newNotification: Notification = {
      id: `announcement-${a.id}`,
      title: 'New Announcement',
      content: a.title,
      type: 'announcement',
      priority: a.type === 'urgent' ? 'high' : 'medium',
      timestamp: new Date().toISOString(),
      read: false,
      link: 'dashboard'
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

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
    <div className={cn(
      "flex h-screen font-sans overflow-hidden transition-colors duration-300",
      theme === 'dark' ? "bg-zinc-950 text-zinc-100" : "bg-zinc-50 text-zinc-900"
    )}>
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        theme={theme}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title={activeTab === 'editor' ? 'Notes Editor' : activeTab} 
          user={profile} 
          onMenuClick={() => setIsSidebarOpen(true)}
          notifications={notifications}
          onMarkAsRead={markNotificationAsRead}
          onClearAll={clearNotifications}
          onNotificationClick={(link) => {
            if (link) setActiveTab(link);
          }}
          theme={theme}
          onThemeToggle={toggleTheme}
        />
        
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
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
                  faculty={faculty} 
                  schedule={schedule} 
                  announcements={announcements}
                  notes={notes}
                  notifications={notifications}
                  tasks={tasks}
                  facultyMessages={facultyMessages}
                  onAddAnnouncement={handleAddAnnouncement}
                  onSelectNote={(n) => { setSelectedNote(n); setActiveTab('editor'); }}
                  onCreateNote={createNewNote}
                  onToggleTask={handleToggleTask}
                  onAddTask={handleAddTask}
                  onDeleteTask={handleDeleteTask}
                  theme={theme}
                />
              )}
              {activeTab === 'materials' && (
                <Materials 
                  materials={materials} 
                  onAdd={handleAddMaterial} 
                  onDelete={handleDeleteMaterial}
                  onDownload={handleDownloadMaterial}
                  theme={theme}
                />
              )}
              {activeTab === 'faculty' && (
                <Faculty 
                  faculty={faculty} 
                  onAdd={handleAddFaculty} 
                  onUpdate={handleUpdateFaculty} 
                  theme={theme}
                />
              )}
              {activeTab === 'research' && (
                <Research theme={theme} />
              )}
              {activeTab === 'schedule' && (
                <Schedule 
                  schedule={schedule} 
                  onAdd={handleAddSchedule} 
                  onDelete={handleDeleteSchedule} 
                  theme={theme}
                />
              )}
              {activeTab === 'chat' && (
                <Chat 
                  messages={facultyMessages} 
                  onSendMessage={(m) => setFacultyMessages([...facultyMessages, m])} 
                  userName={profile.name} 
                  theme={theme}
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
                  theme={theme}
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
        theme={theme}
      />
    </div>
  );
}
