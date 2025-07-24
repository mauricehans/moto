/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import DataProvider from './contexts/DataContext';
import HomePage from './pages/HomePage';
import MotorcyclesPage from './pages/MotorcyclesPage';
import MotorcycleDetailPage from './pages/MotorcycleDetailPage';
import PartsPage from './pages/PartsPage';
import PartDetailPage from './pages/PartDetailPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import ContactPage from './pages/ContactPage';
import AdminPage from './pages/AdminPage';
import ScrollToTop from './utils/ScrollToTop';
import EditMotorcyclePage from './pages/EditMotorcyclePage';
import EditPartPage from './pages/EditPartPage';
import EditBlogPostPage from './pages/EditBlogPostPage';
import AdminImageGalleryPage from './pages/AdminImageGalleryPage';
import CreateMotorcyclePage from './pages/CreateMotorcyclePage';
import CreatePartPage from './pages/CreatePartPage';
import CreateBlogPostPage from './pages/CreateBlogPostPage';

function AppContent() {
  const location = useLocation();
  const isAdminPage = location.pathname === '/admin' || location.pathname.startsWith('/admin/');

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminPage && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/motorcycles" element={<MotorcyclesPage />} />
          <Route path="/motorcycles/:id" element={<MotorcycleDetailPage />} />
          <Route path="/parts" element={<PartsPage />} />
          <Route path="/parts/:id" element={<PartDetailPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:id" element={<BlogPostPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/edit-motorcycle/:id" element={<EditMotorcyclePage />} />
          <Route path="/admin/edit-part/:id" element={<EditPartPage />} />
          <Route path="/admin/edit-blog/:id" element={<EditBlogPostPage />} />
          <Route path="/admin/images/:type/:id" element={<AdminImageGalleryPage />} />
          <Route path="/admin/create-motorcycle" element={<CreateMotorcyclePage />} />
          <Route path="/admin/create-part" element={<CreatePartPage />} />
          <Route path="/admin/create-blog" element={<CreateBlogPostPage />} />
          
        </Routes>
      </main>
      {!isAdminPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <DataProvider>
        <Router>
          <AppContent />
        </Router>
      </DataProvider>
    </ErrorBoundary>
  );
}

export default App;