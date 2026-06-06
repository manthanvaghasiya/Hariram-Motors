'use client';

import { useEffect, useState } from 'react';
import { Trash2, Mail, MailOpen, Phone } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const res = await api.get('/messages?limit=50');
      setMessages(res.data.messages || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchMessages(); }, []);

  const toggleRead = async (id) => {
    try {
      await api.put(`/messages/${id}/read`);
      fetchMessages();
    } catch {}
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this message?')) return;
    try {
      await api.delete(`/messages/${id}`);
      toast.success('Deleted');
      fetchMessages();
    } catch { toast.error('Failed'); }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6" style={{ fontFamily: 'var(--font-outfit)' }}>Messages</h1>

      <div className="space-y-3">
        {loading ? (
          [...Array(4)].map((_, i) => <div key={i} className="skeleton h-24 rounded-2xl" />)
        ) : messages.length > 0 ? (
          messages.map((msg) => (
            <div key={msg._id} className={`glass-card p-5 hover:!transform-none ${!msg.isRead ? 'border-l-4 !border-l-[var(--color-primary)]' : ''}`}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold">{msg.name}</h3>
                    {!msg.isRead && <span className="badge badge-featured">New</span>}
                  </div>
                  <p className="text-sm text-[var(--color-text-secondary)] mb-2">{msg.message}</p>
                  <div className="flex items-center gap-4 text-xs text-[var(--color-text-muted)]">
                    <span className="flex items-center gap-1"><Phone size={12} /> {msg.phone}</span>
                    {msg.email && <span>📧 {msg.email}</span>}
                    <span>{new Date(msg.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button onClick={() => toggleRead(msg._id)} className="p-2 hover:text-[var(--color-primary)] transition" title={msg.isRead ? 'Mark unread' : 'Mark read'}>
                    {msg.isRead ? <MailOpen size={16} /> : <Mail size={16} />}
                  </button>
                  <button onClick={() => handleDelete(msg._id)} className="p-2 hover:text-[var(--color-accent-red)] transition" title="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center py-12 text-[var(--color-text-muted)]">No messages yet</p>
        )}
      </div>
    </div>
  );
}
