import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layout & Core
import { AdminLayout } from './components/admin/AdminLayout';
import { Dashboard } from './pages/admin/Dashboard';

// Artists
import { AdminArtists } from './pages/admin/artists/AdminArtists';
import { AdminArtistForm } from './pages/admin/artists/AdminArtistForm';

// Artworks
import { AdminArtworks } from './pages/admin/artworks/AdminArtworks';
import { AdminArtworkForm } from './pages/admin/artworks/AdminArtworkForm';

// Series
import { AdminSeries } from './pages/admin/series/AdminSeries';
import { AdminSeriesForm } from './pages/admin/series/AdminSeriesForm';

// Books
import { AdminBooks } from './pages/admin/books/AdminBooks';
import { AdminBookForm } from './pages/admin/books/AdminBookForm';

// Sections
import { AdminSections } from './pages/admin/sections/AdminSections';
import { AdminSectionForm } from './pages/admin/sections/AdminSectionForm';

// Taxonomy
import { AdminTaxonomy } from './pages/admin/taxonomy/AdminTaxonomy';

function App() {
  return (
    <Router>
      <Toaster 
        position="top-right" 
        toastOptions={{
          className: 'font-black uppercase text-[10px] tracking-widest italic',
          duration: 3000,
        }} 
      />
      
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<div className="p-20 font-black uppercase italic text-4xl">Atlal Archive <span className="text-primary">Under Construction</span></div>} />

        {/* ADMIN CONTROL CENTER */}
        <Route path="/admin" element={<AdminLayout />}>
          {/* Dashboard Home */}
          <Route index element={<Dashboard />} />
          
          {/* Artists Management */}
          <Route path="artists" element={<AdminArtists />} />
          <Route path="artists/add" element={<AdminArtistForm />} />
          <Route path="artists/edit/:id" element={<AdminArtistForm />} />

          {/* Artworks Management */}
          <Route path="artworks" element={<AdminArtworks />} />
          <Route path="artworks/add" element={<AdminArtworkForm />} />
          <Route path="artworks/edit/:id" element={<AdminArtworkForm />} />

          {/* Series Management */}
          <Route path="series" element={<AdminSeries />} />
          <Route path="series/add" element={<AdminSeriesForm />} />
          <Route path="series/edit/:id" element={<AdminSeriesForm />} />

          {/* Books Registry */}
          <Route path="books" element={<AdminBooks />} />
          <Route path="books/add" element={<AdminBookForm />} />
          <Route path="books/edit/:id" element={<AdminBookForm />} />
          
          {/* Section Hierarchy */}
          <Route path="sections" element={<AdminSections />} />
          <Route path="sections/add" element={<AdminSectionForm />} />
          <Route path="sections/edit/:id" element={<AdminSectionForm />} />

          {/* Taxonomy & Tags */}
          <Route path="taxonomy" element={<AdminTaxonomy />} />
        </Route>

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;