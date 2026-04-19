import { useState } from 'react';

const initialForm = {
  amount: '',
  category: '',
  date: new Date().toISOString().slice(0, 10),
  note: '',
};

export default function ExpenseForm({ onSubmit }) {
  const [form, setForm] = useState(initialForm);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!form.amount || !form.date) {
      return;
    }

    onSubmit(form);
    setForm((current) => ({
      ...initialForm,
      date: current.date,
      category: current.category,
    }));
  }

  return (
    <section className="border border-terminal-line bg-terminal-panel">
      <div className="border-b border-terminal-line px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-terminal-muted">
        add.expense
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-4 py-4">
        <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.22em] text-terminal-muted">
          <span>amount</span>
          <input
            name="amount"
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={form.amount}
            onChange={handleChange}
            autoFocus
            className="h-11 border border-terminal-line bg-black/20 px-3 text-base text-terminal-strong outline-none transition focus:border-terminal-text"
          />
        </label>

        <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.22em] text-terminal-muted">
          <span>category</span>
          <input
            name="category"
            type="text"
            placeholder="food"
            value={form.category}
            onChange={handleChange}
            className="h-11 border border-terminal-line bg-black/20 px-3 text-base uppercase text-terminal-strong outline-none transition focus:border-terminal-text"
          />
        </label>

        <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.22em] text-terminal-muted">
          <span>date</span>
          <input
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            className="h-11 border border-terminal-line bg-black/20 px-3 text-base text-terminal-strong outline-none transition focus:border-terminal-text"
          />
        </label>

        <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.22em] text-terminal-muted">
          <span>note</span>
          <input
            name="note"
            type="text"
            placeholder="coffee.beans"
            value={form.note}
            onChange={handleChange}
            className="h-11 border border-terminal-line bg-black/20 px-3 text-base text-terminal-strong outline-none transition focus:border-terminal-text"
          />
        </label>

        <button
          type="submit"
          className="h-11 border border-terminal-line px-3 text-sm uppercase tracking-[0.18em] text-terminal-strong transition hover:bg-terminal-text/5 focus:border-terminal-text focus:outline-none"
        >
          [ add.entry ]
        </button>
      </form>
    </section>
  );
}
