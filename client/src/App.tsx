import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '../src/components/Layout/Navbar';
import Footer from '../src/components/Layout/Footer';
import ContactUsPage from './pages/Contactus/Contact_us';

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<ContactUsPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
