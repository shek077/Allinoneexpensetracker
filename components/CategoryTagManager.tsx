import React, { useState, useRef } from 'react';
import NeumorphicCard from './NeumorphicCard';
import { useTheme } from '../hooks/useTheme';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../constants';
import { createGlobalRipple } from '../services/rippleEffect';

interface CategoryTagManagerProps {
  customExpenseCategories: string[];
  customIncomeCategories: string[];
  tags: string[];
  categoryIcons: { [key: string]: string };
  categoryColors: { [key: string]: string };
  onAddCategory: (category: string, type: 'expense' | 'income') => void;
  onDeleteCategory: (category: string, type: 'expense' | 'income') => void;
  onSetCategoryIcon: (category: string, dataUrl: string) => void;
  onSetCategoryColor: (category: string, color: string) => void;
  onDeleteTag: (tag: string) => void;
  onClose: () => void;
}

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

const DeleteIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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

const CategoryList: React.FC<{
    title: string;
    items: string[];
    customItems: string[];
    categoryIcons: { [key: string]: string };
    categoryColors: { [key: string]: string };
    onDelete: (item: string) => void;
    onSetIcon: (item: string, dataUrl: string) => void;
    onSetColor: (item: string, color: string) => void;
}> = ({ title, items, customItems, categoryIcons, categoryColors, onDelete, onSetIcon, onSetColor }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [categoryToUpdate, setCategoryToUpdate] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0] && categoryToUpdate) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (loadEvent) => {
                if (loadEvent.target?.result) {
                    onSetIcon(categoryToUpdate, loadEvent.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };
    
    const triggerFileUpload = (category: string) => {
        setCategoryToUpdate(category);
        fileInputRef.current?.click();
    };


    const renderItem = (item: string, isCustom: boolean) => (
        <div key={item} className="flex items-center gap-2 px-2 py-1 text-sm rounded-lg bg-gray-200 dark:bg-gray-700">
            <button onClick={(e) => { createGlobalRipple(e); triggerFileUpload(item); }} title={`Upload icon for ${item}`}>
                {categoryIcons[item] ? (
                     <img src={categoryIcons[item]} alt={item} className="w-6 h-6 rounded-full object-cover" />
                ) : (
                    <div 
                        className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-white"
                        style={{ backgroundColor: categoryColors[item] || '#9ca3af' }}
                    >
                        {item.charAt(0).toUpperCase()}
                    </div>
                )}
            </button>
            <input
                type="color"
                value={categoryColors[item] || '#ffffff'}
                onChange={(e) => onSetColor(item, e.target.value)}
                className="w-6 h-6 p-0 border-none rounded cursor-pointer bg-transparent"
                style={{ appearance: 'none', WebkitAppearance: 'none' }}
                title={`Set color for ${item}`}
            />
            <span className="flex-grow">{item}</span>
            {isCustom && <button onClick={(e) => { createGlobalRipple(e); onDelete(item); }}><DeleteIcon className="w-4 h-4 text-red-500" /></button>}
        </div>
    );
    
    return (
        <div>
            <h4 className="font-bold mb-2">{title}</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {items.map(item => renderItem(item, false))}
                {customItems.map(item => renderItem(item, true))}
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
        </div>
    )
};

const CategoryTagManager: React.FC<CategoryTagManagerProps> = ({ 
    customExpenseCategories, customIncomeCategories, tags, categoryIcons, categoryColors,
    onAddCategory, onDeleteCategory, onSetCategoryIcon, onSetCategoryColor, onDeleteTag, onClose 
}) => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'categories' | 'tags'>('categories');
  const [newExpenseCategory, setNewExpenseCategory] = useState('');
  const [newIncomeCategory, setNewIncomeCategory] = useState('');

  const handleAddCategory = (type: 'expense' | 'income') => {
    const category = type === 'expense' ? newExpenseCategory.trim() : newIncomeCategory.trim();
    if (category) {
        onAddCategory(category, type);
        if (type === 'expense') setNewExpenseCategory('');
        else setNewIncomeCategory('');
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
  
  const typeButtonThemeClasses = {
      light: { active: 'shadow-neumorphic-concave text-primary-mint', inactive: 'shadow-neumorphic-convex' },
      dark: { active: 'shadow-neumorphic-concave-dark text-primary-mint', inactive: 'shadow-neumorphic-convex-dark' },
      lime: { active: 'shadow-neumorphic-concave-lime text-primary-lime', inactive: 'shadow-neumorphic-convex-lime' },
      rose: { active: 'shadow-neumorphic-concave-rose text-primary-rose', inactive: 'shadow-neumorphic-convex-rose' },
      ocean: { active: 'shadow-neumorphic-concave-ocean text-primary-ocean', inactive: 'shadow-neumorphic-convex-ocean' },
      tangerine: { active: 'shadow-neumorphic-concave-tangerine text-primary-tangerine', inactive: 'shadow-neumorphic-convex-tangerine' },
      lavender: { active: 'shadow-neumorphic-concave-lavender text-primary-lavender', inactive: 'shadow-neumorphic-convex-lavender' }
  };

  return (
    <NeumorphicCard className="w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-center mb-6">Manage Categories & Tags</h2>

        <div className="flex rounded-xl p-1 gap-1 mb-6">
            <button onClick={(e) => { createGlobalRipple(e); setActiveTab('categories'); }} className={`flex-1 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 transform active:scale-95 ${activeTab === 'categories' ? typeButtonThemeClasses[theme].active : typeButtonThemeClasses[theme].inactive}`}>
                <CategoryIcon className="w-5 h-5"/> Categories
            </button>
            <button onClick={(e) => { createGlobalRipple(e); setActiveTab('tags'); }} className={`flex-1 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 transform active:scale-95 ${activeTab === 'tags' ? typeButtonThemeClasses[theme].active : typeButtonThemeClasses[theme].inactive}`}>
                <TagIcon className="w-5 h-5"/> Tags
            </button>
        </div>

        <div key={activeTab} className="animate-fadeIn space-y-6 max-h-[60vh] overflow-y-auto pr-2">
            {activeTab === 'categories' && (
                <div className="space-y-6">
                    <CategoryList title="Expense Categories" items={EXPENSE_CATEGORIES} customItems={customExpenseCategories} categoryIcons={categoryIcons} categoryColors={categoryColors} onDelete={(cat) => onDeleteCategory(cat, 'expense')} onSetIcon={onSetCategoryIcon} onSetColor={onSetCategoryColor} />
                    <div className="flex gap-2">
                        <ThemedNeumorphicInput value={newExpenseCategory} onChange={e => setNewExpenseCategory(e.target.value)} placeholder="New expense category..." />
                        <button onClick={(e) => { createGlobalRipple(e); handleAddCategory('expense'); }} className={`px-4 font-bold rounded-xl transform active:scale-95 transition-all ${buttonThemeClasses[theme].primary}`}>Add</button>
                    </div>
                    <hr className="border-gray-300 dark:border-gray-600" />
                    <CategoryList title="Income Categories" items={INCOME_CATEGORIES} customItems={customIncomeCategories} categoryIcons={categoryIcons} categoryColors={categoryColors} onDelete={(cat) => onDeleteCategory(cat, 'income')} onSetIcon={onSetCategoryIcon} onSetColor={onSetCategoryColor}/>
                    <div className="flex gap-2">
                        <ThemedNeumorphicInput value={newIncomeCategory} onChange={e => setNewIncomeCategory(e.target.value)} placeholder="New income category..." />
                        <button onClick={(e) => { createGlobalRipple(e); handleAddCategory('income'); }} className={`px-4 font-bold rounded-xl transform active:scale-95 transition-all ${buttonThemeClasses[theme].primary}`}>Add</button>
                    </div>
                </div>
            )}
            {activeTab === 'tags' && (
                 <div>
                    <h4 className="font-bold mb-2">All Tags</h4>
                    <div className="flex flex-wrap gap-2">
                        {tags.length > 0 ? tags.map(tag => (
                            <span key={tag} className="flex items-center gap-2 px-3 py-1 text-sm rounded-lg bg-gray-300 dark:bg-gray-600">
                                {tag}
                                <button onClick={(e) => { createGlobalRipple(e); onDeleteTag(tag); }}><DeleteIcon className="w-4 h-4 text-red-500" /></button>
                            </span>
                        )) : <p className="text-sm text-gray-500">No tags created yet. Add them in the transaction form.</p>}
                    </div>
                </div>
            )}
        </div>
        
        <div className="flex justify-center pt-6">
             <button type="button" onClick={(e) => { createGlobalRipple(e); onClose(); }} className={`w-full max-w-xs font-bold py-3 px-4 rounded-xl transform active:scale-95 transition-all duration-200 ${buttonThemeClasses[theme].default}`}>Close</button>
        </div>
    </NeumorphicCard>
  );
};

export default CategoryTagManager;