import { useEffect, useMemo, useState } from 'react';
import ExpenseForm from './components/ExpenseForm';
import ExpenseTable from './components/ExpenseTable';
import FiltersBar from './components/FiltersBar';
import SummaryPanel from './components/SummaryPanel';
import TerminalHeader from './components/TerminalHeader';

const STORAGE_KEY = 'expense-terminal-records';

const todayIso = new Date().toISOString().slice(0, 10);
const currentMonth = todayIso.slice(0, 7);

const demoExpenses = [
  {
    id: 'seed-1',
    amount: 18.5,
    category: 'Food',
    date: todayIso,
    note: 'coffee.beans',
  },
  {
    id: 'seed-2',
    amount: 64,
    category: 'Transport',
    date: currentMonth + '-03',
    note: 'metro.topup',
  },
  {
    id: 'seed-3',
    amount: 120,
    category: 'Tools',
    date: currentMonth + '-08',
    note: 'domain.renewal',
  },
];

function formatMoney(value) {
  return `$${value.toFixed(2)}`;
}

function normalizeExpense(payload) {
  return {
    id: crypto.randomUUID(),
    amount: Number(payload.amount),
    category: payload.category.trim() || 'Other',
    date: payload.date,
    note: payload.note.trim(),
  };
}

function getMonthBounds(monthValue) {
  if (!monthValue) {
    return null;
  }

  const [year, month] = monthValue.split('-').map(Number);
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0);

  return { start, end };
}

export default function App() {
  const [expenses, setExpenses] = useState(() => {
    const savedExpenses = window.localStorage.getItem(STORAGE_KEY);

    if (!savedExpenses) {
      return demoExpenses;
    }

    try {
      const parsedExpenses = JSON.parse(savedExpenses);
      return Array.isArray(parsedExpenses) ? parsedExpenses : demoExpenses;
    } catch {
      return demoExpenses;
    }
  });
  const [filters, setFilters] = useState({
    category: 'All',
    month: currentMonth,
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  }, [expenses]);

  const categories = useMemo(() => {
    const values = new Set(expenses.map((expense) => expense.category));
    return ['All', ...Array.from(values).sort((left, right) => left.localeCompare(right))];
  }, [expenses]);

  const filteredExpenses = useMemo(() => {
    return expenses
      .filter((expense) => {
        const matchesCategory =
          filters.category === 'All' || expense.category === filters.category;
        const matchesMonth = !filters.month || expense.date.startsWith(filters.month);

        return matchesCategory && matchesMonth;
      })
      .sort((left, right) => right.date.localeCompare(left.date));
  }, [expenses, filters]);

  const summary = useMemo(() => {
    const now = new Date();
    const today = todayIso;
    const activeMonth = filters.month || currentMonth;
    const monthBounds = getMonthBounds(activeMonth);
    const daysInMonth = monthBounds ? monthBounds.end.getDate() : now.getDate();

    const monthExpenses = expenses.filter((expense) => expense.date.startsWith(activeMonth));
    const todayTotal = monthExpenses
      .filter((expense) => expense.date === today)
      .reduce((sum, expense) => sum + expense.amount, 0);
    const monthTotal = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const avgDay = monthTotal / daysInMonth;

    return {
      today: formatMoney(todayTotal),
      month: formatMoney(monthTotal),
      avgDay: formatMoney(avgDay || 0),
    };
  }, [expenses, filters.month]);

  function handleAddExpense(payload) {
    setExpenses((current) => [normalizeExpense(payload), ...current]);
  }

  function handleDeleteExpense(expenseId) {
    setExpenses((current) => current.filter((expense) => expense.id !== expenseId));
  }

  function handleFilterChange(key, value) {
    setFilters((current) => ({
      ...current,
      [key]: value,
    }));
  }

  return (
    <main className="min-h-screen bg-terminal-bg px-4 py-6 text-terminal-text sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-4">
        <TerminalHeader />
        <SummaryPanel summary={summary} />
        <section className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
          <ExpenseForm onSubmit={handleAddExpense} />
          <div className="flex flex-col gap-4">
            <FiltersBar
              categories={categories}
              filters={filters}
              onFilterChange={handleFilterChange}
            />
            <ExpenseTable expenses={filteredExpenses} onDelete={handleDeleteExpense} />
          </div>
        </section>
      </div>
    </main>
  );
}
