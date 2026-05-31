import { useState } from 'react';
import { Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadApi } from '@/apiservice/misc.api.js';
import { Spinner } from '@/components/common/Loader.jsx';

// Uploads images to Cloudinary and returns URLs via onChange.
// `multiple` toggles single string vs array-of-strings behaviour.
export default function ImageUploader({ value, onChange, multiple = false }) {
  const [uploading, setUploading] = useState(false);
  const urls = multiple ? value || [] : value ? [value] : [];

  const handleFiles = async (e) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    try {
      if (multiple) {
        const res = await uploadApi.images(files);
        onChange([...(value || []), ...res.data.urls]);
      } else {
        const res = await uploadApi.image(files[0]);
        onChange(res.data.url);
      }
    } catch {
      toast.error('Upload failed. Check Cloudinary config.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const removeAt = (i) => {
    if (multiple) onChange(value.filter((_, idx) => idx !== i));
    else onChange('');
  };

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {urls.map((url, i) => (
          <div key={i} className="relative h-24 w-24 overflow-hidden rounded-lg border">
            <img src={url} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => removeAt(i)}
              className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white"
            >
              <X size={12} />
            </button>
          </div>
        ))}
        <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-gray-300 text-gray-400 hover:border-primary-400 hover:text-primary-500">
          {uploading ? (
            <Spinner className="h-5 w-5" />
          ) : (
            <>
              <Upload size={18} />
              <span className="text-[10px]">Upload</span>
            </>
          )}
          <input type="file" accept="image/*" multiple={multiple} onChange={handleFiles} className="hidden" />
        </label>
      </div>
      <p className="mt-2 text-xs text-gray-400">PNG/JPG up to 5MB.</p>
    </div>
  );
}
