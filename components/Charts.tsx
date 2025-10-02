import React, { useMemo } from 'react';
import { Transaction } from '../types';
import NeumorphicCard from './NeumorphicCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { useTheme } from '../hooks/useTheme';
import { EXPENSE_CATEGORIES } from '../constants';

interface ChartsProps {
    transactions: Transaction[];
    categoryColors: { [key: string]: string };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#FF6347', '#4682B4', '#32CD32'];

const Charts: React.FC<ChartsProps> = ({ transactions, categoryColors }) => {
    const { theme } = useTheme();
    
    const themeConfig = {
        light: {
            tickColor: '#4A5568',
            gridStroke: '#D1D9E6',
            tooltipBg: '#e0e5ec',
        },
        dark: {
            tickColor: '#A0AEC0',
            gridStroke: '#4A5568',
            tooltipBg: '#2c3038',
        },
        lime: {
            tickColor: '#4a5551',
            gridStroke: '#d1d5c7',
            tooltipBg: '#f0f2eb',
        },
        rose: {
            tickColor: '#5d4037',
            gridStroke: '#d8c8c6',
            tooltipBg: '#fbe9e7',
        },
        ocean: {
            tickColor: '#3a506b',
            gridStroke: '#c2d4de',
            tooltipBg: '#e6f0f5',
        },
        tangerine: {
            tickColor: '#6b4f4f',
            gridStroke: '#dcc0b0',
            tooltipBg: '#fff0e6',
        },
        lavender: {
            tickColor: '#594b61',
            gridStroke: '#d3c7d9',
            tooltipBg: '#f3eef7',
        },
    };
    const currentThemeConfig = themeConfig[theme];


    const expenseByCategory = useMemo(() => {
        const categoryMap: { [key: string]: number } = {};
        transactions
            .filter(t => t.type === 'expense')
            .forEach(t => {
                categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
            });
        return Object.entries(categoryMap).map(([name, value]) => ({ name, value }));
    }, [transactions]);
    
    const incomeVsExpenseByMonth = useMemo(() => {
        const dataMap: { [key: string]: { income: number, expense: number } } = {};
        transactions.forEach(t => {
            const month = new Date(t.date).toLocaleString('default', { month: 'short', year: 'numeric' });
            if (!dataMap[month]) {
                dataMap[month] = { income: 0, expense: 0 };
            }
            dataMap[month][t.type] += t.amount;
        });

        const sortedMonths = Object.keys(dataMap).sort((a,b) => new Date(a).getTime() - new Date(b).getTime());

        return sortedMonths.map(month => ({
            name: month,
            Income: dataMap[month].income,
            Expense: dataMap[month].expense,
        }));
    }, [transactions]);
    
    if (transactions.length === 0) {
        return (
            <NeumorphicCard className="mt-8 text-center p-8">
                <h3 className="text-xl font-semibold">No Data for Charts</h3>
                <p className="mt-2">Add some transactions to see your financial visualisations.</p>
            </NeumorphicCard>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            <NeumorphicCard>
                <h3 className="text-lg font-semibold mb-4 text-center">Income vs. Expense Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={incomeVsExpenseByMonth}>
                        <CartesianGrid strokeDasharray="3 3" stroke={currentThemeConfig.gridStroke} />
                        <XAxis dataKey="name" tick={{ fill: currentThemeConfig.tickColor }} />
                        <YAxis tick={{ fill: currentThemeConfig.tickColor }} />
                        <Tooltip contentStyle={{ backgroundColor: currentThemeConfig.tooltipBg, border: 'none', borderRadius: '1rem' }}/>
                        <Legend />
                        <Line type="monotone" dataKey="Income" stroke="#00C49F" strokeWidth={2} isAnimationActive={true} />
                        <Line type="monotone" dataKey="Expense" stroke="#FF8042" strokeWidth={2} isAnimationActive={true} />
                    </LineChart>
                </ResponsiveContainer>
            </NeumorphicCard>

            <NeumorphicCard>
                <h3 className="text-lg font-semibold mb-4 text-center">Expenses by Category</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={expenseByCategory}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                            isAnimationActive={true}
                        >
                            {expenseByCategory.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={categoryColors[entry.name] || COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                         <Tooltip contentStyle={{ backgroundColor: currentThemeConfig.tooltipBg, border: 'none', borderRadius: '1rem' }}/>
                         <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </NeumorphicCard>
        </div>
    );
};

export default Charts;