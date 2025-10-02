import { Currency } from './types';

export const EXPENSE_CATEGORIES: string[] = [
  'Groceries', 'Utilities', 'Rent/Mortgage', 'Transportation', 'Entertainment',
  'Dining Out', 'Shopping', 'Health', 'Education', 'Subscriptions', 'Settlement', 'Other'
];

export const INCOME_CATEGORIES: string[] = [
  'Salary', 'Freelance', 'Investment', 'Gift', 'Settlement', 'Other'
];

export const CURRENCIES: Currency[] = [
  { symbol: '$', name: 'USD' },
  { symbol: '€', name: 'EUR' },
  { symbol: '£', name: 'GBP' },
  { symbol: '¥', name: 'JPY' },
  { symbol: '₹', name: 'INR' },
];