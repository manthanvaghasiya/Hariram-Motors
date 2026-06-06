'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, X, Save } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';
import api from '@/lib/api';

export default function AddCarPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [form, setForm] = useState({
    make: '', model: '', year: '', price: '', kms: '',
    fuelType: '', transmission: '', bodyType: '', color: '',
    owners: '1', seats: '', engineCC: '', insurance: '',
    registrationState: '', description: '', features: '',
    isFeatured: false, status: 'available',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    setImages([...images, ...files]);
    setPreviews([...previews, ...files.map(f => URL.createObjectURL(f))]);
  };

  const removeImage = (i) => {
    const newImages = [...images]; const newPreviews = [...previews];
    URL.revokeObjectURL(newPreviews[i]);
    newImages.splice(i, 1); newPreviews.splice(i, 1);
    setImages(newImages); setPreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.make || !form.model) return toast.error('Brand and Model are required');
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v !== '' && v !== false) fd.append(k, v); });
      if (form.features) fd.set('features', JSON.stringify(form.features.split(',').map(f => f.trim()).filter(Boolean)));
      images.forEach(img => fd.append('images', img));
      await api.post('/cars', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Car added!');
      router.push('/admin/inventory');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed');
    }
    setLoading(false);
  };

  return (
    <div>
      <Link href="/admin/inventory" className="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] mb-4 transition-colors">
        <ArrowLeft size={16} /> Back to Inventory
      </Link>
      <h1 className="text-2xl font-bold mb-6" style={{ fontFamily: 'var(--font-outfit)' }}>Add New Car</h1>

      <form onSubmit={handleSubmit} className="glass-card p-6 hover:!transform-none space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div><label className="input-label">Brand *</label><input name="make" value={form.make} onChange={handleChange} className="input-field" placeholder="e.g. Maruti Suzuki" required /></div>
          <div><label className="input-label">Model *</label><input name="model" value={form.model} onChange={handleChange} className="input-field" placeholder="e.g. Swift" required /></div>
          <div><label className="input-label">Year</label><input name="year" type="number" value={form.year} onChange={handleChange} className="input-field" placeholder="e.g. 2021" /></div>
          <div><label className="input-label">Price (₹)</label><input name="price" type="number" value={form.price} onChange={handleChange} className="input-field" placeholder="e.g. 650000" /></div>
          <div><label className="input-label">KM Driven</label><input name="kms" type="number" value={form.kms} onChange={handleChange} className="input-field" placeholder="e.g. 35000" /></div>
          <div><label className="input-label">Fuel Type</label><select name="fuelType" value={form.fuelType} onChange={handleChange} className="input-field"><option value="">Select</option>{['Petrol','Diesel','CNG','Electric','Hybrid'].map(f => <option key={f}>{f}</option>)}</select></div>
          <div><label className="input-label">Transmission</label><select name="transmission" value={form.transmission} onChange={handleChange} className="input-field"><option value="">Select</option>{['Manual','Automatic','AMT','CVT','DCT'].map(t => <option key={t}>{t}</option>)}</select></div>
          <div><label className="input-label">Body Type</label><select name="bodyType" value={form.bodyType} onChange={handleChange} className="input-field"><option value="">Select</option>{['Sedan','SUV','Hatchback','MUV','Coupe','Convertible','Pickup','Van','Wagon'].map(b => <option key={b}>{b}</option>)}</select></div>
          <div><label className="input-label">Color</label><input name="color" value={form.color} onChange={handleChange} className="input-field" placeholder="e.g. White" /></div>
          <div><label className="input-label">Owners</label><input name="owners" type="number" value={form.owners} onChange={handleChange} className="input-field" min="1" /></div>
          <div><label className="input-label">Insurance</label><select name="insurance" value={form.insurance} onChange={handleChange} className="input-field"><option value="">Select</option>{['Comprehensive','Third Party','Expired','Zero Dep'].map(i => <option key={i}>{i}</option>)}</select></div>
          <div><label className="input-label">Status</label><select name="status" value={form.status} onChange={handleChange} className="input-field">{['available','sold','reserved','upcoming'].map(s => <option key={s}>{s}</option>)}</select></div>
        </div>

        <div><label className="input-label">Description</label><textarea name="description" value={form.description} onChange={handleChange} className="input-field" rows={3} placeholder="Describe the car..." /></div>
        <div><label className="input-label">Features (comma-separated)</label><input name="features" value={form.features} onChange={handleChange} className="input-field" placeholder="ABS, Airbags, Power Windows..." /></div>

        <div className="flex items-center gap-2">
          <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} className="w-4 h-4 accent-[var(--color-primary)]" />
          <label className="text-sm">Mark as Featured</label>
        </div>

        {/* Images */}
        <div>
          <label className="input-label">Photos</label>
          <div className="border-2 border-dashed border-[var(--color-border)] rounded-xl p-6 text-center cursor-pointer hover:border-[var(--color-primary)] transition" onClick={() => document.getElementById('car-images').click()}>
            <Upload size={24} className="mx-auto mb-2 text-[var(--color-text-muted)]" />
            <p className="text-sm text-[var(--color-text-secondary)]">Click to upload photos</p>
            <input id="car-images" type="file" accept="image/*" multiple onChange={handleImages} className="hidden" />
          </div>
          {previews.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-4">
              {previews.map((src, i) => (
                <div key={i} className="relative w-24 h-20 rounded-lg overflow-hidden group">
                  <Image src={src} alt="" fill className="object-cover" />
                  <button type="button" onClick={() => removeImage(i)} className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"><X size={16} className="text-white" /></button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button type="submit" disabled={loading} className="btn-primary !py-3 !px-8">
          {loading ? 'Saving...' : <><Save size={16} /> Save Car</>}
        </button>
      </form>
    </div>
  );
}
