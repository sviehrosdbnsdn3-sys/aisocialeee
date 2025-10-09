
import React from 'react';
import type { BrandKit } from '../types';
import { TrashIcon } from './icons';

interface BrandKitManagerProps {
  isOpen: boolean;
  onClose: () => void;
  kits: BrandKit[];
  onDelete: (kitName: string) => void;
  onSelect: (kit: BrandKit) => void;
}

export const BrandKitManager: React.FC<BrandKitManagerProps> = ({ isOpen, onClose, kits, onDelete, onSelect }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 transition-opacity"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700 w-full max-w-2xl m-4 transform transition-all"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">Brand Kit Manager</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white rounded-full transition-colors" aria-label="Close">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {kits.length === 0 ? (
            <p className="text-gray-400 text-center py-8">You haven't saved any brand kits yet.</p>
          ) : (
            <ul className="space-y-4">
              {kits.map(kit => (
                <li key={kit.name} className="bg-gray-900 p-4 rounded-lg flex items-center justify-between border border-gray-700">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-700 rounded-md flex items-center justify-center p-1">
                      <img src={kit.logo} alt={`${kit.name} logo`} className="max-w-full max-h-full object-contain" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-white">{kit.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                          <div className="w-5 h-5 rounded-full border-2 border-gray-600" style={{ backgroundColor: kit.brandColor }}></div>
                          <span className="text-sm text-gray-400 capitalize">{kit.font.replace(/-/g, ' ')}</span>
                          <span className="text-sm text-gray-400 capitalize">&middot;</span>
                          <span className="text-sm text-gray-400 capitalize">{kit.template.replace(/-/g, ' ')}</span>
                      </div>
                      {kit.socialHandles && kit.socialHandles.length > 0 && (
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
                          {kit.socialHandles.map(handle => handle.username && (
                            <div key={handle.id} className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full">
                              <span className="capitalize">{handle.platform}</span>: {handle.username}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button 
                        onClick={() => onSelect(kit)}
                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-800 transition-colors"
                        aria-label={`Select ${kit.name} brand kit`}
                    >
                        Select
                    </button>
                    <button 
                        onClick={() => onDelete(kit.name)}
                        className="p-2 text-gray-500 hover:text-red-400 rounded-full transition-colors"
                        aria-label={`Delete ${kit.name} brand kit`}
                    >
                        <TrashIcon className="w-6 h-6" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
         <div className="p-6 border-t border-gray-700 text-right">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Close
            </button>
          </div>
      </div>
    </div>
  );
};