'use client';

import { useState } from 'react';
import { Key, ShieldCheck, Lock, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';

export default function AdminSettingsPage() {
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false });
  const [changingPass, setChangingPass] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirm) {
      return toast.error('New passwords do not match!');
    }
    if (passwords.newPassword.length < 6) {
      return toast.error('New password must be at least 6 characters long.');
    }
    
    setChangingPass(true);
    try {
      await api.put('/auth/change-password', { 
        currentPassword: passwords.currentPassword, 
        newPassword: passwords.newPassword 
      });
      toast.success('Password successfully updated!');
      setPasswords({ currentPassword: '', newPassword: '', confirm: '' });
      setShowPass({ current: false, new: false, confirm: false });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to change password. Please check your current password.');
    }
    setChangingPass(false);
  };

  const toggleShow = (field) => setShowPass(prev => ({ ...prev, [field]: !prev[field] }));

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6">
      
      {/* Premium Header */}
      <div className="flex flex-col items-center text-center mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="relative mb-6 group">
          <div className="absolute inset-0 bg-purple-600 blur-[30px] opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-full"></div>
          <div className="relative p-5 bg-gradient-to-br from-[#1a1a2e] to-[#0a0a12] rounded-full border border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.15)]">
            <ShieldCheck size={40} className="text-purple-400" />
          </div>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 tracking-tight" style={{ fontFamily: 'var(--font-outfit)' }}>
          Security Center
        </h1>
        <p className="text-gray-400 text-sm sm:text-base max-w-md">
          Manage your administrator credentials. Ensure your new password is strong and secure.
        </p>
      </div>

      {/* Security Form Card */}
      <div className="relative animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
        {/* Decorative backdrop glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 via-pink-500/20 to-purple-600/20 rounded-[2.5rem] blur-xl opacity-50"></div>
        
        <div className="relative bg-[#0d0d16] border border-white/10 rounded-[2rem] p-8 sm:p-10 shadow-2xl backdrop-blur-xl">
          
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                <Key size={20} className="text-purple-400" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-wide">Change Password</h2>
            </div>
            {/* Safe Status Badge */}
            <div className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 flex items-center gap-1.5 hidden sm:flex">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-xs font-semibold text-green-400 uppercase tracking-wider">Secure Connection</span>
            </div>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-6">
            
            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 ml-1">Current Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-purple-400 transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  type={showPass.current ? "text" : "password"} 
                  value={passwords.currentPassword} 
                  onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })} 
                  className="w-full bg-[#151520] border border-white/10 rounded-xl py-3.5 pl-11 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all shadow-inner"
                  placeholder="Enter current password"
                  required 
                />
                <button type="button" onClick={() => toggleShow('current')} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-white transition-colors">
                  {showPass.current ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            {/* New Password & Confirm (Side by Side on desktop) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 ml-1">New Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-purple-400 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input 
                    type={showPass.new ? "text" : "password"} 
                    value={passwords.newPassword} 
                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} 
                    className="w-full bg-[#151520] border border-white/10 rounded-xl py-3.5 pl-11 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all shadow-inner"
                    placeholder="Min. 6 characters"
                    required 
                  />
                  <button type="button" onClick={() => toggleShow('new')} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-white transition-colors">
                    {showPass.new ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 ml-1">Confirm Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-purple-400 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input 
                    type={showPass.confirm ? "text" : "password"} 
                    value={passwords.confirm} 
                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} 
                    className="w-full bg-[#151520] border border-white/10 rounded-xl py-3.5 pl-11 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all shadow-inner"
                    placeholder="Repeat new password"
                    required 
                  />
                  <button type="button" onClick={() => toggleShow('confirm')} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-white transition-colors">
                    {showPass.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-8 mt-6">
              <button 
                type="submit" 
                disabled={changingPass || !passwords.currentPassword || !passwords.newPassword || !passwords.confirm} 
                className="w-full relative group overflow-hidden rounded-xl p-[1px] disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                {/* Button border gradient */}
                <span className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 opacity-70 group-hover:opacity-100 transition-opacity"></span>
                <div className="relative bg-[#1a0e2e] py-3.5 px-8 rounded-xl flex items-center justify-center gap-2 transition-all">
                  <Key size={18} className="text-purple-400 group-hover:text-purple-300" />
                  <span className="font-bold text-white tracking-wide">
                    {changingPass ? 'Verifying & Updating...' : 'Update Administrator Password'}
                  </span>
                </div>
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
