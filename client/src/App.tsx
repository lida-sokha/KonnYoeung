import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from '../src/components/Layout/Navbar';
import Footer from '../src/components/Layout/Footer';
<<<<<<< HEAD
import AboutUsPage from './pages/Aboutus/About_us';
function App() {
  return (
    <Router>
=======
import HomePage from './pages/HomePage/HomePage';
import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/Signup';
import AboutUsPage from './pages/Aboutus/About_us';
import ContactUs from './pages/Contactus/Contact_us';
import DashboardPage from './pages/Dashboard/Dashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Verify from './pages/Auth/Otpverify';
import CreateArticle from './pages/Admin/Create_article';
import ArticleDetail from './pages/Article/ArticleDetail';
import ArticlePage from './pages/Article/Articles';
import MainLayout from './components/Layout/MainLayout';
import Hospital from './pages/Hospitals/Hospitals';
import HospitalDetail from './pages/Hospitals/HospitalDetail';
import CheckSymptoms from './pages/Symptoms/CheckSymptoms';
import SymptomStart from './pages/Symptoms/SymptomStart';
import SymptomResult from './pages/Symptoms/SymptomResult';
import { GoogleOAuthProvider } from '@react-oauth/google';
import ManageDiseases from './pages/Admin/ManageDiseases';
import DiseaseDetail from './pages/Admin/DiseaseDetail';
import DiseaseEdit from './pages/Admin/DiseaseEdit';
import { DiseaseProvider } from './contexts/DiseaseContext';
import Settings from './pages/Settingpage/Setting';
function AppContent() {
  return (
<<<<<<< HEAD
    <Router>
      {/* Navbar stays OUTSIDE Routes so it shows on every page */}
      <Navbar /> 
>>>>>>> 9cd30a9e5551054095ac7dd83702684dd60ac720
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
<<<<<<< HEAD

      
=======
      <Footer />
>>>>>>> 9cd30a9e5551054095ac7dd83702684dd60ac720
=======
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

      <Route path='/symptoms' element={
        <ProtectedRoute>
          <CheckSymptoms />
        </ProtectedRoute>
      } />
      <Route path='/symptoms/start' element={
        <ProtectedRoute>
          <SymptomStart />
        </ProtectedRoute>
      } />
      <Route path='/symptoms/result' element={
        <ProtectedRoute>
          <SymptomResult />
        </ProtectedRoute>
      } />

      <Route path='/admin/diseases' element={<DiseaseProvider><Outlet /></DiseaseProvider>}>
        <Route index element={<ManageDiseases />} />
        <Route path=':id' element={<DiseaseDetail />} />
        <Route path=':id/edit' element={<DiseaseEdit />} />
      </Route>

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
      
      <Route
        path="/settings" element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}

function App() {
  return (
    <Router>
      <GoogleOAuthProvider clientId="">
        <AppContent />
      </GoogleOAuthProvider>
>>>>>>> 3f32afd5fc9d50e72c45805475ae08402fd674a1
    </Router>
  );
}

export default App;