import { useState, useEffect } from "react";
import { useAuth } from "../../Context/AuthContext";
import axios from "axios";

interface Income {
  id: number;
  date: string;
  source: string;
  description: string;
  amount: number;
}

export default function Income() {
  const API_BASE_URL = "http://localhost:5000"; // Your backend URL
  const { token, logout } = useAuth();
  const [income, setIncome] = useState<Income[]>([]);
  
  // Fetch expenses from backend
  useEffect(() => {
    if (!token) {
      logout(); // Ensure user is logged in
      return;
    }

    const fetchIncome = async () => {
      try {
        const response = await axios.get<Income[]>(`${API_BASE_URL}/valid/income`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIncome(response.data);
        console.log(response.data)
      } catch (error) {
        console.error("Failed to fetch expenses:", error);
        logout(); // Logout if unauthorized
      }
    };

    fetchIncome();
  }, [token, logout]);

  return (
    <div className="container mt-4">
      <h2>Expenses</h2>
      <table className="table table-bordered table-striped">
        <thead className="thead-dark">
          <tr>
            <th>Date</th>
            <th>Source</th>
            <th>Amount ($)</th>
            <th>Description</th>
  
          </tr>
        </thead>
        <tbody>
          {income.length > 0 ? (
            income.map((income) => (
              <tr key={income.id}>
                <td>{income.date.toString().split("T")[0]}</td>
                <td>{income.source}</td>
                <td>{income.amount}</td>
                <td>{income.description}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="text-center">
                No income found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
