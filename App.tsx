import React, { useState } from 'react';
import { Package } from 'lucide-react';
import UploadArea from './components/UploadArea';
import ScenarioSelector from './components/ScenarioSelector';
import ResultGallery from './components/ResultGallery';
import { AppState, GeneratedImage } from './types';
import { SCENARIOS } from './constants';
import { generateMarketingImage } from './services/geminiService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.UPLOAD);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>([]);
  const [generatedResults, setGeneratedResults] = useState<GeneratedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleImageSelected = (base64: string) => {
    setOriginalImage(base64);
    setAppState(AppState.SELECT_SCENARIO);
  };

  const handleToggleScenario = (id: string) => {
    setSelectedScenarios(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleGenerate = async () => {
    if (!originalImage || selectedScenarios.length === 0) return;

    setIsGenerating(true);
    const newResults: GeneratedImage[] = [];

    // Process scenarios sequentially to avoid hitting rate limits too hard, 
    // or parallel if the quota allows. Let's do parallel for UX speed but handle errors gracefully.
    const promises = selectedScenarios.map(async (scenarioId) => {
      const scenario = SCENARIOS.find(s => s.id === scenarioId);
      if (!scenario) return null;

      try {
        const generatedUrl = await generateMarketingImage(originalImage, scenario.promptTemplate);
        
        return {
          id: `${scenarioId}-${Date.now()}`,
          originalImageBase64: originalImage,
          imageUrl: generatedUrl,
          scenarioName: scenario.name,
          promptUsed: scenario.promptTemplate,
          timestamp: Date.now()
        } as GeneratedImage;
      } catch (error) {
        console.error(`Failed to generate for ${scenario.name}`, error);
        return null;
      }
    });

    try {
      const results = await Promise.all(promises);
      const successfulResults = results.filter((r): r is GeneratedImage => r !== null);
      
      setGeneratedResults(successfulResults);
      setAppState(AppState.RESULTS);
    } catch (error) {
      console.error("Batch generation failed", error);
      alert("Something went wrong during generation. Please check your API key and try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRestart = () => {
    setAppState(AppState.UPLOAD);
    setOriginalImage(null);
    setSelectedScenarios([]);
    setGeneratedResults([]);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleRestart}>
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Package className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              ProductVisualize<span className="text-indigo-500">AI</span>
            </h1>
          </div>
          <div className="text-sm text-slate-400 hidden sm:block">
            Powered by Gemini 2.5 Flash Image
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full">
        {appState === AppState.UPLOAD && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mt-16 px-4">
              <h2 className="text-4xl font-extrabold text-white mb-4 tracking-tight">
                Turn one photo into <br/>
                <span className="text-indigo-400">endless marketing assets.</span>
              </h2>
              <p className="text-lg text-slate-400 max-w-xl mx-auto mb-8">
                Upload your product and let our AI place it on mugs, billboards, t-shirts, and more instantly.
              </p>
            </div>
            <UploadArea onImageSelected={handleImageSelected} />
          </div>
        )}

        {appState === AppState.SELECT_SCENARIO && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500 pb-20">
             {originalImage && (
               <div className="max-w-5xl mx-auto mt-6 px-4 mb-4">
                 <div className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                   <img src={originalImage} alt="Original" className="w-16 h-16 rounded-lg object-cover bg-white" />
                   <div>
                     <p className="text-sm text-slate-400">Source Image</p>
                     <button onClick={() => setAppState(AppState.UPLOAD)} className="text-indigo-400 text-sm font-medium hover:underline">Change image</button>
                   </div>
                 </div>
               </div>
             )}
             <ScenarioSelector 
               selectedScenarios={selectedScenarios}
               onToggleScenario={handleToggleScenario}
               onGenerate={handleGenerate}
               isGenerating={isGenerating}
             />
          </div>
        )}

        {appState === AppState.RESULTS && (
          <div className="animate-in fade-in duration-700">
            <ResultGallery 
              results={generatedResults} 
              onRestart={handleRestart}
            />
          </div>
        )}
      </main>

      {/* Simple Footer */}
      <footer className="py-6 border-t border-slate-800 text-center text-slate-600 text-sm">
        <p>© {new Date().getFullYear()} ProductVisualize AI. Built with Google Gemini.</p>
      </footer>
    </div>
  );
};

export default App;
