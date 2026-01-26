import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from '../src/components/Layout/Navbar';
import Footer from '../src/components/Layout/Footer';
import HomePage from './pages/HomePage/HomePage';
import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/Signup';
import AboutUsPage from './pages/Aboutus/About_us';
import ContactUs from './pages/Contactus/Contact_us'; 
import DashboardPage from './pages/Dashboard/Dashboard';

function AppContent() {
  const location = useLocation();

  const hideLayout = ['/login', '/signup', '/Dashboard'].includes(location.pathname);

  return (
    <>
      {/* Show Navbar only if hideLayout is false */}
      {!hideLayout && <Navbar />} 
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path='/Dashboard' element={<DashboardPage />} />
      </Routes>
      
      {/* Show Footer only if hideLayout is false */}
      {!hideLayout && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;