import { useEffect, useMemo, useRef, useState } from 'react';
import ExpenseForm from './components/ExpenseForm';
import ExpenseTable from './components/ExpenseTable';
import FiltersBar from './components/FiltersBar';
import CategorySummary from './components/CategorySummary';
import DataControls from './components/DataControls';
import MonthNavigation from './components/MonthNavigation';
import SummaryPanel from './components/SummaryPanel';
import TerminalHeader from './components/TerminalHeader';
import YearSummary from './components/YearSummary';

const STORAGE_KEY = 'expense-terminal-records';
const RU_MONTH_FORMAT = new Intl.DateTimeFormat('ru-RU', {
  month: 'long',
  year: 'numeric',
});
const RU_MONTH_SHORT_FORMAT = new Intl.DateTimeFormat('ru-RU', {
  month: 'short',
});

function getTodayIso() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function getCurrentMonthValue() {
  return getTodayIso().slice(0, 7);
}

function buildDemoExpenses() {
  const todayIso = getTodayIso();
  const currentMonth = getCurrentMonthValue();

  return [
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
      date: `${currentMonth}-03`,
      note: 'метро',
    },
    {
      id: 'seed-3',
      amount: 3200,
      type: 'income',
      category: 'Зарплата',
      date: `${currentMonth}-08`,
      note: 'аванс',
    },
  ];
}

function formatMoney(value) {
  const sign = value > 0 ? '+' : value < 0 ? '-' : '';
  return `${sign}₽${Math.abs(value).toFixed(2)}`;
}

function getMonthDate(monthValue) {
  const [year, month] = monthValue.split('-').map(Number);
  return new Date(year, month - 1, 1);
}

function getMonthLabel(monthValue) {
  return RU_MONTH_FORMAT.format(getMonthDate(monthValue));
}

function getMonthShortLabel(monthValue) {
  return RU_MONTH_SHORT_FORMAT.format(getMonthDate(monthValue)).replace('.', '');
}

function shiftMonth(monthValue, delta) {
  const [year, month] = monthValue.split('-').map(Number);
  const nextDate = new Date(year, month - 1 + delta, 1);
  const nextYear = nextDate.getFullYear();
  const nextMonth = String(nextDate.getMonth() + 1).padStart(2, '0');

  return `${nextYear}-${nextMonth}`;
}

function getMonthBounds(monthValue) {
  const [year, month] = monthValue.split('-').map(Number);
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0);

  return { start, end };
}

function normalizeStoredExpense(item) {
  return {
    id: item.id || crypto.randomUUID(),
    amount: Number(item.amount) || 0,
    type: item.type === 'income' ? 'income' : 'expense',
    category: item.category?.trim() || 'Прочее',
    date: item.date || getTodayIso(),
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

function sumByType(entries, type) {
  return entries
    .filter((entry) => entry.type === type)
    .reduce((sum, entry) => sum + entry.amount, 0);
}

function getYearMonths(year) {
  return Array.from({ length: 12 }, (_, index) => {
    const month = String(index + 1).padStart(2, '0');
    return `${year}-${month}`;
  });
}

function formatDateTime(value) {
  return new Intl.DateTimeFormat('ru-RU', {
    dateStyle: 'short',
    timeStyle: 'medium',
  }).format(value);
}

function parseImportedExpenses(rawValue) {
  const parsed = JSON.parse(rawValue);

  if (!Array.isArray(parsed)) {
    throw new Error('Ожидался JSON-массив записей.');
  }

  return parsed.map(normalizeStoredExpense);
}

function escapeCsvValue(value) {
  const stringValue = String(value ?? '');
  return `"${stringValue.replaceAll('"', '""')}"`;
}

export default function App() {
  const amountInputRef = useRef(null);
  const [expenses, setExpenses] = useState(() => {
    const savedExpenses = window.localStorage.getItem(STORAGE_KEY);

    if (!savedExpenses) {
      return buildDemoExpenses();
    }

    try {
      const parsedExpenses = JSON.parse(savedExpenses);
      return Array.isArray(parsedExpenses)
        ? parsedExpenses.map(normalizeStoredExpense)
        : buildDemoExpenses();
    } catch {
      return buildDemoExpenses();
    }
  });
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthValue());
  const [systemMonth, setSystemMonth] = useState(getCurrentMonthValue());
  const [filters, setFilters] = useState({
    type: 'all',
    category: 'Все',
    query: '',
  });
  const [lastSavedAt, setLastSavedAt] = useState(() => new Date());
  const [dataMessage, setDataMessage] = useState('Локальное автосохранение активно.');
  const [dataMessageTone, setDataMessageTone] = useState('muted');

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
    setLastSavedAt(new Date());
  }, [expenses]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      const nextSystemMonth = getCurrentMonthValue();

      setSystemMonth((previousSystemMonth) => {
        if (previousSystemMonth !== nextSystemMonth) {
          setSelectedMonth((currentSelectedMonth) =>
            currentSelectedMonth === previousSystemMonth
              ? nextSystemMonth
              : currentSelectedMonth,
          );
        }

        return nextSystemMonth;
      });
    }, 60_000);

    return () => window.clearInterval(intervalId);
  }, []);

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
        setFilters({
          type: 'all',
          category: 'Все',
          query: '',
        });
        setSelectedMonth(getCurrentMonthValue());
      }
    }

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, []);

  const categories = useMemo(() => {
    const values = new Set(expenses.map((expense) => expense.category));
    return ['Все', ...Array.from(values).sort((left, right) => left.localeCompare(right))];
  }, [expenses]);

  const monthEntries = useMemo(
    () => expenses.filter((expense) => expense.date.startsWith(selectedMonth)),
    [expenses, selectedMonth],
  );

  const filteredExpenses = useMemo(() => {
    return monthEntries
      .filter((expense) => {
        const matchesType = filters.type === 'all' || expense.type === filters.type;
        const matchesCategory =
          filters.category === 'Все' || expense.category === filters.category;
        const normalizedQuery = filters.query.trim().toLowerCase();
        const matchesQuery =
          normalizedQuery === '' ||
          expense.category.toLowerCase().includes(normalizedQuery) ||
          expense.note.toLowerCase().includes(normalizedQuery);

        return matchesType && matchesCategory && matchesQuery;
      })
      .sort((left, right) => right.date.localeCompare(left.date));
  }, [filters, monthEntries]);

  const selectedMonthLabel = useMemo(() => getMonthLabel(selectedMonth), [selectedMonth]);
  const selectedYear = selectedMonth.slice(0, 4);

  const summary = useMemo(() => {
    const monthBounds = getMonthBounds(selectedMonth);
    const monthIncome = sumByType(monthEntries, 'income');
    const monthExpense = sumByType(monthEntries, 'expense');
    const monthNet = monthIncome - monthExpense;
    const avgDay = monthNet / monthBounds.end.getDate();

    return [
      {
        key: 'income',
        label: 'доходы месяца',
        value: formatMoney(monthIncome),
        meta: selectedMonthLabel,
      },
      {
        key: 'expense',
        label: 'расходы месяца',
        value: formatMoney(-monthExpense),
        meta: `${monthEntries.length} записей`,
      },
      {
        key: 'balance',
        label: 'баланс месяца',
        value: formatMoney(monthNet),
        meta: `среднее / день ${formatMoney(avgDay || 0)}`,
      },
    ];
  }, [monthEntries, selectedMonth, selectedMonthLabel]);

  const yearSummary = useMemo(() => {
    const months = getYearMonths(selectedYear);
    const rows = months.map((monthValue) => {
      const entries = expenses.filter((expense) => expense.date.startsWith(monthValue));
      const income = sumByType(entries, 'income');
      const expense = sumByType(entries, 'expense');
      const balance = income - expense;

      return {
        key: monthValue,
        label: getMonthShortLabel(monthValue),
        income,
        expense,
        balance,
      };
    });

    const yearIncome = rows.reduce((sum, row) => sum + row.income, 0);
    const yearExpense = rows.reduce((sum, row) => sum + row.expense, 0);
    const yearBalance = yearIncome - yearExpense;

    return {
      year: selectedYear,
      rows,
      totalIncome: yearIncome,
      totalExpense: yearExpense,
      totalBalance: yearBalance,
      avgMonth: yearBalance / 12,
    };
  }, [expenses, selectedYear]);

  const categorySummary = useMemo(() => {
    const grouped = monthEntries.reduce((accumulator, entry) => {
      const current = accumulator.get(entry.category) || {
        category: entry.category,
        income: 0,
        expense: 0,
        balance: 0,
        count: 0,
      };

      if (entry.type === 'income') {
        current.income += entry.amount;
      } else {
        current.expense += entry.amount;
      }

      current.balance = current.income - current.expense;
      current.count += 1;
      accumulator.set(entry.category, current);
      return accumulator;
    }, new Map());

    const rows = Array.from(grouped.values()).sort((left, right) => {
      if (right.expense !== left.expense) {
        return right.expense - left.expense;
      }

      if (right.income !== left.income) {
        return right.income - left.income;
      }

      return left.category.localeCompare(right.category);
    });

    return {
      monthLabel: selectedMonthLabel,
      rows,
    };
  }, [monthEntries, selectedMonthLabel]);

  function handleAddExpense(payload) {
    setExpenses((current) => [normalizeExpense(payload), ...current]);
  }

  function handleDeleteExpense(expenseId) {
    setExpenses((current) => current.filter((expense) => expense.id !== expenseId));
  }

  function handleUpdateExpense(expenseId, payload) {
    const normalizedPayload = normalizeStoredExpense({
      ...payload,
      id: expenseId,
    });

    setExpenses((current) =>
      current.map((expense) => (expense.id === expenseId ? normalizedPayload : expense)),
    );
  }

  function handleFilterChange(key, value) {
    setFilters((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function handleExportData() {
    const exportPayload = JSON.stringify(expenses, null, 2);
    const fileMonth = selectedMonth.replace('-', '_');
    const fileName = `expense-terminal-${fileMonth}.json`;
    const blob = new Blob([exportPayload], { type: 'application/json' });
    const downloadUrl = URL.createObjectURL(blob);
    const anchor = document.createElement('a');

    anchor.href = downloadUrl;
    anchor.download = fileName;
    anchor.click();

    URL.revokeObjectURL(downloadUrl);
    setDataMessage(`Экспортировано: ${fileName}`);
    setDataMessageTone('success');
  }

  function handleExportMonthCsv() {
    const csvRows = [
      ['Дата', 'Тип', 'Категория', 'Заметка', 'Сумма'],
      ...monthEntries
        .slice()
        .sort((left, right) => left.date.localeCompare(right.date))
        .map((entry) => [
          entry.date,
          entry.type === 'income' ? 'Приход' : 'Расход',
          entry.category,
          entry.note,
          entry.type === 'income' ? entry.amount.toFixed(2) : `-${entry.amount.toFixed(2)}`,
        ]),
    ];

    const csvContent =
      '\uFEFF' + csvRows.map((row) => row.map(escapeCsvValue).join(';')).join('\n');
    const fileName = `expense-terminal-${selectedMonth}-google-sheets.csv`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const downloadUrl = URL.createObjectURL(blob);
    const anchor = document.createElement('a');

    anchor.href = downloadUrl;
    anchor.download = fileName;
    anchor.click();

    URL.revokeObjectURL(downloadUrl);
    setDataMessage(`Экспортировано в CSV: ${fileName}`);
    setDataMessageTone('success');
  }

  async function handleImportData(file) {
    if (!file) {
      return;
    }

    try {
      const importedExpenses = parseImportedExpenses(await file.text());
      setExpenses(importedExpenses);
      setDataMessage(`Импортировано записей: ${importedExpenses.length}`);
      setDataMessageTone('success');
    } catch (error) {
      setDataMessage(error.message || 'Не удалось импортировать JSON.');
      setDataMessageTone('danger');
    }
  }

  return (
    <main className="min-h-screen bg-terminal-bg px-4 py-6 text-terminal-text sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-4">
        <TerminalHeader />
        <MonthNavigation
          currentMonth={systemMonth}
          selectedMonth={selectedMonth}
          onChangeMonth={setSelectedMonth}
        />
        <SummaryPanel summary={summary} />
        <section className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
          <ExpenseForm
            amountInputRef={amountInputRef}
            selectedMonth={selectedMonth}
            selectedMonthLabel={selectedMonthLabel}
            todayIso={getTodayIso()}
            onSubmit={handleAddExpense}
          />
          <div className="flex flex-col gap-4">
            <FiltersBar
              categories={categories}
              filters={filters}
              selectedMonthLabel={selectedMonthLabel}
              onFilterChange={handleFilterChange}
            />
            <ExpenseTable
              expenses={filteredExpenses}
              monthLabel={selectedMonthLabel}
              onUpdate={handleUpdateExpense}
              onDelete={handleDeleteExpense}
            />
          </div>
        </section>
        <CategorySummary summary={categorySummary} />
        <YearSummary summary={yearSummary} />
        <DataControls
          dataMessage={dataMessage}
          dataMessageTone={dataMessageTone}
          lastSavedAt={formatDateTime(lastSavedAt)}
          selectedMonthLabel={selectedMonthLabel}
          onExportMonthCsv={handleExportMonthCsv}
          onExport={handleExportData}
          onImport={handleImportData}
        />
      </div>
    </main>
  );
}
