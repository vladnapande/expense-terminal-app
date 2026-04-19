import { useRef, useState } from 'react';

function createInitialForm(todayIso) {
  return {
    type: 'expense',
    amount: '',
    category: '',
    date: todayIso,
    note: '',
  };
}

const categoryPresets = {
  expense: ['Еда', 'Транспорт', 'Дом', 'Подписки', 'Здоровье', 'Прочее'],
  income: ['Зарплата', 'Фриланс', 'Возврат', 'Продажа', 'Подарок', 'Прочее'],
};

function getMonthLabel(monthValue) {
  const [year, month] = monthValue.split('-').map(Number);

  return new Intl.DateTimeFormat('ru-RU', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(year, month - 1, 1));
}

export default function ExpenseForm({
  amountInputRef,
  selectedMonth,
  selectedMonthLabel,
  todayIso,
  onSubmit,
}) {
  const [form, setForm] = useState(() => createInitialForm(todayIso));
  const categoryInputRef = useRef(null);
  const dateInputRef = useRef(null);
  const noteInputRef = useRef(null);
  const entryMonthLabel = getMonthLabel(form.date.slice(0, 7));
  const isOutsideViewedMonth = form.date.slice(0, 7) !== selectedMonth;

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleTypeChange(type) {
    setForm((current) => ({
      ...current,
      type,
      category: categoryPresets[type].includes(current.category)
        ? current.category
        : categoryPresets[type][0],
    }));
  }

  function handlePresetCategory(category) {
    setForm((current) => ({ ...current, category }));
    amountInputRef.current?.focus();
    amountInputRef.current?.select();
  }

  function focusNextField(name) {
    if (name === 'amount') {
      categoryInputRef.current?.focus();
      categoryInputRef.current?.select();
      return;
    }

    if (name === 'category') {
      dateInputRef.current?.focus();
      return;
    }

    if (name === 'date') {
      noteInputRef.current?.focus();
      noteInputRef.current?.select();
    }
  }

  function handleFieldKeyDown(event) {
    if (event.key !== 'Enter' || event.shiftKey) {
      return;
    }

    const { name } = event.currentTarget;

    if (name === 'note') {
      return;
    }

    event.preventDefault();
    focusNextField(name);
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!form.amount || !form.date) {
      return;
    }

    onSubmit(form);
    setForm((current) => ({
      ...createInitialForm(todayIso),
      type: current.type,
      date: current.date,
      category: current.category,
    }));
    amountInputRef.current?.focus();
    amountInputRef.current?.select();
  }

  return (
    <section className="border border-terminal-line bg-terminal-panel">
      <div className="border-b border-terminal-line px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-terminal-muted">
        новая запись
      </div>
      <div className="border-b border-terminal-line px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-terminal-muted/80">
        enter: следующее поле | ctrl+k или /: сумма | esc: текущий месяц
      </div>
      <div className="border-b border-terminal-line px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-terminal-muted/80">
        открыт месяц: {selectedMonthLabel} | дата по умолчанию: {todayIso}
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-4 py-4">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleTypeChange('expense')}
            className={`h-11 border px-3 text-sm uppercase tracking-[0.16em] transition ${
              form.type === 'expense'
                ? 'border-terminal-text text-terminal-strong'
                : 'border-terminal-line text-terminal-muted hover:text-terminal-strong'
            }`}
          >
            расход
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('income')}
            className={`h-11 border px-3 text-sm uppercase tracking-[0.16em] transition ${
              form.type === 'income'
                ? 'border-terminal-text text-terminal-strong'
                : 'border-terminal-line text-terminal-muted hover:text-terminal-strong'
            }`}
          >
            приход
          </button>
        </div>

        <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.22em] text-terminal-muted">
          <span>сумма</span>
          <input
            ref={amountInputRef}
            name="amount"
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={form.amount}
            onChange={handleChange}
            onKeyDown={handleFieldKeyDown}
            autoFocus
            className="h-11 border border-terminal-line bg-black/20 px-3 text-base text-terminal-strong outline-none transition focus:border-terminal-text"
          />
        </label>

        <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.22em] text-terminal-muted">
          <span>категория</span>
          <input
            ref={categoryInputRef}
            name="category"
            type="text"
            placeholder="еда"
            value={form.category}
            onChange={handleChange}
            onKeyDown={handleFieldKeyDown}
            className="h-11 border border-terminal-line bg-black/20 px-3 text-base uppercase text-terminal-strong outline-none transition focus:border-terminal-text"
          />
        </label>

        <div className="flex flex-wrap gap-2">
          {categoryPresets[form.type].map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => handlePresetCategory(category)}
              className={`border px-3 py-2 text-xs uppercase tracking-[0.16em] transition ${
                form.category === category
                  ? 'border-terminal-text text-terminal-strong'
                  : 'border-terminal-line text-terminal-muted hover:text-terminal-strong'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.22em] text-terminal-muted">
          <span>дата</span>
          <input
            ref={dateInputRef}
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            onKeyDown={handleFieldKeyDown}
            className="h-11 border border-terminal-line bg-black/20 px-3 text-base text-terminal-strong outline-none transition focus:border-terminal-text"
          />
        </label>
        <p
          className={`text-[11px] uppercase tracking-[0.16em] ${
            isOutsideViewedMonth ? 'text-terminal-danger' : 'text-terminal-muted'
          }`}
        >
          запись попадет в: {entryMonthLabel}
          {isOutsideViewedMonth ? ' | не в текущий просмотр' : ' | видна сразу в таблице'}
        </p>

        <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.22em] text-terminal-muted">
          <span>заметка</span>
          <input
            ref={noteInputRef}
            name="note"
            type="text"
            placeholder="кофе"
            value={form.note}
            onChange={handleChange}
            className="h-11 border border-terminal-line bg-black/20 px-3 text-base text-terminal-strong outline-none transition focus:border-terminal-text"
          />
        </label>

        <button
          type="submit"
          className="h-11 border border-terminal-line px-3 text-sm uppercase tracking-[0.18em] text-terminal-strong transition hover:bg-terminal-text/5 focus:border-terminal-text focus:outline-none"
        >
          [ сохранить: enter в заметке ]
        </button>
      </form>
    </section>
  );
}
