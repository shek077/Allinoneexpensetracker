export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  date: string; // ISO string format
  description: string;
  notes?: string;
  recurring: 'none' | 'daily' | 'weekly' | 'monthly';
  currency: string; // e.g., '$', '€'
  isRecurringInstance?: boolean;
  parentId?: string;
  isTaxDeductible?: boolean;
  payerId?: 'user' | string; // 'user' or personId
  splitDetails?: SplitDetail[];
  tags?: string[];
}

export interface Currency {
  symbol: string;
  name: string;
}

export interface BudgetGoal {
  id: string;
  category: string;
  amount: number;
}

export interface Alert {
  id: string;
  type: 'warning' | 'error' | 'info';
  message: string;
}

export interface Person {
    id: string;
    name: string;
    iconUrl?: string;
}

export interface SplitDetail {
    personId: 'user' | string; // 'user' or personId
    amount?: number; // Optional, if not present, assumed equal split
}