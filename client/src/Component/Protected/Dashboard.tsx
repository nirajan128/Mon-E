/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import { useAuth } from "../../Context/AuthContext";
import { Link, useNavigate, Outlet, useLocation } from "react-router-dom";
import axios from "axios";
import Logo from "../Shared/Logo";
import "../../App.css";
import LogoLight from "../Shared/LogoLight";

interface UserData {
  id: number;
  google_id: string;
  firstname: string;
  lastname: string;
  email: string;
}

export default function Dashboard() {
  // ✅ State & Auth
  const API_BASE_URL = "http://localhost:5000";
  const { token, logout } = useAuth();
  const [user, setUser] = useState<UserData | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Fetch user data & handle authentication
  useEffect(() => {
    if (!token) {
      logout();
      navigate("/");
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
        navigate("/");
      }
    };

    fetchUser();
  }, [token, logout, navigate]);

  const now = new Date();
  const dateTime = now.toLocaleString(); 

  return (
    <div className="container-fluid">
      {/* Navbar for Small Screens */}
      <nav className="dashNav text-white p-3 d-md-none w-100">
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <LogoLight />
          </div>
          <button className="btn btn-light" onClick={() => setSidebarOpen(!sidebarOpen)}>
            ☰ Menu
          </button>
        </div>
        {sidebarOpen && (
          <ul className="nav flex-column mt-3">
            <li className="nav-item">
              <Link className="nav-link text-white" to="/dashboard">Dashboard</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/dashboard/expenses">Expenses</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/dashboard/income">Income</Link>
            </li>
          </ul>
        )}
      </nav>

      {/* Main Row (Sidebar + Content) */}
      <div className="row">
        {/* Sidebar (Visible Only on Large Screens) */}
        <nav className="col-md-3 col-lg-2 d-none d-md-block dashNav text-white">
          <div className="text-center mb-3">
            <LogoLight />
          </div>
          <hr />
          <ul className="nav flex-column">
          <li className={`nav-item ${location.pathname === "/dashboard" ? "activeNav" : ""}`}>
              <Link className="nav-link text-white" to="/dashboard">Dashboard</Link>
            </li>
            <li className={`nav-item ${location.pathname === "/dashboard/expenses" ? "activeNav" : ""}`}>
              <Link className="nav-link text-white" to="/dashboard/expenses">Expenses</Link>
            </li>
            <li className={`nav-item ${location.pathname === "/dashboard/income" ? "activeNav" : ""}`}>
              <Link className="nav-link text-white" to="/dashboard/income">Income</Link>
            </li>
          </ul>
        </nav>

        {/* Main Content Area */}
        <main className="col-md-9 col-lg-10 p-4">
          {location.pathname === "/dashboard" ? (
            <>
            <div className="d-flex justify-content-end">
              {user ? (
                <div>
                  <h4>Welcome, {user.firstname}!</h4>
                  <p>{dateTime}</p>
                </div>
              ) : (
                <p>Loading user data...</p>
              )}
            </div>
            
            </>
          ) : (
            <Outlet />
          )}

          {/* Logout Button */}
          <button onClick={() => { logout(); navigate("/"); }} className="btn btn-danger mt-3">
            Logout
          </button>
        </main>
      </div>
    </div>
  );
}
