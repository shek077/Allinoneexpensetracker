import React, { useState, useMemo, useCallback, useRef, useEffect, lazy, Suspense } from 'react';
import { Transaction, BudgetGoal, Alert, Person } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useTheme } from './hooks/useTheme';
import Header from './components/Header';
import Summary from './components/Summary';
import Filters from './components/Filters';
import TransactionList from './components/TransactionList';
import BudgetProgress from './components/BudgetProgress';
import Balances from './components/Balances';
import UpcomingSubscriptions from './components/UpcomingSubscriptions';
import { generatePdf } from './services/pdfGenerator';
import { CURRENCIES, INCOME_CATEGORIES, EXPENSE_CATEGORIES } from './constants';
import AnimatedModal from './components/AnimatedModal';
import Loader from './components/Loader';
import Alerts from './components/Alerts';

// Lazy load components for code-splitting and better performance
const Charts = lazy(() => import('./components/Charts'));
const TransactionForm = lazy(() => import('./components/TransactionForm'));
const BudgetGoals = lazy(() => import('./components/BudgetGoals'));
const PeopleManager = lazy(() => import('./components/PeopleManager'));
const SubscriptionManager = lazy(() => import('./components/SubscriptionManager'));
const CategoryTagManager = lazy(() => import('./components/CategoryTagManager'));
const ConfirmationDialog = lazy(() => import('./components/ConfirmationDialog'));
const CurrencyPrompt = lazy(() => import('./components/CurrencyPrompt'));


const calculateNextPaymentDate = (transaction: Transaction): Date => {
    let nextDate = new Date(transaction.date);
    const now = new Date();
    now.setHours(0, 0, 0, 0);

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
                return new Date('9999-12-31'); // Far future date for non-recurring
        }
    }
    return nextDate;
};

const App: React.FC = () => {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('transactions', []);
  const [deletingTransactionIds, setDeletingTransactionIds] = useState<Set<string>>(new Set());
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  
  const [budgetGoals, setBudgetGoals] = useLocalStorage<BudgetGoal[]>('budgetGoals', []);
  const [isBudgetFormVisible, setIsBudgetFormVisible] = useState(false);

  const [people, setPeople] = useLocalStorage<Person[]>('people', []);
  const [isPeopleManagerVisible, setIsPeopleManagerVisible] = useState(false);
  const [isSubscriptionManagerVisible, setIsSubscriptionManagerVisible] = useState(false);
  const [isCategoryManagerVisible, setIsCategoryManagerVisible] = useState(false);
  const [isResetDialogVisible, setIsResetDialogVisible] = useState(false);
  const [isCurrencyPromptVisible, setIsCurrencyPromptVisible] = useState(false);
  const [pendingCurrency, setPendingCurrency] = useState<string | null>(null);


  // Custom Categories, Tags & Icons
  const [customExpenseCategories, setCustomExpenseCategories] = useLocalStorage<string[]>('customExpenseCategories', []);
  const [customIncomeCategories, setCustomIncomeCategories] = useLocalStorage<string[]>('customIncomeCategories', []);
  const [tags, setTags] = useLocalStorage<string[]>('tags', []);
  const [categoryIcons, setCategoryIcons] = useLocalStorage<{ [category: string]: string }>('categoryIcons', {});
  const [categoryColors, setCategoryColors] = useLocalStorage<{ [category: string]: string }>('categoryColors', {});

  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterDateRange, setFilterDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' });
  
  const [rememberCurrency, setRememberCurrency] = useLocalStorage<boolean>('rememberCurrency', true);
  const [filterCurrency, _setFilterCurrency] = useState<string>(() => {
    if (rememberCurrency) {
        const item = window.localStorage.getItem('filterCurrency');
        try {
            return item ? JSON.parse(item) : CURRENCIES[0].symbol;
        } catch {
            return CURRENCIES[0].symbol;
        }
    }
    return CURRENCIES[0].symbol;
  });

  const [filterTaxStatus, setFilterTaxStatus] = useState<'all' | 'deductible' | 'non-deductible'>('all');
  const [filterTag, setFilterTag] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');


  const { theme } = useTheme();
  const reportRef = useRef<HTMLDivElement>(null);
  
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const triggeredAlertsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (rememberCurrency) {
        window.localStorage.setItem('filterCurrency', JSON.stringify(filterCurrency));
    } else {
        window.localStorage.removeItem('filterCurrency');
    }
  }, [rememberCurrency, filterCurrency]);

  useEffect(() => {
    const lastCheck = localStorage.getItem('lastRecurringCheck');
    const lastCheckDate = lastCheck ? new Date(lastCheck) : new Date(0);
    const now = new Date();

    const recurringTransactions = transactions.filter(t => t.recurring && t.recurring !== 'none' && !t.isRecurringInstance);
    const newTransactions: Transaction[] = [];

    recurringTransactions.forEach(t => {
      let nextDate = new Date(t.date);

      while (nextDate <= now) {
        if (t.recurring === 'daily') {
          nextDate.setDate(nextDate.getDate() + 1);
        } else if (t.recurring === 'weekly') {
          nextDate.setDate(nextDate.getDate() + 7);
        } else if (t.recurring === 'monthly') {
          nextDate.setMonth(nextDate.getMonth() + 1);
        } else {
          break;
        }

        if (nextDate > lastCheckDate && nextDate <= now) {
          const newTransactionDate = new Date(nextDate);
          newTransactions.push({
            ...t,
            id: crypto.randomUUID(),
            date: newTransactionDate.toISOString().split('T')[0],
            recurring: 'none',
            isRecurringInstance: true,
            parentId: t.id,
          });
        }
      }
    });

    if (newTransactions.length > 0) {
      setTransactions(prev => [...prev, ...newTransactions]);
    }

    localStorage.setItem('lastRecurringCheck', now.toISOString());
  }, []); // Empty dependency array ensures this runs only once on mount

  const allTags = useMemo(() => {
    const uniqueTags = new Set(transactions.flatMap(t => t.tags || []));
    return ['all', ...Array.from(uniqueTags)];
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return transactions
      .filter(t => t.currency === filterCurrency)
      .filter(t => {
        if (filterCategory !== 'all' && t.category !== filterCategory) return false;
        if (filterTag !== 'all' && (!t.tags || !t.tags.includes(filterTag))) return false;
        if (filterDateRange.start && new Date(t.date) < new Date(filterDateRange.start)) return false;
        if (filterDateRange.end && new Date(t.date) > new Date(filterDateRange.end)) return false;
        if (filterTaxStatus === 'deductible' && !t.isTaxDeductible) return false;
        if (filterTaxStatus === 'non-deductible' && t.isTaxDeductible) return false;
        if (searchTerm) {
            const inDescription = t.description.toLowerCase().includes(lowercasedSearchTerm);
            const inNotes = t.notes?.toLowerCase().includes(lowercasedSearchTerm);
            if (!inDescription && !inNotes) return false;
        }
        return true;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, filterCategory, filterDateRange, filterCurrency, filterTaxStatus, filterTag, searchTerm]);
  
  const requestCurrencyChange = useCallback((newCurrency: string) => {
    if (newCurrency !== filterCurrency) {
      setPendingCurrency(newCurrency);
      setIsCurrencyPromptVisible(true);
    }
  }, [filterCurrency]);

  const handleCurrencyChoice = useCallback((remember: boolean) => {
    if (pendingCurrency) {
      _setFilterCurrency(pendingCurrency);
      setRememberCurrency(remember);
    }
    setIsCurrencyPromptVisible(false);
    setPendingCurrency(null);
  }, [pendingCurrency, setRememberCurrency]);

  const handleCloseCurrencyPrompt = useCallback(() => {
    setIsCurrencyPromptVisible(false);
    setPendingCurrency(null);
  }, []);

  const addTransaction = useCallback((transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = { ...transaction, id: crypto.randomUUID() };
    setTransactions(prev => [newTransaction, ...prev]);
    if(newTransaction.tags){
        setTags(prevTags => {
            const newTags = new Set([...prevTags, ...newTransaction.tags!]);
            return Array.from(newTags);
        });
    }
    setIsFormVisible(false);
  }, [setTransactions, setTags]);

  const updateTransaction = useCallback((updatedTransaction: Transaction) => {
    setTransactions(prev => prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t));
    if (updatedTransaction.tags) {
        setTags(prevTags => {
            const newTags = new Set([...prevTags, ...updatedTransaction.tags!]);
            return Array.from(newTags);
        });
    }
    setEditingTransaction(null);
    setIsFormVisible(false);
  }, [setTransactions, setTags]);

  const deleteTransaction = useCallback((id: string) => {
    setDeletingTransactionIds(prev => new Set(prev).add(id));

    setTimeout(() => {
        setTransactions(prev => prev.filter(t => t.id !== id));
        setDeletingTransactionIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(id);
            return newSet;
        });
    }, 400); // Match animation duration in CSS
  }, [setTransactions]);

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsFormVisible(true);
  };
  
  const openAddForm = () => {
    setEditingTransaction(null);
    setIsFormVisible(true);
  }

  const handleExportPdf = useCallback(() => {
    if (reportRef.current) {
      generatePdf(reportRef.current, 'Expense_Report');
    }
  }, []);

  const addOrUpdateBudgetGoal = useCallback((goal: Omit<BudgetGoal, 'id'>) => {
    setBudgetGoals(prev => {
        const existingGoal = prev.find(g => g.category === goal.category);
        if (existingGoal) {
            triggeredAlertsRef.current.delete(`${existingGoal.id}-near`);
            triggeredAlertsRef.current.delete(`${existingGoal.id}-exceeded`);
            return prev.map(g => g.category === goal.category ? { ...g, amount: goal.amount } : g);
        } else {
            return [...prev, { ...goal, id: crypto.randomUUID() }];
        }
    });
  }, [setBudgetGoals]);

  const deleteBudgetGoal = useCallback((id: string) => {
      setBudgetGoals(prev => {
        const goalToDelete = prev.find(g => g.id === id);
        if (goalToDelete) {
            triggeredAlertsRef.current.delete(`${goalToDelete.id}-near`);
            triggeredAlertsRef.current.delete(`${goalToDelete.id}-exceeded`);
        }
        return prev.filter(g => g.id !== id);
      });
  }, [setBudgetGoals]);

  const dismissAlert = useCallback((id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  }, []);
  
  const addPerson = useCallback((name: string) => {
      if (name && !people.some(p => p.name.toLowerCase() === name.toLowerCase())) {
          setPeople(prev => [...prev, { id: crypto.randomUUID(), name }]);
      }
  }, [people, setPeople]);

  const updatePerson = useCallback((updatedPerson: Person) => {
      setPeople(prev => prev.map(p => p.id === updatedPerson.id ? updatedPerson : p));
  }, [setPeople]);

  const deletePerson = useCallback((id: string) => {
      setPeople(prev => prev.filter(p => p.id !== id));
      setTransactions(prev => prev.map(t => {
          if (t.payerId === id) t.payerId = 'user';
          if (t.splitDetails) {
              t.splitDetails = t.splitDetails.filter(s => s.personId !== id);
          }
          return t;
      }));
  }, [setPeople, setTransactions]);

  const balances = useMemo(() => {
      const balanceMap: { [personId: string]: number } = {};
      people.forEach(p => balanceMap[p.id] = 0);

      transactions.forEach(t => {
          if (t.splitDetails && t.payerId) {
              const totalSplits = t.splitDetails.length;
              if (totalSplits === 0) return;

              const individualShare = t.amount / totalSplits;

              if (t.payerId === 'user') { // User paid
                  t.splitDetails.forEach(split => {
                      if (split.personId !== 'user') {
                          balanceMap[split.personId] = (balanceMap[split.personId] || 0) + (split.amount || individualShare);
                      }
                  });
              } else { // Someone else paid
                  const userShare = t.splitDetails.find(s => s.personId === 'user');
                  if (userShare) {
                      balanceMap[t.payerId] = (balanceMap[t.payerId] || 0) - (userShare.amount || individualShare);
                  }
              }
          }
      });
      return people.map(p => ({
          ...p,
          balance: balanceMap[p.id] || 0
      })).filter(p => p.balance !== 0);

  }, [transactions, people]);

  const handleSettleUp = useCallback((personId: string, amount: number) => {
      const person = people.find(p => p.id === personId);
      if (!person) return;

      const settlementTransaction: Omit<Transaction, 'id'> = {
          amount: Math.abs(amount),
          date: new Date().toISOString().split('T')[0],
          description: `Settlement with ${person.name}`,
          currency: filterCurrency,
          recurring: 'none',
          type: amount > 0 ? 'income' : 'expense',
          category: 'Settlement',
      };
      addTransaction(settlementTransaction);
  }, [people, addTransaction, filterCurrency]);
  
  const cancelSubscription = useCallback((transactionId: string) => {
      setTransactions(prev => prev.map(t => 
          t.id === transactionId ? { ...t, recurring: 'none' } : t
      ));
      triggeredAlertsRef.current.delete(`${transactionId}-renewal-warning`);
      triggeredAlertsRef.current.delete(`${transactionId}-renewal-today`);
  }, [setTransactions]);

  // Category and Tag Management
  const combinedExpenseCategories = useMemo(() => [...EXPENSE_CATEGORIES, ...customExpenseCategories], [customExpenseCategories]);
  const combinedIncomeCategories = useMemo(() => [...INCOME_CATEGORIES, ...customIncomeCategories], [customIncomeCategories]);

  const addCustomCategory = (category: string, type: 'expense' | 'income') => {
    if (type === 'expense') {
        setCustomExpenseCategories(prev => [...new Set([...prev, category])]);
    } else {
        setCustomIncomeCategories(prev => [...new Set([...prev, category])]);
    }
  };

  const deleteCustomCategory = (category: string, type: 'expense' | 'income') => {
      if (type === 'expense') {
        setCustomExpenseCategories(prev => prev.filter(c => c !== category));
      } else {
        setCustomIncomeCategories(prev => prev.filter(c => c !== category));
      }
      setCategoryIcons(prev => {
          const newIcons = { ...prev };
          delete newIcons[category];
          return newIcons;
      });
      setCategoryColors(prev => {
          const newColors = { ...prev };
          delete newColors[category];
          return newColors;
      });
  };

  const setCategoryIcon = (category: string, dataUrl: string) => {
      setCategoryIcons(prev => ({ ...prev, [category]: dataUrl }));
  };

  const setCategoryColor = (category: string, color: string) => {
      setCategoryColors(prev => ({ ...prev, [category]: color }));
  };

  const addTag = (tag: string) => {
      setTags(prev => [...new Set([...prev, tag])]);
  };

  const deleteTag = (tagToDelete: string) => {
      setTags(prev => prev.filter(t => t !== tagToDelete));
      setTransactions(prev => prev.map(t => ({
          ...t,
          tags: t.tags?.filter(tag => tag !== tagToDelete)
      })));
  };

  const handleResetApp = useCallback(() => {
    window.localStorage.clear();
    window.location.reload();
  }, []);

  useEffect(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return t.type === 'expense' &&
               transactionDate.getMonth() === currentMonth &&
               transactionDate.getFullYear() === currentYear;
    });

    const alertsToAdd: Alert[] = [];

    budgetGoals.forEach(goal => {
        const spent = monthlyTransactions
            .filter(t => t.category === goal.category && t.currency === filterCurrency)
            .reduce((sum, t) => sum + t.amount, 0);
        
        if (goal.amount <= 0) return;
        const progress = spent / goal.amount;

        const nearKey = `${goal.id}-near`;
        const exceededKey = `${goal.id}-exceeded`;

        if (progress >= 0.9 && progress <= 1 && !triggeredAlertsRef.current.has(nearKey)) {
            alertsToAdd.push({
                id: crypto.randomUUID(),
                type: 'warning',
                message: `You've spent ${filterCurrency}${spent.toFixed(2)} (${Math.round(progress * 100)}%) of your ${filterCurrency}${goal.amount.toFixed(2)} budget for ${goal.category}.`
            });
            triggeredAlertsRef.current.add(nearKey);
        }

        if (progress > 1 && !triggeredAlertsRef.current.has(exceededKey)) {
            alertsToAdd.push({
                id: crypto.randomUUID(),
                type: 'error',
                message: `You've exceeded your ${goal.category} budget of ${filterCurrency}${goal.amount.toFixed(2)} by ${filterCurrency}${(spent - goal.amount).toFixed(2)}.`
            });
            triggeredAlertsRef.current.add(exceededKey);
            triggeredAlertsRef.current.delete(nearKey);
        }
    });

    if (alertsToAdd.length > 0) {
        setAlerts(prev => [...prev, ...alertsToAdd]);
    }
  }, [transactions, budgetGoals, filterCurrency]);
  
  useEffect(() => {
    const activeSubscriptions = transactions.filter(t =>
        t.type === 'expense' && t.recurring !== 'none' && !t.isRecurringInstance
    );

    if (activeSubscriptions.length === 0) return;

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const alertsToAdd: Alert[] = [];
    const oneDay = 24 * 60 * 60 * 1000;

    activeSubscriptions.forEach(sub => {
        const nextPaymentDate = calculateNextPaymentDate(sub);
        const daysUntilPayment = Math.round((nextPaymentDate.getTime() - now.getTime()) / oneDay);

        const warningKey = `${sub.id}-renewal-warning`;
        const todayKey = `${sub.id}-renewal-today`;

        if (daysUntilPayment === 3 && !triggeredAlertsRef.current.has(warningKey)) {
            alertsToAdd.push({
                id: crypto.randomUUID(),
                type: 'warning',
                message: `Your subscription for "${sub.description || sub.category}" (${filterCurrency}${sub.amount.toFixed(2)}) is due in 3 days.`
            });
            triggeredAlertsRef.current.add(warningKey);
        }

        if (daysUntilPayment === 0 && !triggeredAlertsRef.current.has(todayKey)) {
            alertsToAdd.push({
                id: crypto.randomUUID(),
                type: 'info',
                message: `Your subscription for "${sub.description || sub.category}" (${filterCurrency}${sub.amount.toFixed(2)}) renews today.`
            });
            triggeredAlertsRef.current.add(todayKey);
        }
    });

    if (alertsToAdd.length > 0) {
        setAlerts(prev => [...prev, ...alertsToAdd]);
    }
  }, [transactions, filterCurrency]);

  const themeClasses = {
    light: 'bg-light-bg text-gray-800',
    dark: 'bg-dark-bg text-gray-200',
    lime: 'bg-lime-bg text-lime-text',
    rose: 'bg-rose-bg text-rose-text',
    ocean: 'bg-ocean-bg text-ocean-text',
    tangerine: 'bg-tangerine-bg text-tangerine-text',
    lavender: 'bg-lavender-bg text-lavender-text',
  }[theme];

  const reportBgClass = {
    light: 'bg-light-bg',
    dark: 'bg-dark-bg',
    lime: 'bg-lime-bg',
    rose: 'bg-rose-bg',
    ocean: 'bg-ocean-bg',
    tangerine: 'bg-tangerine-bg',
    lavender: 'bg-lavender-bg',
  }[theme];

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans p-4 sm:p-6 md:p-8 ${themeClasses}`}>
      <Alerts alerts={alerts} onDismiss={dismissAlert} />
      <div className="max-w-screen-xl mx-auto">
        <Header />
        <main className="space-y-8">
          <div ref={reportRef} className={`p-4 sm:p-6 rounded-2xl ${reportBgClass}`}>
            <Summary transactions={filteredTransactions} currency={filterCurrency} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                <div className="lg:col-span-2">
                     {budgetGoals.length > 0 && (
                        <BudgetProgress
                            transactions={filteredTransactions}
                            budgetGoals={budgetGoals}
                            currency={filterCurrency}
                        />
                     )}
                </div>
                <div className="space-y-8">
                    <Balances balances={balances} people={people} onSettleUp={handleSettleUp} />
                    <UpcomingSubscriptions transactions={transactions} currency={filterCurrency} />
                </div>
            </div>
            <Suspense fallback={<Loader />}>
                <Charts transactions={filteredTransactions} categoryColors={categoryColors} />
            </Suspense>
          </div>
          <Filters 
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
            filterDateRange={filterDateRange}
            setFilterDateRange={setFilterDateRange}
            filterCurrency={filterCurrency}
            onCurrencyChange={requestCurrencyChange}
            filterTaxStatus={filterTaxStatus}
            setFilterTaxStatus={setFilterTaxStatus}
            filterTag={filterTag}
            setFilterTag={setFilterTag}
            allTags={allTags}
            transactions={transactions}
            expenseCategories={combinedExpenseCategories}
            incomeCategories={combinedIncomeCategories}
            onExportPdf={handleExportPdf}
            onShowBudgetGoals={() => setIsBudgetFormVisible(true)}
            onShowPeopleManager={() => setIsPeopleManagerVisible(true)}
            onShowSubscriptionManager={() => setIsSubscriptionManagerVisible(true)}
            onShowCategoryManager={() => setIsCategoryManagerVisible(true)}
            onShowResetDialog={() => setIsResetDialogVisible(true)}
          />
          <TransactionList 
            transactions={filteredTransactions} 
            onEdit={handleEdit} 
            onDelete={deleteTransaction}
            onAddTransaction={openAddForm}
            people={people}
            categoryIcons={categoryIcons}
            categoryColors={categoryColors}
            deletingTransactionIds={deletingTransactionIds}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        </main>
      </div>

      <AnimatedModal isOpen={isFormVisible} onClose={() => setIsFormVisible(false)}>
        <Suspense fallback={<Loader isModal={true} />}>
          <TransactionForm
            onSubmit={editingTransaction ? updateTransaction : addTransaction}
            initialData={editingTransaction}
            onClose={() => setIsFormVisible(false)}
            people={people}
            expenseCategories={combinedExpenseCategories}
            incomeCategories={combinedIncomeCategories}
            onAddTag={addTag}
            currentGlobalCurrency={filterCurrency}
            onCurrencyChange={requestCurrencyChange}
          />
        </Suspense>
      </AnimatedModal>
      
      <AnimatedModal isOpen={isBudgetFormVisible} onClose={() => setIsBudgetFormVisible(false)}>
        <Suspense fallback={<Loader isModal={true} />}>
          <BudgetGoals
              budgetGoals={budgetGoals}
              onSave={addOrUpdateBudgetGoal}
              onDelete={deleteBudgetGoal}
              onClose={() => setIsBudgetFormVisible(false)}
          />
        </Suspense>
      </AnimatedModal>

      <AnimatedModal isOpen={isPeopleManagerVisible} onClose={() => setIsPeopleManagerVisible(false)}>
        <Suspense fallback={<Loader isModal={true} />}>
          <PeopleManager
              people={people}
              onAddPerson={addPerson}
              onUpdatePerson={updatePerson}
              onDeletePerson={deletePerson}
              onClose={() => setIsPeopleManagerVisible(false)}
          />
        </Suspense>
      </AnimatedModal>

      <AnimatedModal isOpen={isSubscriptionManagerVisible} onClose={() => setIsSubscriptionManagerVisible(false)}>
        <Suspense fallback={<Loader isModal={true} />}>
          <SubscriptionManager
              transactions={transactions}
              onCancelSubscription={cancelSubscription}
              onClose={() => setIsSubscriptionManagerVisible(false)}
          />
        </Suspense>
      </AnimatedModal>

      <AnimatedModal isOpen={isCategoryManagerVisible} onClose={() => setIsCategoryManagerVisible(false)}>
        <Suspense fallback={<Loader isModal={true} />}>
          <CategoryTagManager
              customExpenseCategories={customExpenseCategories}
              customIncomeCategories={customIncomeCategories}
              tags={tags}
              categoryIcons={categoryIcons}
              categoryColors={categoryColors}
              onAddCategory={addCustomCategory}
              onDeleteCategory={deleteCustomCategory}
              onSetCategoryIcon={setCategoryIcon}
              onSetCategoryColor={setCategoryColor}
              onDeleteTag={deleteTag}
              onClose={() => setIsCategoryManagerVisible(false)}
          />
        </Suspense>
      </AnimatedModal>
      
      <AnimatedModal isOpen={isResetDialogVisible} onClose={() => setIsResetDialogVisible(false)}>
        <Suspense fallback={<Loader isModal={true} />}>
          <ConfirmationDialog
            onClose={() => setIsResetDialogVisible(false)}
            onConfirm={handleResetApp}
            title="Confirm App Reset"
            message="Are you sure you want to reset the application? All your data, including transactions, budgets, and settings, will be permanently deleted."
          />
        </Suspense>
      </AnimatedModal>

      <AnimatedModal isOpen={isCurrencyPromptVisible} onClose={handleCloseCurrencyPrompt}>
        <Suspense fallback={<Loader isModal={true} />}>
            <CurrencyPrompt
                onClose={handleCloseCurrencyPrompt}
                onConfirm={handleCurrencyChoice}
                newCurrencySymbol={pendingCurrency || ''}
                newCurrencyName={CURRENCIES.find(c => c.symbol === pendingCurrency)?.name || ''}
            />
        </Suspense>
      </AnimatedModal>
    </div>
  );
};

export default App;
