// src/App.js
import React, { useState } from 'react';
import { Route, Routes, Link, useNavigate } from 'react-router-dom';

// Components
import Home from './components/Home';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Tool from './components/Tool';
import Ticket from './components/Ticket';
import Team from './components/Team';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  
  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-lightred">
      <nav className="bg-gray-800 p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-white text-2xl font-bold">
            Ticketing Tool
          </Link>
          <div>
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="text-white hover:bg-gray-700 px-4 py-2 rounded"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-white hover:bg-gray-700 px-4 py-2 rounded"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="text-white hover:bg-gray-700 px-4 py-2 rounded ml-4"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/tool"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Tool />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tool/ticket"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Ticket />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tool/team"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Team />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      <footer className="bg-gray-800 text-white py-4 text-center">
        <p>&copy; {new Date().getFullYear()} Ticketing Tool. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
