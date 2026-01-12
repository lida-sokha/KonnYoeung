import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '../src/components/Layout/Navbar';
import Footer from '../src/components/Layout/Footer';
function App() {

  return (
    <Router>
      <Navbar /> {/* This stays on top of every page */}
      <Routes>
        {/* Add your other routes here */}
      </Routes>
      <Footer />
    </Router>
  );
}

export default App
