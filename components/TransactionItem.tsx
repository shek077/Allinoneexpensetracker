import React, { useState } from 'react';
import { Transaction, Person } from '../types';
import NeumorphicCard from './NeumorphicCard';
import { useTheme } from '../hooks/useTheme';
import { createGlobalRipple } from '../services/rippleEffect';

interface TransactionItemProps {
    transaction: Transaction;
    onEdit: (transaction: Transaction) => void;
    onDeleteRequest: (transaction: Transaction) => void;
    people: Person[];
    categoryIcons: { [key: string]: string };
    categoryColors: { [key: string]: string };
    isDeleting: boolean;
}

const EditIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
    </svg>
);

const DeleteIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const RecurringIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 9a9 9 0 0114.13-6.36M20 15a9 9 0 01-14.13 6.36" />
    </svg>
);

const TaxIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
);

const SplitIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.282-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.282.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

const CategoryIconDisplay: React.FC<{ category: string, iconUrl?: string, color?: string, type: 'income' | 'expense' }> = ({ category, iconUrl, color, type }) => {
    if (iconUrl) {
        return <img src={iconUrl} alt={category} className="w-10 h-10 rounded-full object-cover" />;
    }

    if (color) {
        return (
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg text-white" style={{ backgroundColor: color }}>
                {category.charAt(0).toUpperCase()}
            </div>
        );
    }

    const bgColor = type === 'income' ? 'bg-green-200 dark:bg-green-800' : 'bg-red-200 dark:bg-red-800';
    const textColor = type === 'income' ? 'text-green-700 dark:text-green-200' : 'text-red-700 dark:text-red-200';

    return (
        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${bgColor} ${textColor}`}>
            {category.charAt(0).toUpperCase()}
        </div>
    );
};


const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, onEdit, onDeleteRequest, people, categoryIcons, categoryColors, isDeleting }) => {
    const { theme } = useTheme();
    const { type, amount, category, date, description, notes, currency, recurring, isRecurringInstance, isTaxDeductible, splitDetails, payerId, tags } = transaction;
    const isIncome = type === 'income';
    const amountColor = isIncome ? 'text-green-500' : 'text-red-500';
    const sign = isIncome ? '+' : '-';
    const isSplit = !!splitDetails && splitDetails.length > 0;
    const [isExpanded, setIsExpanded] = useState(false);

    const getPersonName = (personId: string | 'user') => {
        if (personId === 'user') return 'You';
        return people.find(p => p.id === personId)?.name || 'Unknown';
    }
    
    const tagBgColor = {
        light: 'bg-gray-200',
        dark: 'bg-gray-700',
        lime: 'bg-lime-200',
        rose: 'bg-rose-200',
        ocean: 'bg-blue-200',
        tangerine: 'bg-orange-200',
        lavender: 'bg-purple-200',
    }[theme];

    return (
        <NeumorphicCard 
            type="concave" 
            className={`!p-0 transition-all duration-300 ${isDeleting ? 'transaction-item-exit' : 'transaction-item-enter'}`}
        >
            <div className={`p-4 flex items-center gap-4 ${isSplit || notes ? 'cursor-pointer' : ''}`} onClick={() => (isSplit || notes) && setIsExpanded(!isExpanded)}>
                <CategoryIconDisplay category={category} iconUrl={categoryIcons[category]} color={categoryColors[category]} type={type} />
                <div className="flex-1 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-bold text-lg">{description || category}</p>
                            {recurring !== 'none' && !isRecurringInstance && (
                                <span title={`Recurring ${recurring}`}>
                                    <RecurringIcon className="w-4 h-4 text-blue-500" />
                                </span>
                            )}
                            {isTaxDeductible && (
                                <span title="Tax Deductible">
                                    <TaxIcon className="w-4 h-4 text-purple-500" />
                                </span>
                            )}
                            {isSplit && (
                                <span title="Split Expense">
                                    <SplitIcon className="w-4 h-4 text-orange-500" />
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                            <p className="text-sm text-gray-600 dark:text-gray-300">{description ? category : ''}</p>
                            {tags && tags.length > 0 && tags.map(tag => (
                                <span key={tag} className={`px-2 py-0.5 text-xs rounded-full ${tagBgColor}`}>
                                    #{tag}
                                </span>
                            ))}
                        </div>
                        {notes && !isExpanded && (
                           <p className="text-sm text-gray-500 dark:text-gray-400 italic mt-1.5 truncate">
                                {notes}
                           </p>
                        )}
                    </div>
                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between">
                        <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(date).toLocaleDateString()}</p>
                        <p className={`font-bold text-lg ${amountColor}`}>
                            {sign} {currency}{amount.toFixed(2)}
                        </p>
                        <div className="flex items-center gap-2">
                            <button onClick={(e) => { e.stopPropagation(); createGlobalRipple(e); onEdit(transaction); }} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transform active:scale-90 transition-all">
                                <EditIcon className="w-5 h-5" />
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); createGlobalRipple(e); onDeleteRequest(transaction); }} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transform active:scale-90 transition-all">
                                <DeleteIcon className="w-5 h-5 text-red-500" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
             {isExpanded && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2 animate-fadeIn">
                    {notes && (
                         <div>
                            <p className="font-semibold mb-1">Notes:</p>
                            <p className="text-sm italic text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{notes}</p>
                        </div>
                    )}
                    {isSplit && (
                        <div>
                            <p className="font-semibold mb-1">Split Details:</p>
                            <p className="text-sm">Paid by: <span className="font-medium">{getPersonName(payerId!)}</span></p>
                            <ul className="list-disc list-inside text-sm mt-1">
                                {splitDetails.map((detail, index) => (
                                    <li key={index}>
                                        {getPersonName(detail.personId)}: {currency}
                                        {detail.amount ? detail.amount.toFixed(2) : (amount / splitDetails.length).toFixed(2)}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </NeumorphicCard>
    );
};

export default TransactionItem;