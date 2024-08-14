// Tool.js
import React from 'react';
import { FaTicketAlt, FaUsers } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function Tool() {
  const navigate = useNavigate();

  const handleCreateTicket = () => {
    navigate('/tool/ticket');
  };

  const handleCreateTeam = () =>{
    navigate('/tool/team');
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-lightred p-6">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-6">Tool Dashboard</h1>
      <p className="text-lg text-gray-700 mb-10 text-center max-w-2xl">
        Welcome to your tool dashboard! Manage your tickets and teams efficiently.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-lg">
        <div className="bg-indigo-500 rounded-lg shadow-md text-white font-semibold hover:shadow-lg transition duration-300 ease-in-out">
          <button
            onClick={handleCreateTicket}
            className="flex items-center justify-center p-4 w-full h-full hover:bg-indigo-700 transform hover:scale-105 transition duration-300 rounded-lg"
          >
            <FaTicketAlt className="mr-3 text-2xl" />
            Create Ticket
          </button>
        </div>
        <div className="bg-indigo-500 rounded-lg shadow-md text-white font-semibold hover:shadow-lg transition duration-300 ease-in-out">
          <button onClick={handleCreateTeam} className="flex items-center justify-center p-4 w-full h-full hover:bg-indigo-700 transform hover:scale-105 transition duration-300 rounded-lg">
            <FaUsers className="mr-3 text-2xl" />
            Create Team
          </button>
        </div>
      </div>
    </div>
  );
}

export default Tool;
