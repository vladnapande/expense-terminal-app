import { useEffect, useState } from 'react';

function formatAmount(value) {
  return `₽${value.toFixed(2)}`;
}

function createEditForm(expense) {
  return {
    type: expense.type,
    category: expense.category,
    note: expense.note,
    date: expense.date,
    amount: String(expense.amount),
  };
}

export default function ExpenseTable({ expenses, monthLabel, onUpdate, onDelete }) {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);

  useEffect(() => {
    if (!editingId) {
      return;
    }

    const existingExpense = expenses.find((expense) => expense.id === editingId);

    if (!existingExpense) {
      setEditingId(null);
      setEditForm(null);
    }
  }, [editingId, expenses]);

  function startEdit(expense) {
    setEditingId(expense.id);
    setEditForm(createEditForm(expense));
  }

  function cancelEdit() {
    setEditingId(null);
    setEditForm(null);
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setEditForm((current) => ({ ...current, [name]: value }));
  }

  function handleSave(expenseId) {
    if (!editForm?.amount || !editForm.date) {
      return;
    }

    onUpdate(expenseId, {
      ...editForm,
      amount: Number(editForm.amount),
    });
    cancelEdit();
  }

  return (
    <section className="overflow-hidden border border-terminal-line bg-terminal-panel">
      <div className="border-b border-terminal-line px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-terminal-muted">
        операции
      </div>
      <div className="border-b border-terminal-line px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-terminal-muted/80">
        журнал за {monthLabel}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-sm">
          <thead className="text-left text-[11px] uppercase tracking-[0.24em] text-terminal-muted">
            <tr className="border-b border-terminal-line">
              <th className="px-4 py-3 font-normal">дата</th>
              <th className="px-4 py-3 font-normal">тип</th>
              <th className="px-4 py-3 font-normal">категория</th>
              <th className="px-4 py-3 font-normal">заметка</th>
              <th className="px-4 py-3 font-normal text-right">сумма</th>
              <th className="px-4 py-3 font-normal text-right">действия</th>
            </tr>
          </thead>
          <tbody>
            {expenses.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="px-4 py-10 text-center uppercase tracking-[0.18em] text-terminal-muted"
                >
                  нет записей под текущий фильтр
                </td>
              </tr>
            ) : (
              expenses.map((expense) => {
                const isEditing = editingId === expense.id;

                return (
                  <tr
                    key={expense.id}
                    className="border-b border-terminal-line/70 align-top last:border-b-0"
                  >
                    <td className="px-4 py-3 text-terminal-muted">
                      {isEditing ? (
                        <input
                          name="date"
                          type="date"
                          value={editForm.date}
                          onChange={handleChange}
                          className="h-10 w-36 border border-terminal-line bg-black/20 px-2 text-xs text-terminal-strong outline-none focus:border-terminal-text"
                        />
                      ) : (
                        expense.date
                      )}
                    </td>
                    <td className="px-4 py-3 uppercase text-terminal-muted">
                      {isEditing ? (
                        <select
                          name="type"
                          value={editForm.type}
                          onChange={handleChange}
                          className="h-10 w-28 border border-terminal-line bg-black/20 px-2 text-xs uppercase text-terminal-strong outline-none focus:border-terminal-text"
                        >
                          <option value="expense">расход</option>
                          <option value="income">приход</option>
                        </select>
                      ) : expense.type === 'income' ? (
                        'приход'
                      ) : (
                        'расход'
                      )}
                    </td>
                    <td className="px-4 py-3 uppercase text-terminal-strong">
                      {isEditing ? (
                        <input
                          name="category"
                          type="text"
                          value={editForm.category}
                          onChange={handleChange}
                          className="h-10 w-36 border border-terminal-line bg-black/20 px-2 text-xs uppercase text-terminal-strong outline-none focus:border-terminal-text"
                        />
                      ) : (
                        expense.category
                      )}
                    </td>
                    <td className="px-4 py-3 text-terminal-text/80">
                      {isEditing ? (
                        <input
                          name="note"
                          type="text"
                          value={editForm.note}
                          onChange={handleChange}
                          className="h-10 min-w-40 border border-terminal-line bg-black/20 px-2 text-xs text-terminal-strong outline-none focus:border-terminal-text"
                        />
                      ) : (
                        expense.note || '—'
                      )}
                    </td>
                    <td
                      className={`px-4 py-3 text-right ${
                        expense.type === 'income' ? 'text-terminal-text' : 'text-terminal-strong'
                      }`}
                    >
                      {isEditing ? (
                        <input
                          name="amount"
                          type="number"
                          min="0"
                          step="0.01"
                          value={editForm.amount}
                          onChange={handleChange}
                          className="h-10 w-28 border border-terminal-line bg-black/20 px-2 text-right text-xs text-terminal-strong outline-none focus:border-terminal-text"
                        />
                      ) : (
                        <>
                          {expense.type === 'income' ? '+' : '-'}
                          {formatAmount(expense.amount)}
                        </>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        {isEditing ? (
                          <>
                            <button
                              type="button"
                              onClick={() => handleSave(expense.id)}
                              className="border border-terminal-line px-2 py-1 text-xs uppercase tracking-[0.16em] text-terminal-strong transition hover:bg-terminal-text/5"
                            >
                              save
                            </button>
                            <button
                              type="button"
                              onClick={cancelEdit}
                              className="border border-terminal-line px-2 py-1 text-xs uppercase tracking-[0.16em] text-terminal-muted transition hover:text-terminal-strong"
                            >
                              cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => startEdit(expense)}
                              className="border border-terminal-line px-2 py-1 text-xs uppercase tracking-[0.16em] text-terminal-strong transition hover:bg-terminal-text/5"
                            >
                              edit
                            </button>
                            <button
                              type="button"
                              onClick={() => onDelete(expense.id)}
                              className="border border-terminal-line px-2 py-1 text-xs uppercase tracking-[0.16em] text-terminal-danger transition hover:border-terminal-danger hover:text-terminal-danger"
                            >
                              del
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
