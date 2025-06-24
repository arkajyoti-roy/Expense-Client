import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Header from "./Header.jsx";
import StatCards from "./StatCards";
import ActionsAndModals from "./ActionsAndModals";
import TablesAndOverviews from "./TablesAndOverviews";

const Home = () => {
  const navigate = useNavigate();
  const API_BASE_URL = "https://expense-server-neoq.onrender.com";

  // Consolidated state
  const [data, setData] = useState({
    transactions: [],
    recurringRules: [],
    budget: null,
    budgetStats: { openingBalance: 0, totalCredit: 0, totalDebit: 0, netBalance: 0 }
  });
  
  const [loading, setLoading] = useState(false);
  
  // Loading states for individual operations
  const [operationLoading, setOperationLoading] = useState({
    createTransaction: false,
    updateTransaction: false,
    deleteTransaction: false,
    createRecurring: false,
    updateRecurring: false,
    deleteRecurring: false,
    createBudget: false,
    logout: false
  });
  
  // Modal states - simplified to single object
  const [modals, setModals] = useState({
    addTransaction: false,
    addRecurring: false,
    budgetForm: false,
    editTransaction: false,
    editRecurring: false
  });

  // Editing states
  const [editing, setEditing] = useState({
    transaction: null,
    recurring: null
  });

  // Form states with default values
  const defaultForms = {
    transaction: {
      amount: "",
      description: "",
      date: new Date().toISOString().slice(0, 10),
      type: "debit"
    },
    recurring: {
      amount: "",
      title: "",
      date: new Date().toISOString().slice(0, 10),
      type: "debit",
      frequency: "monthly"
    },
    budget: {
      month: new Date().toISOString().slice(0, 7),
      openingBalance: ""
    }
  };

  const [forms, setForms] = useState(defaultForms);

  // Helper functions
  const makeAPICall = async (endpoint, options = {}) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` })
      },
      ...options
    });
    
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  };

  const updateModal = (modalName, value) => {
    setModals(prev => ({ ...prev, [modalName]: value }));
  };

  const updateForm = (formName, updates) => {
    setForms(prev => ({ ...prev, [formName]: { ...prev[formName], ...updates } }));
  };

  const resetForm = (formName) => {
    setForms(prev => ({ ...prev, [formName]: defaultForms[formName] }));
  };

  const setOperationLoadingState = (operation, isLoading) => {
    setOperationLoading(prev => ({ ...prev, [operation]: isLoading }));
  };

  // API operations
  const fetchData = async () => {
    try {
      setLoading(true);
      const [transactionsRes, recurringRes, budgetRes] = await Promise.allSettled([
        makeAPICall("/api/transactions"),
        makeAPICall("/api/recurring"),
        makeAPICall("/api/budget")
      ]);

      const newData = { ...data };

      // Handle transactions
      if (transactionsRes.status === 'fulfilled') {
        const { transactions = [], openingBalance = 0, totalCredit = 0, totalDebit = 0, netBalance = 0 } = transactionsRes.value;
        newData.transactions = transactions;
        newData.budgetStats = { openingBalance, totalCredit, totalDebit, netBalance };
      }

      // Handle recurring rules
      if (recurringRes.status === 'fulfilled') {
        const response = recurringRes.value;
        newData.recurringRules = Array.isArray(response.recurring) ? response.recurring : 
                                 Array.isArray(response) ? response : [];
      }

      // Handle budget
      if (budgetRes.status === 'fulfilled') {
        newData.budget = budgetRes.value;
      }

      setData(newData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setOperationLoadingState('logout', true);
      await makeAPICall("/api/user/logout", { method: "POST" });
      toast.success("Logged out successfully!");
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Error during logout, but you'll be logged out anyway.");
    } finally {
      setOperationLoadingState('logout', false);
      localStorage.removeItem("token");
      navigate("/login", { replace: true });
    }
  };

  // CRUD operations
  const createTransaction = async () => {
    try {
      setOperationLoadingState('createTransaction', true);
      await makeAPICall("/api/transactions", {
        method: "POST",
        body: JSON.stringify({ ...forms.transaction, amount: parseFloat(forms.transaction.amount) })
      });
      resetForm('transaction');
      updateModal('addTransaction', false);
      await fetchData();
      toast.success("Transaction created successfully!");
    } catch (error) {
      console.error("Error creating transaction:", error);
      toast.error("Failed to create transaction. Please try again.");
    } finally {
      setOperationLoadingState('createTransaction', false);
    }
  };

  const updateTransaction = async () => {
    try {
      setOperationLoadingState('updateTransaction', true);
      await makeAPICall(`/api/transactions/${editing.transaction._id}`, {
        method: "PUT",
        body: JSON.stringify({ ...forms.transaction, amount: parseFloat(forms.transaction.amount) })
      });
      resetForm('transaction');
      updateModal('editTransaction', false);
      setEditing(prev => ({ ...prev, transaction: null }));
      await fetchData();
      toast.success("Transaction updated successfully!");
    } catch (error) {
      console.error("Error updating transaction:", error);
      toast.error("Failed to update transaction. Please try again.");
    } finally {
      setOperationLoadingState('updateTransaction', false);
    }
  };

  const createRecurringRule = async () => {
    try {
      setOperationLoadingState('createRecurring', true);
      const [year, month, dayStr] = forms.recurring.date.split("-");
      const payload = {
        title: forms.recurring.title,
        amount: parseFloat(forms.recurring.amount),
        type: forms.recurring.type,
        frequency: forms.recurring.frequency,
        day: parseInt(dayStr),
        startDate: forms.recurring.date,
        endDate: null
      };

      await makeAPICall("/api/recurring", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      
      resetForm('recurring');
      updateModal('addRecurring', false);
      await fetchData();
      toast.success("Recurring rule created successfully!");
    } catch (error) {
      console.error("Error creating recurring rule:", error);
      toast.error("Failed to create recurring rule. Please try again.");
    } finally {
      setOperationLoadingState('createRecurring', false);
    }
  };

  const updateRecurringRule = async () => {
    try {
      setOperationLoadingState('updateRecurring', true);
      await makeAPICall(`/api/recurring/${editing.recurring._id}`, {
        method: "PUT",
        body: JSON.stringify({ ...forms.recurring, amount: parseFloat(forms.recurring.amount) })
      });
      
      resetForm('recurring');
      updateModal('editRecurring', false);
      setEditing(prev => ({ ...prev, recurring: null }));
      await fetchData();
      toast.success("Recurring rule updated successfully!");
    } catch (error) {
      console.error("Error updating recurring rule:", error);
      toast.error("Failed to update recurring rule. Please try again.");
    } finally {
      setOperationLoadingState('updateRecurring', false);
    }
  };

  const createBudget = async () => {
    try {
      setOperationLoadingState('createBudget', true);
      await makeAPICall("/api/budget", {
        method: "POST",
        body: JSON.stringify({
          month: forms.budget.month,
          openingBalance: parseFloat(forms.budget.openingBalance)
        })
      });
      
      resetForm('budget');
      updateModal('budgetForm', false);
      await fetchData();
      toast.success("Budget created successfully!");
    } catch (error) {
      console.error("Error creating budget:", error);
      toast.error("Failed to create budget. Please try again.");
    } finally {
      setOperationLoadingState('createBudget', false);
    }
  };

  const deleteTransaction = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        setOperationLoadingState('deleteTransaction', true);
        await makeAPICall(`/api/transactions/${id}`, { method: "DELETE" });
        await fetchData();
        toast.success("Transaction deleted successfully!");
      } catch (error) {
        console.error("Error deleting transaction:", error);
        toast.error("Failed to delete transaction. Please try again.");
      } finally {
        setOperationLoadingState('deleteTransaction', false);
      }
    }
  };

  const deleteRecurringRule = async (id) => {
    if (window.confirm("Are you sure you want to delete this recurring rule?")) {
      try {
        setOperationLoadingState('deleteRecurring', true);
        await makeAPICall(`/api/recurring/${id}`, { method: "DELETE" });
        await fetchData();
        toast.success("Recurring rule deleted successfully!");
      } catch (error) {
        console.error("Error deleting recurring rule:", error);
        toast.error("Failed to delete recurring rule. Please try again.");
      } finally {
        setOperationLoadingState('deleteRecurring', false);
      }
    }
  };

  // Edit handlers
  const openEditTransaction = (transaction) => {
    setEditing(prev => ({ ...prev, transaction }));
    updateForm('transaction', {
      amount: transaction.amount.toString(),
      description: transaction.description,
      date: transaction.date,
      type: transaction.type
    });
    updateModal('editTransaction', true);
  };

  const openEditRecurring = (rule) => {
    setEditing(prev => ({ ...prev, recurring: rule }));
    updateForm('recurring', {
      amount: rule.amount.toString(),
      title: rule.title,
      date: rule.date,
      type: rule.type,
      frequency: rule.frequency
    });
    updateModal('editRecurring', true);
  };

  const cancelEdit = () => {
    setModals(prev => ({ ...prev, editTransaction: false, editRecurring: false }));
    setEditing({ transaction: null, recurring: null });
    resetForm('transaction');
    resetForm('recurring');
  };

  useEffect(() => {
    fetchData();
    
    // Set up auto-refresh every 2 seconds
    const intervalId = setInterval(() => {
      fetchData();
    }, 2000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Calculate totals
  const safeTransactions = Array.isArray(data.transactions) ? data.transactions : [];
  const totalIncome = safeTransactions
    .filter(t => t.type === "credit")
    .reduce((sum, t) => sum + (t.amount || 0), 0);
  const totalExpenses = safeTransactions
    .filter(t => t.type === "debit")
    .reduce((sum, t) => sum + (t.amount || 0), 0);
  const balance = data.budgetStats.netBalance || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onLogout={handleLogout} logoutLoading={operationLoading.logout} />

      <div className="max-w-7xl mx-auto p-6">
        <StatCards
          totalIncome={totalIncome}
          totalExpenses={totalExpenses}
          balance={balance}
        />

        <ActionsAndModals
          budget={data.budget}
          showAddTransaction={modals.addTransaction}
          setShowAddTransaction={(value) => updateModal('addTransaction', value)}
          showAddRecurring={modals.addRecurring}
          setShowAddRecurring={(value) => updateModal('addRecurring', value)}
          showBudgetForm={modals.budgetForm}
          setShowBudgetForm={(value) => updateModal('budgetForm', value)}
          showEditTransaction={modals.editTransaction}
          showEditRecurring={modals.editRecurring}
          transactionForm={forms.transaction}
          setTransactionForm={(updates) => updateForm('transaction', updates)}
          recurringForm={forms.recurring}
          setRecurringForm={(updates) => updateForm('recurring', updates)}
          budgetForm={forms.budget}
          setBudgetForm={(updates) => updateForm('budget', updates)}
          createTransaction={createTransaction}
          updateTransaction={updateTransaction}
          createRecurringRule={createRecurringRule}
          updateRecurringRule={updateRecurringRule}
          createBudget={createBudget}
          cancelEdit={cancelEdit}
          // Pass loading states
          loadingStates={operationLoading}
        />

        <TablesAndOverviews
          transactions={data.transactions}
          recurringRules={data.recurringRules}
          budget={data.budget}
          balance={balance}
          openEditTransaction={openEditTransaction}
          deleteTransaction={deleteTransaction}
          openEditRecurring={openEditRecurring}
          deleteRecurringRule={deleteRecurringRule}
          // Pass loading states
          loadingStates={operationLoading}
        />
      </div>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default Home;