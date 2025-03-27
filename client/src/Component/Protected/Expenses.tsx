import { useState, useEffect } from "react";
import { useAuth } from "../../Context/AuthContext";
import axios from "axios";

interface Expense {
  id: number;
  date: string;
  description: string;
  amount: number;
}

export default function Expenses() {
  const API_BASE_URL = "http://localhost:5000"; // Your backend URL
  const { token, logout } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  
  // Fetch expenses from backend
  useEffect(() => {
    if (!token) {
      logout(); // Ensure user is logged in
      return;
    }

    const fetchExpenses = async () => {
      try {
        const response = await axios.get<Expense[]>(`${API_BASE_URL}/valid/expenses`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setExpenses(response.data);
        console.log(response.data)
      } catch (error) {
        console.error("Failed to fetch expenses:", error);
        logout(); // Logout if unauthorized
      }
    };

    fetchExpenses();
  }, [token, logout]);

  return (
    <div className="container mt-4">
      <h2>Expenses</h2>
      <table className="table table-bordered table-striped">
        <thead className="thead-dark">
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Amount ($)</th>
          </tr>
        </thead>
        <tbody>
          {expenses.length > 0 ? (
            expenses.map((expense) => (
              <tr key={expense.id}>
                <td>{expense.date}</td>
                <td>{expense.description}</td>
                <td>{expense.amount}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="text-center">
                No expenses found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
