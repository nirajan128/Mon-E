import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../Context/AuthContext";
import axios from "axios";
import PostForm from "../Shared/PostForm";
import { DeleteModal } from "../Shared/DeleteModal";
import { EditModal } from "../Shared/EditFormModal";

interface Income {
  id: number;
  date: string;
  source: string;
  income_id: number;
  description: string;
  amount: number;
  tax: number;
  cpp: number;
  ei: number;
}

export default function Income() {
  const API_BASE_URL = "http://localhost:5000";
  const { token, logout } = useAuth();
  const [income, setIncome] = useState<Income[]>([]);
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [totals, setTotals] = useState<{ Tax: number; CPP: number; EI: number }>({ Tax: 0, CPP: 0, EI: 0 });

  const [headerMonthFilter, setHeaderMonthFilter] = useState<string>("All");
  const [tableSourceFilter, setTableSourceFilter] = useState<string>("All");
  const [tableMonthFilter, setTableMonthFilter] = useState<string>("All");

  const [selectedIncome, setSelectedIncome] = useState<Income | null>(null);
  const [dateSortOrder, setDateSortOrder] = useState<"asc" | "desc" | "none">("none");

  const toggleDateSort = () => {
    setDateSortOrder((prev) => {
      if (prev === "none") return "asc";
      if (prev === "asc") return "desc";
      return "none";
    });
  };
  

  const fetchIncome = useCallback(async () => {
    if (!token) {
      logout();
      return;
    }

    try {
      const response = await axios.get<Income[]>(`${API_BASE_URL}/valid/income`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const formattedIncome = response.data.map((inc) => ({
        ...inc,
        amount: Number(inc.amount),
        tax: Number(inc.tax),
        cpp: Number(inc.cpp),
        ei: Number(inc.ei),
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

  useEffect(() => {
    const filteredIncome =
      headerMonthFilter === "All"
        ? income
        : income.filter((inc) => inc.date.includes(`-${headerMonthFilter}-`));

    const total = filteredIncome.reduce((sum, inc) => sum + inc.amount, 0);
    setTotalIncome(total);

    const taxTotal = filteredIncome.reduce((sum, inc) => sum + inc.tax, 0);
    const cppTotal = filteredIncome.reduce((sum, inc) => sum + inc.cpp, 0);
    const eiTotal = filteredIncome.reduce((sum, inc) => sum + inc.ei, 0);

    setTotals({ Tax: taxTotal, CPP: cppTotal, EI: eiTotal });
  }, [income, headerMonthFilter]);

  const filteredTableIncome = income
  .filter((inc) => {
    const sourceMatch = tableSourceFilter === "All" || inc.source === tableSourceFilter;
    const monthMatch = tableMonthFilter === "All" || inc.date.includes(`-${tableMonthFilter}-`);
    return sourceMatch && monthMatch;
  })
  .sort((a, b) => {
    if (dateSortOrder === "asc") {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    } else if (dateSortOrder === "desc") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else {
      return 0;
    }
  });


  const uniqueSource = Array.from(new Set(income.map((inc) => inc.source)));
  const uniqueMonths = Array.from(new Set(income.map((inc) => inc.date.split("-")[1])));
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="mt-3">
      <div>
        <div className="row headerRow align-items-center">
          <div className="col-md-5 text-center">
            <h1 className="totalExp">${totalIncome.toFixed(2)}</h1>
          </div>
          <div className="col-md-5">
            <div className="p-2 d-flex justify-content-center flex-wrap taxes">
              <div className="category-box m-2 p-3"><strong>Tax</strong><br /><span>${totals.Tax.toFixed(2)}</span></div>
              <div className="category-box m-2 p-3"><strong>CPP</strong><br /><span>${totals.CPP.toFixed(2)}</span></div>
              <div className="category-box m-2 p-3"><strong>EI</strong><br /><span>${totals.EI.toFixed(2)}</span></div>
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

      <div className="filters mt-4 d-flex">
        <select className="form-control form-select" value={tableSourceFilter} onChange={(e) => setTableSourceFilter(e.target.value)}>
          <option value="All">All Categories</option>
          {uniqueSource.map((src, index) => (
            <option key={index} value={src}>{src}</option>
          ))}
        </select>
        <select className="form-control form-select mx-3" value={tableMonthFilter} onChange={(e) => setTableMonthFilter(e.target.value)}>
          <option value="All">All Months</option>
          {uniqueMonths.map((month, index) => (
            <option key={index} value={month}>{monthNames[parseInt(month) - 1]}</option>
          ))}
        </select>
        <PostForm
          title="Income"
          columns={["source", "amount", "description", "tax", "cpp", "ei", "date"]}
          onSuccess={fetchIncome}
        />
      </div>

      <div className="container mt-4">
        <table className="table table-bordered table-responsive table-hover table-striped">
          <thead className="thead-dark">
            <tr>
            <th onClick={toggleDateSort} style={{ cursor: "pointer" }}>
  Date {dateSortOrder === "asc" ? "▲" : dateSortOrder === "desc" ? "▼" : ""}
</th>

              <th>Source</th>
              <th>Amount ($)</th>
              <th>Description</th>
              <th>Tax</th>
              <th>CPP</th>
              <th>EI</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredTableIncome.length > 0 ? (
              filteredTableIncome.map((inc) => (
                <tr key={inc.id}>
                  <td>{inc.date.split("T")[0]}</td>
                  <td>{inc.source}</td>
                  <td>{inc.amount}</td>
                  <td>{inc.description}</td>
                  <td>{inc.tax}</td>
                  <td>{inc.cpp}</td>
                  <td>{inc.ei}</td>
                  <td>
                    <button onClick={() => setSelectedIncome(inc)} className="border border-0">
                      <i className="fas fa-pencil mx-2 text-warning" data-bs-toggle="modal" data-bs-target="#editModal"></i>
                    </button>
                    <button onClick={() => setSelectedIncome(inc)} className="border border-0">
                      <i className="fas fa-trash mx-2 text-danger" data-bs-toggle="modal" data-bs-target="#deleteModal"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center">No income entries found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedIncome && (
        <EditModal
          title="Income"
          columns={["date", "source", "amount", "description", "tax", "cpp", "ei"]}
          data={selectedIncome}
          onSuccess={() => {
            fetchIncome();
            setSelectedIncome(null);
             location.reload();
          }}
          incomeExpenseId={selectedIncome.income_id}
        />
      )}

      {selectedIncome && (
        <DeleteModal
          title="Income"
          data={selectedIncome}
          onSuccess={() => {
            fetchIncome();
            setSelectedIncome(null);
            location.reload();
          }}
        />
      )}
    </div>
  );
}
