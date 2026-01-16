import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '../src/components/Layout/Navbar';
import Footer from '../src/components/Layout/Footer';
import HomePage from './pages/HomePage/HomePage';
function App() {

  return (
    <Router>
      <Navbar /> {/* This stays on top of every page */}
      <Routes>
        <Route path='/' element={<HomePage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App