import React, { useState } from 'react';
import { X, Wand2, Download, RefreshCw } from 'lucide-react';
import { GeneratedImage } from '../types';
import { editGeneratedImage } from '../services/geminiService';

interface EditorModalProps {
  image: GeneratedImage;
  onClose: () => void;
  onUpdateImage: (id: string, newUrl: string) => void;
}

const EditorModal: React.FC<EditorModalProps> = ({ image, onClose, onUpdateImage }) => {
  const [prompt, setPrompt] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState(image.imageUrl);
  const [error, setError] = useState<string | null>(null);

  const handleEdit = async () => {
    if (!prompt.trim()) return;
    
    setIsEditing(true);
    setError(null);
    try {
      // We edit the CURRENT state of the image, allowing iterative edits
      const newImageUrl = await editGeneratedImage(currentImageUrl, prompt);
      setCurrentImageUrl(newImageUrl);
      onUpdateImage(image.id, newImageUrl);
      setPrompt(''); // Clear prompt on success
    } catch (err) {
      setError("Failed to edit image. Please try again.");
    } finally {
      setIsEditing(false);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = currentImageUrl;
    link.download = `edited-${image.scenarioName}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-indigo-400" />
            Edit: {image.scenarioName}
          </h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-950 flex flex-col items-center justify-center">
           <div className="relative group max-w-full max-h-[50vh]">
              <img 
                src={currentImageUrl} 
                alt="Editing target" 
                className="max-h-[50vh] rounded-lg shadow-lg object-contain"
              />
              {isEditing && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                  <div className="flex flex-col items-center">
                    <RefreshCw className="w-10 h-10 text-indigo-400 animate-spin mb-2" />
                    <span className="text-white font-medium">Applying magic...</span>
                  </div>
                </div>
              )}
           </div>
           
           {error && (
             <div className="mt-4 text-red-400 bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20">
               {error}
             </div>
           )}
        </div>

        {/* Footer Controls */}
        <div className="p-6 border-t border-slate-700 bg-slate-800 space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your edit (e.g., 'Add a sunset filter', 'Make it snowing')"
              className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              onKeyDown={(e) => e.key === 'Enter' && handleEdit()}
            />
            <button
              onClick={handleEdit}
              disabled={isEditing || !prompt.trim()}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-500 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Wand2 className="w-4 h-4" />
              Apply
            </button>
          </div>
          
          <div className="flex justify-between items-center pt-2">
             <button 
                onClick={handleDownload}
                className="text-slate-400 hover:text-white text-sm flex items-center gap-2 px-3 py-2 hover:bg-slate-700 rounded-lg transition-colors"
             >
               <Download className="w-4 h-4" />
               Download Image
             </button>
             <p className="text-xs text-slate-500">
               Powered by Gemini 2.5 Flash Image
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorModal;
