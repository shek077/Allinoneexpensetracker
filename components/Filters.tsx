
import React, { useMemo } from 'react';
import NeumorphicCard from './NeumorphicCard';
import { Transaction } from '../types';
import { useTheme } from '../hooks/useTheme';
import { CURRENCIES } from '../constants';
import { createGlobalRipple } from '../services/rippleEffect';

interface FiltersProps {
  filterCategory: string;
  setFilterCategory: (category: string) => void;
  filterDateRange: { start: string; end:string; };
  setFilterDateRange: (range: { start: string; end: string; }) => void;
  filterCurrency: string;
  onCurrencyChange: (currency: string) => void;
  filterTaxStatus: 'all' | 'deductible' | 'non-deductible';
  setFilterTaxStatus: (status: 'all' | 'deductible' | 'non-deductible') => void;
  filterTag: string;
  setFilterTag: (tag: string) => void;
  allTags: string[];
  transactions: Transaction[];
  expenseCategories: string[];
  incomeCategories: string[];
  onExportPdf: () => void;
  onShowBudgetGoals: () => void;
  onShowPeopleManager: () => void;
  onShowSubscriptionManager: () => void;
  onShowCategoryManager: () => void;
  onShowResetDialog: () => void;
}

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

const TagIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 5h14a2 2 0 012 2v3a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2zm0 0l7 7 7-7" />
    </svg>
);


const CalendarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const TargetIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v3m0 9v3m-7.5-7.5h3m9 0h3M4.5 12a7.5 7.5 0 1115 0 7.5 7.5 0 01-15 0z" />
    </svg>
);

const ExportIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

const TaxIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
);

const PeopleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.282-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.282.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

const SubscriptionIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" opacity="0.6"/>
    </svg>
);

const ResetIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M4 9a9 9 0 0115.147-5.409M20 20v-5h-5m0 5a9 9 0 01-15.147 5.409" />
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


const Filters: React.FC<FiltersProps> = ({ 
    filterCategory, setFilterCategory, 
    filterDateRange, setFilterDateRange,
    filterCurrency, onCurrencyChange,
    filterTaxStatus, setFilterTaxStatus,
    filterTag, setFilterTag,
    allTags,
    expenseCategories, incomeCategories,
    onExportPdf,
    onShowBudgetGoals,
    onShowPeopleManager,
    onShowSubscriptionManager,
    onShowCategoryManager,
    onShowResetDialog,
}) => {
  const { theme } = useTheme();
  const categories = useMemo(() => {
    const allCategories = new Set([...expenseCategories, ...incomeCategories]);
    return ['all', ...Array.from(allCategories)];
  }, [expenseCategories, incomeCategories]);
  
  const buttonThemeClasses = {
      light: 'bg-primary-mint text-white shadow-neumorphic-convex active:shadow-neumorphic-concave',
      dark: 'bg-primary-mint text-white shadow-neumorphic-convex-dark active:shadow-neumorphic-concave-dark',
      lime: 'bg-primary-lime text-white shadow-neumorphic-convex-lime active:shadow-neumorphic-concave-lime',
      rose: 'bg-primary-rose text-white shadow-neumorphic-convex-rose active:shadow-neumorphic-concave-rose',
      ocean: 'bg-primary-ocean text-white shadow-neumorphic-convex-ocean active:shadow-neumorphic-concave-ocean',
      tangerine: 'bg-primary-tangerine text-white shadow-neumorphic-convex-tangerine active:shadow-neumorphic-concave-tangerine',
      lavender: 'bg-primary-lavender text-white shadow-neumorphic-convex-lavender active:shadow-neumorphic-concave-lavender',
  };

   const resetButtonThemeClasses = {
        light: 'bg-red-500 text-white shadow-neumorphic-convex active:shadow-neumorphic-concave',
        dark: 'bg-red-500 text-white shadow-neumorphic-convex-dark active:shadow-neumorphic-concave-dark',
        lime: 'bg-red-500 text-white shadow-neumorphic-convex-lime active:shadow-neumorphic-concave-lime',
        rose: 'bg-red-500 text-white shadow-neumorphic-convex-rose active:shadow-neumorphic-concave-rose',
        ocean: 'bg-red-500 text-white shadow-neumorphic-convex-ocean active:shadow-neumorphic-concave-ocean',
        tangerine: 'bg-red-500 text-white shadow-neumorphic-convex-tangerine active:shadow-neumorphic-concave-tangerine',
        lavender: 'bg-red-500 text-white shadow-neumorphic-convex-lavender active:shadow-neumorphic-concave-lavender',
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
    <NeumorphicCard>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <div>
              <label className="flex items-center gap-1.5 text-sm font-medium mb-1">
                  <CurrencyIcon className="w-5 h-5" />
                  <span>Currency</span>
              </label>
              <ThemedNeumorphicSelect value={filterCurrency} onChange={(e) => onCurrencyChange(e.target.value)}>
                  {CURRENCIES.map(c => <option key={c.name} value={c.symbol}>{c.symbol} {c.name}</option>)}
              </ThemedNeumorphicSelect>
          </div>
          <div>
              <label className="flex items-center gap-1.5 text-sm font-medium mb-1">
                  <CategoryIcon className="w-5 h-5" />
                  <span>Category</span>
              </label>
              <ThemedNeumorphicSelect value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                  {categories.map(cat => <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>)}
              </ThemedNeumorphicSelect>
          </div>
           <div>
              <label className="flex items-center gap-1.5 text-sm font-medium mb-1">
                  <TagIcon className="w-5 h-5" />
                  <span>Tag</span>
              </label>
              <ThemedNeumorphicSelect value={filterTag} onChange={(e) => setFilterTag(e.target.value)}>
                  {allTags.map(tag => <option key={tag} value={tag}>{tag === 'all' ? 'All Tags' : tag}</option>)}
              </ThemedNeumorphicSelect>
          </div>
          <div>
              <label className="flex items-center gap-1.5 text-sm font-medium mb-1">
                  <CalendarIcon className="w-5 h-5" />
                  <span>Start Date</span>
              </label>
              <ThemedNeumorphicInput type="date" value={filterDateRange.start} onChange={(e) => setFilterDateRange({...filterDateRange, start: e.target.value})} />
          </div>
          <div>
              <label className="flex items-center gap-1.5 text-sm font-medium mb-1">
                  <CalendarIcon className="w-5 h-5" />
                  <span>End Date</span>
              </label>
              <ThemedNeumorphicInput type="date" value={filterDateRange.end} onChange={(e) => setFilterDateRange({...filterDateRange, end: e.target.value})} />
          </div>
        </div>
        <div>
            <label className="flex items-center gap-1.5 text-sm font-medium mb-1">
                <TaxIcon className="w-5 h-5" />
                <span>Tax Status</span>
            </label>
            <div className="flex rounded-xl p-1 gap-1 max-w-md">
                {(['all', 'deductible', 'non-deductible'] as const).map(status => (
                    <button
                        key={status}
                        onClick={(e) => {
                            createGlobalRipple(e);
                            setFilterTaxStatus(status);
                        }}
                        className={`flex-1 py-2 rounded-lg font-semibold text-sm capitalize transform active:scale-95 transition-all ${filterTaxStatus === status ? typeButtonThemeClasses[theme].active : typeButtonThemeClasses[theme].inactive}`}
                    >
                        {status}
                    </button>
                ))}
            </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 pt-2">
            <button
            onClick={(e) => {
                createGlobalRipple(e);
                onShowBudgetGoals();
            }}
            className={`w-full h-12 font-bold py-3 px-4 rounded-xl transform active:scale-95 transition-all duration-200 ${buttonThemeClasses[theme]} flex items-center justify-center gap-2`}
            >
                <TargetIcon className="w-5 h-5" />
                <span className="truncate">Budgets</span>
            </button>
            <button
            onClick={(e) => {
                createGlobalRipple(e);
                onShowPeopleManager();
            }}
            className={`w-full h-12 font-bold py-3 px-4 rounded-xl transform active:scale-95 transition-all duration-200 ${buttonThemeClasses[theme]} flex items-center justify-center gap-2`}
            >
                <PeopleIcon className="w-5 h-5" />
                <span className="truncate">People</span>
            </button>
            <button
            onClick={(e) => {
                createGlobalRipple(e);
                onShowSubscriptionManager();
            }}
            className={`w-full h-12 font-bold py-3 px-4 rounded-xl transform active:scale-95 transition-all duration-200 ${buttonThemeClasses[theme]} flex items-center justify-center gap-2`}
            >
                <SubscriptionIcon className="w-5 h-5" />
                <span className="truncate">Subscriptions</span>
            </button>
             <button
            onClick={(e) => {
                createGlobalRipple(e);
                onShowCategoryManager();
            }}
            className={`w-full h-12 font-bold py-3 px-4 rounded-xl transform active:scale-95 transition-all duration-200 ${buttonThemeClasses[theme]} flex items-center justify-center gap-2`}
            >
                <CategoryIcon className="w-5 h-5" />
                <span className="truncate">Categories</span>
            </button>
            <button
            onClick={(e) => {
                createGlobalRipple(e);
                onExportPdf();
            }}
            className={`w-full h-12 font-bold py-3 px-4 rounded-xl transform active:scale-95 transition-all duration-200 ${buttonThemeClasses[theme]} flex items-center justify-center gap-2`}
            >
                <ExportIcon className="w-5 h-5" />
                <span className="truncate">Export PDF</span>
            </button>
            <button
            onClick={(e) => {
                createGlobalRipple(e);
                onShowResetDialog();
            }}
            className={`w-full h-12 font-bold py-3 px-4 rounded-xl transform active:scale-95 transition-all duration-200 ${resetButtonThemeClasses[theme]} flex items-center justify-center gap-2`}
            >
                <ResetIcon className="w-5 h-5" />
                <span className="truncate">Reset App</span>
            </button>
        </div>
      </div>
    </NeumorphicCard>
  );
};

export default Filters;
