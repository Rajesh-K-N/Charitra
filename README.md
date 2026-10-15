### Project Description: Charitra - Bhagavad Gita and Ramayana Reciter

**Charitra** is a full-stack web application designed as a spiritual reading platform for Hindu scriptures, specifically the **Bhagavad Gita** and **Ramayana**. It gamifies the experience of reading ancient texts to encourage daily spiritual practice, tracking user progress, streaks, and karma points. The app promotes mindfulness and discipline through features like daily reading goals, leaderboards, and progress resets. It's built with a modern, aesthetic UI inspired by traditional Indian motifs (e.g., parchment-style readers, saffron/maroon color schemes, and Sanskrit-inspired fonts).

#### **Overall Architecture and Technologies**
- **Frontend**: Built with **React** (v19.2.0) using **Vite** for fast development and building. It uses **Tailwind CSS** for styling, **React Router** for navigation, and custom components for a cohesive, spiritual-themed design. The app is responsive and includes features like loading states, modals, and smooth transitions.
- **Backend**: A **Node.js** server using **Express.js** (v5.2.1) with **MongoDB** (via Mongoose) for data persistence. Authentication is handled via **JWT** tokens, and passwords are hashed with **bcryptjs**. The server includes CORS support for cross-origin requests.
- **Database**: **MongoDB** stores user data (e.g., profiles, progress, points). Scripture content is stored in a static JSON file (`scriptures.json`) for simplicity, with plans for expansion.
- **Deployment/Development**: The client runs on `localhost:5173` (Vite dev server), and the server on `localhost:5000`. Environment variables (e.g., `MONGO_URI`, `JWT_SECRET`) are managed via `.env`. No production deployment is configured yet.
- **Project Structure**:
  - Root: Basic monorepo setup with shared `package.json`.
  - `client/`: React app with Vite, ESLint, PostCSS, and Tailwind.
  - `server/`: Express API with routes, models, and data.
  - Key folders: `src/pages` (React components for pages), `src/context` (auth state), `server/routes` (API endpoints), `server/models` (MongoDB schemas).

#### **Key Features and Functionality**

1. **User Authentication and Management**:
   - **Signup/Login**: Users create accounts with name, email, and password. Passwords are securely hashed. A short-lived JWT is stored in an HttpOnly cookie for session persistence.
   - **Auth Context**: A React context manages global user state and restores the session from the API on app start.
   - **Private Routes**: Protected pages (Dashboard, Reader, Leaderboard) require authentication; unauthenticated users are redirected to login.

2. **Dashboard**:
   - Personalized welcome with user name and progress overview.
   - Displays **Karma Points** (earned by completing pages), **Daily Streaks** (consecutive reading days), and **Daily Reads** (pages read today).
   - Progress bar for daily goal (1 page minimum).
   - Scripture selection: Two books – **Ramayana** (epic of Rama) and **Bhagavad Gita** (Krishna's teachings). Clicking opens the Reader at page 1.
   - Fetches and updates user progress on load via API calls.

3. **Reader (Scripture Viewing)**:
   - Displays scripture content page-by-page (e.g., chapters/verses from `scriptures.json`).
   - Parchment-style UI with decorative borders, serif fonts, and justified text for an immersive reading experience.
   - Navigation: Previous/Next buttons (disabled at boundaries). "Complete & Continue" button awards +10 Karma Points, updates progress (streaks, daily reads), and advances to the next page.
   - Progress Tracking: Each completion updates the user's reading progress (bookmarked page per book), streaks (resets if not read daily), and points. Daily reads reset at midnight.
   - Content Source: Static JSON with sample chapters (e.g., Ramayana: Bala Kanda; Bhagavad Gita: Chapter 1). If a page doesn't exist, shows a "end of scripture" message.

4. **Leaderboard ("Hall of Sages")**:
   - Displays top 10 users by Karma Points, including rank, name, points, and streaks.
   - Highlights the current user with a "You" badge and background color.
   - Fetched from the API, sorted by points descending.

5. **Progress Reset ("Karma Reset")**:
   - Accessible via Navbar button; requires confirmation in a modal.
   - Resets points, streaks, and daily reads to 0, but retains reading bookmarks (progress map).
   - Encourages fresh starts without losing place in scriptures.

6. **Gamification and Motivation**:
   - **Points System**: +10 points per completed page.
   - **Streaks**: Tracks consecutive days of reading; resets if skipped.
   - **Daily Goals**: Visual progress bar for 1+ pages/day.
   - Leaderboard fosters community and competition.
   - Spiritual theming: Uses terms like "Yatra" (journey), "Karma," "Tapasya" (austerity), and icons (e.g., 🕉️, 🏆) to align with Hindu philosophy.

#### **Data and Content**
- **Scriptures JSON**: Contains structured text for Ramayana (10 sample pages) and Bhagavad Gita (10 sample pages). Each page includes Markdown-formatted content with headings, translations, and narratives. Example: Bhagavad Gita Chapter 1 with Sanskrit verses and English translations.
- **User Model**: Stores name, email, password, points, streaks, dailyReads, lastReadDate, and progress (a Map of bookId to last-read page).
- **API Endpoints**:
  - `/api/auth/register` & `/api/auth/login`: User auth.
  - `/api/books/content/:bookId/:page`: Fetch scripture content.
  - `/api/books/progress`: Update progress on page completion.
  - `/api/books/my-progress`: Get user's stats.
  - `/api/books/reset-progress`: Reset stats.
  - `/api/books/leaderboard`: Get top users.

#### **How It Works (User Flow)**
1. **Onboarding**: New users sign up, log in, and land on the Dashboard.
2. **Reading**: Select a book, read pages sequentially. Complete each to earn points and track progress.
3. **Progression**: Streaks build with daily reads; points accumulate for leaderboard ranking.
4. **Community**: View rankings to stay motivated.
5. **Reset**: Optionally reset for a fresh spiritual journey.

#### **Limitations and Future Enhancements**
- Content is limited to sample pages; full scriptures would require expansion or external APIs.
- No offline mode or audio recitation (despite "reciter" in the name).
- No advanced features like bookmarks, notes, or multi-language support.
- Security: JWT sessions expire after one hour; passwords are bcrypt-hashed. The API uses security headers, origin-restricted CORS, request limits, input validation, and global/auth rate limiting. There are no refresh tokens.
- Scalability: Static JSON for content; could move to DB for dynamic updates.
- UI/UX: Relies on Tailwind; could add animations or dark mode.

This app blends technology with spirituality, making ancient texts accessible and engaging through modern web development practices. It's ideal for users seeking daily inspiration from Hindu epics. If you'd like details on specific files, code snippets, or how to run it, let me know!

#### **Vercel deployment**
- The root `vercel.json` configures two services: `client` (Vite) and `server` (Express). `/api/*` is routed to the server first; all other paths are routed to the client.
- The browser calls the public same-origin `/api` path, so there is no server-to-server service binding in this project. The backend service is public only through the `/api/*` rewrite.
- Import this repository as a Vercel project using the repository root. Configure `MONGO_URI`, `JWT_SECRET`, `CLIENT_ORIGIN`, and `COOKIE_SAME_SITE` in Vercel's project environment variables. Set `CLIENT_ORIGIN` to the deployed site's full origin (scheme and host; include preview origins if required). Do not configure `VITE_API_URL` on Vercel; the client defaults to `/api`.
- Configure `VITE_SITE_URL` to the production site URL and set optional analytics/verification IDs only if those integrations are enabled. Keep database credentials and JWT secrets in server environment variables, never `VITE_*` variables.
- Install the Vercel CLI and run `vercel dev` from the repository root to exercise local service routing. For separate local development, run the server on port 5000 and the client on port 5173; the Vite dev proxy forwards `/api` requests to the server.
- `npm run build --prefix client`, `npm test --prefix server`, and both package-level `npm audit` commands are the local validation commands.
