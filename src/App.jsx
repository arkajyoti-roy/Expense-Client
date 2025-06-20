import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Components/Home';
import Login from './Components/Login';

function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Protected Route */}
        <Route
          path="/home"
          element={token ? <Home /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;
