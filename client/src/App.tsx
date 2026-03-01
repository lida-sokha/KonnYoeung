import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/Signup';
import AboutUsPage from './pages/Aboutus/About_us';
import ContactUs from './pages/Contactus/Contact_us';
import DashboardPage from './pages/Dashboard/Dashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Verify from './pages/Auth/Otpverify';
import ArticleDetail from './pages/Article/ArticleDetail';
import ArticlePage from './pages/Article/Articles';
import MainLayout from './components/Layout/MainLayout';
import Hospital from './pages/Hospitals/Hospitals';
import HospitalDetail from './pages/Hospitals/HospitalDetail';
import CheckSymptoms from './pages/Symptoms/CheckSymptoms';
import SymptomStart from './pages/Symptoms/SymptomStart';
import SymptomResult from './pages/Symptoms/SymptomResult';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { DiseaseProvider } from './contexts/DiseaseContext';
import Settings from './pages/Settingpage/Setting';

//admin 
import AdminRoute from './components/auth/AdminRoute'; 
import AdminDashboard from './pages/Admin/AdminDashboard/AdminDashboard';
import CreateArticle from './pages/Admin/Create_article';
import DiseaseDetail from './pages/Admin/DiseaseDetail';
import DiseaseEdit from './pages/Admin/DiseaseEdit';
import ManageDiseases from './pages/Admin/ManageDiseases';
import ManageUsers from './pages/Admin/ManageUser';

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
      
      {/* admin route */}
      <Route 
          path='/admin/dashboard' 
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } 
      />
      {/* Admin Dashboard */}
      <Route 
        path='/admin/dashboard' 
        element={<AdminRoute><AdminDashboard /></AdminRoute>} 
      />

      <Route
        path='/admin/all-users'
        element={
          <AdminRoute>
            <ManageUsers />
        </AdminRoute>
      }
      />
      
      {/* Disease Management Group */}
      <Route 
        path='/admin/diseases' 
        element={
          <AdminRoute>
            <DiseaseProvider>
              <Outlet />
            </DiseaseProvider>
          </AdminRoute>
        }
      >
        <Route index element={<ManageDiseases />} />
        <Route path=':id' element={<DiseaseDetail />} />
        <Route path=':id/edit' element={<DiseaseEdit />} />
      </Route>

      {/* Create Article - Move it HERE */}
      <Route 
        path='/admin/createArticle' 
        element={
          <AdminRoute>
            <CreateArticle />
          </AdminRoute>
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
    </Router>
  );
}

export default App;