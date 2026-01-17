import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '../src/components/Layout/Navbar';
import Footer from '../src/components/Layout/Footer';
import HomePage from './pages/HomePage/HomePage';
import Login  from './pages/Auth/Login';
import SignUp from './pages/Auth/Signup';
import AboutUsPage from './pages/Aboutus/About_us';
import ContactUs from './pages/Contactus/Contact_us'; // Don't forget your new page!

function App() {
  return (
    <Router>
      {/* Navbar stays OUTSIDE Routes so it shows on every page */}
      <Navbar /> 
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>

      {/* Footer stays OUTSIDE Routes so it shows on every page */}
      <Footer />
    </Router>
  );
}

export default App;