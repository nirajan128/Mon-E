import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../Context/AuthContext";
import axios from "axios";
import PostForm from "../Shared/PostForm";
import "../../App.css"
import { EditModal } from "../Shared/EditFormModal";
import { DeleteModal } from "../Shared/DeleteModal";
import { printElementAsPDF } from "../../utils/PrintUtils";

interface Expense {
  id: number;
  date: string;
  expense_id:number;
  category: string;
  description: string;
  amount: number;
  payment_type: string;
  transaction_type: 'Debit' | 'Credit';
}

export default function Expenses() {
  const API_BASE_URL = "http://localhost:5000"; // Your backend URL
  const { token, logout } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [categoryTotals, setCategoryTotals] = useState<{ [key: string]: number }>({});
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [totalCredit, setTotalCredit] = useState<number>(0);
const [totalDebit, setTotalDebit] = useState<number>(0);
const [totalCash, setTotalCash] = useState<number>(0);
const [dateSortOrder, setDateSortOrder] = useState<"asc" | "desc" | "none">("none");


  // Filters for header
  const [headerMonthFilter, setHeaderMonthFilter] = useState<string>("All");
  
  // Filters for table
  const [tableCategoryFilter, setTableCategoryFilter] = useState<string>("All");
  const [tableMonthFilter, setTableMonthFilter] = useState<string>("All");

  // Fetch expenses from backend
  // Fetch income data
  const fetchExpenses = useCallback(async () => {
    if (!token) {
      logout();
      return;
    }
    try {
      const response = await axios.get<Expense[]>(`${API_BASE_URL}/valid/expenses`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const formattedExpenses = response.data.map(expense => ({
        ...expense,
        amount: Number(expense.amount),
      }));
      setExpenses(formattedExpenses);
    } catch (error) {
      console.error("Failed to fetch income:", error);
      logout();
    }
  }, [token, logout]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  // Calculate total expenses and category totals (based on header filter)
  useEffect(() => {
    const filteredExpenses =
      headerMonthFilter === "All"
        ? expenses
        : expenses.filter((expense) => expense.date.includes(`-${headerMonthFilter}-`));
  
    const total = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    setTotalExpenses(total);
  
    const categoryMap: { [key: string]: number } = {};
    let debitTotal = 0;
    let creditTotal = 0;
    let cashTotal = 0
  
    filteredExpenses.forEach(({ category, amount, payment_type }) => {
      categoryMap[category] = (categoryMap[category] || 0) + amount;
  
      if (payment_type.toLowerCase() === "debit") {
        debitTotal += amount;
      } else if (payment_type.toLowerCase() === "credit") {
        creditTotal += amount;
      }else if (payment_type.toLowerCase() === "cash"){
        cashTotal += amount;
      }
    });
  
    setCategoryTotals(categoryMap);
    setTotalDebit(debitTotal);
    setTotalCredit(creditTotal);
    setTotalCash(cashTotal);
  }, [expenses, headerMonthFilter]);
  
  // Filter expenses for table display
  const filteredTableExpenses = expenses
  .filter((expense) => {
    const categoryMatch = tableCategoryFilter === "All" || expense.category === tableCategoryFilter;
    const monthMatch = tableMonthFilter === "All" || expense.date.includes(`-${tableMonthFilter}-`);
    return categoryMatch && monthMatch;
  })
  .sort((a, b) => {
    if (dateSortOrder === "asc") {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    } else if (dateSortOrder === "desc") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else {
      return 0; // no sort
    }
  });

  const toggleDateSort = () => {
    setDateSortOrder(prev => {
      if (prev === "none") return "asc";
      if (prev === "asc") return "desc";
      return "none";
    });
  };


  // Extract unique months and categories
  const uniqueCategories = Array.from(new Set(expenses.map(expense => expense.category)));
  const uniqueMonths = Array.from(new Set(expenses.map(expense => expense.date.split("-")[1])));
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <div id="full-page">
       <div className="print-buttons text-end my-3">
      <button className="btn btn-outline-primary mx-1" onClick={() => printElementAsPDF("header-section", "header.pdf")}>
        Print Header
      </button>
      <button className="btn btn-outline-secondary mx-1" onClick={() => printElementAsPDF("table-section", "expenses-table.pdf")}>
        Print Table
      </button>
      <button className="btn btn-outline-success mx-1" onClick={() => printElementAsPDF("full-page", "full-page.pdf")}>
        Print Full Page
      </button>
    </div>
      <div className="mt-3" id="header-section">
        <div className="row headerRow align-items-center">
          <div className="col-md-5 text-center">
            <h1 className="totalExp">${totalExpenses.toFixed(2)}</h1>
            <div className="text-center fw-bold">
            <p className="mb-1 text-muted">Debit Total: ${totalDebit.toFixed(2)}</p>
<p className="mb-1 text-muted">Credit Total: ${totalCredit.toFixed(2)}</p>
<p className="mb-1 text-muted">Cash Total: ${totalCash.toFixed(2)}</p>

            </div>
          </div>
          <div className="col-md-5">
            <div className="p-2 d-flex justify-content-center flex-wrap">
              {Object.entries(categoryTotals).map(([category, total]) => (
                <div key={category} className="category-box m-2 p-3">
                  <strong>{category}</strong><br />
                  <span>${total.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="col-md-2 text-center">
            <select className="form-control form-select" value={headerMonthFilter} onChange={(e) => setHeaderMonthFilter(e.target.value)}>
              <option value="All">All Months</option>
              {uniqueMonths.map((month, index) => (
                <option key={index} value={month}>{monthNames[parseInt(month) - 1]}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <hr />

<div id="table-section">
   {/* Table Filters */}
   <div className="filters mt-4 d-flex">
        <select className="form-control form-select" value={tableCategoryFilter} onChange={(e) => setTableCategoryFilter(e.target.value)}>
          <option value="All">All Categories</option>
          {uniqueCategories.map((category, index) => (
            <option key={index} value={category}>{category}</option>
          ))}
        </select>
        <select className="form-control form-select mx-3" value={tableMonthFilter} onChange={(e) => setTableMonthFilter(e.target.value)}>
          <option value="All">All Months</option>
          {uniqueMonths.map((month, index) => (
            <option key={index} value={month}>{monthNames[parseInt(month) - 1]}</option>
          ))}
        </select>
        <PostForm   title="Expenses" columns={
    expenses.length > 0
      ? Object.keys(expenses[0]).filter(
          (key) => !["expense_id", "id"].includes(key)
        )
      : ["date", "category", "amount", "description", "payment_type"]
  }
  onSuccess={fetchExpenses}/>
      </div>

      {/* Expenses Table */}
      <div className="container mt-4">
        <table className="table table-bordered table-responsive table-hover table-striped">
          <thead className="thead-dark">
            <tr>
            <th onClick={() => toggleDateSort()} style={{ cursor: "pointer" }}>
  Date {dateSortOrder === "asc" ? "▲" : dateSortOrder === "desc" ? "▼" : ""}
</th>
              <th>Category</th>
              <th>Amount ($)</th>
              <th>Description</th>
              <th>Payment Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTableExpenses.length > 0 ? (
              filteredTableExpenses.map((expense) => (
                <tr key={expense.id}>
                  <td>{expense.date.split("T")[0]}</td>
                  <td>{expense.category}</td>
                  <td>{expense.amount}</td>
                  <td>{expense.description}</td>
                  <td>{expense.payment_type}</td>
                  <td>
                    <button onClick={() => setSelectedExpense(expense)} className="border border-0">
                    <i 
                      className="fas fa-pencil mx-2 text-warning" 
                      data-bs-toggle="modal" 
                      data-bs-target="#editModal"
                    ></i>
                    </button>
                  
                  <button onClick={() => setSelectedExpense(expense)} className="border border-0">
                  <i 
                      className="fas fa-trash mx-2 text-danger" 
                      data-bs-toggle="modal" 
                      data-bs-target="#deleteModal"
                    ></i>
                  </button>
                    
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center">No expenses found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
</div>
     


      {/* Edit Modal */}
      {selectedExpense && (
        <EditModal
          title="Expenses"
          columns={["date", "category", "amount", "description", "paymentType"]}
          data={selectedExpense}
          onSuccess={() => {
            fetchExpenses();
            setSelectedExpense(null);
            location.reload();
          }}
          incomeExpenseId={selectedExpense.expense_id}
        />
      )}

      {/* Delete Modal */}
      {selectedExpense && (
        <DeleteModal
          title="Expenses"
          data={selectedExpense}
          onSuccess={() => {
            fetchExpenses();
            setSelectedExpense(null);
            location.reload();
          }}
        />
      )}

    </div>
  );
}
