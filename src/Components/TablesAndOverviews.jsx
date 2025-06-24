import { Edit, Trash2 } from "lucide-react";

const TablesAndOverviews = ({
  transactions,
  recurringRules,
  budget,
  balance,
  openEditTransaction,
  deleteTransaction,
  openEditRecurring,
  deleteRecurringRule,
}) => {
  const safeTransactions = Array.isArray(transactions) ? transactions : [];

  return (
    <>
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
    </>
  );
};

export default TablesAndOverviews;