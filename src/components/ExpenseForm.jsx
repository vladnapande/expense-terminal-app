import { useRef, useState } from 'react';

const initialForm = {
  amount: '',
  category: '',
  date: new Date().toISOString().slice(0, 10),
  note: '',
};

export default function ExpenseForm({ amountInputRef, onSubmit }) {
  const [form, setForm] = useState(initialForm);
  const categoryInputRef = useRef(null);
  const dateInputRef = useRef(null);
  const noteInputRef = useRef(null);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
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
      ...initialForm,
      date: current.date,
      category: current.category,
    }));
    amountInputRef.current?.focus();
    amountInputRef.current?.select();
  }

  return (
    <section className="border border-terminal-line bg-terminal-panel">
      <div className="border-b border-terminal-line px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-terminal-muted">
        add.expense
      </div>
      <div className="border-b border-terminal-line px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-terminal-muted/80">
        enter: next field | ctrl+k or /: focus amount | esc: reset filters
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-4 py-4">
        <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.22em] text-terminal-muted">
          <span>amount</span>
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
          <span>category</span>
          <input
            ref={categoryInputRef}
            name="category"
            type="text"
            placeholder="food"
            value={form.category}
            onChange={handleChange}
            onKeyDown={handleFieldKeyDown}
            className="h-11 border border-terminal-line bg-black/20 px-3 text-base uppercase text-terminal-strong outline-none transition focus:border-terminal-text"
          />
        </label>

        <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.22em] text-terminal-muted">
          <span>date</span>
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

        <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.22em] text-terminal-muted">
          <span>note</span>
          <input
            ref={noteInputRef}
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
          [ submit: enter on note ]
        </button>
      </form>
    </section>
  );
}
