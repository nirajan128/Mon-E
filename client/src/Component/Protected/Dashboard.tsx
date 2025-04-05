/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import { useAuth } from "../../Context/AuthContext";
import { Link, useNavigate, Outlet, useLocation } from "react-router-dom";
import axios from "axios";
import LogoLight from "../Shared/LogoLight";
import "../../App.css";

interface UserData {
  id: number;
  google_id: string;
  firstname: string;
  lastname: string;
  email: string;
}

export default function Dashboard() {
  const API_BASE_URL = "http://localhost:5000";
  const { token, logout } = useAuth();
  const [user, setUser] = useState<UserData | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

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
      {/* Centered Logo */}
      <div className="text-center py-3 logo-container">
        <LogoLight />
      </div>

      {/* Nav Links Centered Below Logo */}
      <nav className="dashNav text-white py-2">
        <div className="d-flex justify-content-center gap-4 flex-wrap">
          <Link
            className={`nav-link nav-item ${location.pathname === "/dashboard" ? "activeNav" : ""}`}
            to="/dashboard"
          >
            Dashboard
          </Link>
          <Link
            className={`nav-link nav-item  ${location.pathname === "/dashboard/expenses" ? "activeNav" : ""}`}
            to="/dashboard/expenses"
          >
            Expenses
          </Link>
          <Link
            className={`nav-link nav-item  ${location.pathname === "/dashboard/income" ? "activeNav" : ""}`}
            to="/dashboard/income"
          >
            Income
          </Link>
          <button onClick={() => { logout(); navigate("/"); }} className="btn btn-danger">
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-4 mt-3">
        {location.pathname === "/dashboard" ? (
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
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  );
}
