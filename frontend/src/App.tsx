import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { LanguageProvider } from './context/LanguageContext';

// Layouts & Components
import { AdminLayout } from './components/admin/AdminLayout';
import Navbar from './components/Navbar'; 
import Footer from './components/Footer'; // Ensure you created this file in components/

// Public Pages
import Home from './pages/Home';
import Library from './pages/Library';
import ArtistProfile from './pages/ArtistProfile';
import ArtworkDetail from './pages/ArtworkDetail';
import Manifesto from './pages/Manifesto';
import About from './pages/About';
import Search from './pages/Search';

// Admin Pages
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
    <LanguageProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Toaster 
          position="top-right" 
          toastOptions={{
            style: {
              background: '#0f0f0f',
              color: '#fff',
              fontSize: '10px',
              textTransform: 'uppercase',
            }
          }}
        />

        {/* Wrapping public routes in a fragment to include global Navbar/Footer.
            Admin routes are separated so they use their own AdminLayout.
        */}
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Routes>
            {/* --- PUBLIC ROUTES (With Global Navbar & Footer) --- */}
            <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
            <Route path="/library" element={<PublicLayout><Library /></PublicLayout>} />
            <Route path="/artist/:id" element={<PublicLayout><ArtistProfile /></PublicLayout>} />
            <Route path="/artwork/:id" element={<PublicLayout><ArtworkDetail /></PublicLayout>} />
            <Route path="/manifesto" element={<PublicLayout><Manifesto /></PublicLayout>} />
            <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
            <Route path="/search" element={<PublicLayout><Search /></PublicLayout>} />

            {/* --- ADMIN PORTAL --- */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="artists" element={<AdminArtists />} />
              <Route path="artists/add" element={<AdminArtistForm />} />
              <Route path="artists/edit/:id" element={<AdminArtistForm />} />
              <Route path="artworks" element={<AdminArtworks />} />
              <Route path="artworks/add" element={<AdminArtworkForm />} />
              <Route path="artworks/edit/:id" element={<AdminArtworkForm />} />
              <Route path="series" element={<AdminSeries />} />
              <Route path="series/add" element={<AdminSeriesForm />} />
              <Route path="series/edit/:id" element={<AdminSeriesForm />} />
              <Route path="books" element={<AdminBooks />} />
              <Route path="books/add" element={<AdminBookForm />} />
              <Route path="books/edit/:id" element={<AdminBookForm />} />
              <Route path="sections" element={<AdminSections />} />
              <Route path="sections/add" element={<AdminSectionForm />} />
              <Route path="sections/edit/:id" element={<AdminSectionForm />} />
              <Route path="taxonomy" element={<AdminTaxonomy />} />
              <Route path="taxonomy/add/:type" element={<AdminTaxonomyForm />} />
              <Route path="taxonomy/edit/:type/:id" element={<AdminTaxonomyForm />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </LanguageProvider>
  );
}

/**
 * A helper component that wraps public pages with the global Navbar and Footer.
 * This prevents duplication of code in every page file.
 */
const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <Navbar />
      <div style={{ flex: 1 }}>
        {children}
      </div>
      <Footer />
    </>
  );
};

export default App;