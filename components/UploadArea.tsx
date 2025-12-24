import React, { useCallback } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface UploadAreaProps {
  onImageSelected: (base64: string) => void;
}

const UploadArea: React.FC<UploadAreaProps> = ({ onImageSelected }) => {
  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        onImageSelected(base64String);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageSelected]);

  return (
    <div className="w-full max-w-2xl mx-auto mt-10">
      <div className="relative border-2 border-dashed border-slate-600 rounded-2xl bg-slate-800/50 hover:bg-slate-800 transition-colors group">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <div className="p-4 bg-indigo-500/20 rounded-full mb-4 group-hover:scale-110 transition-transform">
            <Upload className="w-10 h-10 text-indigo-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Upload your product image
          </h3>
          <p className="text-slate-400 max-w-sm">
            Drag and drop or click to upload. Recommended: Clear product shot with simple background.
          </p>
        </div>
      </div>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
          <div className="w-8 h-8 mx-auto bg-green-500/20 rounded-full flex items-center justify-center mb-3">
            <ImageIcon className="w-4 h-4 text-green-400" />
          </div>
          <h4 className="text-sm font-medium text-slate-200">High Resolution</h4>
          <p className="text-xs text-slate-500 mt-1">Best results with 1024x1024+</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
          <div className="w-8 h-8 mx-auto bg-blue-500/20 rounded-full flex items-center justify-center mb-3">
            <div className="w-4 h-4 rounded-sm border-2 border-blue-400"></div>
          </div>
          <h4 className="text-sm font-medium text-slate-200">Clear Subject</h4>
          <p className="text-xs text-slate-500 mt-1">Avoid cluttered backgrounds</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
          <div className="w-8 h-8 mx-auto bg-purple-500/20 rounded-full flex items-center justify-center mb-3">
            <div className="w-4 h-4 bg-purple-400 rounded-full"></div>
          </div>
          <h4 className="text-sm font-medium text-slate-200">Consistency</h4>
          <p className="text-xs text-slate-500 mt-1">AI keeps your branding intact</p>
        </div>
      </div>
    </div>
  );
};

export default UploadArea;
