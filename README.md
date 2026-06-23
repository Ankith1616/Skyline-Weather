# 🌤️ NimbusWeather

NimbusWeather is a production-grade, full-stack weather forecasting and travel intelligence platform. It features a modern, high-fidelity React.js frontend powered by Vanilla CSS (showcasing glassmorphism, responsive grid layouts, and smooth animations) coupled with a scalable Express/Node.js backend with Mongoose/MongoDB connectivity, request rate-limiting, and multiple report-export architectures.

---

## 🚀 Key Features

*   **🔍 Multi-Mode Location Search**: Lookup metrics via City name, Zipcode, Coordinates, or Landmarks, alongside a "Locate Me" button leveraging the browser's Geolocation API.
*   **💡 Smart Weather Advisory**: Context-aware recommendations engine displaying real-time safety tips (e.g., "Carry an umbrella" for rain, "Stay hydrated" for hot weather, "Secure items" for wind).
*   **🗺️ Interactive Map Embed**: Dynamically displays the queried location on a Google Map using precise coordinate alignments.
*   **🎥 YouTube Travel Guides**: Automatically aggregates location-based travel insights and guide videos.
*   **🗄️ Database search logging**: Automatically stores search logs in MongoDB with detailed metrics (location, temp, humidity, wind, and conditions).
*   **🎛️ Collapsible Advanced Filters**: Toggle a filter drawer inside the history log to query by Condition types, Date bounds, and Temperature thresholds, with sorting options.
*   **📥 Multi-Format Data Exports**: Export search histories in three formats:
    *   `JSON` format.
    *   `CSV` text spreadsheets.
    *   `PDF` layout reports (dynamically rendered using `pdfkit`).
*   **🌓 Adaptive Dark Mode**: Syncs design themes between light and dark settings, saved to client local storage.

---

## 💻 Tech Stack

### **Frontend**
*   **Framework**: [React.js](https://react.dev/) (v18.3.1)
*   **Build Utility**: [Vite](https://vite.dev/)
*   **Styling**: Vanilla CSS (CSS variables, responsive design, backdrop filters)
*   **Icons**: [Lucide React](https://lucide.dev/)

### **Backend**
*   **Runtime**: [Node.js](https://nodejs.org/) (ES Modules)
*   **Web Framework**: [Express.js](https://expressjs.com/)
*   **ORM / Database**: [Mongoose](https://mongoosejs.com/) & [MongoDB](https://www.mongodb.com/)
*   **PDF Generation**: [pdfkit](https://pdfkit.org/)
*   **Security & Diagnostics**: [Helmet](https://helmetjs.github.io/), [Express Rate Limit](https://www.npmjs.com/package/express-rate-limit), [Morgan](https://www.npmjs.com/package/morgan), and [Winston/Custom Logger](https://github.com/winstonjs/winston)

---

## 🛠️ Installation & Setup

### Prerequisites
*   Node.js (v18.0.0 or higher)
*   MongoDB running locally (e.g. `mongodb://127.0.0.1:27017/weather_app`) or a MongoDB Atlas URI

### Steps

1.  **Clone the Repository** and navigate to the project directory:
    ```bash
    cd weather-app
    ```

2.  **Install All Dependencies**:
    The root workspace includes concurrently mapped scripts. Install dependencies for the root, frontend, and backend packages:
    ```bash
    npm run install:all
    ```

3.  **Configure Environment Variables**:
    Create a `.env` file in the `backend/` folder. (See [Environment Variables](#-environment-variables) below).

4.  **Run in Development Mode**:
    Launch both the frontend client and backend server concurrently with a single command from the root folder:
    ```bash
    npm run dev
    ```
    *   **Frontend client**: Running at `http://localhost:3001` (or next available port)
    *   **Backend server**: Running at `http://localhost:5000`

---

## 🔑 Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/weather_app
OPENWEATHER_API_KEY=mock
NODE_ENV=development
```

> [!NOTE]
> Set `OPENWEATHER_API_KEY=mock` to run the application completely offline. It will fallback to a high-fidelity client-side and server-side deterministic mock data generator matching searched locations. Set a real key from OpenWeatherMap to enable live queries.

---

## 🔌 API Endpoints

### **Weather Records CRUD**
*   `POST /api/weather` - Log a new weather search record.
*   `GET /api/weather` - Retrieve all search logs (supports case-insensitive filtering by `?location=`).
*   `GET /api/weather/:id` - Fetch details for a specific log ID.
*   `PUT /api/weather/:id` - Update an existing log record.
*   `DELETE /api/weather/:id` - Remove a search log from the database.

### **Data Exports**
*   `GET /api/export/json` - Download database logs as a JSON attachment.
*   `GET /api/export/csv` - Download database logs as a CSV file.
*   `GET /api/export/pdf` - Download database logs formatted inside a PDF table report.

### **Diagnostics**
*   `GET /health` - Returns 200 OK to verify server status.

---

## 📂 Codebase Folder Structure

```text
weather-app/
├── package.json               # Root manifest utilizing concurrently
├── README.md                  # Project documentation
├── backend/                   # Node.js/Express back-end project
│   ├── package.json
│   ├── server.js              # Server entrypoint
│   ├── .env                   # Configuration variables
│   ├── config/
│   │   └── db.js              # MongoDB driver link
│   ├── controllers/
│   │   └── weatherController.js # Handles API request logics & PDF builds
│   ├── middleware/
│   │   ├── errorHandler.js
│   │   └── rateLimiter.js
│   ├── models/
│   │   ├── Favorite.js        # Bookmarked locations schema
│   │   └── WeatherRecord.js   # Search history schema
│   ├── routes/
│   │   └── weatherRoutes.js   # API route declarations
│   ├── services/
│   │   └── weatherService.js  # Live OpenWeatherMap fetch service
│   └── utils/
│       └── logger.js
└── frontend/                  # React client-side Vite project
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx            # Core page routing controls
        ├── index.css          # CSS design tokens & theme sheets
        ├── components/
        │   ├── ErrorMessage/
        │   ├── Forecast/      # Forecast list and Forecast cards
        │   ├── Loader/
        │   ├── Navbar/        # Navigation links & Dark Mode switch
        │   ├── SearchBar/     # Pill-shaped input with Geolocation triggers
        │   └── WeatherCard/   # Primary weather details grid
        ├── pages/
        │   ├── Home/          # Hero landing screen
        │   ├── SearchHistory/ # Filters log & export toolbar
        │   └── SearchResults/ # Suggestions, Maps, and YouTube layout
        └── services/
            └── weatherApi.js  # Client mock generator & fetch scripts
```

---

## 📸 Interface Screenshots

*Add screenshots of your screens to visually display your UI layouts:*

1.  **Dashboard Hub (Landing Screen)**
    *Place image placeholder here: `docs/screenshots/dashboard_view.png`*
2.  **Search Analytics View (Map & Videos)**
    *Place image placeholder here: `docs/screenshots/analytics_view.png`*
3.  **Advanced Database History & Logs Export**
    *Place image placeholder here: `docs/screenshots/history_log_view.png`*

---

## 🔮 Future Improvements

1.  **Saved Bookmarks Pages**: Connect the backend `/api/favorites` API with the frontend `Favorites` views (already in codebase) to let users pin multiple cities on a custom bookmarks grid.
2.  **Notification Webhooks**: Configure cron scheduling alerts matching custom weather thresholds (e.g. notify if severe thunderstorms or heavy snowfall is expected).
3.  **Real-Time Map Overlays**: Upgrade Google Maps embeds into interactive OpenLayers or Mapbox maps showing real-time wind speed, temperature heatmap, and precipitation overlays.
