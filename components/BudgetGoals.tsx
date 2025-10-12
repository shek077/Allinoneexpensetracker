import React, { useState } from 'react';
import { BudgetGoal } from '../types';
import NeumorphicCard from './NeumorphicCard';
import { EXPENSE_CATEGORIES } from '../constants';
import { useTheme } from '../hooks/useTheme';
import ConfirmationDialog from './ConfirmationDialog';
import AnimatedModal from './AnimatedModal';
import { createGlobalRipple } from '../services/rippleEffect';

interface BudgetGoalsProps {
  budgetGoals: BudgetGoal[];
  onSave: (goal: Omit<BudgetGoal, 'id'>) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
  currency: string;
}

const TargetIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v3m0 9v3m-7.5-7.5h3m9 0h3M4.5 12a7.5 7.5 0 1115 0 7.5 7.5 0 01-15 0z" />
    </svg>
);

const CategoryIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.53 0 1.04.21 1.41.59l7 7a2 2 0 010 2.83l-5 5a2 2 0 01-2.83 0l-7-7A2 2 0 013 8V3a2 2 0 012-2h2z" />
    </svg>
);

const AmountIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" />
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

const DeleteIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);


const BudgetGoals: React.FC<BudgetGoalsProps> = ({ budgetGoals, onSave, onDelete, onClose, currency }) => {
  const { theme } = useTheme();
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [amount, setAmount] = useState('');
  const [goalToDelete, setGoalToDelete] = useState<BudgetGoal | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
        alert("Please enter a valid positive amount.");
        return;
    }
    onSave({ category, amount: Number(amount) });
    setAmount('');
  };

  const handleRequestDelete = (goal: BudgetGoal) => {
      setGoalToDelete(goal);
  };

  const handleConfirmDelete = () => {
      if (goalToDelete) {
          onDelete(goalToDelete.id);
          setGoalToDelete(null);
      }
  };

  const buttonThemeClasses = {
      light: {
          primary: 'bg-primary-mint text-white shadow-neumorphic-convex active:shadow-neumorphic-concave',
          default: 'shadow-neumorphic-convex active:shadow-neumorphic-concave',
      },
      dark: {
          primary: 'bg-primary-mint text-white shadow-neumorphic-convex-dark active:shadow-neumorphic-concave-dark',
          default: 'shadow-neumorphic-convex-dark active:shadow-neumorphic-concave-dark',
      },
      lime: {
          primary: 'bg-primary-lime text-white shadow-neumorphic-convex-lime active:shadow-neumorphic-concave-lime',
          default: 'shadow-neumorphic-convex-lime active:shadow-neumorphic-concave-lime',
      },
      rose: {
          primary: 'bg-primary-rose text-white shadow-neumorphic-convex-rose active:shadow-neumorphic-concave-rose',
          default: 'shadow-neumorphic-convex-rose active:shadow-neumorphic-concave-rose',
      },
      ocean: {
          primary: 'bg-primary-ocean text-white shadow-neumorphic-convex-ocean active:shadow-neumorphic-concave-ocean',
          default: 'shadow-neumorphic-convex-ocean active:shadow-neumorphic-concave-ocean',
      },
      tangerine: {
          primary: 'bg-primary-tangerine text-white shadow-neumorphic-convex-tangerine active:shadow-neumorphic-concave-tangerine',
          default: 'shadow-neumorphic-convex-tangerine active:shadow-neumorphic-concave-tangerine',
      },
      lavender: {
          primary: 'bg-primary-lavender text-white shadow-neumorphic-convex-lavender active:shadow-neumorphic-concave-lavender',
          default: 'shadow-neumorphic-convex-lavender active:shadow-neumorphic-concave-lavender',
      }
  };

  return (
    <>
      <NeumorphicCard className="w-full max-w-lg" glass>
          <div className="flex items-center justify-center gap-3 mb-6">
              <TargetIcon className="w-7 h-7" />
              <h2 className="text-2xl font-bold text-center">Manage Budgets</h2>
          </div>

          <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-2">
              {budgetGoals.length > 0 ? budgetGoals.map(goal => (
                  <NeumorphicCard type="concave" key={goal.id} className="!p-3 flex justify-between items-center">
                      <div>
                          <p className="font-semibold">{goal.category}</p>
                          <p className="text-lg font-bold">{currency}{goal.amount.toFixed(2)}</p>
                      </div>
                      <button onClick={(e) => { createGlobalRipple(e); handleRequestDelete(goal); }} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors" aria-label={`Delete ${goal.category} budget`}>
                         <DeleteIcon className="w-5 h-5 text-red-500" />
                      </button>
                  </NeumorphicCard>
              )) : <p className="text-center text-gray-500">No budget goals set yet.</p>}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-lg font-semibold text-center">Add or Update Goal</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                      <label className="flex items-center gap-1.5 text-sm font-medium mb-1">
                          <CategoryIcon className="w-5 h-5" />
                          <span>Category</span>
                      </label>
                      <ThemedNeumorphicSelect value={category} onChange={e => setCategory(e.target.value)}>
                          {EXPENSE_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </ThemedNeumorphicSelect>
                  </div>
                  <div>
                      <label className="flex items-center gap-1.5 text-sm font-medium mb-1">
                          <AmountIcon className="w-5 h-5" />
                          <span>Monthly Budget</span>
                      </label>
                      <ThemedNeumorphicInput type="number" value={amount} onChange={e => setAmount(e.target.value)} required min="0.01" step="0.01" placeholder="e.g. 500" />
                  </div>
              </div>
              <div className="flex gap-4 pt-4">
                  <button type="button" onClick={(e) => { createGlobalRipple(e); onClose(); }} className={`w-full font-bold py-3 px-4 rounded-xl transform active:scale-95 transition-all duration-200 ${buttonThemeClasses[theme].default}`}>Close</button>
                  <button type="submit" onClick={createGlobalRipple} className={`w-full font-bold py-3 px-4 rounded-xl transform active:scale-95 transition-all duration-200 ${buttonThemeClasses[theme].primary}`}>Save Goal</button>
              </div>
          </form>
      </NeumorphicCard>
      <AnimatedModal isOpen={!!goalToDelete} onClose={() => setGoalToDelete(null)}>
        <ConfirmationDialog
            onClose={() => setGoalToDelete(null)}
            onConfirm={handleConfirmDelete}
            title="Confirm Budget Deletion"
            message={`Are you sure you want to delete the budget goal for "${goalToDelete?.category}"?`}
        />
      </AnimatedModal>
    </>
  );
};

export default BudgetGoals;