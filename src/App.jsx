import { useEffect, useMemo, useRef, useState } from 'react';
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
    type: 'expense',
    category: 'Еда',
    date: todayIso,
    note: 'кофе',
  },
  {
    id: 'seed-2',
    amount: 64,
    type: 'expense',
    category: 'Транспорт',
    date: currentMonth + '-03',
    note: 'метро',
  },
  {
    id: 'seed-3',
    amount: 3200,
    type: 'income',
    category: 'Зарплата',
    date: currentMonth + '-08',
    note: 'аванс',
  },
];

function formatMoney(value) {
  const sign = value > 0 ? '+' : value < 0 ? '-' : '';
  return `${sign}₽${Math.abs(value).toFixed(2)}`;
}

function normalizeStoredExpense(item) {
  return {
    id: item.id || crypto.randomUUID(),
    amount: Number(item.amount) || 0,
    type: item.type === 'income' ? 'income' : 'expense',
    category: item.category?.trim() || 'Прочее',
    date: item.date || todayIso,
    note: item.note?.trim() || '',
  };
}

function normalizeExpense(payload) {
  return {
    id: crypto.randomUUID(),
    amount: Number(payload.amount),
    type: payload.type === 'income' ? 'income' : 'expense',
    category: payload.category.trim() || 'Прочее',
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
  const amountInputRef = useRef(null);
  const [expenses, setExpenses] = useState(() => {
    const savedExpenses = window.localStorage.getItem(STORAGE_KEY);

    if (!savedExpenses) {
      return demoExpenses;
    }

    try {
      const parsedExpenses = JSON.parse(savedExpenses);
      return Array.isArray(parsedExpenses)
        ? parsedExpenses.map(normalizeStoredExpense)
        : demoExpenses;
    } catch {
      return demoExpenses;
    }
  });
  const [filters, setFilters] = useState({
    type: 'all',
    category: 'Все',
    month: currentMonth,
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    function handleKeydown(event) {
      const activeTag = document.activeElement?.tagName;
      const isTypingTarget =
        activeTag === 'INPUT' || activeTag === 'TEXTAREA' || activeTag === 'SELECT';

      if (event.key === '/' && !isTypingTarget) {
        event.preventDefault();
        amountInputRef.current?.focus();
        amountInputRef.current?.select();
      }

      if ((event.key === 'k' || event.key === 'K') && event.ctrlKey) {
        event.preventDefault();
        amountInputRef.current?.focus();
        amountInputRef.current?.select();
      }

      if (event.key === 'Escape' && !isTypingTarget) {
        setFilters((current) => ({
          ...current,
          type: 'all',
          category: 'Все',
          month: currentMonth,
        }));
      }
    }

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, []);

  const categories = useMemo(() => {
    const values = new Set(expenses.map((expense) => expense.category));
    return ['Все', ...Array.from(values).sort((left, right) => left.localeCompare(right))];
  }, [expenses]);

  const filteredExpenses = useMemo(() => {
    return expenses
      .filter((expense) => {
        const matchesType = filters.type === 'all' || expense.type === filters.type;
        const matchesCategory =
          filters.category === 'Все' || expense.category === filters.category;
        const matchesMonth = !filters.month || expense.date.startsWith(filters.month);

        return matchesType && matchesCategory && matchesMonth;
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
    const todayEntries = expenses.filter((expense) => expense.date === today);

    const todayIncome = todayEntries
      .filter((expense) => expense.type === 'income')
      .reduce((sum, expense) => sum + expense.amount, 0);
    const todayExpense = todayEntries
      .filter((expense) => expense.type === 'expense')
      .reduce((sum, expense) => sum + expense.amount, 0);
    const monthIncome = monthExpenses
      .filter((expense) => expense.type === 'income')
      .reduce((sum, expense) => sum + expense.amount, 0);
    const monthExpense = monthExpenses
      .filter((expense) => expense.type === 'expense')
      .reduce((sum, expense) => sum + expense.amount, 0);

    const todayNet = todayIncome - todayExpense;
    const monthNet = monthIncome - monthExpense;
    const avgDay = monthNet / daysInMonth;

    return [
      {
        key: 'today',
        label: 'сегодня',
        value: formatMoney(todayNet),
        meta: `приход ${formatMoney(todayIncome)} / расход ${formatMoney(-todayExpense)}`,
      },
      {
        key: 'month',
        label: 'месяц',
        value: formatMoney(monthNet),
        meta: `приход ${formatMoney(monthIncome)} / расход ${formatMoney(-monthExpense)}`,
      },
      {
        key: 'avgDay',
        label: 'среднее / день',
        value: formatMoney(avgDay || 0),
        meta: `${daysInMonth} дн. в месяце`,
      },
    ];
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
          <ExpenseForm amountInputRef={amountInputRef} onSubmit={handleAddExpense} />
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
