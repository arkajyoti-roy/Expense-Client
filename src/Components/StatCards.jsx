// import React from "react";
import { TrendingUp, DollarSign, Target } from "lucide-react";

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

const StatCards = ({ totalIncome, totalExpenses, balance }) => {
  return (
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
  );
};

export default StatCards;