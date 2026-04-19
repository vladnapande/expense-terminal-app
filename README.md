# Expense Terminal App

Minimalist expense tracker built with React and Tailwind CSS.

## Stack

- React
- Tailwind CSS
- Vite
- localStorage

## UI Direction

- dark terminal-like interface
- monospace typography
- green accent text
- thin borders
- strict minimal layout
- restrained cursor blink effect

## Features

- terminal header
- summary for `today`, `month`, `avg/day`
- fast expense entry form
- category and month filters
- tabular expense list
- delete action
- local persistence in browser storage

## Local Run

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
```

## Deploy

This repository is configured for GitHub Pages via GitHub Actions.

After pushing to `main`, enable Pages in the repository settings and choose:

- Source: `GitHub Actions`

The workflow will build the Vite app and publish the `dist` output automatically.
