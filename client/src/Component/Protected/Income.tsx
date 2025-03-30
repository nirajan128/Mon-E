import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../Context/AuthContext";
import axios from "axios";
import PostForm from "../Shared/PostForm";


interface Income {
  id: number;
  date: string;
  source: string;
  description: string;
  amount: number;
  Tax: number;
  CPP: number;
  EI: number;
}

export default function Income() {
  const API_BASE_URL = "http://localhost:5000"; // Your backend URL
  const { token, logout } = useAuth();
  const [income, setIncome] = useState<Income[]>([]);
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [totals, setTotals] = useState<{ Tax: number; CPP: number; EI: number }>({ Tax: 0, CPP: 0, EI: 0 });

  // Filters for header
  const [headerMonthFilter, setHeaderMonthFilter] = useState<string>("All");
  
  // Filters for table
  const [tableSourceFilter, setTableSourceFilter] = useState<string>("All");
  const [tableMonthFilter, setTableMonthFilter] = useState<string>("All");
  
  // Fetch expenses from backend

  // Fetch income data
  const fetchIncome = useCallback(async () => {
    if (!token) {
      logout();
      return;
    }
    try {
     

      const response = await axios.get<Income[]>(`${API_BASE_URL}/valid/income`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const formattedIncome = response.data.map((income) => ({
        ...income,
        amount: Number(income.amount),
        Tax: Number(income.Tax),
        CPP: Number(income.CPP),
        EI: Number(income.EI),
      }));

      setIncome(formattedIncome);
      
    } catch (error) {
      console.error("Failed to fetch income:", error);
      logout();
    }
  }, [token, logout]);

  useEffect(() => {
    fetchIncome();
  }, [fetchIncome]);

    // Calculate total income and source totals (based on header filter)
    useEffect(() => {
      const filteredIncome = headerMonthFilter === "All" ? income : income.filter(income => income.date.includes(`-${headerMonthFilter}-`));
  
      const total = filteredIncome.reduce((sum, income) => sum + income.amount, 0);
      setTotalIncome(total);
  
      const taxTotal = filteredIncome.reduce((sum, income) => sum + income.Tax, 0);
      const cppTotal = filteredIncome.reduce((sum, income) => sum + income.CPP, 0);
      const eiTotal = filteredIncome.reduce((sum, income) => sum + income.EI, 0);
      setTotals({ Tax: taxTotal, CPP: cppTotal, EI: eiTotal });
    }, [income, headerMonthFilter]);
  
    // Filter expenses for table display
    const filteredTableIncome = income.filter((income) => {
      const categoryMatch = tableSourceFilter === "All" || income.source === tableSourceFilter;
      const monthMatch = tableMonthFilter === "All" || income.date.includes(`-${tableMonthFilter}-`);
      return categoryMatch && monthMatch;
    });

    // Extract unique months and categories
  const uniqueSource = Array.from(new Set(income.map(eachIncome => eachIncome.source)));
  const uniqueMonths = Array.from(new Set(income.map(eachIncome => eachIncome.date.split("-")[1])));
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  return (
    <div>
      <div>
        <h1 className="expenseLabel">INCOME</h1>
        <div className="row headerRow align-items-center">
          <div className="col-md-5 text-center">
            <h1 className="totalExp">${totalIncome}</h1>
          </div>
          <div className="col-md-5">
            <div className="p-2 d-flex justify-content-center flex-wrap taxes">
            <div className="category-box m-2 p-3 category-box"><strong>Tax</strong><br /><span>${totals.Tax}</span></div>
            <div className="category-box m-2 p-3 category-box"><strong>CPP</strong><br /><span>${totals.CPP}</span></div>
            <div className="category-box m-2 p-3 category-box"><strong>EI</strong><br /><span>${totals.EI}</span></div>
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
      {/* Table Filters */}
      <div className="filters mt-4 d-flex">
        <select className="form-control form-select" value={tableSourceFilter} onChange={(e) => setTableSourceFilter(e.target.value)}>
          <option value="All">All Categories</option>
          {uniqueSource.map((eachSources, index) => (
            <option key={index} value={eachSources}>{eachSources}</option>
          ))}
        </select>
        <select className="form-control form-select mx-3" value={tableMonthFilter} onChange={(e) => setTableMonthFilter(e.target.value)}>
          <option value="All">All Months</option>
          {uniqueMonths.map((month, index) => (
            <option key={index} value={month}>{monthNames[parseInt(month) - 1]}</option>
          ))}
        </select>
        <PostForm title="Income" columns={["date", "source", "amount", "description", "Tax", "CPP", "EI"]}




  onSuccess={fetchIncome}/>
      </div>
    <div className="container mt-4">
      <table className="table table-bordered  table-responsive table-striped">
        <thead className="thead-dark">
          <tr>
            <th>Date</th>
            <th>Source</th>
            <th>Amount ($)</th>
            <th>Description</th>
            <th>Tax</th>
            <th>CPP</th>
            <th>EI</th>
  
          </tr>
        </thead>
        <tbody>
        {filteredTableIncome.length > 0 ? (
              filteredTableIncome.map((eachIncome) => (
                <tr key={eachIncome.id}>
                  <td>{eachIncome.date.split("T")[0]}</td>
                  <td>{eachIncome.source}</td>
                  <td>{eachIncome.amount}</td>
                  <td>{eachIncome.description}</td>
                  <td>{eachIncome.Tax}</td>
                  <td>{eachIncome.CPP}</td>
                  <td>{eachIncome.EI}</td>
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
  );
}
