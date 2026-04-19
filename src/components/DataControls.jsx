import { useRef } from 'react';

export default function DataControls({
  dataMessage,
  dataMessageTone,
  lastSavedAt,
  selectedMonthLabel,
  onExportMonthCsv,
  onExport,
  onImport,
}) {
  const fileInputRef = useRef(null);

  function handleImportClick() {
    fileInputRef.current?.click();
  }

  async function handleFileChange(event) {
    const file = event.target.files?.[0];
    await onImport(file);
    event.target.value = '';
  }

  const messageToneClass =
    dataMessageTone === 'danger'
      ? 'text-terminal-danger'
      : dataMessageTone === 'success'
        ? 'text-terminal-text'
        : 'text-terminal-muted';

  return (
    <section className="border border-terminal-line bg-terminal-panel">
      <div className="border-b border-terminal-line px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-terminal-muted">
        данные
      </div>
      <div className="border-b border-terminal-line px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-terminal-muted/80">
        автосохранение в localStorage при любом изменении записей
      </div>
      <div className="border-b border-terminal-line px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-terminal-muted/80">
        csv экспортируется только за выбранный месяц: {selectedMonthLabel}
      </div>
      <div className="flex flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onExportMonthCsv}
            className="h-11 border border-terminal-line px-4 text-sm uppercase tracking-[0.16em] text-terminal-strong transition hover:bg-terminal-text/5"
          >
            [ экспорт csv ]
          </button>
          <button
            type="button"
            onClick={onExport}
            className="h-11 border border-terminal-line px-4 text-sm uppercase tracking-[0.16em] text-terminal-strong transition hover:bg-terminal-text/5"
          >
            [ экспорт json ]
          </button>
          <button
            type="button"
            onClick={handleImportClick}
            className="h-11 border border-terminal-line px-4 text-sm uppercase tracking-[0.16em] text-terminal-strong transition hover:bg-terminal-text/5"
          >
            [ импорт json ]
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
        <div className="text-[11px] uppercase tracking-[0.16em] text-terminal-muted">
          последнее автосохранение: {lastSavedAt}
        </div>
      </div>
      <div className={`border-t border-terminal-line px-4 py-3 text-[11px] uppercase tracking-[0.16em] ${messageToneClass}`}>
        {dataMessage}
      </div>
    </section>
  );
}
