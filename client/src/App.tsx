import { Routes, Route } from 'react-router-dom';

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
import ProtectedRoute from './components/admin/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';

// Layout components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Auth context provider
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<><Navbar /><main><HomePage /></main><Footer /></>} />
        <Route path="/menu" element={<><Navbar /><main><MenuPage /></main><Footer /></>} />
        <Route path="/about" element={<><Navbar /><main><AboutPage /></main><Footer /></>} />
        <Route path="/contact" element={<><Navbar /><main><ContactPage /></main><Footer /></>} />

        {/* Admin routes — nested under AdminLayout */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="dishes" element={<AdminDishes />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="images" element={<AdminImages />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="hours" element={<AdminHours />} />
          <Route path="homepage" element={<AdminHomepage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<><Navbar /><main><NotFoundPage /></main><Footer /></>} />
      </Routes>
    </AuthProvider>
  );
}

export default App;