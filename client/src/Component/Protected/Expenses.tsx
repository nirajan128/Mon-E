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

  // New state for filters
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [monthFilter, setMonthFilter] = useState<string>("All")

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

   // Filter expenses based on selected category and month
   const filteredExpenses = expenses.filter((expense) => {
    const categoryMatch = categoryFilter === "All" || expense.category === categoryFilter;
    const monthMatch = monthFilter === "All" || expense.date.includes(monthFilter);
    return categoryMatch && monthMatch;
  });

  // Get unique categories for the filter dropdown
  const uniqueCategories = Array.from(new Set(expenses.map(expense => expense.category)));
  const uniqueMonths = Array.from(new Set(expenses.map(expense => expense.date.split("-")[1]))); // Extract month from date

  return (
    <>
    <div>
      <h1 className="expenseLabel">EXPENSES</h1>
      <div className="row">
        <div className="col-sm-12 col-md-6">
          <h1 className="totalExp">${totalExpenses}</h1>
        </div>
        <div className="col-sm-12 col-md-6">
          <div className="p-2 d-flex justify-content-center align-items-center flex-wrap">
            {Object.entries(categoryTotals).length > 0 ? (
              Object.entries(categoryTotals).map(([category, total]) => (
                <div
                  key={category}
                  className="category-box m-2 p-3 d-flex justify-content-center align-items-center"
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    backgroundColor: "#f8f9fa",
                    width: "150px",
                    textAlign: "center",
                  }}
                >
                  <div>
                    <strong>{category}</strong>
                    <br />
                    <span>${total}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center">No expenses found</div>
            )}
          </div>
        </div>
      </div>
    </div>

    {/* Filters Section */}
    <div className="filters mt-4">
      <div className="row">
        <div className="col-md-6">
          <select
            className="form-control"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">All Categories</option>
            {uniqueCategories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <select
            className="form-control"
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
          >
            <option value="All">All Months</option>
            {uniqueMonths.map((month, index) => (
              <option key={index} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>

    {/* Expenses Table */}
    <div className="container mt-4">
      <table className="table table-bordered table-striped table-responsive">
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
          {filteredExpenses.length > 0 ? (
            filteredExpenses.map((expense) => (
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
              <td colSpan={5} className="text-center">
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
