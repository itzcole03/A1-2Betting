import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingOverlayProps {
  isVisible: boolean;
  title?: string;
  subtitle?: string;
}

export function LoadingOverlay({ isVisible, title = 'Loading...', subtitle = 'Please wait...' }: LoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center backdrop-blur-md">
      <div className="glass-morphism rounded-3xl p-8 flex flex-col items-center space-y-4 animate-scale-in">
        <Loader2 className="w-16 h-16 text-primary-500 animate-spin" />
        <div className="text-center">
          <div className="font-bold text-lg mb-2 text-white">{title}</div>
          <div className="text-sm text-gray-300">{subtitle}</div>
        </div>
      </div>
    </div>
  );
}