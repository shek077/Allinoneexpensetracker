import React from 'react';
import NeumorphicCard from './NeumorphicCard';
import { Person } from '../types';
import { useTheme } from '../hooks/useTheme';
import { createGlobalRipple } from '../services/rippleEffect';

interface Balance extends Person {
    balance: number;
}

interface BalancesProps {
    balances: Balance[];
    people: Person[];
    onSettleUp: (personId: string, amount: number) => void;
}

const BalancesIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
    </svg>
);

const PersonIcon: React.FC<{ person: Balance, colorClass: string }> = ({ person, colorClass }) => {
    if (person.iconUrl) {
        return <img src={person.iconUrl} alt={person.name} className="w-6 h-6 rounded-full object-cover" />;
    }
    const bgColor = {
        light: 'bg-gray-200',
        dark: 'bg-gray-600',
        lime: 'bg-lime-200',
        rose: 'bg-rose-200',
        ocean: 'bg-blue-200',
        tangerine: 'bg-orange-200',
        lavender: 'bg-purple-200',
    }[useTheme().theme];
    return (
        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${bgColor} ${colorClass}`}>
            {person.name.charAt(0).toUpperCase()}
        </div>
    );
};

const Balances: React.FC<BalancesProps> = ({ balances, onSettleUp }) => {
    const { theme } = useTheme();

    const buttonThemeClasses = {
      light: 'bg-primary-mint text-white shadow-neumorphic-convex active:shadow-neumorphic-concave',
      dark: 'bg-primary-mint text-white shadow-neumorphic-convex-dark active:shadow-neumorphic-concave-dark',
      lime: 'bg-primary-lime text-white shadow-neumorphic-convex-lime active:shadow-neumorphic-concave-lime',
      rose: 'bg-primary-rose text-white shadow-neumorphic-convex-rose active:shadow-neumorphic-concave-rose',
      ocean: 'bg-primary-ocean text-white shadow-neumorphic-convex-ocean active:shadow-neumorphic-concave-ocean',
      tangerine: 'bg-primary-tangerine text-white shadow-neumorphic-convex-tangerine active:shadow-neumorphic-concave-tangerine',
      lavender: 'bg-primary-lavender text-white shadow-neumorphic-convex-lavender active:shadow-neumorphic-concave-lavender',
    };

    const youOwe = balances.filter(b => b.balance < 0);
    const owesYou = balances.filter(b => b.balance > 0);

    return (
        <NeumorphicCard className="h-full">
            <div className="flex items-center gap-3 mb-4">
                <BalancesIcon className="w-6 h-6" />
                <h3 className="text-lg font-bold">Balances</h3>
            </div>
            
            <div className="space-y-4">
                {youOwe.length > 0 && (
                    <div>
                        <h4 className="font-semibold text-sm mb-2 text-red-500">You Owe</h4>
                        <div className="space-y-2">
                            {youOwe.map(p => (
                                <div key={p.id} className="flex justify-between items-center text-sm">
                                    <div className="flex items-center gap-2">
                                        <PersonIcon person={p} colorClass="text-red-500" />
                                        <span>{p.name}</span>
                                    </div>
                                    <span className="font-bold text-red-500">${Math.abs(p.balance).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                 {owesYou.length > 0 && (
                    <div>
                        <h4 className="font-semibold text-sm mb-2 text-green-500">Owes You</h4>
                        <div className="space-y-2">
                            {owesYou.map(p => (
                                <div key={p.id} className="flex justify-between items-center text-sm">
                                    <div className="flex items-center gap-2">
                                        <PersonIcon person={p} colorClass="text-green-500" />
                                        <span>{p.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-green-500">${p.balance.toFixed(2)}</span>
                                        <button onClick={(e) => { createGlobalRipple(e); onSettleUp(p.id, p.balance); }} className={`px-2 py-0.5 text-xs rounded-md ${buttonThemeClasses[theme]}`}>
                                            Settle
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {balances.length === 0 && (
                     <p className="text-sm text-center text-gray-500 dark:text-gray-400 py-4">All settled up!</p>
                )}
            </div>
        </NeumorphicCard>
    );
};

export default Balances;