import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./Components/pages/Home";
import Login from "./Components/Login";

function App() {
  const token = localStorage.getItem("token");

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
        {/* Default redirect */}
      </Routes>
    </Router>
  );
}

export default App;
