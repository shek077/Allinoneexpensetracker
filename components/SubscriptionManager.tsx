import React, { useMemo } from 'react';
import { Transaction } from '../types';
import NeumorphicCard from './NeumorphicCard';
import { useTheme } from '../hooks/useTheme';
import { createGlobalRipple } from '../services/rippleEffect';

interface SubscriptionManagerProps {
  transactions: Transaction[];
  onCancelSubscription: (id: string) => void;
  onClose: () => void;
}

const SubscriptionIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" opacity="0.6"/>
    </svg>
);

const CancelIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
    </svg>
);

const calculateNextPaymentDate = (transaction: Transaction): Date => {
    let nextDate = new Date(transaction.date);
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Compare dates only

    while (nextDate < now) {
        switch (transaction.recurring) {
            case 'daily':
                nextDate.setDate(nextDate.getDate() + 1);
                break;
            case 'weekly':
                nextDate.setDate(nextDate.getDate() + 7);
                break;
            case 'monthly':
                nextDate.setMonth(nextDate.getMonth() + 1);
                break;
            default:
                 return new Date('9999-12-31');
        }
    }
    return nextDate;
};


const SubscriptionManager: React.FC<SubscriptionManagerProps> = ({ transactions, onCancelSubscription, onClose }) => {
  const { theme } = useTheme();

  const activeSubscriptions = useMemo(() => {
    return transactions
      .filter(t => t.type === 'expense' && t.recurring !== 'none' && !t.isRecurringInstance)
      .map(t => ({
          ...t,
          nextPaymentDate: calculateNextPaymentDate(t)
      }))
      .sort((a,b) => a.nextPaymentDate.getTime() - b.nextPaymentDate.getTime());
  }, [transactions]);


  const buttonThemeClasses = {
      light: {
          cancel: 'bg-red-500 text-white shadow-neumorphic-convex active:shadow-neumorphic-concave',
          default: 'shadow-neumorphic-convex active:shadow-neumorphic-concave',
      },
      dark: {
          cancel: 'bg-red-500 text-white shadow-neumorphic-convex-dark active:shadow-neumorphic-concave-dark',
          default: 'shadow-neumorphic-convex-dark active:shadow-neumorphic-concave-dark',
      },
      lime: {
          cancel: 'bg-red-500 text-white shadow-neumorphic-convex-lime active:shadow-neumorphic-concave-lime',
          default: 'shadow-neumorphic-convex-lime active:shadow-neumorphic-concave-lime',
      },
      rose: {
          cancel: 'bg-red-500 text-white shadow-neumorphic-convex-rose active:shadow-neumorphic-concave-rose',
          default: 'shadow-neumorphic-convex-rose active:shadow-neumorphic-concave-rose',
      },
      ocean: {
          cancel: 'bg-red-500 text-white shadow-neumorphic-convex-ocean active:shadow-neumorphic-concave-ocean',
          default: 'shadow-neumorphic-convex-ocean active:shadow-neumorphic-concave-ocean',
      },
      tangerine: {
          cancel: 'bg-red-500 text-white shadow-neumorphic-convex-tangerine active:shadow-neumorphic-concave-tangerine',
          default: 'shadow-neumorphic-convex-tangerine active:shadow-neumorphic-concave-tangerine',
      },
      lavender: {
          cancel: 'bg-red-500 text-white shadow-neumorphic-convex-lavender active:shadow-neumorphic-concave-lavender',
          default: 'shadow-neumorphic-convex-lavender active:shadow-neumorphic-concave-lavender',
      }
  };

  return (
    <NeumorphicCard className="w-full max-w-2xl">
        <div className="flex items-center justify-center gap-3 mb-6">
            <SubscriptionIcon className="w-7 h-7" />
            <h2 className="text-2xl font-bold text-center">Manage Subscriptions</h2>
        </div>

        <div className="space-y-3 mb-6 max-h-96 overflow-y-auto pr-2">
            {activeSubscriptions.length > 0 ? activeSubscriptions.map(sub => (
                <NeumorphicCard type="concave" key={sub.id} className="!p-3 flex justify-between items-center gap-2">
                    <div className="flex-1">
                        <p className="font-semibold">{sub.description || sub.category}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                            Next payment: {sub.nextPaymentDate.toLocaleDateString()} ({sub.recurring})
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <p className="font-bold text-lg">{sub.currency}{sub.amount.toFixed(2)}</p>
                        <button 
                            onClick={(e) => { createGlobalRipple(e); onCancelSubscription(sub.id); }} 
                            className={`p-3 rounded-full transform active:scale-95 transition-all ${buttonThemeClasses[theme].cancel}`} 
                            aria-label={`Cancel subscription for ${sub.description || sub.category}`}
                        >
                           <CancelIcon className="w-5 h-5" />
                        </button>
                    </div>
                </NeumorphicCard>
            )) : <p className="text-center text-gray-500 py-8">No active subscriptions found.</p>}
        </div>

        <div className="flex justify-center pt-4">
             <button type="button" onClick={(e) => { createGlobalRipple(e); onClose(); }} className={`w-full max-w-xs font-bold py-3 px-4 rounded-xl transform active:scale-95 transition-all duration-200 ${buttonThemeClasses[theme].default}`}>Close</button>
        </div>
    </NeumorphicCard>
  );
};

export default SubscriptionManager;