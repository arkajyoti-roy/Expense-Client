import React from "react";
import { Plus, Repeat, Target, X } from "lucide-react";

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

const ActionsAndModals = ({
  budget,
  showAddTransaction,
  setShowAddTransaction,
  showAddRecurring,
  setShowAddRecurring,
  showBudgetForm,
  setShowBudgetForm,
  showEditTransaction,
  showEditRecurring,
  transactionForm,
  setTransactionForm,
  recurringForm,
  setRecurringForm,
  budgetForm,
  setBudgetForm,
  createTransaction,
  updateTransaction,
  createRecurringRule,
  updateRecurringRule,
  createBudget,
  cancelEdit,
}) => {
  return (
    <>
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

      {/* Add Transaction Modal */}
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

      {/* Edit Transaction Modal */}
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

      {/* Add Recurring Modal */}
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

      {/* Edit Recurring Modal */}
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

      {/* Budget Modal */}
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
    </>
  );
};

export default ActionsAndModals;