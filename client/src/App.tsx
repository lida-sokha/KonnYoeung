import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '../src/components/Layout/Navbar';
import Footer from '../src/components/Layout/Footer';
import AboutUsPage from './pages/Aboutus/About_us';
function App() {
  return (
    <Router>
      <SignUp /> This stays on top of every page
      <Routes>
        <Route path="/" element={<AboutUsPage />} />
      </Routes>

      
    </Router>
  );
}

export default App;
