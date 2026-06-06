'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Upload, X, Save, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { getOptimizedImage } from '@/lib/utils';

export default function EditCarPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newImages, setNewImages] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const [form, setForm] = useState({
    make: '', model: '', year: '', price: '', kms: '',
    fuelType: '', transmission: '', bodyType: '', color: '',
    owners: '1', seats: '', engineCC: '', insurance: '',
    registrationState: '', description: '', features: '',
    isFeatured: false, status: 'available', condition: 'used',
    exShowroomPrice: '', onRoadPrice: '', variants: ''
  });

  useEffect(() => {
    const fetchCar = async () => {
      try {
        // Fetch by ID — we need to use the cars list endpoint with a search
        const res = await api.get(`/cars?limit=100`);
        const car = (res.data.cars || []).find(c => c._id === id);
        if (!car) { toast.error('Car not found'); router.push('/admin/inventory'); return; }

        setForm({
          make: car.make || '', model: car.model || '',
          year: car.year || '', price: car.price || '', kms: car.kms || '',
          fuelType: car.fuelType || '', transmission: car.transmission || '',
          bodyType: car.bodyType || '', color: car.color || '',
          owners: car.owners || '1', seats: car.seats || '',
          engineCC: car.engineCC || '', insurance: car.insurance || '',
          registrationState: car.registrationState || '',
          description: car.description || '',
          features: (car.features || []).join(', '),
          isFeatured: car.isFeatured || false,
          status: car.status || 'available',
          condition: car.condition || 'used',
          exShowroomPrice: car.exShowroomPrice || '',
          onRoadPrice: car.onRoadPrice || '',
          variants: (car.variants || []).join(', ')
        });
        setExistingImages(car.images || []);
      } catch (err) {
        toast.error('Failed to load car');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchCar();
  }, [id, router]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleNewImages = (e) => {
    const files = Array.from(e.target.files);
    setNewImages([...newImages, ...files]);
    setNewPreviews([...newPreviews, ...files.map(f => URL.createObjectURL(f))]);
  };

  const removeNewImage = (i) => {
    const imgs = [...newImages]; const prevs = [...newPreviews];
    URL.revokeObjectURL(prevs[i]);
    imgs.splice(i, 1); prevs.splice(i, 1);
    setNewImages(imgs); setNewPreviews(prevs);
  };

  const removeExistingImage = (index) => {
    const img = existingImages[index];
    if (img.publicId) setDeletedImages([...deletedImages, img.publicId]);
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.make || !form.model) return toast.error('Brand and Model are required');
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v !== '' && v !== false) fd.append(k, v);
      });
      if (form.features) {
        fd.set('features', JSON.stringify(form.features.split(',').map(f => f.trim()).filter(Boolean)));
      }
      if (form.variants) {
        fd.set('variants', JSON.stringify(form.variants.split(',').map(v => v.trim()).filter(Boolean)));
      }
      fd.append('existingImages', JSON.stringify(existingImages));
      if (deletedImages.length > 0) {
        fd.append('deletedImages', JSON.stringify(deletedImages));
      }
      newImages.forEach(img => fd.append('images', img));

      await api.put(`/cars/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Car updated!');
      router.push('/admin/inventory');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="skeleton h-8 w-48 rounded" />
        <div className="skeleton h-[400px] rounded-2xl" />
      </div>
    );
  }

  return (
    <div>
      <Link href="/admin/inventory" className="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] mb-4 transition-colors">
        <ArrowLeft size={16} /> Back to Inventory
      </Link>
      <h1 className="text-2xl font-bold mb-6" style={{ fontFamily: 'var(--font-outfit)' }}>
        Edit Car — {form.make} {form.model}
      </h1>

      <form onSubmit={handleSubmit} className="glass-card p-6 hover:!transform-none space-y-6">
        {/* Car Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div><label className="input-label">Brand *</label><input name="make" value={form.make} onChange={handleChange} className="input-field" required /></div>
          <div><label className="input-label">Model *</label><input name="model" value={form.model} onChange={handleChange} className="input-field" required /></div>
          <div><label className="input-label">Year</label><input name="year" type="number" value={form.year} onChange={handleChange} className="input-field" /></div>
          <div><label className="input-label">Price (₹)</label><input name="price" type="number" value={form.price} onChange={handleChange} className="input-field" /></div>
          <div><label className="input-label">KM Driven</label><input name="kms" type="number" value={form.kms} onChange={handleChange} className="input-field" /></div>
          <div><label className="input-label">Condition</label><select name="condition" value={form.condition} onChange={handleChange} className="input-field"><option value="used">Used</option><option value="new">New (0km)</option></select></div>
          {form.condition === 'new' && (
            <>
              <div><label className="input-label">Ex-Showroom Price (₹)</label><input name="exShowroomPrice" type="number" value={form.exShowroomPrice} onChange={handleChange} className="input-field" /></div>
              <div><label className="input-label">On-Road Price (₹)</label><input name="onRoadPrice" type="number" value={form.onRoadPrice} onChange={handleChange} className="input-field" /></div>
            </>
          )}
          <div>
            <label className="input-label">Fuel Type</label>
            <select name="fuelType" value={form.fuelType} onChange={handleChange} className="input-field">
              <option value="">Select</option>
              {['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'].map(f => <option key={f}>{f}</option>)}
            </select>
          </div>
          <div>
            <label className="input-label">Transmission</label>
            <select name="transmission" value={form.transmission} onChange={handleChange} className="input-field">
              <option value="">Select</option>
              {['Manual', 'Automatic', 'AMT', 'CVT', 'DCT'].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="input-label">Body Type</label>
            <select name="bodyType" value={form.bodyType} onChange={handleChange} className="input-field">
              <option value="">Select</option>
              {['Sedan', 'SUV', 'Hatchback', 'MUV', 'Coupe', 'Convertible', 'Pickup', 'Van', 'Wagon'].map(b => <option key={b}>{b}</option>)}
            </select>
          </div>
          <div><label className="input-label">Color</label><input name="color" value={form.color} onChange={handleChange} className="input-field" /></div>
          <div><label className="input-label">Owners</label><input name="owners" type="number" value={form.owners} onChange={handleChange} className="input-field" min="1" /></div>
          <div>
            <label className="input-label">Insurance</label>
            <select name="insurance" value={form.insurance} onChange={handleChange} className="input-field">
              <option value="">Select</option>
              {['Comprehensive', 'Third Party', 'Expired', 'Zero Dep'].map(i => <option key={i}>{i}</option>)}
            </select>
          </div>
          <div>
            <label className="input-label">Status</label>
            <select name="status" value={form.status} onChange={handleChange} className="input-field">
              {['available', 'sold', 'reserved', 'upcoming'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="input-label">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} className="input-field" rows={3} />
        </div>
        <div>
          <label className="input-label">Features (comma-separated)</label>
          <input name="features" value={form.features} onChange={handleChange} className="input-field" placeholder="ABS, Airbags, Power Windows..." />
        </div>
        {form.condition === 'new' && (
          <div>
            <label className="input-label">Variants (comma-separated)</label>
            <input name="variants" value={form.variants} onChange={handleChange} className="input-field" placeholder="e.g. XZ+, Fearless, Creative" />
          </div>
        )}

        <div className="flex items-center gap-2">
          <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} className="w-4 h-4 accent-[var(--color-primary)]" />
          <label className="text-sm">Mark as Featured</label>
        </div>

        {/* Existing Images */}
        {existingImages.length > 0 && (
          <div>
            <label className="input-label">Current Photos</label>
            <div className="flex flex-wrap gap-3">
              {existingImages.map((img, i) => (
                <div key={i} className="relative w-28 h-22 rounded-lg overflow-hidden group border border-[var(--color-border)]">
                  <Image
                    src={getOptimizedImage(img.url, 200)}
                    alt={`Photo ${i + 1}`}
                    width={112}
                    height={88}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(i)}
                    className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={16} className="text-red-400" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New Images Upload */}
        <div>
          <label className="input-label">Add More Photos</label>
          <div
            className="border-2 border-dashed border-[var(--color-border)] rounded-xl p-6 text-center cursor-pointer hover:border-[var(--color-primary)] transition"
            onClick={() => document.getElementById('edit-car-images').click()}
          >
            <Upload size={24} className="mx-auto mb-2 text-[var(--color-text-muted)]" />
            <p className="text-sm text-[var(--color-text-secondary)]">Click to upload new photos</p>
            <input id="edit-car-images" type="file" accept="image/*" multiple onChange={handleNewImages} className="hidden" />
          </div>
          {newPreviews.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-4">
              {newPreviews.map((src, i) => (
                <div key={i} className="relative w-24 h-20 rounded-lg overflow-hidden group">
                  <Image src={src} alt="" width={96} height={80} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeNewImage(i)}
                    className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                  >
                    <X size={16} className="text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="btn-primary !py-3 !px-8">
            {saving ? 'Saving...' : <><Save size={16} /> Update Car</>}
          </button>
          <Link href="/admin/inventory" className="btn-outline !py-3 !px-6">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
