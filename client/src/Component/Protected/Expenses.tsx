import { useState, useEffect } from "react";
import { useAuth } from "../../Context/AuthContext";
import axios from "axios";
import "../../App.css"

interface Expense {
  id: number;
  date: string;
  category: string;
  description: string;
  amount: number;
  paymentType: string;
}

export default function Expenses() {
  const API_BASE_URL = "http://localhost:5000"; // Your backend URL
  const { token, logout } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [categoryTotals, setCategoryTotals] = useState<{ [key: string]: number }>({});
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
        // Ensure amount is a number
    const formattedExpenses = response.data.map(expense => ({
        ...expense,
        amount: Number(expense.amount), // Convert amount to number
      }));
        setExpenses(formattedExpenses)
        console.log(response.data)
      } catch (error) {
        console.error("Failed to fetch expenses:", error);
        logout(); // Logout if unauthorized
      }
    };

    fetchExpenses();
  }, [token, logout]);

  useEffect(() => {
    const total = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
    setTotalExpenses(total);
  }, [expenses]);

 // Calculate total expenses and category totals
 useEffect(() => {
    // Calculate overall total
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    setTotalExpenses(total);

    // Calculate category-wise totals
    const categoryMap: { [key: string]: number } = {};
    expenses.forEach(({ category, amount }) => {
      categoryMap[category] = (categoryMap[category] || 0) + amount;
    });

    setCategoryTotals(categoryMap);
  }, [expenses]);

  return (
    <>
    <div>
        <h1 className="expenseLabel">EXPENSES</h1>
        <div className="row">
            <div className="col-sm-12 col-md-8">
                
                <h1 className="totalExp">${totalExpenses}</h1>
            </div>
            <div className="col-sm-12 col-md-4">
                <div className="p-2 d-flex justify-content-center align-items-center">
                <ul className="list-style-none">
        {Object.entries(categoryTotals).length > 0 ? (
          Object.entries(categoryTotals).map(([category, total]) => (
            <li key={category}>
              <strong>{category}:</strong> ${total}
            </li>
          ))
        ) : (
          <li className="list-group-item text-center">No expenses found</li>
        )}
      </ul>
                </div>
            </div>
        </div>
    </div>
    <div className="container mt-4">
      <table className="table table-bordered table-striped">
        <thead className="thead-dark">
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Amount ($)</th>
            <th>Description</th>
            <th>Payment Type</th>
  
          </tr>
        </thead>
        <tbody>
          {expenses.length > 0 ? (
            expenses.map((expense) => (
              <tr key={expense.id}>
                <td>{expense.date.toString().split("T")[0]}</td>
                <td>{expense.category}</td>
                <td>{expense.amount}</td>
                <td>{expense.description}</td>
                <td>{expense.paymentType}</td>
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
    </>
  );
}
