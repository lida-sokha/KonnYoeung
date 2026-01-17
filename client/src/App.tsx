import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import AboutUsPage from './pages/Aboutus/About_us';

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<AboutUsPage />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
