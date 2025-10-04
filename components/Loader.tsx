import React from 'react';
import { useTheme } from '../hooks/useTheme';
import NeumorphicCard from './NeumorphicCard';

interface LoaderProps {
    isModal?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ isModal = false }) => {
  const { theme } = useTheme();

  const spinnerColor = {
    light: 'border-primary-mint',
    dark: 'border-primary-mint',
    lime: 'border-primary-lime',
    rose: 'border-primary-rose',
    ocean: 'border-primary-ocean',
    tangerine: 'border-primary-tangerine',
    lavender: 'border-primary-lavender',
  }[theme];

  const spinnerTrackColor = {
    light: 'border-gray-300',
    dark: 'border-gray-600',
    lime: 'border-lime-shadow-dark',
    rose: 'border-rose-shadow-dark',
    ocean: 'border-ocean-shadow-dark',
    tangerine: 'border-tangerine-shadow-dark',
    lavender: 'border-lavender-shadow-dark',
  }[theme];

  const spinner = (
    <div className="flex justify-center items-center h-full">
        <div className={`w-12 h-12 rounded-full animate-spin border-4 ${spinnerColor} ${spinnerTrackColor}`} style={{ borderTopColor: 'transparent' }}></div>
    </div>
  );

  if (isModal) {
      return (
         <div className="w-full max-w-lg">
             <NeumorphicCard className="w-full h-64 flex justify-center items-center">
                 {spinner}
             </NeumorphicCard>
         </div>
      );
  }

  return (
    <NeumorphicCard className="my-8 h-80">
      {spinner}
    </NeumorphicCard>
  );
};

export default Loader;
