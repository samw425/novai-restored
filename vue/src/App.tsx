import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { DetailPage } from './pages/DetailPage';
import { YouTubePage } from './pages/YouTubePage';
import { MoviesPage } from './pages/MoviesPage';
import { TVPage } from './pages/TVPage';
import { PlatformPage } from './pages/PlatformPage';
import { SearchPage } from './pages/SearchPage';
import { TrendingPage } from './pages/TrendingPage';
import { WhatToWatchPage } from './pages/WhatToWatchPage';
import { NewReleasesPage } from './pages/NewReleasesPage';
import { CriticsPicksPage } from './pages/CriticsPicksPage';
import { AudienceFavoritesPage } from './pages/AudienceFavoritesPage';
import { FeedbackPage } from './pages/FeedbackPage';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-vue-black text-white flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            {/* Main Pages */}
            <Route path="/" element={<HomePage />} />
            <Route path="/movies" element={<MoviesPage />} />
            <Route path="/tv" element={<TVPage />} />
            <Route path="/youtube" element={<YouTubePage />} />

            {/* Browse Pages */}
            <Route path="/trending" element={<TrendingPage />} />
            <Route path="/what-to-watch" element={<WhatToWatchPage />} />
            <Route path="/new-releases" element={<NewReleasesPage />} />
            <Route path="/critics-picks" element={<CriticsPicksPage />} />
            <Route path="/audience-favorites" element={<AudienceFavoritesPage />} />

            {/* Platform Pages */}
            <Route path="/platform/:platform" element={<PlatformPage />} />

            {/* Detail Pages */}
            <Route path="/movie/:id" element={<DetailPage />} />
            <Route path="/tv/:id" element={<DetailPage />} />

            {/* Utility Pages */}
            <Route path="/search" element={<SearchPage />} />
            <Route path="/feedback" element={<FeedbackPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
