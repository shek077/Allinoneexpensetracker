import React, { useState, useEffect } from 'react';
import { useTheme } from '../hooks/useTheme';

interface AnimatedModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const AnimatedModal: React.FC<AnimatedModalProps> = ({ isOpen, onClose, children }) => {
    const { theme } = useTheme();
    const [isRendered, setIsRendered] = useState(isOpen);

    useEffect(() => {
        if (isOpen) {
            setIsRendered(true);
        } else {
            const timer = setTimeout(() => {
                setIsRendered(false);
            }, 300); // Must match animation-duration
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const modalBgClass = {
        light: 'bg-light-bg/80 backdrop-blur-sm',
        dark: 'bg-dark-bg/80 backdrop-blur-sm',
        lime: 'bg-lime-bg/80 backdrop-blur-sm',
        rose: 'bg-rose-bg/80 backdrop-blur-sm',
        ocean: 'bg-ocean-bg/80 backdrop-blur-sm',
        tangerine: 'bg-tangerine-bg/80 backdrop-blur-sm',
        lavender: 'bg-lavender-bg/80 backdrop-blur-sm',
    }[theme];

    if (!isRendered) {
        return null;
    }

    return (
        <div 
            className={`fixed inset-0 flex items-center justify-center z-50 p-4 ${modalBgClass} ${isOpen ? 'animate-fadeIn' : 'animate-fadeOut'}`}
            onClick={onClose}
        >
            <div 
                className={`w-full max-h-full overflow-y-auto ${isOpen ? 'animate-scaleIn' : 'animate-scaleOut'}`}
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
};

export default AnimatedModal;