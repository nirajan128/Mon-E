import './App.css';
import HomePage from './Component/pages/Homepage';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from './Context/AuthContext';
import Dashboard from './Component/Protected/Dashboard';
import Expenses from './Component/Protected/Expenses';
import Income from './Component/Protected/Income';

function App() {
  return (
    <Router>
    <AuthProvider>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/dashboard" element={<Dashboard />}> 
          <Route path="expenses" element={<Expenses />} />
          <Route path="income" element={<Income />} />
      </Route>
      
    </Routes>
    </AuthProvider>
  </Router>
  )
}

export default App
