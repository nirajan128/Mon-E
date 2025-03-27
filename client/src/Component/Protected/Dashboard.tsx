import { useState, useEffect } from "react";
import { useAuth } from "../../Context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Logo from "../Shared/Logo";
import "../../App.css";

interface UserData {
  id: number;
  google_id: string;
  firstname: string;
  lastname: string;
  email: string;
}

export default function Dashboard() {
  // ✅ State & Auth
  const API_BASE_URL = "http://localhost:5000"; // Your Express backend URL
  const { token, logout } = useAuth();
  const [user, setUser] = useState<UserData | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // ✅ Fetch user data & handle authentication
  useEffect(() => {
    if (!token) {
      logout();
      navigate("/login"); // Redirect to login if no token
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await axios.get<UserData>(`${API_BASE_URL}/valid/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Auth problem:", error);
        logout();
        navigate("/login"); // Redirect if authentication fails
      }
    };

    fetchUser();
  }, [token, logout, navigate]);

  return (
    <div className="container-fluid">
      {/* Navbar for Small Screens */}
      <nav className="bg-dark text-white p-3 d-md-none w-100">
        <div className="d-flex justify-content-between align-items-center">
          {/* ✅ Logo */}
          <div className="d-flex align-items-center">
           <Logo />
          </div>
          <button className="btn btn-light" onClick={() => setSidebarOpen(!sidebarOpen)}>
            ☰ Menu
          </button>
        </div>
        {sidebarOpen && (
          <ul className="nav flex-column mt-3">
            <li className="nav-item">
              <Link className="nav-link text-white" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/profile">Profile</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/settings">Settings</Link>
            </li>
          </ul>
        )}
      </nav>

      {/* Main Row (Sidebar + Content) */}
      <div className="row">
        {/* Sidebar (Visible Only on Large Screens) */}
        <nav className="col-md-3 col-lg-2 d-none d-md-block bg-dark text-white p-3 vh-100">
          {/* ✅ Logo */}
          <div className="text-center mb-3">
            <Logo />
          </div>
          <ul className="nav flex-column">
            <li className="nav-item">
              <Link className="nav-link text-white" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/profile">Profile</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/settings">Settings</Link>
            </li>
          </ul>
        </nav>

        {/* Main Content Area */}
        <main className="col-md-9 col-lg-10 p-4">
          <h1>Dashboard</h1>
          {user ? (
            <div>
              <h2>Welcome, {user.firstname} {user.lastname}!</h2>
              <p>Email: {user.email}</p>
            </div>
          ) : (
            <p>Loading user data...</p>
          )}

          {/* Logout Button */}
          <button onClick={() => { logout(); navigate("/login"); }} className="btn btn-danger mt-3">
            Logout
          </button>
        </main>
      </div>
    </div>
  );
}
