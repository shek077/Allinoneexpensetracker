import React from 'react';
import NeumorphicCard from './NeumorphicCard';
import { useTheme } from '../hooks/useTheme';
import { createGlobalRipple } from '../services/rippleEffect';

interface ConfirmationDialogProps {
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ onClose, onConfirm, title, message }) => {
  const { theme } = useTheme();

  const buttonThemeClasses = {
      light: {
          confirm: 'bg-red-500 text-white shadow-neumorphic-convex active:shadow-neumorphic-concave',
          default: 'shadow-neumorphic-convex active:shadow-neumorphic-concave',
      },
      dark: {
          confirm: 'bg-red-500 text-white shadow-neumorphic-convex-dark active:shadow-neumorphic-concave-dark',
          default: 'shadow-neumorphic-convex-dark active:shadow-neumorphic-concave-dark',
      },
      lime: {
          confirm: 'bg-red-500 text-white shadow-neumorphic-convex-lime active:shadow-neumorphic-concave-lime',
          default: 'shadow-neumorphic-convex-lime active:shadow-neumorphic-concave-lime',
      },
      rose: {
          confirm: 'bg-red-500 text-white shadow-neumorphic-convex-rose active:shadow-neumorphic-concave-rose',
          default: 'shadow-neumorphic-convex-rose active:shadow-neumorphic-concave-rose',
      },
      ocean: {
          confirm: 'bg-red-500 text-white shadow-neumorphic-convex-ocean active:shadow-neumorphic-concave-ocean',
          default: 'shadow-neumorphic-convex-ocean active:shadow-neumorphic-concave-ocean',
      },
      tangerine: {
          confirm: 'bg-red-500 text-white shadow-neumorphic-convex-tangerine active:shadow-neumorphic-concave-tangerine',
          default: 'shadow-neumorphic-convex-tangerine active:shadow-neumorphic-concave-tangerine',
      },
      lavender: {
          confirm: 'bg-red-500 text-white shadow-neumorphic-convex-lavender active:shadow-neumorphic-concave-lavender',
          default: 'shadow-neumorphic-convex-lavender active:shadow-neumorphic-concave-lavender',
      }
  };

  const handleConfirm = () => {
    onConfirm();
  };

  return (
      <NeumorphicCard className="w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4 text-center">{title}</h2>
        <p className="text-center mb-6">{message}</p>
        <div className="flex gap-4">
          <button onClick={(e) => { createGlobalRipple(e); onClose(); }} className={`w-full font-bold py-3 px-4 rounded-xl transform active:scale-95 transition-all duration-200 ${buttonThemeClasses[theme].default}`}>
            Cancel
          </button>
          <button onClick={(e) => { createGlobalRipple(e); handleConfirm(); }} className={`w-full font-bold py-3 px-4 rounded-xl transform active:scale-95 transition-all duration-200 ${buttonThemeClasses[theme].confirm}`}>
            Confirm
          </button>
        </div>
      </NeumorphicCard>
  );
};

export default ConfirmationDialog;