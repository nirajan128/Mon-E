/* import { useState, useEffect } from "react"; */
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
       <Route path="/login" element={<LoginForm />} />
       <Route path="/register" element={<RegisterForm />} />
    </Routes>
  </Router>
  </div>
  )
  
}

export default App;