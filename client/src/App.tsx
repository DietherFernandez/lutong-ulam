import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Public pages
import HomePage from './pages/public/HomePage';
import MenuPage from './pages/public/MenuPage';
import AboutPage from './pages/public/AboutPage';
import ContactPage from './pages/public/ContactPage';
import NotFoundPage from './pages/NotFoundPage';

// Admin pages
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminDishes from './pages/admin/Dishes';
import AdminCategories from './pages/admin/Categories';
import AdminImages from './pages/admin/Images';
import AdminSettings from './pages/admin/Settings';
import AdminHours from './pages/admin/Hours';
import AdminHomepage from './pages/admin/Homepage';
import AdminMessages from './pages/admin/Messages';
import ProtectedRoute from './components/admin/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';

// Layout components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Common components
import ScrollToTop from './components/common/ScrollToTop';
import PageWrapper from './components/common/PageWrapper';

// Auth context provider
import { AuthProvider } from './contexts/AuthContext';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public routes */}
        <Route path="/" element={<><Navbar /><main><PageWrapper><HomePage /></PageWrapper></main><Footer /></>} />
        <Route path="/menu" element={<><Navbar /><main><PageWrapper><MenuPage /></PageWrapper></main><Footer /></>} />
        <Route path="/about" element={<><Navbar /><main><PageWrapper><AboutPage /></PageWrapper></main><Footer /></>} />
        <Route path="/contact" element={<><Navbar /><main><PageWrapper><ContactPage /></PageWrapper></main><Footer /></>} />

        {/* Admin routes — nested under AdminLayout */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<PageWrapper><AdminDashboard /></PageWrapper>} />
          <Route path="dishes" element={<PageWrapper><AdminDishes /></PageWrapper>} />
          <Route path="categories" element={<PageWrapper><AdminCategories /></PageWrapper>} />
          <Route path="images" element={<PageWrapper><AdminImages /></PageWrapper>} />
          <Route path="settings" element={<PageWrapper><AdminSettings /></PageWrapper>} />
          <Route path="hours" element={<PageWrapper><AdminHours /></PageWrapper>} />
          <Route path="homepage" element={<PageWrapper><AdminHomepage /></PageWrapper>} />
          <Route path="messages" element={<PageWrapper><AdminMessages /></PageWrapper>} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<><Navbar /><main><PageWrapper><NotFoundPage /></PageWrapper></main><Footer /></>} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <AuthProvider>
      <ScrollToTop />
      <AnimatedRoutes />
    </AuthProvider>
  );
}

export default App;