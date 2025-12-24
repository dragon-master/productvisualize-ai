import React, { useState } from 'react';
import { GeneratedImage } from '../types';
import { Download, Edit, Maximize2 } from 'lucide-react';
import EditorModal from './EditorModal';

interface ResultGalleryProps {
  results: GeneratedImage[];
  onRestart: () => void;
}

const ResultGallery: React.FC<ResultGalleryProps> = ({ results, onRestart }) => {
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  // Local state to track updates if an image is edited in the modal
  const [galleryImages, setGalleryImages] = useState<GeneratedImage[]>(results);

  // Sync props to state if new results come in (simple way, could use useEffect but this is safer for this scope)
  // Actually, let's trust the props initially, but allow local overrides for edits.
  // Better pattern: Update the local state when modal saves.
  
  const handleUpdateImage = (id: string, newUrl: string) => {
    setGalleryImages(prev => prev.map(img => 
      img.id === id ? { ...img, imageUrl: newUrl } : img
    ));
    
    // Also update selected image so the modal doesn't jump back
    if (selectedImage && selectedImage.id === id) {
      setSelectedImage(prev => prev ? { ...prev, imageUrl: newUrl } : null);
    }
  };

  // Allow downloading
  const handleDownload = (url: string, name: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `product-visualize-${name}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto mt-8 px-4 pb-20">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-white">Generated Assets</h2>
        <button 
          onClick={onRestart}
          className="text-slate-400 hover:text-white hover:underline decoration-indigo-500 underline-offset-4"
        >
          Start New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {galleryImages.map((image) => (
          <div 
            key={image.id} 
            className="group relative bg-slate-800 rounded-xl overflow-hidden shadow-lg border border-slate-700 hover:border-indigo-500/50 transition-all duration-300"
          >
            <div className="aspect-square w-full bg-slate-900 relative overflow-hidden">
               {/* Image */}
               <img 
                 src={image.imageUrl} 
                 alt={image.scenarioName} 
                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
               />
               
               {/* Overlay Actions */}
               <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-4">
                  <button
                    onClick={() => setSelectedImage(image)}
                    className="bg-white text-slate-900 px-6 py-2 rounded-full font-semibold flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-200"
                  >
                    <Edit className="w-4 h-4" />
                    Edit with AI
                  </button>
                  <div className="flex gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-200 delay-75">
                     <button 
                        onClick={() => handleDownload(image.imageUrl, image.scenarioName)}
                        className="p-2 bg-slate-700 hover:bg-slate-600 rounded-full text-white transition-colors"
                        title="Download"
                     >
                       <Download className="w-5 h-5" />
                     </button>
                     <button 
                        onClick={() => setSelectedImage(image)}
                        className="p-2 bg-slate-700 hover:bg-slate-600 rounded-full text-white transition-colors"
                        title="Fullscreen/Edit"
                     >
                       <Maximize2 className="w-5 h-5" />
                     </button>
                  </div>
               </div>
            </div>
            
            <div className="p-4 border-t border-slate-700">
              <h3 className="font-semibold text-white">{image.scenarioName}</h3>
              <p className="text-xs text-slate-500 mt-1 truncate">
                {new Date(image.timestamp).toLocaleTimeString()} • Gemini 2.5 Flash
              </p>
            </div>
          </div>
        ))}
      </div>

      {selectedImage && (
        <EditorModal 
          image={selectedImage} 
          onClose={() => setSelectedImage(null)}
          onUpdateImage={handleUpdateImage}
        />
      )}
    </div>
  );
};

export default ResultGallery;
