# Денежный Терминал

Личный local-first трекер расходов и доходов в стиле минималистичного Linux terminal UI.

Проект сделан как быстрый инструмент "для себя":

- без backend
- без базы данных
- без авторизации
- без облачной синхронизации
- все данные хранятся локально в `localStorage`

## Стек

- React
- Tailwind CSS
- Vite
- localStorage

## Что есть сейчас

- terminal-style интерфейс: темный фон, monospace, зеленые акценты, тонкие границы
- быстрый ввод операций
- учет `расходов` и `приходов`
- инлайн-категории для частых операций
- помесячный режим просмотра
- навигация по месяцам: `прошлый / текущий / следующий`
- автоматический переход на новый календарный месяц, если приложение было открыто
- summary по выбранному месяцу:
  - доходы месяца
  - расходы месяца
  - баланс месяца
  - среднее за день
- фильтры внутри выбранного месяца:
  - по типу
  - по категории
  - по текстовому поиску
- таблица операций за выбранный месяц
- inline-редактирование записи прямо в таблице
- итог по категориям за выбранный месяц
- годовая сводка по выбранному году:
  - доходы по месяцам
  - расходы по месяцам
  - баланс по месяцам
  - итог за год
  - среднее за месяц
- экспорт всех данных в `JSON`
- импорт данных из `JSON`
- явный статус автосохранения
- удаление записей
- сохранение данных между сессиями через `localStorage`

## UX

- фокус на быстрый ввод с клавиатуры
- `Enter` ведет по форме вперед
- `Enter` в последнем поле сохраняет запись
- после сохранения фокус возвращается на сумму
- `Ctrl+K` или `/` переводит фокус на поле суммы
- `Esc` сбрасывает фильтры и возвращает текущий месяц
- при любом изменении записей срабатывает автосохранение в `localStorage`
- в интерфейсе видно время последнего автосохранения
- поиск работает по категории и заметке внутри текущего месяца
- редактирование записи делается прямо в таблице без модальных окон
- в форме видно:
  - какой месяц сейчас открыт
  - в какой месяц попадет новая запись
  - будет ли запись видна сразу в текущем просмотре

## Архитектура

- все состояние хранится на клиенте
- `localStorage` читается и сохраняется централизованно в `src/App.jsx`
- месяц вынесен в отдельное состояние просмотра, а не оставлен обычным фильтром
- компоненты небольшие и утилитарные, без лишнего рефакторинга и без дополнительных зависимостей

## Структура

- [src/App.jsx](/root/sandbox/expense-terminal-app/src/App.jsx) — основная логика, состояние, вычисления summary и year summary
- [src/components/MonthNavigation.jsx](/root/sandbox/expense-terminal-app/src/components/MonthNavigation.jsx) — переключение между месяцами
- [src/components/ExpenseForm.jsx](/root/sandbox/expense-terminal-app/src/components/ExpenseForm.jsx) — быстрый ввод операции
- [src/components/FiltersBar.jsx](/root/sandbox/expense-terminal-app/src/components/FiltersBar.jsx) — фильтры и поиск внутри месяца
- [src/components/ExpenseTable.jsx](/root/sandbox/expense-terminal-app/src/components/ExpenseTable.jsx) — журнал операций и inline-редактирование
- [src/components/CategorySummary.jsx](/root/sandbox/expense-terminal-app/src/components/CategorySummary.jsx) — итог по категориям за выбранный месяц
- [src/components/SummaryPanel.jsx](/root/sandbox/expense-terminal-app/src/components/SummaryPanel.jsx) — краткая сводка по месяцу
- [src/components/YearSummary.jsx](/root/sandbox/expense-terminal-app/src/components/YearSummary.jsx) — годовая табличная сводка
- [src/components/DataControls.jsx](/root/sandbox/expense-terminal-app/src/components/DataControls.jsx) — экспорт, импорт и статус автосохранения
- [src/components/TerminalHeader.jsx](/root/sandbox/expense-terminal-app/src/components/TerminalHeader.jsx) — верхняя terminal-панель

## Локальный запуск

```bash
cd /root/sandbox/expense-terminal-app
npm install
npm run dev
```

## Сборка

```bash
cd /root/sandbox/expense-terminal-app
npm run build
```

## Деплой

Репозиторий настроен на GitHub Pages через GitHub Actions.

- репозиторий: `https://github.com/vladnapande/expense-terminal-app`
- сайт: `https://vladnapande.github.io/expense-terminal-app/`

Публикация идет автоматически при push в `main`.
