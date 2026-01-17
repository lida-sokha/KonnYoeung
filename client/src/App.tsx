import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '../src/components/Layout/Navbar';
import Footer from '../src/components/Layout/Footer';
import Login  from './pages/Auth/Login';
import SignUp from './pages/Auth/Signup';
function App() {

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
