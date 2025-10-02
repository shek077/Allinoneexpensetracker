import React, { useState, useEffect, useMemo } from 'react';
import { Transaction, Person, SplitDetail } from '../types';
import NeumorphicCard from './NeumorphicCard';
import { CURRENCIES } from '../constants';
import { useTheme } from '../hooks/useTheme';
import { createGlobalRipple } from '../services/rippleEffect';

interface TransactionFormProps {
  onSubmit: (transaction: any) => void;
  initialData?: Transaction | null;
  onClose: () => void;
  people: Person[];
  expenseCategories: string[];
  incomeCategories: string[];
  onAddTag: (tag: string) => void;
}

const AmountIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" />
    </svg>
);
const CurrencyIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);
const CategoryIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.53 0 1.04.21 1.41.59l7 7a2 2 0 010 2.83l-5 5a2 2 0 01-2.83 0l-7-7A2 2 0 013 8V3a2 2 0 012-2h2z" />
    </svg>
);
const CalendarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);
const DescriptionIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
);
const NotesIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);
const RecurringIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 9a9 9 0 0114.13-6.36M20 15a9 9 0 01-14.13 6.36" />
    </svg>
);
const TagIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 5h14a2 2 0 012 2v3a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2zm0 0l7 7 7-7" />
    </svg>
);


// FIX: Corrected the props type for ThemedNeumorphicInput to be specific to HTMLInputElement, resolving a TypeScript error on checkbox onChange handlers.
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

const ThemedNeumorphicTextarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({ className, ...props }) => {
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
        <textarea
            className={`w-full p-3 rounded-xl focus:outline-none focus:ring-2 ${themeClasses[theme]} ${className}`}
            {...props}
        />
    );
};

const ThemedNeumorphicSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = ({ children, className, ...props }) => {
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
        <select
            className={`w-full p-3 rounded-xl focus:outline-none focus:ring-2 appearance-none ${themeClasses[theme]} ${className}`}
            {...props}
        >
            {children}
        </select>
    );
};

const TransactionForm: React.FC<TransactionFormProps> = ({ onSubmit, initialData, onClose, people, expenseCategories, incomeCategories, onAddTag }) => {
  const { theme } = useTheme();
  const [type, setType] = useState<'income' | 'expense'>(initialData?.type || 'expense');
  const [amount, setAmount] = useState(initialData?.amount?.toString() || '');
  const [category, setCategory] = useState(initialData?.category || expenseCategories[0]);
  const [date, setDate] = useState(initialData?.date ? initialData.date.split('T')[0] : new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState(initialData?.description || '');
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [recurring, setRecurring] = useState<'none' | 'daily' | 'weekly' | 'monthly'>(initialData?.recurring || 'none');
  const [currency, setCurrency] = useState(initialData?.currency || CURRENCIES[0].symbol);
  const [isTaxDeductible, setIsTaxDeductible] = useState(initialData?.isTaxDeductible || false);
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [currentTag, setCurrentTag] = useState('');

  // Expense splitting state
  const [isSplit, setIsSplit] = useState(!!initialData?.splitDetails && initialData.splitDetails.length > 0);
  const [payer, setPayer] = useState<'user' | string>(initialData?.payerId || 'user');
  const [involvedPeople, setInvolvedPeople] = useState<Set<string | 'user'>>(
      new Set(initialData?.splitDetails?.map(d => d.personId) || ['user'])
  );
  const [splitMethod, setSplitMethod] = useState<'equal' | 'custom'>('equal');
  const [customAmounts, setCustomAmounts] = useState<{ [key: string]: string }>(
      initialData?.splitDetails?.reduce((acc, detail) => ({ ...acc, [detail.personId]: detail.amount?.toString() || '' }), {}) || {}
  );
  
  const categories = type === 'expense' ? expenseCategories : incomeCategories;

  useEffect(() => {
    if (initialData) {
      setType(initialData.type);
      setAmount(initialData.amount.toString());
      setCategory(initialData.category);
      setDate(initialData.date.split('T')[0]);
      setDescription(initialData.description);
      setNotes(initialData.notes || '');
      setRecurring(initialData.recurring);
      setCurrency(initialData.currency);
      setIsTaxDeductible(initialData.isTaxDeductible || false);
      setTags(initialData.tags || []);
      
      const hasSplitDetails = !!initialData.splitDetails && initialData.splitDetails.length > 0;
      setIsSplit(hasSplitDetails);
      if (hasSplitDetails) {
          setPayer(initialData.payerId || 'user');
          setInvolvedPeople(new Set(initialData.splitDetails!.map(d => d.personId)));
          const hasCustomAmounts = initialData.splitDetails!.some(d => d.amount !== undefined);
          setSplitMethod(hasCustomAmounts ? 'custom' : 'equal');
          setCustomAmounts(initialData.splitDetails!.reduce((acc, detail) => ({ ...acc, [detail.personId]: detail.amount?.toString() || '' }), {}))
      }

    }
  }, [initialData]);
  
  useEffect(() => {
    if (!categories.includes(category)) {
      setCategory(categories[0]);
    }
    if (type === 'income') {
        setIsTaxDeductible(false);
        setIsSplit(false);
    }
  }, [type, category, categories]);

  const handleInvolvedPersonToggle = (personId: string | 'user') => {
      setInvolvedPeople(prev => {
          const newSet = new Set(prev);
          if (newSet.has(personId)) {
              newSet.delete(personId);
          } else {
              newSet.add(personId);
          }
          return newSet;
      });
  };

  const totalCustomAmount = useMemo(() => {
      if (splitMethod !== 'custom') return 0;
      return Array.from(involvedPeople).reduce((total, personId) => total + (parseFloat(customAmounts[personId]) || 0), 0);
  }, [customAmounts, involvedPeople, splitMethod]);

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && currentTag.trim()) {
        e.preventDefault();
        const newTag = currentTag.trim().toLowerCase();
        if (!tags.includes(newTag)) {
            setTags([...tags, newTag]);
            onAddTag(newTag);
        }
        setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
      setTags(tags.filter(tag => tag !== tagToRemove));
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
        alert("Please enter a valid amount.");
        return;
    }

    let transactionData: any = {
      ...(initialData || {}),
      type,
      amount: Number(amount),
      category,
      date,
      description,
      notes,
      recurring,
      currency,
      tags,
      isTaxDeductible: type === 'expense' ? isTaxDeductible : false,
      splitDetails: null,
      payerId: null,
    };

    if (isSplit && type === 'expense') {
        if (involvedPeople.size < 2) {
            alert("Please select at least two people to split the expense.");
            return;
        }
        if (splitMethod === 'custom' && Math.abs(totalCustomAmount - Number(amount)) > 0.01) {
            alert(`Custom split amounts (${totalCustomAmount.toFixed(2)}) do not add up to the total transaction amount (${Number(amount).toFixed(2)}).`);
            return;
        }

        const splitDetails: SplitDetail[] = Array.from(involvedPeople).map(personId => ({
            personId,
            amount: splitMethod === 'custom' ? (parseFloat(customAmounts[personId]) || 0) : undefined,
        }));

        transactionData = {
            ...transactionData,
            payerId: payer,
            splitDetails,
        };
    }


    onSubmit(transactionData);
  };
  
  const buttonThemeClasses = {
      light: {
          primary: 'bg-primary-mint text-white shadow-neumorphic-convex active:shadow-neumorphic-concave',
          default: 'shadow-neumorphic-convex active:shadow-neumorphic-concave',
          tag: 'bg-gray-200',
      },
      dark: {
          primary: 'bg-primary-mint text-white shadow-neumorphic-convex-dark active:shadow-neumorphic-concave-dark',
          default: 'shadow-neumorphic-convex-dark active:shadow-neumorphic-concave-dark',
          tag: 'bg-gray-700',
      },
      lime: {
          primary: 'bg-primary-lime text-white shadow-neumorphic-convex-lime active:shadow-neumorphic-concave-lime',
          default: 'shadow-neumorphic-convex-lime active:shadow-neumorphic-concave-lime',
           tag: 'bg-lime-200',
      },
      rose: {
          primary: 'bg-primary-rose text-white shadow-neumorphic-convex-rose active:shadow-neumorphic-concave-rose',
          default: 'shadow-neumorphic-convex-rose active:shadow-neumorphic-concave-rose',
          tag: 'bg-rose-200',
      },
      ocean: {
          primary: 'bg-primary-ocean text-white shadow-neumorphic-convex-ocean active:shadow-neumorphic-concave-ocean',
          default: 'shadow-neumorphic-convex-ocean active:shadow-neumorphic-concave-ocean',
          tag: 'bg-blue-200',
      },
      tangerine: {
          primary: 'bg-primary-tangerine text-white shadow-neumorphic-convex-tangerine active:shadow-neumorphic-concave-tangerine',
          default: 'shadow-neumorphic-convex-tangerine active:shadow-neumorphic-concave-tangerine',
          tag: 'bg-orange-200',
      },
      lavender: {
          primary: 'bg-primary-lavender text-white shadow-neumorphic-convex-lavender active:shadow-neumorphic-concave-lavender',
          default: 'shadow-neumorphic-convex-lavender active:shadow-neumorphic-concave-lavender',
          tag: 'bg-purple-200',
      }
  };

  const typeButtonThemeClasses = {
      light: {
          active: 'shadow-neumorphic-concave text-primary-mint',
          inactive: 'shadow-neumorphic-convex',
      },
      dark: {
          active: 'shadow-neumorphic-concave-dark text-primary-mint',
          inactive: 'shadow-neumorphic-convex-dark',
      },
      lime: {
          active: 'shadow-neumorphic-concave-lime text-primary-lime',
          inactive: 'shadow-neumorphic-convex-lime',
      },
      rose: {
          active: 'shadow-neumorphic-concave-rose text-primary-rose',
          inactive: 'shadow-neumorphic-convex-rose',
      },
      ocean: {
          active: 'shadow-neumorphic-concave-ocean text-primary-ocean',
          inactive: 'shadow-neumorphic-convex-ocean',
      },
      tangerine: {
          active: 'shadow-neumorphic-concave-tangerine text-primary-tangerine',
          inactive: 'shadow-neumorphic-convex-tangerine',
      },
      lavender: {
          active: 'shadow-neumorphic-concave-lavender text-primary-lavender',
          inactive: 'shadow-neumorphic-convex-lavender',
      }
  };

  return (
    <div className="w-full max-w-lg">
      <NeumorphicCard className="w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">{initialData ? 'Edit' : 'Add'} Transaction</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex rounded-xl p-1 gap-1">
            <button type="button" onClick={(e) => { createGlobalRipple(e); setType('expense'); }} className={`flex-1 py-2 rounded-lg font-semibold transition-all transform active:scale-95 ${type === 'expense' ? typeButtonThemeClasses[theme].active : typeButtonThemeClasses[theme].inactive}`}>Expense</button>
            <button type="button" onClick={(e) => { createGlobalRipple(e); setType('income'); }} className={`flex-1 py-2 rounded-lg font-semibold transition-all transform active:scale-95 ${type === 'income' ? typeButtonThemeClasses[theme].active : typeButtonThemeClasses[theme].inactive}`}>Income</button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium mb-1">
                  <AmountIcon className="w-5 h-5" />
                  <span>Amount</span>
              </label>
              <ThemedNeumorphicInput type="number" value={amount} onChange={e => setAmount(e.target.value)} required min="0.01" step="0.01" />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium mb-1">
                  <CurrencyIcon className="w-5 h-5" />
                  <span>Currency</span>
              </label>
              <ThemedNeumorphicSelect value={currency} onChange={e => setCurrency(e.target.value)}>
                {CURRENCIES.map(c => <option key={c.name} value={c.symbol}>{c.symbol} {c.name}</option>)}
              </ThemedNeumorphicSelect>
            </div>
          </div>
           <div>
            <label className="flex items-center gap-1.5 text-sm font-medium mb-1">
                <DescriptionIcon className="w-5 h-5" />
                <span>Description</span>
            </label>
            <ThemedNeumorphicInput type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="e.g. Coffee with friends" />
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium mb-1">
                <NotesIcon className="w-5 h-5" />
                <span>Notes (Optional)</span>
            </label>
            <ThemedNeumorphicTextarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="e.g. Catch up about the project" rows={2} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium mb-1">
                  <CategoryIcon className="w-5 h-5" />
                  <span>Category</span>
              </label>
              <ThemedNeumorphicSelect value={category} onChange={e => setCategory(e.target.value)}>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </ThemedNeumorphicSelect>
            </div>
             <div>
              <label className="flex items-center gap-1.5 text-sm font-medium mb-1">
                  <CalendarIcon className="w-5 h-5" />
                  <span>Date</span>
              </label>
              <ThemedNeumorphicInput type="date" value={date} onChange={e => setDate(e.target.value)} required />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium mb-1">
                <TagIcon className="w-5 h-5" />
                <span>Tags</span>
            </label>
            <div className="flex flex-wrap items-center gap-2 p-2 rounded-xl shadow-neumorphic-concave dark:shadow-neumorphic-concave-dark">
                {tags.map(tag => (
                    <div key={tag} className={`flex items-center gap-1.5 px-2 py-1 rounded ${buttonThemeClasses[theme].tag}`}>
                        <span className="text-sm">{tag}</span>
                        <button type="button" onClick={(e) => { createGlobalRipple(e); removeTag(tag);}} className="font-bold">&times;</button>
                    </div>
                ))}
                <input
                    type="text"
                    value={currentTag}
                    onChange={e => setCurrentTag(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    placeholder="Add a tag..."
                    className="flex-1 bg-transparent focus:outline-none p-1"
                />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <label className="flex items-center gap-1.5 text-sm font-medium mb-1">
                <RecurringIcon className="w-5 h-5" />
                <span>Recurring</span>
                </label>
                <ThemedNeumorphicSelect value={recurring} onChange={(e) => setRecurring(e.target.value as 'none' | 'daily' | 'weekly' | 'monthly')}>
                <option value="none">None</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                </ThemedNeumorphicSelect>
            </div>
            {type === 'expense' && (
            <div>
                <label className="flex items-center gap-1.5 text-sm font-medium mb-1">
                    <span>&nbsp;</span>
                </label>
                <div className="flex items-center h-full">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <ThemedNeumorphicInput
                            type="checkbox"
                            className="!w-5 !h-5 !rounded"
                            checked={isTaxDeductible}
                            onChange={(e) => setIsTaxDeductible(e.target.checked)}
                        />
                        <span>Tax Deductible</span>
                    </label>
                </div>
            </div>
            )}
            </div>

            {type === 'expense' && people.length > 0 && (
            <div>
                <div className="flex items-center justify-between mb-2">
                    <label className="font-medium">Split Expense</label>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={isSplit} onChange={() => setIsSplit(!isSplit)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-mint"></div>
                    </label>
                </div>
                {isSplit && (
                    <NeumorphicCard type="concave" className="space-y-4">
                        <div>
                            <label className="font-medium mb-1 block">Paid by</label>
                            <ThemedNeumorphicSelect value={payer} onChange={(e) => setPayer(e.target.value)}>
                                <option value="user">You</option>
                                {people.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </ThemedNeumorphicSelect>
                        </div>
                        <div>
                            <label className="font-medium mb-1 block">Split with</label>
                            <div className="grid grid-cols-2 gap-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={involvedPeople.has('user')} onChange={() => handleInvolvedPersonToggle('user')} className="w-4 h-4" />
                                    <span>You</span>
                                </label>
                                {people.map(p => (
                                    <label key={p.id} className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={involvedPeople.has(p.id)} onChange={() => handleInvolvedPersonToggle(p.id)} className="w-4 h-4" />
                                        <span>{p.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="font-medium mb-1 block">Split Method</label>
                            <div className="flex rounded-lg p-1 gap-1">
                                <button type="button" onClick={(e) => { createGlobalRipple(e); setSplitMethod('equal'); }} className={`flex-1 py-1 rounded-md text-sm font-semibold transition-all transform active:scale-95 ${splitMethod === 'equal' ? typeButtonThemeClasses[theme].active : typeButtonThemeClasses[theme].inactive}`}>Equal</button>
                                <button type="button" onClick={(e) => { createGlobalRipple(e); setSplitMethod('custom'); }} className={`flex-1 py-1 rounded-md text-sm font-semibold transition-all transform active:scale-95 ${splitMethod === 'custom' ? typeButtonThemeClasses[theme].active : typeButtonThemeClasses[theme].inactive}`}>Custom</button>
                            </div>
                        </div>
                        {splitMethod === 'custom' && (
                            <div>
                                <label className="font-medium mb-1 block">Custom Amounts</label>
                                <div className="space-y-2">
                                    {Array.from(involvedPeople).map(personId => (
                                        <div key={personId} className="flex items-center gap-2">
                                            <span className="flex-1">{personId === 'user' ? 'You' : people.find(p => p.id === personId)?.name}</span>
                                            <ThemedNeumorphicInput
                                                type="number"
                                                placeholder="0.00"
                                                min="0"
                                                step="0.01"
                                                className="w-28"
                                                value={customAmounts[personId] || ''}
                                                onChange={(e) => setCustomAmounts(prev => ({ ...prev, [personId]: e.target.value }))}
                                            />
                                        </div>
                                    ))}
                                    <div className="text-right text-sm font-semibold">
                                        Total: {currency}{totalCustomAmount.toFixed(2)} / {currency}{Number(amount).toFixed(2)}
                                    </div>
                                </div>
                            </div>
                        )}
                    </NeumorphicCard>
                )}
            </div>
            )}
          <div className="flex gap-4 pt-4">
            <button type="button" onClick={(e) => { createGlobalRipple(e); onClose(); }} className={`w-full font-bold py-3 px-4 rounded-xl transform active:scale-95 transition-all duration-200 ${buttonThemeClasses[theme].default}`}>Cancel</button>
            <button type="submit" onClick={createGlobalRipple} className={`w-full font-bold py-3 px-4 rounded-xl transform active:scale-95 transition-all duration-200 ${buttonThemeClasses[theme].primary}`}>{initialData ? 'Update' : 'Save'}</button>
          </div>
        </form>
      </NeumorphicCard>
    </div>
  );
};

export default TransactionForm;