<<<<<<< HEAD
# KamPre
=======
# 🛒 KamPare — Compare Smart. Save More.

A full-stack grocery price comparison web app that lets users search for items
and instantly compare prices across **Amazon, Flipkart, Blinkit, Instamart, and
BigBasket**, with automatic best-deal highlighting.

---

## 📁 Project Structure

```
kampare/
├── backend/                   # Node.js + Express API
│   ├── server.js              # Entry point
│   ├── routes/
│   │   ├── compare.js         # /api/compare  — main comparison endpoint
│   │   ├── categories.js      # /api/categories
│   │   └── favorites.js       # /api/favorites
│   ├── services/
│   │   └── priceService.js    # Core price aggregation + caching logic
│   ├── data/
│   │   └── mockProducts.js    # Simulated platform product database
│   ├── .env.example           # Environment variable template
│   └── package.json
│
└── frontend/                  # React + Tailwind CSS
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── App.jsx            # Root component (search + results orchestration)
    │   ├── index.js
    │   ├── index.css          # Tailwind + custom styles
    │   ├── components/
    │   │   ├── SearchBar.jsx       # Search input with autocomplete + voice
    │   │   ├── ProductCard.jsx     # Per-platform result card
    │   │   ├── BestDealBanner.jsx  # Best-deal hero banner
    │   │   ├── ComparisonTable.jsx # Sortable table view
    │   │   ├── FilterBar.jsx       # Sort + view-toggle controls
    │   │   ├── PriceChart.jsx      # Recharts bar chart
    │   │   ├── FavoritesPanel.jsx  # Slide-in saved items panel
    │   │   ├── LoadingState.jsx    # Skeleton loader
    │   │   └── ErrorState.jsx      # Empty / error states
    │   ├── services/
    │   │   └── api.js         # Axios wrappers for all backend calls
    │   └── utils/
    │       └── platformConfig.js   # Platform colours, icons, formatters
    ├── tailwind.config.js
    └── package.json
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥ 18.x  ([https://nodejs.org](https://nodejs.org))
- **npm** ≥ 9.x  (bundled with Node)

---

### 1. Clone / navigate to the project

```bash
cd kampare
```

---

### 2. Start the Backend

```bash
cd backend
npm install
cp .env.example .env        # copy environment template
npm run dev                 # starts on http://localhost:5000
```

Verify it works:
```
GET http://localhost:5000/api/health
→ { "status": "ok", "app": "KamPare" }
```

---

### 3. Start the Frontend (new terminal)

```bash
cd frontend
npm install
npm start                   # starts on http://localhost:3000
```

The CRA development server proxies all `/api/*` requests to `localhost:5000`.

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Server health check |
| `GET` | `/api/compare?item=toor+dal` | Fetch & compare prices |
| `GET` | `/api/compare?item=rice&sort=value` | Sort by price per unit |
| `GET` | `/api/compare/suggestions?q=tor` | Autocomplete suggestions |
| `GET` | `/api/categories` | List all product categories |
| `GET` | `/api/favorites` | List saved favorites |
| `POST` | `/api/favorites` | Save a favorite `{ name, category }` |
| `DELETE` | `/api/favorites/:name` | Remove a favorite |

### Example Response — `/api/compare?item=toor+dal`

```json
{
  "query": "toor dal",
  "results": [
    {
      "platform": "BigBasket",
      "platformKey": "bigbasket",
      "productName": "bb Royal Toor Dal / Arhar Dal, 1 kg",
      "brand": "bb Royal",
      "price": 109,
      "originalPrice": 120,
      "quantity": "1 kg",
      "pricePerUnit": 10.9,
      "discount": 9,
      "isBestDeal": true,
      "isBestValue": true,
      "deliveryTime": "Same day",
      "rating": 4.4,
      "link": "https://www.bigbasket.com/ps/?q=toor+dal"
    }
    // ... more platforms
  ],
  "bestDeal": { /* cheapest item */ },
  "bestValue": { /* lowest ₹/100g item */ },
  "totalPlatforms": 5,
  "availablePlatforms": 5,
  "fromCache": false
}
```

---

## 🎯 Features

| Feature | Status |
|---------|--------|
| Multi-platform price comparison (5 platforms) | ✅ |
| Best Deal 🔥 automatic highlighting | ✅ |
| Best Value 💎 (lowest price per unit) | ✅ |
| Autocomplete search suggestions | ✅ |
| Voice search (Web Speech API) | ✅ |
| Card grid + sortable table view | ✅ |
| Price comparison bar chart | ✅ |
| Skeleton loading animations | ✅ |
| Favorites save/remove panel | ✅ |
| In-memory result caching (5 min TTL) | ✅ |
| Platform failure graceful fallback | ✅ |
| Mobile responsive design | ✅ |
| Discount % display | ✅ |

---

## 📦 Supported Search Terms

| Category | Example Searches |
|----------|-----------------|
| Pulses | `Toor Dal`, `Arhar Dal`, `Pigeon Pea` |
| Rice & Grains | `Rice`, `Basmati Rice`, `Chawal` |
| Dairy | `Milk`, `Full Cream Milk`, `Doodh` |
| Flour | `Atta`, `Wheat Flour`, `Aashirvaad Atta` |
| Staples | `Sugar`, `Cheeni` |
| Oils | `Oil`, `Cooking Oil`, `Sunflower Oil` |

---

## ⚙️ Environment Variables (backend/.env)

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `5000` | Backend server port |
| `CACHE_TTL` | `300` | Cache TTL in seconds |
| `RATE_LIMIT_WINDOW_MS` | `900000` | Rate limit window (15 min) |
| `RATE_LIMIT_MAX` | `100` | Max requests per window |
| `MONGODB_URI` | — | MongoDB connection (optional) |

---

## 🏗️ Production Build

```bash
# Build the React frontend
cd frontend && npm run build

# Serve the build folder with any static server or behind nginx
```

---

## 🧠 Architecture Notes

- **Mock data layer** (`data/mockProducts.js`) simulates real platform APIs.
  Replace `findProducts()` calls in `priceService.js` with real HTTP calls to
  Flipkart Affiliate API / RapidAPI product search endpoints as needed.
- **Concurrency**: all platform fetches run via `Promise.allSettled()` —
  one platform timing out never blocks the others.
- **Caching**: `node-cache` (in-memory) caches results per query for 5 minutes,
  keeping response times fast on repeated searches.
- **Unit normalisation**: `quantityGrams` field standardises all products to
  grams/mL for the "price per 100g" fair-comparison metric.

---

## 🎨 Branding

| Element | Value |
|---------|-------|
| App Name | KamPare |
| Tagline | *Compare Smart. Save More.* |
| Primary Green | `#16a34a` |
| Accent Orange | `#ea580c` |

---

*Made with ❤️ — KamPare*
>>>>>>> b28b56b338c0242116cea9e1170939cef4b0ecda
