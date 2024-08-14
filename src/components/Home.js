// Home.js
import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-lightred p-6">
      <h1 className="text-5xl font-extrabold text-gray-800 mb-6">Welcome to Our Ticketing Tool</h1>
      <p className="text-xl text-gray-700 mb-8 text-center max-w-3xl">
        Our ticketing tool simplifies issue management and enhances team collaboration. Create, track, and resolve tickets effortlessly with our intuitive interface.
      </p>
      <div className="flex space-x-4">
        <Link
          to="/login"
          className="bg-red-700 text-white py-3 px-6 rounded-lg shadow-md hover:bg-red-900 transition duration-300 ease-in-out"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="bg-gray-600 text-white py-3 px-6 rounded-lg shadow-md hover:bg-gray-700 transition duration-300 ease-in-out"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}

export default Home;
