import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layouts
// FIXED: Using named import for AdminLayout to match its 'export const'
import { AdminLayout } from './components/admin/AdminLayout';

// Pages
import { Dashboard } from './pages/admin/Dashboard';
import { AdminArtists } from './pages/admin/artists/AdminArtists';
import { AdminArtistForm } from './pages/admin/artists/AdminArtistForm';
import { AdminArtworks } from './pages/admin/artworks/AdminArtworks';
import { AdminArtworkForm } from './pages/admin/artworks/AdminArtworkForm'; 
import { AdminSeries } from './pages/admin/series/AdminSeries';
import { AdminSeriesForm } from './pages/admin/series/AdminSeriesForm';
import { AdminBooks } from './pages/admin/books/AdminBooks';
import { AdminBookForm } from './pages/admin/books/AdminBookForm';
import { AdminSections } from './pages/admin/sections/AdminSections';
import { AdminSectionForm } from './pages/admin/sections/AdminSectionForm';
import { AdminTaxonomy } from './pages/admin/taxonomy/AdminTaxonomy';
import { AdminTaxonomyForm } from './pages/admin/taxonomy/AdminTaxonomyForm';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: '#0f0f0f',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
            fontSize: '10px',
            fontWeight: '900',
            textTransform: 'uppercase',
            letterSpacing: '0.1em'
          }
        }}
      />

      <Routes>
        {/* PUBLIC LANDING PAGE */}
        <Route path="/" element={
          <div className="h-screen bg-black text-white flex flex-col items-center justify-center font-black italic text-4xl uppercase tracking-tighter text-center px-6">
            Atlal Archive 
            <span className="text-primary mt-2 text-xl not-italic tracking-[0.3em]">Under Construction</span>
          </div>
        } />

        {/* ADMIN PORTAL */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          
          {/* ARTISTS: IDs are locked in the form during edit */}
          <Route path="artists" element={<AdminArtists />} />
          <Route path="artists/add" element={<AdminArtistForm />} />
          <Route path="artists/edit/:id" element={<AdminArtistForm />} />

          {/* ARTWORKS */}
          <Route path="artworks" element={<AdminArtworks />} />
          <Route path="artworks/add" element={<AdminArtworkForm />} />
          <Route path="artworks/edit/:id" element={<AdminArtworkForm />} />

          {/* SERIES: Corrected to use named routes */}
          <Route path="series" element={<AdminSeries />} />
          <Route path="series/add" element={<AdminSeriesForm />} />
          <Route path="series/edit/:id" element={<AdminSeriesForm />} />

          {/* BOOKS */}
          <Route path="books" element={<AdminBooks />} />
          <Route path="books/add" element={<AdminBookForm />} />
          <Route path="books/edit/:id" element={<AdminBookForm />} />

          {/* SECTIONS */}
          <Route path="sections" element={<AdminSections />} />
          <Route path="sections/add" element={<AdminSectionForm />} />
          <Route path="sections/edit/:id" element={<AdminSectionForm />} />

          {/* TAXONOMY: Pattern-matched for theme/tag logic */}
          <Route path="taxonomy" element={<AdminTaxonomy />} />
          <Route path="taxonomy/add/:type" element={<AdminTaxonomyForm />} />
          <Route path="taxonomy/edit/:type/:id" element={<AdminTaxonomyForm />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;