import React from 'react';
import { NodeData, NodeType } from '../../types';
import { ChevronDown, ChevronUp, GripHorizontal, Activity, Image as ImageIcon, Box, Monitor, Cpu } from 'lucide-react';

interface BaseNodeProps {
  data: NodeData;
  isSelected: boolean;
  isActiveChain: boolean;
  accentColor?: string;
  zoom: number; // New prop for inverse scaling
  onSelect: (id: string) => void;
  onToggleCollapse: (id: string) => void;
  // Generic Port Handlers
  onPortDown: (id: string, type: 'input' | 'output', e: React.MouseEvent) => void;
  onPortUp: (id: string, type: 'input' | 'output', e: React.MouseEvent) => void;
  onPortContextMenu?: (id: string, type: 'input' | 'output', e: React.MouseEvent) => void;
  children: React.ReactNode;
}

const getNodeIcon = (type: NodeType) => {
  switch (type) {
    case NodeType.OSCILLATOR: return <Activity size={14} />;
    case NodeType.PICKER: return <ImageIcon size={14} />;
    case NodeType.TRANSFORM: return <Box size={14} />;
    case NodeType.OUTPUT: return <Monitor size={14} />;
    case NodeType.LOGIC: return <Cpu size={14} />;
    default: return <Box size={14} />;
  }
};

const getTypeLabel = (type: NodeType) => {
    switch(type) {
        case NodeType.OSCILLATOR: return "LFO";
        case NodeType.TRANSFORM: return "MODIFIER";
        default: return type;
    }
}

export const BaseNode: React.FC<BaseNodeProps> = ({ 
  data, 
  isSelected, 
  isActiveChain,
  accentColor = '#FF1F1F',
  zoom,
  onSelect, 
  onToggleCollapse,
  onPortDown,
  onPortUp,
  onPortContextMenu,
  children 
}) => {
  
  // Visual Logic
  const borderColor = (isSelected || isActiveChain) ? accentColor : 'rgba(255,255,255,0.1)';
  
  // Inverse scaling for borders so they stay consistent thickness on screen
  const borderWidth = isSelected ? 2 / zoom : 1 / zoom;
  
  const shadowStyle = isSelected 
    ? `0 0 ${30 / zoom}px ${accentColor}60` 
    : isActiveChain 
        ? `0 0 ${15 / zoom}px ${accentColor}20` 
        : 'none';

  return (
    <div 
      className={`absolute w-64 rounded-xl backdrop-blur-md bg-black/90 border-solid group select-none transition-colors duration-200 ease-out`}
      style={{ 
        left: data.position.x, 
        top: data.position.y,
        borderColor: borderColor,
        borderWidth: `${borderWidth}px`,
        boxShadow: shadowStyle,
        zIndex: isSelected ? 50 : 1
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(data.id);
      }}
    >
      {/* Input Port (Left) - Positioned -24px (w-6) outside */}
      {data.type !== NodeType.PICKER && (
        <div 
            className="absolute -left-6 top-7 w-6 h-6 flex items-center justify-center cursor-crosshair z-50 group/port"
            onMouseDown={(e) => {
                e.stopPropagation();
                onPortDown(data.id, 'input', e);
            }}
            onMouseUp={(e) => {
                e.stopPropagation();
                onPortUp(data.id, 'input', e);
            }}
            onContextMenu={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onPortContextMenu && onPortContextMenu(data.id, 'input', e);
            }}
        >
            <div 
                className={`w-3 h-3 bg-black border rounded-full flex items-center justify-center transition-transform group-hover/port:scale-150`}
                style={{ 
                    borderColor: isActiveChain ? accentColor : '#555',
                    borderWidth: `${1/zoom}px` 
                }}
            >
                <div 
                    className="w-1.5 h-1.5 rounded-full" 
                    style={{ backgroundColor: isActiveChain ? accentColor : '#333' }}
                />
            </div>
        </div>
      )}

      {/* Output Port (Right) - Positioned -24px (w-6) outside */}
      {data.type !== NodeType.OUTPUT && (
         <div 
            className="absolute -right-6 top-7 w-6 h-6 flex items-center justify-center cursor-crosshair z-50 group/port"
            onMouseDown={(e) => {
                e.stopPropagation();
                onPortDown(data.id, 'output', e);
            }}
            onMouseUp={(e) => {
                e.stopPropagation();
                onPortUp(data.id, 'output', e);
            }}
            onContextMenu={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onPortContextMenu && onPortContextMenu(data.id, 'output', e);
            }}
         >
            <div 
                className={`w-3 h-3 bg-black border rounded-full flex items-center justify-center transition-transform group-hover/port:scale-150`}
                style={{ 
                    borderColor: isActiveChain ? accentColor : '#555',
                    borderWidth: `${1/zoom}px`
                }}
            >
                <div 
                    className="w-1.5 h-1.5 rounded-full" 
                    style={{ backgroundColor: isActiveChain ? accentColor : '#333' }}
                />
            </div>
         </div>
      )}

      {/* Header */}
      <div 
        className="flex items-center justify-between p-3 border-b border-white/5 cursor-grab active:cursor-grabbing"
        style={{ borderBottomWidth: `${1/zoom}px` }}
      >
        <div className="flex items-center gap-2">
          <span style={{ color: isActiveChain || isSelected ? accentColor : '#666' }}>
            {getNodeIcon(data.type)}
          </span>
          <div className="flex flex-col leading-none">
            <span className={`text-xs font-semibold tracking-wide ${isActiveChain || isSelected ? 'text-white' : 'text-neutral-400'}`}>{data.label}</span>
            <span className="text-[10px] font-mono text-neutral-600 uppercase mt-0.5">{getTypeLabel(data.type)}</span>
          </div>
        </div>
        <div 
            className="text-neutral-600 hover:text-white cursor-pointer p-1"
            onClick={(e) => {
                e.stopPropagation();
                onToggleCollapse(data.id);
            }}
        >
          {data.collapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
        </div>
      </div>

      {/* Body */}
      {!data.collapsed && (
        <div className="p-3">
          {children}
        </div>
      )}
      
      {/* Collapsed State Visual Indicator */}
      {data.collapsed && (
          <div className="px-3 pb-2 pt-1 flex justify-center">
              <GripHorizontal size={12} className="text-neutral-700" />
          </div>
      )}
    </div>
  );
};