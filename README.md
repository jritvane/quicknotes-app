# QuickNotes

A highly polished, minimalist personal note-taking app built for speed. Open it, type a thought, press **Enter** — it's saved. No friction, no clutter.

Built with **React**, **Vite**, and **Tailwind CSS**.

---

## Features

- **⚡ Instant capture** — Always-ready input at the top; press `Enter` to save any note immediately
- **📝 Markdown support** — Write with `**bold**`, `- bullet lists`, `` `code` ``, blockquotes, and more (powered by `react-markdown`)
- **📌 Pin to top** — Pin any note so it always appears above the date-grouped list, regardless of when it was created
- **📅 Date grouping** — Notes are automatically grouped by day under clear section headers (`Today`, `Yesterday`, or a full date)
- **💾 Persistent storage** — All notes (including pinned state) are saved to the browser's `localStorage` and survive page refreshes
- **🔍 Live search** — Filter notes instantly as you type
- **✏️ Inline editing** — Edit any note in place; press `Enter` to save or `Escape` to cancel
- **🗑️ Safe delete** — Two-step delete confirmation prevents accidental data loss

---

## Getting Started

**Prerequisites:** Node.js 18+ and npm.

```bash
# 1. Clone the repository
git clone https://github.com/jritvane/quicknotes-app.git
cd quicknotes-app

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Tech Stack

| Tool | Purpose |
|---|---|
| [React](https://react.dev) | UI components and state |
| [Vite](https://vitejs.dev) | Dev server and bundler |
| [Tailwind CSS v4](https://tailwindcss.com) | Utility-first styling |
| [react-markdown](https://github.com/remarkjs/react-markdown) | Markdown rendering |
| [remark-gfm](https://github.com/remarkjs/remark-gfm) | GitHub Flavored Markdown (tables, task lists, strikethrough) |
