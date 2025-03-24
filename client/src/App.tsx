import './App.css';
import HomePage from './Component/pages/Homepage';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from './Context/AuthContext';
import Dashboard from './Component/Protected/Dashboard';

function App() {
  return (
    <Router>
    <AuthProvider>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
    </AuthProvider>
  </Router>
  )
}

export default App
