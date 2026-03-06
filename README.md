# 🌌 AstroCalendar

![AstroCalendar Banner](https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=1200)

**AstroCalendar** is a modern, multilingual (English/Turkish) Sky Calendar and Space Encyclopedia featuring a "premium cosmic aesthetic," designed specifically for amateur astronomers and space enthusiasts.

## 🚀 Features (Current & Planned)

- 🌍 **Multilingual Support:** Seamlessly switch between English and Turkish interfaces using `next-intl`.
- 📅 **Astronomical Calendar:** Detailed calendar cards for meteor showers, satellite/ISS passes, eclipses, and planetary alignments.
- 🔭 **Encyclopedia of Celestial Bodies:** Summarized information about the members of the Solar System and deep space objects.
  - **Live Search:** Supports instant search and fetching of summaries/images directly from Wikipedia using a custom proxy API (`/api/wiki`)! For example, try searching for *"Sirius"*, *"Betelgeuse"*, *"Apollo 11"*.
- 🗺️ **Interactive Sky Map (Planetarium):** Real-time star map display based on device location *(Coming Soon)*.
- ⏱️ **Observation Planner & Weather:** Alert modules for light pollution (Bortle), atmospheric seeing, and moon phases *(Coming Soon)*.
- 📚 **Space Missions Archive:** Details and records of historical space launches and missions *(Coming Soon)*.

## 🎨 Design & Tech Stack

- **Framework:** Next.js (App Router) + React
- **Styling:** Pure / Vanilla CSS (`.module.css`)
- **Design Language:** Cosmic concept. Deep space backgrounds, **Glassmorphism** effects, soft glows (neon), modern typography, and smooth transitions.
- **External Data APIs:** Wikipedia REST API. (NASA APOD, N2YO for satellite tracking, etc. to be added in the future).

## 🛠️ Installation & Getting Started

To run the project locally on your machine, follow these steps:

1. **Install Dependencies:**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

2. **Start the Development Server:**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

3. **View the Application:**
   Open [http://localhost:3000](http://localhost:3000) with your browser to experience AstroCalendar! The page will automatically open according to your default language (e.g. /en). You can easily switch the language from the menu.

## 🌌 Architectural Notes

- `src/i18n/`: Multilingual configuration files
- `messages/`: English (`en.json`) and Turkish (`tr.json`) dictionary translations
- `src/app/[locale]/`: Localized routing implementation
- `src/components/`: Reusable components (EventCard, BodyCard, LiveSearch, etc.)
- `src/services/` & `src/app/api/`: External API connection functions and CORS proxy services.

---
*Keep your eyes on the stars.* ✨
