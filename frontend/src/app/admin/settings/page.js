'use client';

import { useEffect, useState } from 'react';
import { Save, Key } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    dealershipName: '', tagline: '', phone: '', whatsapp: '',
    email: '', address: '', googleMapsUrl: '',
    yearsInBusiness: '', carsSold: '', happyCustomers: '',
    aboutText: '', missionText: '',
  });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPass, setChangingPass] = useState(false);

  useEffect(() => {
    api.get('/site-settings').then(res => {
      const d = res.data;
      setSettings({
        dealershipName: d.dealershipName || '',
        tagline: d.tagline || '',
        phone: d.phone || '',
        whatsapp: d.whatsapp || '',
        email: d.email || '',
        address: d.address || '',
        googleMapsUrl: d.googleMapsUrl || '',
        yearsInBusiness: d.yearsInBusiness || '',
        carsSold: d.carsSold || '',
        happyCustomers: d.happyCustomers || '',
        aboutText: d.aboutText || '',
        missionText: d.missionText || '',
      });
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/site-settings', settings);
      toast.success('Settings saved!');
    } catch { toast.error('Failed'); }
    setSaving(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirm) return toast.error('Passwords do not match');
    if (passwords.newPassword.length < 6) return toast.error('Min 6 characters');
    setChangingPass(true);
    try {
      await api.put('/auth/change-password', { currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
      toast.success('Password changed!');
      setPasswords({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed');
    }
    setChangingPass(false);
  };

  const handleChange = (key, value) => {
    setSettings({ ...settings, [key]: value });
  };

  if (loading) return <div className="space-y-4">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-12 rounded-xl" />)}</div>;

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-6" style={{ fontFamily: 'var(--font-outfit)' }}>Settings</h1>

      {/* Site Settings */}
      <div className="glass-card p-6 mb-6 hover:!transform-none space-y-5">
        <h2 className="text-lg font-semibold">Dealership Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="input-label">Name</label><input value={settings.dealershipName} onChange={(e) => handleChange('dealershipName', e.target.value)} className="input-field" /></div>
          <div><label className="input-label">Tagline</label><input value={settings.tagline} onChange={(e) => handleChange('tagline', e.target.value)} className="input-field" /></div>
          <div><label className="input-label">Phone</label><input value={settings.phone} onChange={(e) => handleChange('phone', e.target.value)} className="input-field" /></div>
          <div><label className="input-label">WhatsApp</label><input value={settings.whatsapp} onChange={(e) => handleChange('whatsapp', e.target.value)} className="input-field" /></div>
          <div><label className="input-label">Email</label><input value={settings.email} onChange={(e) => handleChange('email', e.target.value)} className="input-field" /></div>
          <div><label className="input-label">Address</label><input value={settings.address} onChange={(e) => handleChange('address', e.target.value)} className="input-field" /></div>
        </div>

        <h2 className="text-lg font-semibold pt-4">Stats (displayed on website)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div><label className="input-label">Years in Business</label><input type="number" value={settings.yearsInBusiness} onChange={(e) => handleChange('yearsInBusiness', e.target.value)} className="input-field" /></div>
          <div><label className="input-label">Cars Sold</label><input type="number" value={settings.carsSold} onChange={(e) => handleChange('carsSold', e.target.value)} className="input-field" /></div>
          <div><label className="input-label">Happy Customers</label><input type="number" value={settings.happyCustomers} onChange={(e) => handleChange('happyCustomers', e.target.value)} className="input-field" /></div>
        </div>

        <h2 className="text-lg font-semibold pt-4">About Page Content</h2>
        <div><label className="input-label">About Text</label><textarea value={settings.aboutText} onChange={(e) => handleChange('aboutText', e.target.value)} className="input-field" rows={3} /></div>
        <div><label className="input-label">Mission Text</label><textarea value={settings.missionText} onChange={(e) => handleChange('missionText', e.target.value)} className="input-field" rows={3} /></div>

        <button onClick={handleSave} disabled={saving} className="btn-primary !py-3">
          {saving ? 'Saving...' : <><Save size={16} /> Save Settings</>}
        </button>
      </div>

      {/* Change Password */}
      <form onSubmit={handleChangePassword} className="glass-card p-6 hover:!transform-none space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2"><Key size={18} className="text-[var(--color-primary)]" /> Change Password</h2>
        <div><label className="input-label">Current Password</label><input type="password" value={passwords.currentPassword} onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })} className="input-field" required /></div>
        <div><label className="input-label">New Password</label><input type="password" value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} className="input-field" required /></div>
        <div><label className="input-label">Confirm New Password</label><input type="password" value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} className="input-field" required /></div>
        <button type="submit" disabled={changingPass} className="btn-outline !py-2.5">
          {changingPass ? 'Changing...' : 'Change Password'}
        </button>
      </form>
    </div>
  );
}
