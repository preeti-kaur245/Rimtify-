import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  MoreHorizontal, 
  Mail, 
  CheckCircle2, 
  XCircle, 
  Clock,
  Download
} from 'lucide-react';
import { Student } from '../types';
import { cn } from '../lib/utils';

interface StudentsProps {
  students: Student[];
  onAdd: (student: Student) => void;
  onUpdate: (student: Student) => void;
}

export function Students({ students, onAdd, onUpdate }: StudentsProps) {
  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newStudent, setNewStudent] = useState<Partial<Student>>({ status: 'active', attendance: 0 });

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.rollNumber.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const student: Student = {
      id: Date.now().toString(),
      name: newStudent.name || '',
      rollNumber: newStudent.rollNumber || '',
      email: newStudent.email || '',
      attendance: Number(newStudent.attendance) || 0,
      status: newStudent.status as any,
    };
    onAdd(student);
    setIsAdding(false);
    setNewStudent({ status: 'active', attendance: 0 });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <input 
            type="text" 
            placeholder="Search students..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 w-80 shadow-sm"
          />
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-zinc-900 text-white px-6 py-2.5 rounded-xl hover:bg-zinc-800 transition-all font-semibold"
        >
          <Plus size={20} />
          Add Student
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50/50 border-b border-zinc-200">
              <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Student Info</th>
              <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Roll Number</th>
              <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Attendance</th>
              <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {filteredStudents.map((student) => (
              <tr key={student.id} className="hover:bg-zinc-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-600 font-bold border border-zinc-200">
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-zinc-900">{student.name}</p>
                      <p className="text-xs text-zinc-500">{student.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-mono text-zinc-600">{student.rollNumber}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="w-48">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-zinc-700">{student.attendance}%</span>
                    </div>
                    <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full rounded-full transition-all duration-1000",
                          student.attendance > 80 ? "bg-emerald-500" : 
                          student.attendance > 60 ? "bg-amber-500" : "bg-rose-500"
                        )}
                        style={{ width: `${student.attendance}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    student.status === 'active' ? "bg-emerald-50 text-emerald-600" :
                    student.status === 'inactive' ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600"
                  )}>
                    {student.status === 'active' ? <CheckCircle2 size={12} /> : 
                     student.status === 'inactive' ? <XCircle size={12} /> : <Clock size={12} />}
                    {student.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-lg transition-all">
                    <MoreHorizontal size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredStudents.length === 0 && (
          <div className="p-20 text-center">
            <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4 text-zinc-400">
              <Users size={32} />
            </div>
            <h3 className="text-lg font-bold text-zinc-900">No students found</h3>
            <p className="text-sm text-zinc-500">Try adjusting your search or add a new student.</p>
          </div>
        )}
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-zinc-900">Add New Student</h3>
                <button type="button" onClick={() => setIsAdding(false)} className="p-2 hover:bg-zinc-100 rounded-full">
                  <Plus size={24} className="rotate-45" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Full Name</label>
                  <input 
                    required
                    type="text" 
                    className="w-full bg-zinc-50 border-zinc-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500"
                    placeholder="John Doe"
                    onChange={e => setNewStudent({...newStudent, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Roll Number</label>
                  <input 
                    required
                    type="text" 
                    className="w-full bg-zinc-50 border-zinc-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500"
                    placeholder="2024CS001"
                    onChange={e => setNewStudent({...newStudent, rollNumber: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Email</label>
                  <input 
                    required
                    type="email" 
                    className="w-full bg-zinc-50 border-zinc-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500"
                    placeholder="john@university.edu"
                    onChange={e => setNewStudent({...newStudent, email: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase">Attendance %</label>
                    <input 
                      type="number" 
                      min="0" max="100"
                      className="w-full bg-zinc-50 border-zinc-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500"
                      onChange={e => setNewStudent({...newStudent, attendance: Number(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase">Status</label>
                    <select 
                      className="w-full bg-zinc-50 border-zinc-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500"
                      onChange={e => setNewStudent({...newStudent, status: e.target.value as any})}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="on-leave">On Leave</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsAdding(false)}
                  className="flex-1 py-3.5 rounded-xl font-bold text-zinc-500 hover:bg-zinc-100 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3.5 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800 transition-all"
                >
                  Save Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
