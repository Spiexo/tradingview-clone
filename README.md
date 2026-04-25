# TradingView Clone

A professional-grade trading dashboard clone built with React, TypeScript, and Tailwind CSS. This application features real-time cryptocurrency charts, interactive drawing tools, price alerts, and a personalized watchlist with Supabase integration.

## 🚀 Features

- **Real-time Charts**: Interactive candlestick charts powered by Recharts and live market data from the CoinGecko API.
- **Drawing Tools**: Technical analysis tools including trend lines that are persisted per asset and timeframe.
- **Price Alerts**: Set 'above' or 'below' price targets for any asset, with real-time tracking and persistence.
- **Personalized Watchlist**: Manage your favorite assets and track their performance in real-time.
- **Secure Authentication**: Complete auth flow (sign up, login, session persistence) powered by Supabase Auth.
- **Responsive Design**: Fully optimized for desktop, tablet, and mobile devices with a native-like experience.

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite 8
- **Styling**: Tailwind CSS 4
- **Charts**: Recharts
- **Backend/Persistence**: Supabase (Auth, PostgreSQL, RLS)
- **Icons**: Lucide React

## 📦 Getting Started

### Prerequisites

- Node.js (v18+)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd tradingview-clone
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the root directory and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## 🏗️ Project Structure

The project follows a modular and strict architectural pattern:

```text
src/
├── components/
│   ├── layout/        # Sidebar, Topbar, MainLayout
│   ├── chart/         # CandlestickChart, ChartToolbar, DrawingToolbar
│   ├── watchlist/     # WatchlistPanel, WatchlistItem
│   ├── alerts/        # AlertPanel, AlertItem
│   ├── auth/          # AuthModal
│   └── ui/            # Reusable UI primitives (Button, Spinner, etc.)
├── hooks/             # Custom React hooks for Auth, API, and Data persistence
├── lib/               # Third-party library configurations (Supabase client)
├── types/             # Centralized TypeScript interfaces and types
├── data/              # Mock data and static configurations
└── App.tsx            # Root application component and state orchestration
```

## 📜 Development Guidelines

This project adheres to strict coding standards defined in `AGENTS.md`, including:
- **TypeScript**: No `any` type allowed, strict mode enabled.
- **Styling**: Utility-first CSS using Tailwind 4 exclusively.
- **Architecture**: One component per file, logic extracted to hooks.
- **Database**: Row Level Security (RLS) enabled on all Supabase tables to ensure data privacy.

## 📄 License

This project is licensed under the MIT License.
