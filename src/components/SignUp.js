import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SignUp() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password }),
      });

      const result = await response.json();
      if (response.ok) {
        navigate('/login');
      } else {
        setError(result.message || 'Sign-up failed');
      }
    } catch (error) {
      setError('Server error');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-lightred p-6 -mt-10">
      <h1 className="text-3xl font-bold mb-6">Sign Up</h1>
      <form onSubmit={handleSignUp} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
        <div className="mb-4">
          <label className="block text-gray-700 mb-2 font-bold">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded p-2 mt-1"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2 font-bold">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border border-gray-300 rounded p-2 mt-1"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2 font-bold">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded p-2 mt-1"
            required
          />
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button type="submit" className="bg-red-800 text-white py-2 px-4 rounded-lg hover:bg-red-900 transition duration-300">
          Sign Up
        </button>
        
      </form>
    </div>
  );
}

export default SignUp;
