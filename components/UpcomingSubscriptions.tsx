import React, { useMemo } from 'react';
import NeumorphicCard from './NeumorphicCard';
import { Transaction } from '../types';

interface UpcomingSubscriptionsProps {
    transactions: Transaction[];
    currency: string;
}

const SubscriptionIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" opacity="0.6"/>
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
                // Should not happen for this component, but good for safety
                return new Date('9999-12-31');
        }
    }
    return nextDate;
};

const UpcomingSubscriptions: React.FC<UpcomingSubscriptionsProps> = ({ transactions, currency }) => {
    const upcoming = useMemo(() => {
        const activeSubscriptions = transactions.filter(t => 
            t.type === 'expense' && t.recurring !== 'none' && !t.isRecurringInstance
        );

        return activeSubscriptions
            .map(t => ({
                ...t,
                nextPaymentDate: calculateNextPaymentDate(t),
            }))
            .sort((a, b) => a.nextPaymentDate.getTime() - b.nextPaymentDate.getTime())
            .slice(0, 3); // Show top 3 upcoming
    }, [transactions]);

    if (upcoming.length === 0) {
        return null;
    }

    const formatDate = (date: Date) => {
        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    }

    return (
        <NeumorphicCard className="h-full">
            <div className="flex items-center gap-3 mb-4">
                <SubscriptionIcon className="w-6 h-6" />
                <h3 className="text-lg font-bold">Upcoming Subscriptions</h3>
            </div>
            {upcoming.length > 0 ? (
                <div className="space-y-3">
                    {upcoming.map(sub => (
                        <div key={sub.id} className="flex justify-between items-center text-sm">
                            <div>
                                <p className="font-semibold">{sub.description || sub.category}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(sub.nextPaymentDate)}</p>
                            </div>
                            <p className="font-bold text-red-500">{currency}{sub.amount.toFixed(2)}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-center text-gray-500 dark:text-gray-400 py-4">No upcoming subscriptions.</p>
            )}
        </NeumorphicCard>
    );
};

export default UpcomingSubscriptions;