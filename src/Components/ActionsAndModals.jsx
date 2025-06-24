import { Plus, Repeat, Target, X } from "lucide-react";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

const FormField = ({ type, placeholder, value, onChange, className = "", options = null }) => {
  const baseClass = `border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${className}`;
  
  if (type === "select") {
    return (
      <select value={value} onChange={onChange} className={baseClass}>
        {options.map(({ value: optValue, label }) => (
          <option key={optValue} value={optValue}>{label}</option>
        ))}
      </select>
    );
  }
  
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={baseClass}
    />
  );
};

const ActionButton = ({ onClick, icon: Icon, children, className }) => (
  <button
    onClick={onClick}
    className={`px-6 py-3 rounded-lg flex items-center gap-2 shadow-md transition-colors text-white ${className}`}
  >
    <Icon size={20} />
    {children}
  </button>
);

const ModalButtons = ({ onSave, onCancel, saveText, saveClassName }) => (
  <div className="flex gap-3 pt-4">
    <button
      onClick={onSave}
      className={`flex-1 px-4 py-2 rounded-lg transition-colors text-white ${saveClassName}`}
    >
      {saveText}
    </button>
    <button
      onClick={onCancel}
      className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg transition-colors"
    >
      Cancel
    </button>
  </div>
);

const TransactionForm = ({ form, onChange, onSave, onCancel, isEdit = false }) => {
  const typeOptions = [
    { value: "debit", label: "Expense (Debit)" },
    { value: "credit", label: "Income (Credit)" }
  ];

  const handleChange = (field) => (e) => onChange({ ...form, [field]: e.target.value });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField
          type={isEdit ? "number" : "text"}
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange("amount")}
          className="focus:ring-blue-500"
        />
        <FormField
          type="select"
          value={form.type}
          onChange={handleChange("type")}
          className="focus:ring-blue-500"
          options={typeOptions}
        />
      </div>
      
      <FormField
        type="text"
        placeholder="Description"
        value={form.description}
        onChange={handleChange("description")}
        className="w-full focus:ring-blue-500"
      />
      
      <FormField
        type="date"
        value={form.date}
        onChange={handleChange("date")}
        className="w-full focus:ring-blue-500"
      />
      
      <ModalButtons
        onSave={onSave}
        onCancel={onCancel}
        saveText={isEdit ? "Update Transaction" : "Save Transaction"}
        saveClassName={isEdit ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"}
      />
    </div>
  );
};

const RecurringForm = ({ form, onChange, onSave, onCancel, isEdit = false }) => {
  const typeOptions = [
    { value: "debit", label: "Expense (Debit)" },
    { value: "credit", label: "Income (Credit)" }
  ];
  
  const frequencyOptions = [
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" }
  ];

  const handleChange = (field) => (e) => onChange({ ...form, [field]: e.target.value });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange("amount")}
          className="focus:ring-purple-500"
        />
        <FormField
          type="select"
          value={form.type}
          onChange={handleChange("type")}
          className="focus:ring-purple-500"
          options={typeOptions}
        />
      </div>
      
      <FormField
        type="text"
        placeholder={isEdit ? "Description" : "Title"}
        value={isEdit ? form.description : form.title}
        onChange={isEdit ? handleChange("description") : handleChange("title")}
        className="w-full focus:ring-purple-500"
      />
      
      <FormField
        type="date"
        value={form.date}
        onChange={handleChange("date")}
        className="w-full focus:ring-purple-500"
      />
      
      <FormField
        type="select"
        value={form.frequency}
        onChange={handleChange("frequency")}
        className="w-full focus:ring-purple-500"
        options={frequencyOptions}
      />
      
      <ModalButtons
        onSave={onSave}
        onCancel={onCancel}
        saveText={isEdit ? "Update Rule" : "Save Rule"}
        saveClassName="bg-purple-600 hover:bg-purple-700"
      />
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
  const actions = [
    {
      onClick: () => setShowAddTransaction(true),
      icon: Plus,
      text: "Add Transaction",
      className: "bg-blue-600 hover:bg-blue-700"
    },
    {
      onClick: () => setShowAddRecurring(true),
      icon: Repeat,
      text: "Add Recurring Rule",
      className: "bg-purple-600 hover:bg-purple-700"
    },
    {
      onClick: () => setShowBudgetForm(true),
      icon: Target,
      text: budget ? "Update Budget" : "Create Budget",
      className: "bg-green-600 hover:bg-green-700"
    },
    
  ];

  const modals = [
    {
      isOpen: showAddTransaction,
      onClose: () => setShowAddTransaction(false),
      title: "Add New Transaction",
      content: (
        <TransactionForm
          form={transactionForm}
          onChange={setTransactionForm}
          onSave={createTransaction}
          onCancel={() => setShowAddTransaction(false)}
        />
      )
    },
    {
      isOpen: showEditTransaction,
      onClose: cancelEdit,
      title: "Edit Transaction",
      content: (
        <TransactionForm
          form={transactionForm}
          onChange={setTransactionForm}
          onSave={updateTransaction}
          onCancel={cancelEdit}
          isEdit={true}
        />
      )
    },
    {
      isOpen: showAddRecurring,
      onClose: () => setShowAddRecurring(false),
      title: "Add New Recurring Rule",
      content: (
        <RecurringForm
          form={recurringForm}
          onChange={setRecurringForm}
          onSave={createRecurringRule}
          onCancel={() => setShowAddRecurring(false)}
        />
      )
    },
    {
      isOpen: showEditRecurring,
      onClose: cancelEdit,
      title: "Edit Recurring Rule",
      content: (
        <RecurringForm
          form={recurringForm}
          onChange={setRecurringForm}
          onSave={updateRecurringRule}
          onCancel={cancelEdit}
          isEdit={true}
        />
      )
    },
    {
      isOpen: showBudgetForm,
      onClose: () => setShowBudgetForm(false),
      title: budget ? "Update Budget" : "Create New Budget",
      content: (
        <div className="space-y-4">
          <FormField
            type="month"
            value={budgetForm.month}
            onChange={(e) => setBudgetForm({ ...budgetForm, month: e.target.value })}
            className="w-full focus:ring-green-500"
          />
          <FormField
            type="number"
            placeholder="Opening Balance"
            value={budgetForm.openingBalance}
            onChange={(e) => setBudgetForm({ ...budgetForm, openingBalance: e.target.value })}
            className="w-full focus:ring-green-500"
          />
          <ModalButtons
            onSave={createBudget}
            onCancel={() => setShowBudgetForm(false)}
            saveText="Save Budget"
            saveClassName="bg-green-600 hover:bg-green-700"
          />
        </div>
      )
    }
  ];

  return (
    <>
      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4 mb-8">
        {actions.map((action, index) => (
          <ActionButton key={index} {...action}>
            {action.text}
          </ActionButton>
        ))}
      </div>

      {/* Modals */}
      {modals.map((modal, index) => (
        <Modal key={index} {...modal}>
          {modal.content}
        </Modal>
      ))}
    </>
  );
};

export default ActionsAndModals;