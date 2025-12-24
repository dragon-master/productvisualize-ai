import React from 'react';
import { SCENARIOS } from '../constants';
import { Coffee, Layout, Shirt, BookOpen, ShoppingBag, Smartphone, CheckCircle2 } from 'lucide-react';
import { Scenario } from '../types';

interface ScenarioSelectorProps {
  selectedScenarios: string[];
  onToggleScenario: (id: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

const IconMap: Record<string, React.ReactNode> = {
  coffee: <Coffee className="w-6 h-6" />,
  layout: <Layout className="w-6 h-6" />,
  shirt: <Shirt className="w-6 h-6" />,
  'book-open': <BookOpen className="w-6 h-6" />,
  'shopping-bag': <ShoppingBag className="w-6 h-6" />,
  smartphone: <Smartphone className="w-6 h-6" />
};

const ScenarioSelector: React.FC<ScenarioSelectorProps> = ({ 
  selectedScenarios, 
  onToggleScenario,
  onGenerate,
  isGenerating
}) => {
  return (
    <div className="max-w-5xl mx-auto mt-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Choose Placements</h2>
          <p className="text-slate-400">Select where you want to see your product</p>
        </div>
        <button
          onClick={onGenerate}
          disabled={selectedScenarios.length === 0 || isGenerating}
          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2
            ${selectedScenarios.length === 0 || isGenerating
              ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
            }`}
        >
          {isGenerating ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Generating...
            </>
          ) : (
            <>
              Generate {selectedScenarios.length} Assets
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SCENARIOS.map((scenario) => {
          const isSelected = selectedScenarios.includes(scenario.id);
          return (
            <div
              key={scenario.id}
              onClick={() => onToggleScenario(scenario.id)}
              className={`relative p-5 rounded-xl border-2 cursor-pointer transition-all duration-200
                ${isSelected 
                  ? 'border-indigo-500 bg-indigo-500/10' 
                  : 'border-slate-700 bg-slate-800/50 hover:border-slate-600 hover:bg-slate-800'
                }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`p-3 rounded-lg ${isSelected ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-slate-300'}`}>
                  {IconMap[scenario.icon]}
                </div>
                {isSelected && (
                  <CheckCircle2 className="w-6 h-6 text-indigo-400" />
                )}
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">{scenario.name}</h3>
              <p className="text-sm text-slate-400">{scenario.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ScenarioSelector;
