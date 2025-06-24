import { LogOut } from "lucide-react";

const Header = ({ onLogout }) => {
  return (
    <header className="bg-white shadow-lg border-b border-gray-200 p-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            💰 Expense Tracker
          </h1>
          <p className="text-gray-600 mt-1">Manage your finances with ease</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={onLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;