
import React, { useState, useEffect, useRef } from 'react';
import { useTheme, Theme } from '../hooks/useTheme';
import NeumorphicCard from './NeumorphicCard';
import { createGlobalRipple } from '../services/rippleEffect';

const SunIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);

const MoonIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
);

const LeafIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12c0 5.523 4.477 10 10 10s10-4.477 10-10S17.523 2 12 2 2 6.477 2 12z" stroke="currentColor" opacity="0.6"/>
      <path d="M12 12c-3.475 0-6.3-2.825-6.3-6.3S8.525 0 12 0" transform="translate(0 6.3)" stroke="currentColor" />
    </svg>
);

const RoseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 8c-2.43 0-4.43 1.76-4.9 4.01" />
        <path d="M12 8c2.43 0 4.43 1.76 4.9 4.01" />
        <path d="M8 12c-1.66 0-3 1.34-3 3s1.34 3 3 3" />
        <path d="M16 12c1.66 0 3 1.34 3 3s-1.34 3-3 3" />
        <path d="M12 12c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
        <path d="M12 2a4 4 0 00-4 4c0 3 4 7 4 7s4-4 4-7a4 4 0 00-4-4z" />
    </svg>
);

const OceanIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12s2.5-4 5-4 5 4 5 4-2.5 4-5 4-5-4-5-4z"/>
        <path d="M19 12s2.5-4 5-4"/>
        <path d="M0 12s2.5-4 5-4"/>
        <path d="M5 16s2.5-4 5-4 5 4 5 4-2.5 4-5 4-5-4-5-4z"/>
        <path d="M19 16s2.5-4 5-4"/>
        <path d="M0 16s2.5-4 5-4"/>
    </svg>
);

const TangerineIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2v20" />
        <path d="M12 12l8.66-5" />
        <path d="M12 12l8.66 5" />
        <path d="M12 12l-8.66 5" />
        <path d="M12 12l-8.66-5" />
        <circle cx="12" cy="12" r="2" fill="currentColor"/>
    </svg>
);

const LavenderIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 5V2" />
        <path d="M12 5c-2.3 2.3-2.3 6.1 0 8.5" />
        <path d="M12 5c2.3 2.3 2.3 6.1 0 8.5" />
        <path d="M17.1 8.9c1.6 1.6 1.6 4.1 0 5.7" />
        <path d="M6.9 8.9c-1.6 1.6-1.6 4.1 0 5.7" />
        <path d="M12 13.5V22" />
        <path d="M9 19h6" />
    </svg>
);

const InstallIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);


const Header: React.FC = () => {
    const { theme, setTheme } = useTheme();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [installPrompt, setInstallPrompt] = useState<any>(null);

    useEffect(() => {
        const handler = (e: Event) => {
            e.preventDefault();
            setInstallPrompt(e);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const handleInstallClick = () => {
        if (!installPrompt) {
            return;
        }
        installPrompt.prompt();
        installPrompt.userChoice.then((choiceResult: { outcome: 'accepted' | 'dismissed' }) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the A2HS prompt');
            } else {
                console.log('User dismissed the A2HS prompt');
            }
            setInstallPrompt(null);
        });
    };

    // FIX: Changed JSX.Element to React.ReactElement to resolve "Cannot find namespace 'JSX'" error.
    const themes: { name: Theme; icon: React.ReactElement }[] = [
        { name: 'light', icon: <SunIcon className="w-5 h-5 text-yellow-500" /> },
        { name: 'dark', icon: <MoonIcon className="w-5 h-5 text-gray-400" /> },
        { name: 'lime', icon: <LeafIcon className="w-5 h-5 text-lime-600" /> },
        { name: 'rose', icon: <RoseIcon className="w-5 h-5 text-pink-500" /> },
        { name: 'ocean', icon: <OceanIcon className="w-5 h-5 text-blue-500" /> },
        { name: 'tangerine', icon: <TangerineIcon className="w-5 h-5 text-orange-500" /> },
        { name: 'lavender', icon: <LavenderIcon className="w-5 h-5 text-purple-500" /> },
    ];

    const currentThemeDetails = themes.find(t => t.name === theme);

    const themeConfig = {
        light: {
            titleAccent: 'text-primary-mint',
            buttonShadow: 'shadow-neumorphic-convex',
            buttonActive: 'active:shadow-neumorphic-concave',
        },
        dark: {
            titleAccent: 'text-primary-mint',
            buttonShadow: 'shadow-neumorphic-convex-dark',
            buttonActive: 'active:shadow-neumorphic-concave-dark',
        },
        lime: {
            titleAccent: 'text-primary-lime',
            buttonShadow: 'shadow-neumorphic-convex-lime',
            buttonActive: 'active:shadow-neumorphic-concave-lime',
        },
        rose: {
            titleAccent: 'text-primary-rose',
            buttonShadow: 'shadow-neumorphic-convex-rose',
            buttonActive: 'active:shadow-neumorphic-concave-rose',
        },
        ocean: {
            titleAccent: 'text-primary-ocean',
            buttonShadow: 'shadow-neumorphic-convex-ocean',
            buttonActive: 'active:shadow-neumorphic-concave-ocean',
        },
        tangerine: {
            titleAccent: 'text-primary-tangerine',
            buttonShadow: 'shadow-neumorphic-convex-tangerine',
            buttonActive: 'active:shadow-neumorphic-concave-tangerine',
        },
        lavender: {
            titleAccent: 'text-primary-lavender',
            buttonShadow: 'shadow-neumorphic-convex-lavender',
            buttonActive: 'active:shadow-neumorphic-concave-lavender',
        }
    };
    
    const currentThemeConfig = themeConfig[theme];

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    return (
        <header className="flex justify-between items-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold">
                Expense<span className={currentThemeConfig.titleAccent}>Tracker</span>
            </h1>
            <div className="flex items-center gap-4">
                 {installPrompt && (
                    <button
                        onClick={(e) => {
                            createGlobalRipple(e);
                            handleInstallClick();
                        }}
                        className={`w-14 h-14 rounded-full flex items-center justify-center transform ${currentThemeConfig.buttonShadow} ${currentThemeConfig.buttonActive} active:scale-95 transition-all duration-200`}
                        aria-label="Install app"
                        title="Install app"
                    >
                        <InstallIcon className="w-6 h-6" />
                    </button>
                )}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={(e) => {
                            createGlobalRipple(e);
                            setIsDropdownOpen(!isDropdownOpen);
                        }}
                        className={`w-14 h-14 rounded-full flex items-center justify-center transform ${currentThemeConfig.buttonShadow} ${currentThemeConfig.buttonActive} active:scale-95 transition-all duration-200`}
                        aria-label="Select theme"
                    >
                        {currentThemeDetails?.icon}
                    </button>
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-40 z-10 animate-scaleIn">
                            <NeumorphicCard className="!p-2">
                                <ul className="space-y-1">
                                    {themes.map(({ name, icon }) => (
                                        <li key={name}>
                                            <button
                                                onClick={(e) => {
                                                    createGlobalRipple(e);
                                                    setTheme(name);
                                                    setIsDropdownOpen(false);
                                                }}
                                                className={`w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors ${theme === name ? 'font-bold' : ''} hover:bg-black/5 dark:hover:bg-white/5`}
                                            >
                                                {icon}
                                                <span className="capitalize">{name}</span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </NeumorphicCard>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;