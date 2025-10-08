
import React from 'react';
import NeumorphicCard from './NeumorphicCard';
import { useTheme } from '../hooks/useTheme';
import { createGlobalRipple } from '../services/rippleEffect';

interface CurrencyPromptProps {
  onClose: () => void;
  onConfirm: (remember: boolean) => void;
  newCurrencySymbol: string;
  newCurrencyName: string;
}

const CurrencyPrompt: React.FC<CurrencyPromptProps> = ({ onClose, onConfirm, newCurrencySymbol, newCurrencyName }) => {
  const { theme } = useTheme();

  const buttonThemeClasses = {
      light: {
          primary: 'bg-primary-mint text-white shadow-neumorphic-convex active:shadow-neumorphic-concave',
          default: 'shadow-neumorphic-convex active:shadow-neumorphic-concave',
      },
      dark: {
          primary: 'bg-primary-mint text-white shadow-neumorphic-convex-dark active:shadow-neumorphic-concave-dark',
          default: 'shadow-neumorphic-convex-dark active:shadow-neumorphic-concave-dark',
      },
      lime: {
          primary: 'bg-primary-lime text-white shadow-neumorphic-convex-lime active:shadow-neumorphic-concave-lime',
          default: 'shadow-neumorphic-convex-lime active:shadow-neumorphic-concave-lime',
      },
      rose: {
          primary: 'bg-primary-rose text-white shadow-neumorphic-convex-rose active:shadow-neumorphic-concave-rose',
          default: 'shadow-neumorphic-convex-rose active:shadow-neumorphic-concave-rose',
      },
      ocean: {
          primary: 'bg-primary-ocean text-white shadow-neumorphic-convex-ocean active:shadow-neumorphic-concave-ocean',
          default: 'shadow-neumorphic-convex-ocean active:shadow-neumorphic-concave-ocean',
      },
      tangerine: {
          primary: 'bg-primary-tangerine text-white shadow-neumorphic-convex-tangerine active:shadow-neumorphic-concave-tangerine',
          default: 'shadow-neumorphic-convex-tangerine active:shadow-neumorphic-concave-tangerine',
      },
      lavender: {
          primary: 'bg-primary-lavender text-white shadow-neumorphic-convex-lavender active:shadow-neumorphic-concave-lavender',
          default: 'shadow-neumorphic-convex-lavender active:shadow-neumorphic-concave-lavender',
      }
  };
  
  const handleConfirm = (remember: boolean) => {
    onConfirm(remember);
  };

  return (
      <NeumorphicCard className="w-full max-w-sm" glass>
        <h2 className="text-xl font-bold mb-4 text-center">Change Currency</h2>
        <p className="text-center mb-6">
            Set <span className="font-bold">{newCurrencyName} ({newCurrencySymbol})</span> as your currency. How would you like to apply this change?
        </p>
        <div className="flex flex-col gap-4">
          <button onClick={(e) => { createGlobalRipple(e); handleConfirm(true); }} className={`w-full font-bold py-3 px-4 rounded-xl transform active:scale-95 transition-all duration-200 ${buttonThemeClasses[theme].primary}`}>
            Set as Default
          </button>
          <button onClick={(e) => { createGlobalRipple(e); handleConfirm(false); }} className={`w-full font-bold py-3 px-4 rounded-xl transform active:scale-95 transition-all duration-200 ${buttonThemeClasses[theme].default}`}>
            For This Session Only
          </button>
        </div>
      </NeumorphicCard>
  );
};

export default CurrencyPrompt;
