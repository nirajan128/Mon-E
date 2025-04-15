import { useState, useEffect } from "react";
import { useAuth } from "../../Context/AuthContext";
import { Link, useNavigate, Outlet, useLocation } from "react-router-dom";
import axios from "axios";
import LogoLight from "../Shared/LogoLight";
import "../../App.css";
import IncomeExpenseBarChart from "../Shared/IncomeExpenseBarChart"; // Bar chart component import
import * as d3 from "d3";

interface UserData {
  id: number;
  google_id: string;
  firstname: string;
  lastname: string;
  email: string;
}

interface IncomeExpense {
  amount: number;
  date: string;
}

interface DashboardResponse {
  user: UserData;
  income: IncomeExpense[];
  expenses: IncomeExpense[];
}

interface DataPoint {
  month: string;
  income: number;
  expense: number;
}

export default function Dashboard() {
  const API_BASE_URL = "http://localhost:5000";
  const { token, logout } = useAuth();
  const [user, setUser] = useState<UserData | null>(null);
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [monthlyData, setMonthlyData] = useState<DataPoint[]>([]);
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
        const response = await axios.get<DashboardResponse>(`${API_BASE_URL}/valid/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data.user);

        const totalIncome = response.data.income.reduce((sum, item) => sum + item.amount, 0);
        const totalExpenses = response.data.expenses.reduce((sum, item) => sum + item.amount, 0);

        setTotalIncome(totalIncome);
        setTotalExpenses(totalExpenses);

        // Parse the timestamp and group by month
        const parseMonth = d3.timeFormat("%Y-%m");
        const incomeMap = new Map<string, number>();
        const expenseMap = new Map<string, number>();

        // Map income and expenses to their respective months
        response.data.income.forEach((i) => {
          const month = parseMonth(new Date(i.date));
          incomeMap.set(month, (incomeMap.get(month) || 0) + i.amount);
        });

        response.data.expenses.forEach((e) => {
          const month = parseMonth(new Date(e.date));
          expenseMap.set(month, (expenseMap.get(month) || 0) + e.amount);
        });

        // Combine and sort the months
        const allMonths = Array.from(new Set([...incomeMap.keys(), ...expenseMap.keys()])).sort();

        // Prepare data for the chart
        const merged: DataPoint[] = allMonths.map((month) => ({
          month,
          income: incomeMap.get(month) || 0,
          expense: expenseMap.get(month) || 0,
        }));

        setMonthlyData(merged);

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
      <div className="header container-fluid">
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
      </div>

      {/* Main Content */}
      <main className="p-4 mt-3 container-fluid">
        {location.pathname === "/dashboard" && (
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
        )}

        {/* Total Income and Expenses - Only for Dashboard */}
        {location.pathname === "/dashboard" && (
          <div className="d-flex justify-content-around py-4">
            <div>
              <h3>Total Income</h3>
              <p>${totalIncome}</p>
            </div>
            <div>
              <h3>Total Expenses</h3>
              <p>${totalExpenses}</p>
            </div>
          </div>
        )}

        {/* Income vs Expenses Bar Chart - Only for Dashboard */}
        {location.pathname === "/dashboard" && (
          <div>
            <h3>Income vs Expense (Monthly)</h3>
            <IncomeExpenseBarChart data={monthlyData} /> {/* Bar Chart Component */}
          </div>
        )}

        {/* Render other routes through Outlet */}
        <Outlet />
      </main>
    </div>
  );
}
