import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '../src/components/Layout/Navbar';
import Footer from '../src/components/Layout/Footer';
<<<<<<< HEAD
import AboutUsPage from './pages/Aboutus/About_us';
function App() {
  return (
    <Router>
=======
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
    </Router>
  );
}

export default App;