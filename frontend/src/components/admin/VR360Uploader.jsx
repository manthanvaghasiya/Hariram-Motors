import React, { useState } from 'react';
import axios from 'axios';
import { UploadCloud, CheckCircle, AlertCircle, Loader2, X } from 'lucide-react';
import toast from 'react-hot-toast';

const CLOUDINARY_UPLOAD_PRESET = 'car_360_uploads';
const CLOUDINARY_CLOUD_NAME = 'dijf9umhc';

const VR360Uploader = ({ onUploadComplete, initialImages = [] }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);
  const [error, setError] = useState('');
  const [uploadedUrls, setUploadedUrls] = useState(initialImages);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setError('');

    if (files.length === 0) return;

    if (files.length < 24) {
      setError('Warning: For a smooth 360° spin, we recommend at least 24 images.');
    }
    if (files.length > 72) {
      setError('Too many images. Please limit to 36-72 images maximum.');
      return;
    }

    // Sort files by name to ensure they stay in the correct spin order (Critical for 360 viewer)
    const sortedFiles = files.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));
    setSelectedFiles(sortedFiles);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);
    setError('');
    setOverallProgress(0);

    const currentUrls = [];
    const totalFiles = selectedFiles.length;
    let completedFiles = 0;

    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

    try {
      // Sequential upload to avoid browser/Cloudinary rate limits
      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        formData.append('file', file);

        console.log(`Uploading ${file.name} to Cloudinary...`);

        const response = await axios.post(cloudinaryUrl, formData, {
          onUploadProgress: (progressEvent) => {
            const fileProgress = progressEvent.loaded / progressEvent.total;
            const totalProgress = Math.round(((completedFiles + fileProgress) / totalFiles) * 100);
            setOverallProgress(totalProgress);
          }
        });

        currentUrls.push(response.data.secure_url);
        completedFiles++;
        setOverallProgress(Math.round((completedFiles / totalFiles) * 100));
      }

      // Success! Pass URLs back
      setUploadedUrls(currentUrls);
      onUploadComplete(currentUrls);
      setIsUploading(false);
      setSelectedFiles([]); // Clear queue after success
      toast.success('360° Sequence Uploaded Successfully!');

    } catch (err) {
      console.error("Cloudinary Error Details:", err.response?.data);
      const errorMessage = err.response?.data?.error?.message || 'Upload failed. Please check your internet connection.';
      setError(`Cloudinary Error: ${errorMessage}`);
      setIsUploading(false);
      toast.error(`Error: ${errorMessage}`);
    }
  };

  const removeUploadedImage = (index) => {
    const newUrls = uploadedUrls.filter((_, i) => i !== index);
    setUploadedUrls(newUrls);
    onUploadComplete(newUrls);
  };

  const removeSelectedFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    if (selectedFiles.length - 1 < 24 && selectedFiles.length - 1 > 0) {
      setError('Warning: At least 24 images are recommended.');
    } else {
      setError('');
    }
  };

  return (
    <div className="p-6 bg-surface border border-gray-100 rounded-3xl shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-heading font-bold text-text uppercase tracking-tight">Upload 360° Spin Photos</h3>
        {uploadedUrls.length > 0 && (
          <span className="px-3 py-1 bg-accent/10 text-accent text-[10px] font-bold rounded-full uppercase tracking-widest">
            {uploadedUrls.length} Live Frames
          </span>
        )}
      </div>
      <p className="text-sm font-body text-text-muted mb-6">Select 24 to 36 sequential photos. We process them for zero-lag spinning.</p>

      {/* Dropzone Area */}
      <div
        className="relative border-4 border-dashed border-gray-100 rounded-2xl p-10 text-center hover:bg-gray-50/50 hover:border-accent/20 transition-all cursor-pointer group"
        onClick={() => !isUploading && document.getElementById('vr-file-input').click()}
      >
        <input
          id="vr-file-input"
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          disabled={isUploading}
          className="hidden"
        />

        <div className="w-16 h-16 bg-accent/5 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
          <UploadCloud className="w-8 h-8 text-accent" />
        </div>
        <p className="font-heading font-bold text-text text-base">
          Click to drag 36 photos here
        </p>
        <p className="font-body text-xs text-text-muted mt-2">Sequential JPEG or PNG images (up to 10MB each)</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 flex items-center gap-2 text-amber-600 bg-amber-50 p-4 rounded-xl text-xs font-semibold animate-pulse">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Selected Files Info & Upload Button */}
      {selectedFiles.length > 0 && !isUploading && (
        <div className="mt-6">
          <div className="flex items-center justify-between bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50 mb-4">
            <div>
              <p className="font-heading font-black text-blue-900 text-sm">{selectedFiles.length} IMAGES READY</p>
              <p className="font-body text-[10px] text-blue-700 font-bold uppercase tracking-wider">Sequential processing active</p>
            </div>
            <button
              onClick={handleUpload}
              type="button"
              className="px-6 py-2.5 bg-accent hover:bg-accent-hover text-white text-xs font-black rounded-xl shadow-lg shadow-accent/20 transition-all uppercase tracking-widest"
            >
              Start Syncing
            </button>
          </div>

          {/* Quick List Preview */}
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
            {selectedFiles.map((file, i) => (
              <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); removeSelectedFile(i); }}
                  className="absolute top-1 right-1 p-0.5 bg-black/50 text-white rounded-full hover:bg-red-500 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Progress Bar UI */}
      {isUploading && (
        <div className="mt-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
          <div className="flex justify-between text-xs font-bold text-text-muted mb-3 uppercase tracking-widest">
            <span className="flex items-center gap-2 italic">
              <Loader2 className="w-4 h-4 animate-spin text-accent" />
              Cloud Processing...
            </span>
            <span>{overallProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-accent h-full rounded-full transition-all duration-300"
              style={{ width: `${overallProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Uploaded Gallery Preview */}
      {uploadedUrls.length > 0 && !isUploading && (
        <div className="mt-8 pt-8 border-t border-dashed border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-heading font-black text-xs text-text-muted uppercase tracking-widest">Live Spin Sequence</h4>
            <span className="text-[10px] font-bold text-accent italic">Sorted by Filename</span>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
            {uploadedUrls.map((url, index) => (
              <div key={index} className="relative group aspect-square rounded-xl overflow-hidden shadow-sm border border-gray-100">
                <img src={url} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center border-2 border-accent/20 rounded-xl">
                  <button
                    type="button"
                    onClick={() => removeUploadedImage(index)}
                    className="p-1.5 bg-white text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VR360Uploader;
