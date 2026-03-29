import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  Sparkles,
  ShieldCheck,
  GraduationCap
} from 'lucide-react';
import { motion } from 'motion/react';

interface LoginProps {
  onLogin: (email: string) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Mock authentication delay
    setTimeout(() => {
      onLogin(email);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[40px] overflow-hidden shadow-2xl border border-zinc-200">
        {/* Left Side: Branding */}
        <div className="bg-zinc-950 p-12 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-12">
              <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-orange-600/20">R</div>
              <h1 className="text-2xl font-bold text-white tracking-tight">rimtify</h1>
            </div>
            
            <h2 className="text-5xl font-bold text-white leading-tight mb-6">
              Empowering <span className="text-orange-500">Educators</span> with Intelligence.
            </h2>
            <p className="text-zinc-400 text-lg leading-relaxed max-w-md">
              The all-in-one portal for university teachers to manage materials, students, and schedules with AI-powered assistance.
            </p>
          </div>

          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-orange-500">
                <Sparkles size={24} />
              </div>
              <div>
                <h4 className="text-white font-bold">AI-Powered Insights</h4>
                <p className="text-zinc-500 text-sm">Generate lesson plans and grade rubrics instantly.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-emerald-500">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h4 className="text-white font-bold">Secure & Private</h4>
                <p className="text-zinc-500 text-sm">Your data and API keys are stored securely.</p>
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -right-20 -top-20 w-96 h-96 bg-orange-600/20 rounded-full blur-[100px]"></div>
          <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px]"></div>
        </div>

        {/* Right Side: Login Form */}
        <div className="p-12 lg:p-20 flex flex-col justify-center">
          <div className="mb-10">
            <h3 className="text-3xl font-bold text-zinc-900 mb-2">Welcome Back</h3>
            <p className="text-zinc-500">Please enter your teacher credentials to access your portal.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                <Mail size={14} /> Email Address
              </label>
              <input 
                required
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="teacher@university.edu"
                className="w-full bg-zinc-50 border-zinc-200 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-orange-500 transition-all outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                <Lock size={14} /> Password
              </label>
              <input 
                required
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-zinc-50 border-zinc-200 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-orange-500 transition-all outline-none"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-zinc-500 cursor-pointer">
                <input type="checkbox" className="rounded border-zinc-300 text-orange-600 focus:ring-orange-500" />
                Remember me
              </label>
              <a href="#" className="text-orange-600 font-bold hover:text-orange-700">Forgot Password?</a>
            </div>

            <button 
              disabled={isLoading}
              type="submit"
              className="w-full bg-zinc-900 text-white py-5 rounded-2xl font-bold text-lg hover:bg-zinc-800 transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-70"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Sign In to Portal
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-zinc-100 text-center">
            <p className="text-zinc-500 text-sm">
              New to Rimtify? <a href="#" className="text-orange-600 font-bold hover:text-orange-700">Contact Administration</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
