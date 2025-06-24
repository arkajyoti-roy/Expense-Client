import { useNavigate } from "react-router-dom";

const RecentSIXTransactions = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/transactions")}
      className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors duration-200 shadow-md hover:shadow-lg"
    >
      View Last 6 Months Transactions
    </button>
  );
};

export default RecentSIXTransactions;