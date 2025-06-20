import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Edit,
  Calendar,
  DollarSign,
  TrendingUp,
  Repeat,
  Target,
  X,
  LogOut,
} from "lucide-react";
import axios from "axios";
import BASE_URL from "./url";
const API_BASE = `${BASE_URL}`;

const Home = () => {
  // Get token from localStorage
  const getToken = () => localStorage.getItem("token");

  // Create axios instance with default config
  const apiClient = axios.create({
    baseURL: API_BASE,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Add interceptor to include token in every request
  apiClient.interceptors.request.use(
    (config) => {
      const token = getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Add response interceptor for error handling
  apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        console.log("Unauthorized - token may be expired");
        handleLogout();
      }
      return Promise.reject(error);
    }
  );

  const [transactions, setTransactions] = useState([]);
  const [recurringRules, setRecurringRules] = useState([]);
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [showAddRecurring, setShowAddRecurring] = useState(false);
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [showEditTransaction, setShowEditTransaction] = useState(false);
  const [showEditRecurring, setShowEditRecurring] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [editingRecurring, setEditingRecurring] = useState(null);
  const [budgetStats, setBudgetStats] = useState({
    openingBalance: 0,
    totalCredit: 0,
    totalDebit: 0,
    netBalance: 0,
  });

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
      await apiClient.post("/api/user/logout");
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      // Clear token regardless of API call success
      localStorage.removeItem("token");
      // Redirect to login page or refresh
      window.location.reload();
    }
  };

  // API calls
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/api/transactions");

      const {
        transactions = [],
        openingBalance = 0,
        totalCredit = 0,
        totalDebit = 0,
        netBalance = 0,
      } = response.data;

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
      const response = await apiClient.get("/api/recurring");
      // If API returns { recurring: [...] }, extract properly
      const data = Array.isArray(response.data.recurring)
        ? response.data.recurring
        : Array.isArray(response.data)
        ? response.data
        : [];

      setRecurringRules(data);
    } catch (error) {
      console.error("Error fetching recurring rules:", error);
      setRecurringRules([]);
    }
  };

  const fetchBudget = async () => {
    try {
      const response = await apiClient.get("/api/budget");
      setBudget(response.data);
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
      await apiClient.post("/api/transactions", payload);
      setTransactionForm({
        amount: "",
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
      await apiClient.put(`/api/transactions/${editingTransaction._id}`, payload);

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
    // Extract day from the date field (format: YYYY-MM-DD)
    const [year, month, dayStr] = recurringForm.date.split("-");
    const day = parseInt(dayStr);

    const payload = {
      title: recurringForm.title, // make sure your form uses `title`
      amount: parseFloat(recurringForm.amount),
      type: recurringForm.type,
      frequency: recurringForm.frequency,
      day,
      startDate: recurringForm.date,
      endDate: null // you can customize this if needed
    };

    await apiClient.post("/api/recurring", payload);

    // Reset the form
    setRecurringForm({
      amount: "",
      title: "",
      date: new Date().toISOString().slice(0, 10),
      type: "debit",
      frequency: "monthly"
    });

    setShowAddRecurring(false);
    fetchRecurringRules();
  } catch (error) {
    console.error(
      "Error creating recurring rule:",
      error.response?.data || error.message
    );
  }
};




  const updateRecurringRule = async () => {
    try {
      const payload = {
        ...recurringForm,
        amount: parseFloat(recurringForm.amount),
      };
      await apiClient.put(`/api/recurring/${editingRecurring._id}`, payload);

      setRecurringForm({
        amount: "",
        description: "",
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
      await apiClient.post("/api/budget", payload);
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
        await apiClient.delete(`/api/transactions/${id}`);
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
        await apiClient.delete(`/api/recurring/${id}`);
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
      description: rule.description,
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
      description: "",
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

  // Calculate totals - ensure transactions is always an array
  const safeTransactions = Array.isArray(transactions) ? transactions : [];
  const totalIncome = safeTransactions
    .filter((t) => t.type === "credit")
    .reduce((sum, t) => sum + (t.amount || 0), 0);
  const totalExpenses = safeTransactions
    .filter((t) => t.type === "debit")
    .reduce((sum, t) => sum + (t.amount || 0), 0);
  // const balance = totalIncome - totalExpenses;
  const balance = budgetStats.netBalance || 0;

  const StatCard = ({ icon: Icon, title, value, color = "blue" }) => (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <p
            className={`text-2xl font-bold ${
              color === "green"
                ? "text-green-600"
                : color === "red"
                ? "text-red-600"
                : "text-blue-600"
            }`}
          >
            ₹{Math.abs(value).toLocaleString()}
          </p>
        </div>
        <Icon
          className={`${
            color === "green"
              ? "text-green-500"
              : color === "red"
              ? "text-red-500"
              : "text-blue-500"
          }`}
          size={32}
        />
      </div>
    </div>
  );

  const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
          <div className="flex justify-between items-center p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>
          <div className="p-6">{children}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              💰 Expense Tracker
            </h1>
            <p className="text-gray-600 mt-1">Manage your finances with ease</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={TrendingUp}
            title="Total Income"
            value={totalIncome}
            color="green"
          />
          <StatCard
            icon={DollarSign}
            title="Total Expenses"
            value={totalExpenses}
            color="red"
          />
          <StatCard
            icon={Target}
            title="Current Balance"
            value={balance}
            color={balance >= 0 ? "green" : "red"}
          />
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => setShowAddTransaction(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 shadow-md transition-colors"
          >
            <Plus size={20} />
            Add Transaction
          </button>
          <button
            onClick={() => setShowAddRecurring(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 shadow-md transition-colors"
          >
            <Repeat size={20} />
            Add Recurring Rule
          </button>
          <button
            onClick={() => setShowBudgetForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 shadow-md transition-colors"
          >
            <Target size={20} />
            {budget ? "Update Budget" : "Create Budget"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Transactions */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                Recent Transactions
              </h3>
            </div>

            <div className="p-6">
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {safeTransactions.slice(0, 10).map((transaction, index) => (
                  <div
                    key={transaction._id || index}
                    className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {transaction.description}
                      </p>
                      <p className="text-sm text-gray-500">
                        {transaction.date}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`font-bold ${
                          transaction.type === "credit"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {transaction.type === "credit" ? "+" : "-"}₹
                        {(transaction.amount || 0).toLocaleString()}
                      </span>

                      <div className="flex gap-1">
                        <button
                          onClick={() => openEditTransaction(transaction)}
                          className="text-blue-500 hover:text-blue-700 p-1"
                          title="Edit transaction"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => deleteTransaction(transaction._id)}
                          className="text-red-500 hover:text-red-700 p-1"
                          title="Delete transaction"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {safeTransactions.length === 0 && (
                  <p className="text-gray-500 text-center py-8">
                    No transactions yet. Add your first transaction!
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Recurring Rules & Budget */}
          <div className="space-y-8">
            {/* Budget Overview */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">
                  Budget Overview
                </h3>
              </div>
              <div className="p-6">
                {budget ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Month</span>
                      <span className="font-medium text-gray-900">
                        {budget.month}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Opening Balance</span>
                      <span className="font-medium text-blue-600">
                        ₹{(budget.openingBalance || 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Current Balance</span>
                      <span
                        className={`font-bold ${
                          balance >= 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        ₹{balance.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No budget set. Create your first budget!
                  </p>
                )}
              </div>
            </div>

            {/* Recurring Rules */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">
                  Recurring Rules
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {Array.isArray(recurringRules) &&
                  recurringRules.length > 0 ? (
                    recurringRules.map((rule, index) => (
                      <div
                        key={rule._id || index}
                        className="p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-900">
                            {rule.description || rule.title}
                          </h4>
                          <div className="flex gap-1">
                            <button
                              onClick={() => openEditRecurring(rule)}
                              className="text-blue-500 hover:text-blue-700 p-1"
                              title="Edit recurring rule"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => deleteRecurringRule(rule._id)}
                              className="text-red-500 hover:text-red-700 p-1"
                              title="Delete recurring rule"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          {new Date(
                            rule.startDate || rule.date
                          ).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                          })}
                        </p>
                        <div className="flex justify-between items-center">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              rule.type === "credit"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {rule.frequency?.charAt(0).toUpperCase() +
                              rule.frequency?.slice(1)}
                          </span>
                          <span className="font-bold text-gray-900">
                            ₹{(rule.amount || 0).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-8">
                      No recurring rules set up yet.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* All Transactions Table */}
        <div className="mt-8 bg-white rounded-lg shadow-md border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">
              All Transactions
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-900">
                    Description
                  </th>
                  <th className="text-left p-4 font-medium text-gray-900">
                    Date
                  </th>
                  <th className="text-left p-4 font-medium text-gray-900">
                    Type
                  </th>
                  <th className="text-left p-4 font-medium text-gray-900">
                    Amount
                  </th>
                  <th className="text-left p-4 font-medium text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {safeTransactions.map((transaction, index) => (
                  <tr
                    key={transaction._id || index}
                    className="hover:bg-gray-50"
                  >
                    <td className="p-4 text-gray-900">
                      {transaction.description}
                    </td>
                    <td className="p-4 text-gray-600">{transaction.date}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          transaction.type === "credit"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {transaction.type === "credit" ? "Income" : "Expense"}
                      </span>
                    </td>
                    <td className="p-4 font-mono font-medium text-gray-900">
                      ₹{(transaction.amount || 0).toLocaleString()}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditTransaction(transaction)}
                          className="text-blue-500 hover:text-blue-700 p-1"
                          title="Edit transaction"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => deleteTransaction(transaction._id)}
                          className="text-red-500 hover:text-red-700 p-1"
                          title="Delete transaction"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {safeTransactions.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No transactions found. Add your first transaction above.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={showAddTransaction}
        onClose={() => setShowAddTransaction(false)}
        title="Add New Transaction"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="amount"
              placeholder="Amount"
              value={transactionForm.amount}
              onChange={(e) =>
                setTransactionForm({
                  ...transactionForm,
                  amount: e.target.value,
                })
              }
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              name="type"
              value={transactionForm.type}
              onChange={(e) =>
                setTransactionForm({ ...transactionForm, type: e.target.value })
              }
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="debit">Expense (Debit)</option>
              <option value="credit">Income (Credit)</option>
            </select>
          </div>

          <input
            type="text"
            name="description"
            placeholder="Description"
            value={transactionForm.description}
            onChange={(e) =>
              setTransactionForm({
                ...transactionForm,
                description: e.target.value,
              })
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="date"
            name="date"
            value={transactionForm.date}
            onChange={(e) =>
              setTransactionForm({ ...transactionForm, date: e.target.value })
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="flex gap-3 pt-4">
            <button
              onClick={createTransaction}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Save Transaction
            </button>
            <button
              onClick={() => setShowAddTransaction(false)}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showEditTransaction}
        onClose={cancelEdit}
        title="Edit Transaction"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="Amount"
              value={transactionForm.amount}
              onChange={(e) =>
                setTransactionForm({
                  ...transactionForm,
                  amount: e.target.value,
                })
              }
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={transactionForm.type}
              onChange={(e) =>
                setTransactionForm({ ...transactionForm, type: e.target.value })
              }
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="debit">Expense (Debit)</option>
              <option value="credit">Income (Credit)</option>
            </select>
          </div>
          <input
            type="text"
            placeholder="Description"
            value={transactionForm.description}
            onChange={(e) =>
              setTransactionForm({
                ...transactionForm,
                description: e.target.value,
              })
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="date"
            value={transactionForm.date}
            onChange={(e) =>
              setTransactionForm({ ...transactionForm, date: e.target.value })
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex gap-3 pt-4">
            <button
              onClick={updateTransaction}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Update Transaction
            </button>
            <button
              onClick={cancelEdit}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showAddRecurring}
        onClose={() => setShowAddRecurring(false)}
        title="Add New Recurring Rule"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="Amount"
              value={recurringForm.amount}
              onChange={(e) =>
                setRecurringForm({ ...recurringForm, amount: e.target.value })
              }
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <input
            type="text"
            placeholder="Title"
            value={recurringForm.title}
            onChange={(e) =>
              setRecurringForm({
                ...recurringForm,
                title: e.target.value,
              })
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="date"
            value={recurringForm.date}
            onChange={(e) =>
              setRecurringForm({ ...recurringForm, date: e.target.value })
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <select
            value={recurringForm.frequency}
            onChange={(e) =>
              setRecurringForm({ ...recurringForm, frequency: e.target.value })
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
          <div className="flex gap-3 pt-4">
            <button
              onClick={createRecurringRule}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Save Rule
            </button>
            <button
              onClick={() => setShowAddRecurring(false)}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showEditRecurring}
        onClose={cancelEdit}
        title="Edit Recurring Rule"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="Amount"
              value={recurringForm.amount}
              onChange={(e) =>
                setRecurringForm({ ...recurringForm, amount: e.target.value })
              }
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <select
              value={recurringForm.type}
              onChange={(e) =>
                setRecurringForm({ ...recurringForm, type: e.target.value })
              }
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="debit">Expense (Debit)</option>
              <option value="credit">Income (Credit)</option>
            </select>
          </div>
          <input
            type="text"
            placeholder="Description"
            value={recurringForm.description}
            onChange={(e) =>
              setRecurringForm({
                ...recurringForm,
                description: e.target.value,
              })
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="date"
            value={recurringForm.date}
            onChange={(e) =>
              setRecurringForm({ ...recurringForm, date: e.target.value })
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <select
            value={recurringForm.frequency}
            onChange={(e) =>
              setRecurringForm({ ...recurringForm, frequency: e.target.value })
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
          <div className="flex gap-3 pt-4">
            <button
              onClick={updateRecurringRule}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Update Rule
            </button>
            <button
              onClick={cancelEdit}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showBudgetForm}
        onClose={() => setShowBudgetForm(false)}
        title={budget ? "Update Budget" : "Create New Budget"}
      >
        <div className="space-y-4">
          <input
            type="month"
            value={budgetForm.month}
            onChange={(e) =>
              setBudgetForm({ ...budgetForm, month: e.target.value })
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="number"
            placeholder="Opening Balance"
            value={budgetForm.openingBalance}
            onChange={(e) =>
              setBudgetForm({ ...budgetForm, openingBalance: e.target.value })
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <div className="flex gap-3 pt-4">
            <button
              onClick={createBudget}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Save Budget
            </button>
            <button
              onClick={() => setShowBudgetForm(false)}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Home;
