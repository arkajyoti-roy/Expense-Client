import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Components
import Header from "../Header.jsx";
import StatCards from "../StatCards";
import ActionsAndModals from "../ActionsAndModals";
import TablesAndOverviews from "../TablesAndOverviews";

const Home = () => {
  const navigate = useNavigate();
  
  // API base URL
  const API_BASE_URL = "https://expense-server-neoq.onrender.com";

  // Helper function to make API calls with authentication
  const makeAPICall = async (endpoint, options = {}) => {
    const token = localStorage.getItem("token");
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultOptions = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    };

    const mergedOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    };

    const response = await fetch(url, mergedOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  };

  // State
  const [transactions, setTransactions] = useState([]);
  const [recurringRules, setRecurringRules] = useState([]);
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(false);
  const [budgetStats, setBudgetStats] = useState({
    openingBalance: 0,
    totalCredit: 0,
    totalDebit: 0,
    netBalance: 0,
  });

  // Modal states
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [showAddRecurring, setShowAddRecurring] = useState(false);
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [showEditTransaction, setShowEditTransaction] = useState(false);
  const [showEditRecurring, setShowEditRecurring] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [editingRecurring, setEditingRecurring] = useState(null);

  // Form states
  const [transactionForm, setTransactionForm] = useState({
    amount: "",
    description: "",
    date: new Date().toISOString().slice(0, 10),
    type: "debit",
  });

  const [recurringForm, setRecurringForm] = useState({
    amount: "",
    title: "",
    date: new Date().toISOString().slice(0, 10),
    type: "debit",
    frequency: "monthly",
  });

  const [budgetForm, setBudgetForm] = useState({
    month: new Date().toISOString().slice(0, 7),
    openingBalance: "",
  });

  // Logout function
  const handleLogout = async () => {
    try {
      await makeAPICall("/api/user/logout", { method: "POST" });
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      localStorage.removeItem("token");
      navigate("/login", { replace: true });
    }
  };

  // API calls
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await makeAPICall("/api/transactions");

      const {
        transactions = [],
        openingBalance = 0,
        totalCredit = 0,
        totalDebit = 0,
        netBalance = 0,
      } = response;

      setTransactions(transactions);
      setBudgetStats({ openingBalance, totalCredit, totalDebit, netBalance });
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setTransactions([]);
      setBudgetStats({
        openingBalance: 0,
        totalCredit: 0,
        totalDebit: 0,
        netBalance: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRecurringRules = async () => {
    try {
      const response = await makeAPICall("/api/recurring");
      
      const data = Array.isArray(response.recurring)
        ? response.recurring
        : Array.isArray(response)
        ? response
        : [];

      setRecurringRules(data);
    } catch (error) {
      console.error("Error fetching recurring rules:", error);
      setRecurringRules([]);
    }
  };

  const fetchBudget = async () => {
    try {
      const response = await makeAPICall("/api/budget");
      setBudget(response);
    } catch (error) {
      console.error("Error fetching budget:", error);
      setBudget(null);
    }
  };

  const createTransaction = async () => {
    try {
      const payload = {
        ...transactionForm,
        amount: parseFloat(transactionForm.amount),
      };
      
      await makeAPICall("/api/transactions", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      
      setTransactionForm({
        amount: "",
        description: "",
        date: new Date().toISOString().slice(0, 10),
        type: "debit",
      });
      setShowAddTransaction(false);
      fetchTransactions();
    } catch (error) {
      console.error("Error creating transaction:", error);
    }
  };

  const updateTransaction = async () => {
    try {
      const payload = {
        ...transactionForm,
        amount: parseFloat(transactionForm.amount),
      };
      
      await makeAPICall(`/api/transactions/${editingTransaction._id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      setTransactionForm({
        amount: "",
        description: "",
        date: new Date().toISOString().slice(0, 10),
        type: "debit",
      });
      setShowEditTransaction(false);
      setEditingTransaction(null);
      fetchTransactions();
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  const createRecurringRule = async () => {
    try {
      const [year, month, dayStr] = recurringForm.date.split("-");
      const day = parseInt(dayStr);

      const payload = {
        title: recurringForm.title,
        amount: parseFloat(recurringForm.amount),
        type: recurringForm.type,
        frequency: recurringForm.frequency,
        day,
        startDate: recurringForm.date,
        endDate: null,
      };

      await makeAPICall("/api/recurring", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setRecurringForm({
        amount: "",
        title: "",
        date: new Date().toISOString().slice(0, 10),
        type: "debit",
        frequency: "monthly",
      });

      setShowAddRecurring(false);
      fetchRecurringRules();
    } catch (error) {
      console.error("Error creating recurring rule:", error);
    }
  };

  const updateRecurringRule = async () => {
    try {
      const payload = {
        ...recurringForm,
        amount: parseFloat(recurringForm.amount),
      };
      
      await makeAPICall(`/api/recurring/${editingRecurring._id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      setRecurringForm({
        amount: "",
        title: "",
        date: new Date().toISOString().slice(0, 10),
        type: "debit",
        frequency: "monthly",
      });
      setShowEditRecurring(false);
      setEditingRecurring(null);
      fetchRecurringRules();
    } catch (error) {
      console.error("Error updating recurring rule:", error);
    }
  };

  const createBudget = async () => {
    try {
      const payload = {
        month: budgetForm.month,
        openingBalance: parseFloat(budgetForm.openingBalance),
      };
      
      await makeAPICall("/api/budget", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      
      setBudgetForm({
        month: new Date().toISOString().slice(0, 7),
        openingBalance: "",
      });
      setShowBudgetForm(false);
      fetchBudget();
    } catch (error) {
      console.error("Error creating budget:", error);
    }
  };

  const deleteTransaction = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await makeAPICall(`/api/transactions/${id}`, { method: "DELETE" });
        fetchTransactions();
      } catch (error) {
        console.error("Error deleting transaction:", error);
      }
    }
  };

  const deleteRecurringRule = async (id) => {
    if (
      window.confirm("Are you sure you want to delete this recurring rule?")
    ) {
      try {
        await makeAPICall(`/api/recurring/${id}`, { method: "DELETE" });
        fetchRecurringRules();
      } catch (error) {
        console.error("Error deleting recurring rule:", error);
      }
    }
  };

  const openEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setTransactionForm({
      amount: transaction.amount.toString(),
      description: transaction.description,
      date: transaction.date,
      type: transaction.type,
    });
    setShowEditTransaction(true);
  };

  const openEditRecurring = (rule) => {
    setEditingRecurring(rule);
    setRecurringForm({
      amount: rule.amount.toString(),
      title: rule.title,
      date: rule.date,
      type: rule.type,
      frequency: rule.frequency,
    });
    setShowEditRecurring(true);
  };

  const cancelEdit = () => {
    setShowEditTransaction(false);
    setShowEditRecurring(false);
    setEditingTransaction(null);
    setEditingRecurring(null);
    setTransactionForm({
      amount: "",
      description: "",
      date: new Date().toISOString().slice(0, 10),
      type: "debit",
    });
    setRecurringForm({
      amount: "",
      title: "",
      date: new Date().toISOString().slice(0, 10),
      type: "debit",
      frequency: "monthly",
    });
  };

  useEffect(() => {
    fetchTransactions();
    fetchRecurringRules();
    fetchBudget();
  }, []);

  // Calculate totals
  const safeTransactions = Array.isArray(transactions) ? transactions : [];
  const totalIncome = safeTransactions
    .filter((t) => t.type === "credit")
    .reduce((sum, t) => sum + (t.amount || 0), 0);
  const totalExpenses = safeTransactions
    .filter((t) => t.type === "debit")
    .reduce((sum, t) => sum + (t.amount || 0), 0);
  const balance = budgetStats.netBalance || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onLogout={handleLogout} />

      <div className="max-w-7xl mx-auto p-6">
        <StatCards
          totalIncome={totalIncome}
          totalExpenses={totalExpenses}
          balance={balance}
        />

        <ActionsAndModals
          budget={budget}
          showAddTransaction={showAddTransaction}
          setShowAddTransaction={setShowAddTransaction}
          showAddRecurring={showAddRecurring}
          setShowAddRecurring={setShowAddRecurring}
          showBudgetForm={showBudgetForm}
          setShowBudgetForm={setShowBudgetForm}
          showEditTransaction={showEditTransaction}
          showEditRecurring={showEditRecurring}
          transactionForm={transactionForm}
          setTransactionForm={setTransactionForm}
          recurringForm={recurringForm}
          setRecurringForm={setRecurringForm}
          budgetForm={budgetForm}
          setBudgetForm={setBudgetForm}
          createTransaction={createTransaction}
          updateTransaction={updateTransaction}
          createRecurringRule={createRecurringRule}
          updateRecurringRule={updateRecurringRule}
          createBudget={createBudget}
          cancelEdit={cancelEdit}
        />

        <TablesAndOverviews
          transactions={transactions}
          recurringRules={recurringRules}
          budget={budget}
          balance={balance}
          openEditTransaction={openEditTransaction}
          deleteTransaction={deleteTransaction}
          openEditRecurring={openEditRecurring}
          deleteRecurringRule={deleteRecurringRule}
        />
      </div>
    </div>
  );
};

export default Home;