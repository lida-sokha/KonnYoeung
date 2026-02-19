import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '../src/components/Layout/Navbar';
import Footer from '../src/components/Layout/Footer';
import HomePage from './pages/HomePage/HomePage';
import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/Signup';
import AboutUsPage from './pages/Aboutus/About_us';
import ContactUs from './pages/Contactus/Contact_us';
import DashboardPage from './pages/Dashboard/Dashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Verify from './pages/Auth/Otpverify';
import CreateArticle from './pages/Admin/Create_article';
import ArticlePage from './pages/Article/Articles';
import ArticleDetail from './pages/Article/ArticleDetail';
import MainLayout from './components/Layout/MainLayout';
import Hospital from './pages/Hospitals/Hospitals';
import HospitalDetail from './pages/Hospitals/HospitalDetail';
import { GoogleOAuthProvider } from '@react-oauth/google';
import ManageDiseases from './pages/Admin/ManageDiseases';
import DiseaseDetail from './pages/Admin/DiseaseDetail';
function AppContent() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/contact" element={<ContactUs />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/verify" element={<Verify />} />

      <Route path='/Dashboard' element={
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      } />

      <Route path='/admin/diseases' element={<ManageDiseases />} />
      <Route path='/admin/diseases/:id' element={<DiseaseDetail />} />

      <Route path="/articles" element={
        <ProtectedRoute>
          <ArticlePage />
        </ProtectedRoute>
      } />

      <Route path="/articles/:id" element={
        <ProtectedRoute>
          <ArticleDetail />
        </ProtectedRoute>
      } />

      <Route path='/hospitals' element={
        <ProtectedRoute>
          <Hospital />
        </ProtectedRoute>
      } />
      <Route path="/hospitals/:id" element={
        <ProtectedRoute>
          <HospitalDetail />
        </ProtectedRoute>
        } />

    </Routes>
  );
}

function App() {
  return (
    <Router>
      <GoogleOAuthProvider clientId="">
        <AppContent />
      </GoogleOAuthProvider>
    </Router>
  );
}

export default App;