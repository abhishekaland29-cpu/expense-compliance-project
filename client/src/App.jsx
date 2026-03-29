import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard'; 
import EmployeeDashboard from './pages/EmployeeDashboard';

function App() {
  // This helper component checks the current user role every time the route is accessed
  const DashboardSelector = () => {
    const userData = localStorage.getItem('user');
    
    if (!userData) {
      return <Navigate to="/login" />;
    }

    const user = JSON.parse(userData);

    // Switch between Admin and Employee dashboards based on the REAL-TIME role
    if (user.role === 'Admin') {
      return <Dashboard />;
    } else {
      return <EmployeeDashboard />;
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-[#020617]">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Use the Selector component here */}
          <Route path="/dashboard" element={<DashboardSelector />} />
          
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;