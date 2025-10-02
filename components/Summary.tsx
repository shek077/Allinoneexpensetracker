import React, { useMemo } from 'react';
import NeumorphicCard from './NeumorphicCard';
import { Transaction } from '../types';

interface SummaryProps {
    transactions: Transaction[];
    currency: string;
}

const IncomeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
    </svg>
);

const ExpenseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
    </svg>
);

const BalanceIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10h.01M9 17h.01M9 10h.01M12 10h.01M15 10h.01M9 13h.01M12 13h.01M15 13h.01M4 7h16a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V8a1 1 0 011-1z" />
    </svg>
);

const TaxIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
);

const Summary: React.FC<SummaryProps> = ({ transactions, currency }) => {
    const { totalIncome, totalExpenses, balance, deductibleExpenses } = useMemo(() => {
        const income = transactions
            .filter(t => t.type === 'income')
            .reduce((acc, t) => acc + t.amount, 0);
        const expenses = transactions
            .filter(t => t.type === 'expense')
            .reduce((acc, t) => acc + t.amount, 0);
        const deductible = transactions
            .filter(t => t.isTaxDeductible)
            .reduce((acc, t) => acc + t.amount, 0);
        return { 
            totalIncome: income, 
            totalExpenses: expenses, 
            balance: income - expenses,
            deductibleExpenses: deductible 
        };
    }, [transactions]);

    const formatAmount = (amount: number) => {
        return `${currency}${amount.toFixed(2)}`;
    }

    const formatBalance = (amount: number) => {
        const sign = amount < 0 ? '-' : '';
        return `${sign}${currency}${Math.abs(amount).toFixed(2)}`;
    }


    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <NeumorphicCard className="text-center">
                <div className="flex items-center justify-center gap-2">
                    <IncomeIcon className="w-6 h-6 text-green-500" />
                    <h3 className="text-lg font-semibold text-green-500">Total Income</h3>
                </div>
                <p className="text-2xl font-bold mt-2">{formatAmount(totalIncome)}</p>
            </NeumorphicCard>
            <NeumorphicCard className="text-center">
                 <div className="flex items-center justify-center gap-2">
                    <ExpenseIcon className="w-6 h-6 text-red-500" />
                    <h3 className="text-lg font-semibold text-red-500">Total Expenses</h3>
                </div>
                <p className="text-2xl font-bold mt-2">{formatAmount(totalExpenses)}</p>
            </NeumorphicCard>
            <NeumorphicCard className="text-center">
                 <div className="flex items-center justify-center gap-2 text-purple-500">
                    <TaxIcon className="w-6 h-6" />
                    <h3 className="text-lg font-semibold">Deductible</h3>
                </div>
                <p className="text-2xl font-bold mt-2 text-purple-500">{formatAmount(deductibleExpenses)}</p>
            </NeumorphicCard>
            <NeumorphicCard className={`text-center`}>
                <div className={`flex items-center justify-center gap-2 ${balance >= 0 ? 'text-blue-500' : 'text-orange-500'}`}>
                    <BalanceIcon className="w-6 h-6" />
                    <h3 className="text-lg font-semibold">Balance</h3>
                </div>
                <p className={`text-2xl font-bold mt-2 ${balance >= 0 ? 'text-blue-500' : 'text-orange-500'}`}>{formatBalance(balance)}</p>
            </NeumorphicCard>
        </div>
    );
};

export default Summary;