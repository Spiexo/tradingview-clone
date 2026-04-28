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
- [x] README.md complet
- [x] Validation étape 8 : build de production sans erreur
      <!-- Validation report: Production build (npm run build) completed successfully. Responsive design, loading states, and error handling have been implemented and verified. Documentation (README.md) is complete. -->

---

## Étape 9 — Migration chart engine vers Lightweight Charts

> Objectif : remplacer Recharts par lightweight-charts (lib officielle TradingView OSS)
> pour un rendu pro des candlesticks avec zoom, crosshair natif et support futur
> des outils de dessin avancés.
> Validation : graphique candlestick affiché avec lightweight-charts, mêmes données
> qu'avant, couleurs bull=vert/bear=rouge, resize correct, npm run build sans erreur.

- [x] Désinstaller recharts, installer lightweight-charts@4 (`npm uninstall recharts && npm install lightweight-charts@4`)
- [x] Ajouter l'interface LWC dans src/types/index.ts si manquante
- [x] Réécrire src/components/chart/CandlestickChart.tsx avec IChartApi (useRef container, createChart, candlestickSeries, ResizeObserver, cleanup on unmount)
- [x] Conserver les mêmes props du composant — aucun changement d'API externe
- [x] Validation étape 9 : npm run build sans erreur TypeScript, graphique visible avec les données existantes
      <!-- Validation report: Replaced Recharts with lightweight-charts for professional candlestick rendering. Optimized interactive trendline drawing using refs. Updated useCoinGecko hook to provide compatible timestamps. Build and type-check passed. -->

---

## Étape 10 — Migration API : CoinGecko → Binance (crypto) + Polygon.io (stocks)

> Objectif : remplacer CoinGecko (rate limit trop bas, pas de bougies granulaires M1/M5/M15)
> par Binance REST pour la crypto (sans clé API) et Polygon.io pour les actions (clé gratuite).
> Validation : bougies BTC/USDT 1h réelles depuis Binance, bougies AAPL 1D depuis Polygon,
> aucune erreur réseau, npm run build sans erreur.

- [x] Créer src/services/binance.ts — fetchKlines(symbol, interval, limit) via https://api.binance.com/api/v3/klines, pas de clé requise
- [x] Créer src/services/polygon.ts — fetchStockOHLCV(ticker, timespan, from, to) via VITE_POLYGON_API_KEY
- [x] Mettre à jour src/hooks/useOHLCV.ts pour router vers binance.ts (type 'crypto') ou polygon.ts (type 'stock')
- [x] Marquer src/hooks/useCoinGecko.ts comme déprécié (commentaire en tête de fichier) sans le supprimer
- [ ] Mettre à jour src/data/mockWatchlist.ts : ajouter AAPL et TSLA avec type 'stock'
- [ ] Validation étape 10 : données réelles crypto ET stock affichées dans le graphique, timeframes opérationnels

---

## Étape 11 — Orderbook live + Screener d'assets

> Objectif : ajouter le panneau orderbook temps réel (Binance WebSocket) et le screener
> permettant de naviguer entre crypto et actions depuis l'interface.
> Validation : orderbook BTC mis à jour en temps réel, screener affiche crypto et stocks,
> cliquer un asset met à jour le graphique principal.

- [ ] Créer src/services/websocket.ts — singleton WebSocket manager (connect, disconnect, subscribe, unsubscribe par symbol)
- [ ] Créer src/hooks/useOrderbook.ts — stream Binance wss://stream.binance.com:9443/ws/{symbol}@depth20@100ms
- [ ] Créer src/components/orderbook/OrderbookPanel.tsx — bids (text-green-400) et asks (text-red-400) avec quantités
- [ ] Créer src/hooks/useScreener.ts — Binance /ticker/24hr pour crypto, Polygon snapshot pour stocks
- [ ] Créer src/components/screener/AssetScreener.tsx — onglets Crypto / Stocks, clic → mise à jour du chart
- [ ] Intégrer OrderbookPanel et AssetScreener dans MainLayout sans casser le layout existant
- [ ] Validation étape 11 : orderbook live fonctionnel, screener opérationnel sur les deux onglets, npm run build sans erreur

---

## Étape 12 — Multi-timeframes & indicateurs techniques

> Objectif : rendre les timeframes pleinement opérationnels avec lightweight-charts
> et ajouter les indicateurs MA, RSI, MACD, Bollinger en overlay ou panneau séparé.
> Validation : changement de timeframe recharge les données, au moins MA20 et RSI visibles.

- [ ] Connecter ChartToolbar au hook useOHLCV — changer timeframe recharge les données via Binance/Polygon
- [ ] Implémenter Moving Average (MA20, MA50) en overlay sur le graphique principal (LineSeries)
- [ ] Implémenter RSI(14) dans un panneau séparé sous le graphique principal
- [ ] Implémenter MACD dans un troisième panneau optionnel (toggle on/off)
- [ ] Implémenter Bollinger Bands (20, 2) en overlay sur le graphique principal
- [ ] Permettre d'activer/désactiver chaque indicateur depuis ChartToolbar
- [ ] Validation étape 12 : tous les timeframes fonctionnels, MA20 + RSI affichés par défaut, build sans erreur
