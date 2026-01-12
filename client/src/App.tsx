import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../src/pages/Auth/Login';
function App() {

  return (
    <Router>
      <Login /> {/* This stays on top of every page */}
      <Routes>
        {/* Add your other routes here */}
      </Routes>
    </Router>
  );
}

export default App