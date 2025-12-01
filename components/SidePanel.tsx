import React from 'react';
import { NodeData, NodeType } from '../types';
import { Input, Slider } from './ui/Input';
import { X, Sliders } from 'lucide-react';

interface SidePanelProps {
  selectedNode: NodeData | null;
  onClose: () => void;
  onUpdate: (id: string, newData: Partial<NodeData>) => void;
}

export const SidePanel: React.FC<SidePanelProps> = ({ selectedNode, onClose, onUpdate }) => {
  if (!selectedNode) return null;

  const handleChange = (key: string, value: any) => {
    onUpdate(selectedNode.id, {
        config: {
            ...selectedNode.config,
            [key]: value
        }
    });
  };

  return (
    <div className="fixed right-4 top-4 bottom-4 w-80 bg-neutral-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/5">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-black border border-white/10 flex items-center justify-center text-accent-red">
                <Sliders size={16} />
            </div>
            <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">{selectedNode.label}</h2>
                <p className="text-xs text-neutral-500 font-mono">ID: {selectedNode.id}</p>
            </div>
        </div>
        <button onClick={onClose} className="text-neutral-500 hover:text-white transition-colors">
          <X size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        
        {/* Common Props */}
        <Input 
            label="Node Label" 
            value={selectedNode.label} 
            onChange={(e) => onUpdate(selectedNode.id, { label: e.target.value })} 
        />

        <div className="h-px bg-white/5 my-6" />

        {/* Specific Props */}
        {selectedNode.type === NodeType.OSCILLATOR && (
            <>
                <Slider 
                    label="Frequency" 
                    min={0.1} max={10} step={0.1} 
                    value={selectedNode.config.frequency || 1} 
                    onChange={(e) => handleChange('frequency', parseFloat(e.target.value))}
                />
                <Slider 
                    label="Amplitude" 
                    min={0} max={10} step={0.1} 
                    value={selectedNode.config.amplitude || 1} 
                    onChange={(e) => handleChange('amplitude', parseFloat(e.target.value))}
                />
                 <div className="flex flex-col gap-2 mb-4">
                    <label className="text-xs text-neutral-500 font-mono uppercase tracking-wider">Wave Type</label>
                    <div className="flex rounded overflow-hidden border border-neutral-800">
                        {['sine', 'square', 'noise'].map((t) => (
                            <button
                                key={t}
                                onClick={() => handleChange('type', t)}
                                className={`flex-1 py-2 text-xs font-mono uppercase ${selectedNode.config.type === t ? 'bg-accent-red text-white' : 'bg-black text-neutral-500 hover:bg-neutral-800'}`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>
            </>
        )}

        {selectedNode.type === NodeType.TRANSFORM && (
             <>
                <Slider 
                    label="Scale" 
                    min={0} max={200} step={1} 
                    value={selectedNode.config.scale || 100} 
                    onChange={(e) => handleChange('scale', parseInt(e.target.value))}
                />
                <Slider 
                    label="Rotation" 
                    min={0} max={360} step={1} 
                    value={selectedNode.config.rotation || 0} 
                    onChange={(e) => handleChange('rotation', parseInt(e.target.value))}
                />
             </>
        )}

        {selectedNode.type === NodeType.PICKER && (
             <>
                <div className="aspect-square bg-black border border-white/10 rounded-lg overflow-hidden mb-4 relative group">
                     <img src={selectedNode.config.src} className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity" />
                     <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <button className="bg-accent-red text-white px-3 py-1 text-xs rounded font-mono">CHANGE SOURCE</button>
                     </div>
                </div>
                <Input 
                    label="Source URL" 
                    value={selectedNode.config.src} 
                    onChange={(e) => handleChange('src', e.target.value)}
                />
             </>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/5 bg-black/40">
        <button className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-xs font-mono text-neutral-400 hover:text-white transition-all uppercase">
            Reset Node
        </button>
      </div>
    </div>
  );
};
