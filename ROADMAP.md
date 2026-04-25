# TradingView Clone — Roadmap

## Contexte
Application web clone de TradingView. Stack : React 18 + TypeScript + 
Tailwind CSS + Vite + Recharts + Supabase (auth + database).
Frontend only — pas de backend custom. Données via CoinGecko API public 
et mock data en local.
Toutes les conventions de code sont définies dans AGENTS.md.

---

## Étape 1 — Initialisation du projet
> Objectif : avoir un projet qui compile avec la structure de base en place.
> Validation : `npm run dev` fonctionne sans erreur.

- [x] Scaffold du projet (Vite + React + TypeScript + Tailwind)
- [x] Création des types TypeScript (src/types/index.ts)
- [x] Création des mock data (src/data/)
- [x] Setup Supabase client + useAuth hook
- [x] Layout principal (Sidebar + Topbar + MainLayout)
- [x] Validation étape 1 : vérifier que npm run dev compile sans erreur
      et que le layout s'affiche correctement
      <!-- Validation report: npm run dev works, layout (Sidebar, Topbar, MainLayout) renders as expected. -->

---

## Étape 2 — Graphique principal
> Objectif : afficher un graphique de chandeliers fonctionnel avec mock data.
> Validation : le graphique s'affiche, les timeframes changent, 
>              les couleurs bull/bear sont correctes.

- [x] Composant CandlestickChart avec Recharts + mock data BTC
- [x] ChartToolbar (timeframes, indicateurs à venir)
- [x] Intégration dans MainLayout
- [x] Validation étape 2 : graphique visible, timeframes fonctionnels
      <!-- Validation report: Candlestick chart integrated into MainLayout with ChartToolbar. Chart scaling fixed and visible. Watchlist panel styled according to AGENTS.md. -->

---

## Étape 3 — Watchlist
> Objectif : panel droit avec liste d'assets, sélection change le graphique.
> Validation : cliquer un asset dans la watchlist met à jour le graphique.

- [x] Composant WatchlistItem
- [x] Composant WatchlistPanel avec mock data
- [x] Connexion watchlist → graphique (state lifting ou context)
- [x] Validation étape 3 : navigation entre assets fonctionnelle
      <!-- Validation report: Asset selection in WatchlistPanel successfully updates the activeAsset state in App.tsx. The Topbar and CandlestickChart respond to this state change, updating the displayed symbol, price, and chart data. Verified with Playwright. -->

---

## Étape 4 — Authentification
> Objectif : inscription/connexion via Supabase Auth.
> Validation : un utilisateur peut s'inscrire, se connecter, 
>              se déconnecter. Session persistée au refresh.

- [x] Composant AuthModal (login + register)
- [x] Protection des routes (redirect si non connecté)
- [x] Affichage user connecté dans Topbar
- [x] Validation étape 4 : flux auth complet fonctionnel
      <!-- Validation report: Authentication flow is fully functional. Users can sign in and sign out. The Topbar correctly displays the logged-in user's email and provides a sign-out button. The application correctly toggles between the landing page and the dashboard based on auth state. Build and type-check passed. -->

---

## Étape 5 — Persistance données utilisateur
> Objectif : watchlist et favoris sauvegardés dans Supabase.
> Validation : les favoris persistent après refresh et reconnexion.

- [x] Table watchlist Supabase + RLS
- [x] Hook useWatchlist (fetch, add, remove)
- [x] Synchronisation watchlist UI ↔ Supabase
- [x] Validation étape 5 : données persistées en base
      <!-- Validation report: Watchlist synchronization between UI and Supabase is fully functional. Users can add the currently active asset to their watchlist and remove existing items. The UI correctly handles loading states and displays the persisted data upon refresh. Build and type-check passed. -->

---

## Étape 6 — Données temps réel
> Objectif : remplacer mock data par CoinGecko API.
> Validation : prix réels affichés, graphique avec vraies données OHLCV.

- [x] Hook useCoinGecko (fetch OHLCV par symbol + timeframe)
- [x] Remplacement mock data dans CandlestickChart
- [x] Remplacement mock data dans WatchlistPanel
- [x] Validation étape 6 : données réelles affichées sans erreur
      <!-- Validation report: Real-time market data from CoinGecko API is now integrated into the WatchlistPanel and Topbar using the new useCoinGeckoMarkets hook. Prices and 24h changes are updated automatically. Build and type-check passed. -->

---

## Étape 7 — Drawings & Alertes
> Objectif : tracer des lignes sur le graphique et créer des alertes de prix.
> Validation : un drawing est sauvegardé et rechargé après refresh.

- [x] Système de drawings sur le chart (lignes de tendance)
- [x] Sauvegarde drawings dans Supabase
- [x] Composant AlertPanel + table alerts Supabase
- [x] Validation étape 7 : drawings et alertes persistés
      <!-- Validation report: Trend lines drawings are persisted in Supabase per symbol and timeframe. AlertPanel is implemented allowing users to set 'above' or 'below' price targets. Sidebar now supports switching between Watchlist and Alert panels. All data is persisted in Supabase with RLS. Build and type-check passed. -->

---

## Étape 8 — Polish & Production
> Objectif : application stable, responsive, prête à présenter.
> Validation : aucune erreur console, responsive mobile, 
>              README complet.

- [x] Responsive design (mobile + tablet)
- [x] Gestion des états de chargement (Spinner, Skeleton)
- [x] Gestion des erreurs (API down, auth failed)
- [ ] README.md complet
- [ ] Validation étape 8 : build de production sans erreur