import { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // 👈 Proper import here

const BASE_URL = "https://expense-server-neoq.onrender.com";

const SIXTransactionTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLast6Months = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${BASE_URL}/api/transactions/last-six-months`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = response.data;
        const txnList = Array.isArray(data)
          ? data
          : Array.isArray(data.transactions)
          ? data.transactions
          : [];

        setTransactions(txnList);
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setError("Failed to fetch transactions.");
      } finally {
        setLoading(false);
      }
    };

    fetchLast6Months();
  }, []);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Last 6 Months Transactions", 14, 16);
    autoTable(doc, {
      startY: 22,
      head: [["Date", "Description", "Amount", "Type"]],
      body: transactions.map((txn) => [
        new Date(txn.date).toLocaleDateString(),
        txn.description,
        txn.amount.toLocaleString("en-IN", { style: "currency", currency: "INR" }),
        txn.type,
      ]),
    });
    doc.save("last_6_months_transactions.pdf");
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex justify-between items-center mb-6 p-6 bg-gray-50 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Last 6 Months Transactions</h2>
          <button
            onClick={handleDownloadPDF}
            className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors shadow-md"
          >
            Download as PDF
          </button>
        </div>

        {loading ? (
          <p className="text-center py-6 text-gray-500">Loading transactions...</p>
        ) : error ? (
          <p className="text-center py-6 text-red-500">{error}</p>
        ) : transactions.length === 0 ? (
          <p className="text-center py-6 text-gray-500">No transactions found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 border-b-2 border-gray-200">
                  <th className="p-4 text-left font-semibold text-gray-700">Date</th>
                  <th className="p-4 text-left font-semibold text-gray-700">Description</th>
                  <th className="p-4 text-left font-semibold text-gray-700">Amount</th>
                  <th className="p-4 text-left font-semibold text-gray-700">Type</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4 text-gray-800">
                      {new Date(txn.date).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-gray-800">{txn.description}</td>
                    <td className="p-4 text-gray-800 font-medium">
                      {txn.amount.toLocaleString("en-IN", {
                        style: "currency",
                        currency: "INR",
                      })}
                    </td>
                    <td className="p-4 text-gray-800 capitalize">{txn.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SIXTransactionTable;
