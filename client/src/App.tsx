/* import { useState, useEffect } from "react"; */
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

import LoginForm from "./components/forms/LoginForm";
import RegisterForm from "./components/forms/RegisterForm";
import HomePage from "./components/HomePage";

function App(){
  return(
    <div>
    <Router>
    <Routes>
       <Route path="/" element={<HomePage />} />
       <Route path="/login" element={<LoginForm />} /> {/* Define the path */}
       <Route path="/register" element={<RegisterForm />} />
    </Routes>
  </Router>
  </div>
  )
  
}

export default App;