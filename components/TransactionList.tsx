

import React, { useState } from 'react';
import NeumorphicCard from './NeumorphicCard';
import TransactionItem from './TransactionItem';
import { Transaction, Person } from '../types';
import { useTheme } from '../hooks/useTheme';
import ConfirmationDialog from './ConfirmationDialog';
import AnimatedModal from './AnimatedModal';
import { createGlobalRipple } from '../services/rippleEffect';

interface TransactionListProps {
    transactions: Transaction[];
    onEdit: (transaction: Transaction) => void;
    onDelete: (id: string) => void;
    onAddTransaction: () => void;
    people: Person[];
    categoryIcons: { [key: string]: string };
    categoryColors: { [key: string]: string };
    deletingTransactionIds: Set<string>;
    searchTerm: string;
    onSearchChange: (term: string) => void;
}

const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
);

const SearchIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const ThemedNeumorphicInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className, ...props }) => {
    const { theme } = useTheme();
    const themeClasses = {
        light: 'bg-light-bg text-gray-700 shadow-neumorphic-concave focus:ring-primary-mint',
        dark: 'bg-dark-bg text-gray-300 shadow-neumorphic-concave-dark focus:ring-primary-mint',
        lime: 'bg-lime-bg text-lime-text shadow-neumorphic-concave-lime focus:ring-primary-lime',
        rose: 'bg-rose-bg text-rose-text shadow-neumorphic-concave-rose focus:ring-primary-rose',
        ocean: 'bg-ocean-bg text-ocean-text shadow-neumorphic-concave-ocean focus:ring-primary-ocean',
        tangerine: 'bg-tangerine-bg text-tangerine-text shadow-neumorphic-concave-tangerine focus:ring-primary-tangerine',
        lavender: 'bg-lavender-bg text-lavender-text shadow-neumorphic-concave-lavender focus:ring-primary-lavender',
    };
    return (
        <input
            className={`w-full p-3 rounded-xl focus:outline-none focus:ring-2 ${themeClasses[theme]} ${className}`}
            {...props}
        />
    );
};

const TransactionList: React.FC<TransactionListProps> = ({ 
    transactions, 
    onEdit, 
    onDelete, 
    onAddTransaction, 
    people, 
    categoryIcons, 
    categoryColors, 
    deletingTransactionIds,
    searchTerm,
    onSearchChange
}) => {
    const { theme } = useTheme();
    const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);

    const buttonThemeClasses = {
      light: 'bg-primary-mint text-white shadow-neumorphic-convex active:shadow-neumorphic-concave',
      dark: 'bg-primary-mint text-white shadow-neumorphic-convex-dark active:shadow-neumorphic-concave-dark',
      lime: 'bg-primary-lime text-white shadow-neumorphic-convex-lime active:shadow-neumorphic-concave-lime',
      rose: 'bg-primary-rose text-white shadow-neumorphic-convex-rose active:shadow-neumorphic-concave-rose',
      ocean: 'bg-primary-ocean text-white shadow-neumorphic-convex-ocean active:shadow-neumorphic-concave-ocean',
      tangerine: 'bg-primary-tangerine text-white shadow-neumorphic-convex-tangerine active:shadow-neumorphic-concave-tangerine',
      lavender: 'bg-primary-lavender text-white shadow-neumorphic-convex-lavender active:shadow-neumorphic-concave-lavender',
    };

    const handleRequestDelete = (transaction: Transaction) => {
        setTransactionToDelete(transaction);
    };

    const handleConfirmDelete = () => {
        if (transactionToDelete) {
            onDelete(transactionToDelete.id);
            setTransactionToDelete(null);
        }
    };

    return (
        <>
            <NeumorphicCard>
                <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                    <h2 className="text-xl font-bold flex-shrink-0">Recent Transactions</h2>
                    <div className="w-full sm:w-auto flex-grow sm:max-w-xs relative">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <ThemedNeumorphicInput
                            type="text"
                            placeholder="Search transactions..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                     <button
                        onClick={(e) => {
                            createGlobalRipple(e);
                            onAddTransaction();
                        }}
                        className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transform active:scale-95 ${buttonThemeClasses[theme]} transition-all duration-200`}
                        aria-label="Add new transaction"
                    >
                       <PlusIcon className="w-6 h-6" />
                    </button>
                </div>

                {transactions.length > 0 ? (
                    <div className="space-y-4">
                        {transactions.map(transaction => (
                            <TransactionItem
                                key={transaction.id}
                                transaction={transaction}
                                onEdit={onEdit}
                                onDeleteRequest={handleRequestDelete}
                                people={people}
                                categoryIcons={categoryIcons}
                                categoryColors={categoryColors}
                                isDeleting={deletingTransactionIds.has(transaction.id)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p>{searchTerm ? 'No transactions match your search.' : 'No transactions found.'}</p>
                        {!searchTerm && <p className="mt-2">Click the '+' button to add one!</p>}
                    </div>
                )}
            </NeumorphicCard>
            <AnimatedModal isOpen={!!transactionToDelete} onClose={() => setTransactionToDelete(null)}>
                <ConfirmationDialog
                    onClose={() => setTransactionToDelete(null)}
                    onConfirm={handleConfirmDelete}
                    title="Confirm Deletion"
                    message={`Are you sure you want to delete this transaction: ${transactionToDelete?.description || transactionToDelete?.category} (${transactionToDelete?.currency}${transactionToDelete?.amount.toFixed(2)})? This action cannot be undone.`}
                />
            </AnimatedModal>
        </>
    );
};

export default TransactionList;