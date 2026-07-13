'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IconTrash, IconMailOpened, IconMail, IconPhoneCall, 
  IconBrandWhatsapp, IconMessageCircle, IconCalendar, 
  IconUser, IconSearch, IconX, IconInbox
} from '@tabler/icons-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { getWhatsAppLink } from '@/lib/utils';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchMessages = async () => {
    try {
      const res = await api.get('/messages?limit=100');
      setMessages(res.data.messages || []);
    } catch {
      toast.error('Failed to load messages');
    }
    setLoading(false);
  };

  useEffect(() => { fetchMessages(); }, []);

  const toggleRead = async (id, currentStatus) => {
    try {
      await api.put(`/messages/${id}/read`);
      // Optimistic update
      setMessages(messages.map(msg => 
        msg._id === id ? { ...msg, isRead: !currentStatus } : msg
      ));
      if (selectedMessage?._id === id) {
        setSelectedMessage({ ...selectedMessage, isRead: !currentStatus });
      }
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleSelectMessage = (msg) => {
    setSelectedMessage(msg);
    // Auto-mark as read if unread
    if (!msg.isRead) {
      toggleRead(msg._id, msg.isRead);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      await api.delete(`/messages/${id}`);
      toast.success('Message deleted');
      setMessages(messages.filter(msg => msg._id !== id));
      if (selectedMessage?._id === id) setSelectedMessage(null);
    } catch { 
      toast.error('Failed to delete'); 
    }
  };

  const filteredMessages = messages.filter(msg => 
    msg.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    msg.phone?.includes(searchQuery) ||
    msg.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.20))] overflow-hidden -mx-4 sm:-mx-6 lg:-mx-8">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-4 sm:px-6 lg:px-8 py-4 bg-white/[0.02] border-b border-white/5 shrink-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-1" style={{ fontFamily: 'var(--font-outfit)' }}>
            Customer Messages
          </h1>
          <p className="text-xs text-gray-400">
            {messages.length} total • {messages.filter(m => !m.isRead).length} unread
          </p>
        </div>
        
        <div className="relative w-full sm:w-64">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input 
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-all placeholder-gray-500"
          />
        </div>
      </div>

      {/* DUAL PANE LAYOUT */}
      <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative">
        
        {/* LEFT PANE: MESSAGE LIST */}
        <div className={`lg:col-span-4 border-r border-white/5 bg-[#0a0a12]/50 flex flex-col overflow-hidden transition-transform duration-300 ${selectedMessage ? 'hidden lg:flex' : 'flex'}`}>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
            {loading ? (
              [...Array(6)].map((_, i) => (
                <div key={i} className="h-20 bg-white/5 rounded-xl animate-pulse border border-white/5" />
              ))
            ) : filteredMessages.length > 0 ? (
              filteredMessages.map((msg) => (
                <div 
                  key={msg._id} 
                  onClick={() => handleSelectMessage(msg)}
                  className={`p-3 rounded-xl cursor-pointer border transition-all duration-300 relative overflow-hidden group ${
                    selectedMessage?._id === msg._id 
                      ? 'bg-purple-500/10 border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.1)]' 
                      : !msg.isRead 
                        ? 'bg-white/[0.03] border-white/10 hover:border-purple-500/30 hover:bg-white/[0.06]' 
                        : 'bg-transparent border-transparent hover:bg-white/[0.02] hover:border-white/5 opacity-70 hover:opacity-100'
                  }`}
                >
                  {!msg.isRead && (
                    <div className="absolute top-0 left-0 w-1 h-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
                  )}
                  
                  <div className="flex justify-between items-start mb-1.5">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <h3 className={`text-sm font-bold truncate font-['Outfit'] ${!msg.isRead ? 'text-white' : 'text-gray-300'}`}>
                        {msg.name}
                      </h3>
                      {!msg.isRead && (
                        <span className="shrink-0 bg-purple-500/20 text-purple-400 text-[9px] uppercase font-bold px-1.5 py-0.5 rounded border border-purple-500/30">
                          New
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-gray-500 whitespace-nowrap shrink-0 ml-2 mt-0.5">
                      {new Date(msg.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                  
                  <p className="text-xs text-gray-400 line-clamp-1 mb-2">
                    {msg.message}
                  </p>
                  
                  <div className="flex items-center gap-2 text-[11px] text-gray-500">
                    <span className="flex items-center gap-1"><IconPhoneCall size={10} /> {msg.phone}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 py-12">
                <IconInbox size={48} className="mb-4 opacity-20" />
                <p>No messages found</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANE: MESSAGE DETAILS */}
        <div className={`lg:col-span-8 bg-[#0a0a12] flex flex-col overflow-hidden relative ${!selectedMessage ? 'hidden lg:flex' : 'flex'}`}>
          {selectedMessage ? (
            <>
              {/* Details Header */}
              <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/[0.01]">
                
                {/* Mobile Back Button */}
                <button 
                  onClick={() => setSelectedMessage(null)}
                  className="lg:hidden flex items-center gap-2 text-gray-400 hover:text-white mb-1"
                >
                  <IconX size={18} />
                  <span className="text-xs font-bold uppercase tracking-wider">Close</span>
                </button>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                    <IconUser size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white font-['Outfit'] leading-tight">{selectedMessage.name}</h2>
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mt-0.5">
                      <IconCalendar size={10} />
                      {new Date(selectedMessage.createdAt).toLocaleString('en-IN', { 
                        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' 
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => toggleRead(selectedMessage._id, selectedMessage.isRead)} 
                    className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-gray-400 hover:text-white transition-all group"
                    title={selectedMessage.isRead ? 'Mark as Unread' : 'Mark as Read'}
                  >
                    {selectedMessage.isRead ? <IconMailOpened size={16} /> : <IconMail size={16} className="text-purple-400" />}
                  </button>
                  <button 
                    onClick={() => handleDelete(selectedMessage._id)} 
                    className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40 text-red-400 transition-all"
                    title="Delete Message"
                  >
                    <IconTrash size={16} />
                  </button>
                </div>
              </div>

              {/* Message Body */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-5">
                
                {/* Contact Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                      <IconPhoneCall size={16} />
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-0.5">Phone</div>
                      <div className="text-sm text-white font-['Inter'] truncate">{selectedMessage.phone}</div>
                    </div>
                  </div>
                  
                  {selectedMessage.email && (
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400 shrink-0">
                        <IconMail size={16} />
                      </div>
                      <div className="overflow-hidden">
                        <div className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-0.5">Email</div>
                        <div className="text-sm text-white font-['Inter'] truncate">{selectedMessage.email}</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Message Content */}
                <div className="mb-6">
                  <div className="flex items-center gap-1.5 mb-3">
                    <IconMessageCircle size={14} className="text-purple-400" />
                    <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Message</h3>
                  </div>
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 text-gray-300 font-['Inter'] text-sm leading-relaxed whitespace-pre-wrap shadow-inner relative">
                    <IconMessageCircle className="absolute top-3 right-3 text-white/5" size={48} />
                    <span className="relative z-10">{selectedMessage.message}</span>
                  </div>
                </div>

              </div>

              {/* Action Footer */}
              <div className="p-4 border-t border-white/5 bg-[#0a0a12]/80 backdrop-blur-md">
                <div className="flex flex-col sm:flex-row gap-3">
                  <a 
                    href={getWhatsAppLink(selectedMessage.phone, 'Hi, I received your message on Hariram Motors.')}
                    target="_blank" rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 bg-[#25D366]/10 border border-[#25D366]/30 hover:bg-[#25D366]/20 text-[#25D366] py-2.5 rounded-lg text-sm font-bold transition-all"
                  >
                    <IconBrandWhatsapp size={16} />
                    Reply on WhatsApp
                  </a>
                  
                  <a 
                    href={`tel:${selectedMessage.phone}`}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20 text-blue-400 py-2.5 rounded-lg text-sm font-bold transition-all"
                  >
                    <IconPhoneCall size={16} />
                    Call Customer
                  </a>
                </div>
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 relative overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-500/5 blur-[100px] rounded-full pointer-events-none"></div>
              <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-gray-600 relative z-10">
                <IconMessageCircle size={40} />
              </div>
              <h2 className="text-2xl font-bold text-white font-['Outfit'] mb-2 relative z-10">Select a Message</h2>
              <p className="text-gray-400 max-w-md relative z-10">
                Click on any message from the list to view its full contents, mark it as read, or reply directly.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
