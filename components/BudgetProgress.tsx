import React, { useMemo } from 'react';
import NeumorphicCard from './NeumorphicCard';
import { Transaction, BudgetGoal } from '../types';
import { useTheme } from '../hooks/useTheme';

interface BudgetProgressProps {
    transactions: Transaction[];
    budgetGoals: BudgetGoal[];
    currency: string;
}

const TargetIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v3m0 9v3m-7.5-7.5h3m9 0h3M4.5 12a7.5 7.5 0 1115 0 7.5 7.5 0 01-15 0z" />
    </svg>
);

const WarningIcon: React.FC<{ className?: string }> = ({ className }) => (
     <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
);


const BudgetProgress: React.FC<BudgetProgressProps> = ({ transactions, budgetGoals, currency }) => {
    const { theme } = useTheme();

    const progressData = useMemo(() => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const monthlyExpenses = transactions.filter(t => {
            const transactionDate = new Date(t.date);
            return t.type === 'expense' &&
                   transactionDate.getMonth() === currentMonth &&
                   transactionDate.getFullYear() === currentYear;
        });

        return budgetGoals.map(goal => {
            const spent = monthlyExpenses
                .filter(t => t.category === goal.category)
                .reduce((sum, t) => sum + t.amount, 0);
            
            const progress = goal.amount > 0 ? (spent / goal.amount) * 100 : 0;

            return {
                ...goal,
                spent,
                progress,
            };
        }).sort((a,b) => b.progress - a.progress);
    }, [transactions, budgetGoals]);

    if (!budgetGoals || budgetGoals.length === 0) {
        return null;
    }

    return (
        <NeumorphicCard>
            <div className="flex items-center gap-3 mb-4">
                <TargetIcon className="w-6 h-6" />
                <h3 className="text-xl font-bold">Monthly Budget Progress</h3>
            </div>
            <div className="space-y-6">
                {progressData.map(goal => {
                    const isOverBudget = goal.progress > 100;
                    const isNearingBudget = goal.progress >= 90 && !isOverBudget;
                    const remaining = goal.amount - goal.spent;

                    const getProgressColor = () => {
                        if (isOverBudget) return 'bg-gradient-to-r from-red-500 to-red-600';
                        if (goal.progress > 90) return 'bg-gradient-to-r from-orange-400 to-orange-500';
                        if (goal.progress > 70) return 'bg-gradient-to-r from-yellow-400 to-yellow-500';
                        return {
                            light: 'bg-gradient-to-r from-primary-mint to-teal-400',
                            dark: 'bg-gradient-to-r from-primary-mint to-teal-400',
                            lime: 'bg-gradient-to-r from-primary-lime to-lime-500',
                            rose: 'bg-gradient-to-r from-primary-rose to-pink-600',
                            ocean: 'bg-gradient-to-r from-primary-ocean to-cyan-400',
                            tangerine: 'bg-gradient-to-r from-primary-tangerine to-orange-400',
                            lavender: 'bg-gradient-to-r from-primary-lavender to-purple-500',
                        }[theme];
                    };

                    const barBackground = {
                        light: 'bg-gray-200',
                        dark: 'bg-gray-700',
                        lime: 'bg-gray-300',
                        rose: 'bg-gray-300',
                        ocean: 'bg-gray-300',
                        tangerine: 'bg-gray-300',
                        lavender: 'bg-gray-300',
                    }[theme];

                    return (
                        <div key={goal.id}>
                             <div className="flex justify-between items-center mb-1">
                                <span className="font-semibold">{goal.category}</span>
                                <div className="flex items-center gap-1">
                                    {isNearingBudget && <WarningIcon className="h-5 w-5 text-orange-400" />}
                                    <span className={`font-bold text-base ${isOverBudget ? 'text-red-500' : ''} ${isNearingBudget ? 'text-orange-500' : ''}`}>
                                        {Math.round(goal.progress)}%
                                    </span>
                                </div>
                            </div>
                            <div className={`w-full h-4 rounded-full ${barBackground} overflow-hidden shadow-inner`}>
                                <div
                                    className={`h-full rounded-full ${getProgressColor()} transition-all duration-500 ease-out`}
                                    style={{ width: `${Math.min(goal.progress, 100)}%` }}
                                />
                            </div>
                            <div className="flex justify-between items-baseline mt-1.5 text-sm text-gray-600 dark:text-gray-400">
                                <span>Spent: <span className="font-medium">{currency}{goal.spent.toFixed(2)}</span></span>
                                <span>Goal: <span className="font-medium">{currency}{goal.amount.toFixed(2)}</span></span>
                            </div>

                            {isOverBudget ? (
                                <div className="flex items-center justify-end text-sm text-red-500 mt-1 gap-1 font-semibold">
                                    <WarningIcon className="h-4 w-4" />
                                    <span>Over budget by {currency}{(goal.spent - goal.amount).toFixed(2)}</span>
                                </div>
                            ) : (
                                <div className="flex justify-end items-baseline mt-1 text-sm text-gray-500 dark:text-gray-300">
                                    <span>Remaining: <span className="font-medium">{currency}{remaining.toFixed(2)}</span></span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </NeumorphicCard>
    );
};

export default BudgetProgress;