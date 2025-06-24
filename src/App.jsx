import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./Components/Home";
import Login from "./Components/Login";
import RecentSIXTransactions from "./Components/RecentSIXTransactions";
import SIXTransactionTable from "./Components/SIXTransactionTable";
import { useState, useEffect } from "react";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const handleStorage = () => {
      setToken(localStorage.getItem("token"));
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Also update token when it changes in the same tab (after login)
  useEffect(() => {
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function (key, value) {
      originalSetItem.apply(this, arguments);
      if (key === "token") {
        setToken(value);
      }
    };
    return () => {
      localStorage.setItem = originalSetItem;
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Navigate to={token ? "/home" : "/login"} replace />}
        />
        {/* Protected Route */}
        <Route
          path="/home"
          element={token ? <Home /> : <Navigate to="/login" replace />}
        />

        <Route path="/login" element={<Login />} />

        <Route path="/transactions/trigger" element={<RecentSIXTransactions />} />
        <Route path="/transactions" element={<SIXTransactionTable />} />
        {/* Default redirect */}
      </Routes>
    </Router>
  );
}

export default App;
