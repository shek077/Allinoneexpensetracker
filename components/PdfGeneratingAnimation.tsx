import React, { useState, useEffect } from 'react';
import { useTheme } from '../hooks/useTheme';

interface PdfGeneratingAnimationProps {
  status: 'idle' | 'processing' | 'success';
}

const messages = [
  "Gathering transactions...",
  "Building your report...",
  "Designing layout...",
  "Finalizing PDF...",
];

const DocumentIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
);

const CheckmarkIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

const PdfGeneratingAnimation: React.FC<PdfGeneratingAnimationProps> = ({ status }) => {
  const { theme } = useTheme();
  const [currentMessage, setCurrentMessage] = useState(messages[0]);

  useEffect(() => {
    if (status === 'processing') {
      const interval = setInterval(() => {
        setCurrentMessage(prev => {
          const currentIndex = messages.indexOf(prev);
          const nextIndex = (currentIndex + 1) % messages.length;
          return messages[nextIndex];
        });
      }, 1800);
      return () => clearInterval(interval);
    }
  }, [status]);

  if (status === 'idle') {
    return null;
  }

  const bgColor = {
    light: 'bg-light-bg/80 backdrop-blur-sm',
    dark: 'bg-dark-bg/80 backdrop-blur-sm',
    lime: 'bg-lime-bg/80 backdrop-blur-sm',
    rose: 'bg-rose-bg/80 backdrop-blur-sm',
    ocean: 'bg-ocean-bg/80 backdrop-blur-sm',
    tangerine: 'bg-tangerine-bg/80 backdrop-blur-sm',
    lavender: 'bg-lavender-bg/80 backdrop-blur-sm',
  }[theme];

  const cardColor = {
    light: 'bg-light-bg',
    dark: 'bg-dark-bg',
    lime: 'bg-lime-bg',
    rose: 'bg-rose-bg',
    ocean: 'bg-ocean-bg',
    tangerine: 'bg-tangerine-bg',
    lavender: 'bg-lavender-bg',
  }[theme];

  const shadowClass = {
    light: 'shadow-neumorphic-convex',
    dark: 'shadow-neumorphic-convex-dark',
    lime: 'shadow-neumorphic-convex-lime',
    rose: 'shadow-neumorphic-convex-rose',
    ocean: 'shadow-neumorphic-convex-ocean',
    tangerine: 'shadow-neumorphic-convex-tangerine',
    lavender: 'shadow-neumorphic-convex-lavender',
  }[theme];

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center animate-fadeIn ${bgColor}`}>
      <div className={`relative flex flex-col items-center justify-center w-64 h-64 rounded-2xl ${cardColor} ${shadowClass} animate-scaleIn`}>
        <div className="relative w-24 h-24">
          {/* Processing State */}
          <div className={`absolute inset-0 transition-opacity duration-300 ${status === 'processing' ? 'opacity-100' : 'opacity-0'}`}>
            <DocumentIcon className="w-full h-full text-gray-500 dark:text-gray-400" />
            <div className="absolute inset-0 animate-spin-slow">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-primary-mint rounded-full"></div>
            </div>
          </div>

          {/* Success State */}
          <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${status === 'success' ? 'opacity-100' : 'opacity-0'}`}>
            <div className="w-24 h-24 rounded-full bg-primary-mint/20 flex items-center justify-center pdf-success-circle">
              <CheckmarkIcon className="w-12 h-12 text-primary-mint pdf-success-check" />
            </div>
          </div>
        </div>

        <p className="absolute bottom-8 text-center px-4 font-medium transition-opacity duration-300">
          <span key={currentMessage}>
            {status === 'processing' ? currentMessage : 'Report generated successfully!'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default PdfGeneratingAnimation;
