import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaRegCircle, FaRegClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'; // React Icons
import ConfirmationModal from './Confirmation Modal';

function Ticket() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    teamName: '',
    status: 'open',
    assignee: '',
    reporter: '',
  });

  const [teams, setTeams] = useState([]);
  const [tickets, setTickets] = useState([]); // To hold tickets
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingTicket, setEditingTicket] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State for pop-up visibility

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState(null);
  

  useEffect(() => {
    fetchTeams();
    fetchTickets(); // Fetch tickets on component mount
  }, []);

  const fetchTeams = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:5000/api/teams');
      setTeams(response.data);
    } catch (error) {
      console.error('Error fetching teams:', error);
      setError('Error fetching teams');
    } finally {
      setLoading(false);
    }
  };

  const fetchTickets = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:5000/api/tickets');
      setTickets(response.data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      setError('Error fetching tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError(null);
    try {
      const data = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        team: formData.teamName.trim(),
        status: formData.status.trim().toLowerCase(),
        assignee: formData.assignee.trim(),
        reporter: formData.reporter.trim(),
      };

      if (editingTicket) {
        await axios.put(`http://localhost:5000/api/tickets/${editingTicket.id}`, data, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        setEditingTicket(null);
      } else {
        await axios.post('http://localhost:5000/api/tickets', data, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }

      // Reset form data
      setFormData({
        title: '',
        description: '',
        teamName: '',
        status: 'open',
        assignee: '',
        reporter: '',
      });

      // Close pop-up after submit
      setIsPopupOpen(false);

      // Option 1: Refresh the page
      // window.location.reload();

      // Option 2: Re-fetch tickets data
      fetchTickets();
    } catch (error) {
      console.error('Error submitting ticket:', error.response ? error.response.data : error.message);
      setError('Error submitting ticket: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (ticket) => {
    setFormData({
      title: ticket.title,
      description: ticket.description,
      teamName: ticket.team,
      status: ticket.status,
      assignee: ticket.assignee,
      reporter: ticket.reporter,
    });
    setEditingTicket(ticket);
    setIsPopupOpen(true); // Open pop-up for editing
  };


  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tickets/${id}`);
      fetchTickets();
      setError('');
    } catch (error) {
      console.error('Error deleting ticket:', error.response ? error.response.data : error.message);
      setError('Error deleting ticket');
    }
  };

  const handleConfirmDelete = () => {
    if (ticketToDelete) {
      handleDelete(ticketToDelete);
      setIsModalOpen(false);
    }
  };

  const openModal = (id) => {
    setTicketToDelete(id);
    setIsModalOpen(true);
  };

  const validateForm = () => {
    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.teamName.trim() ||
      !formData.status.trim() ||
      !formData.assignee.trim() ||
      !formData.reporter.trim()
    ) {
      setError('All fields are required');
      return false;
    }

    const validStatuses = ['open', 'in-progress', 'resolved', 'closed'];
    if (!validStatuses.includes(formData.status.trim().toLowerCase())) {
      setError('Invalid status value');
      return false;
    }

    return true;
  };

  const openPopup = () => {
    setFormData({
      title: '',
      description: '',
      teamName: '',
      status: 'open',
      assignee: '',
      reporter: '',
    });
    setEditingTicket(null);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setError(null); // Clear any errors when closing
  };

  // Summary data
  const summary = tickets.reduce(
    (acc, ticket) => {
      acc[ticket.status] = (acc[ticket.status] || 0) + 1;
      return acc;
    },
    { open: 0, 'in-progress': 0, resolved: 0, closed: 0 }
  );

  return (
    <div className="flex flex-col items-center min-h-screen bg-red-100 p-6 ml-10 mr-10 rounded-xl">
  

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-4 w-full">
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
          <FaRegCircle className="text-blue-500 text-3xl mr-2" />
          <div>
            <h3 className="text-lg font-bold">Open</h3>
            <p className="text-xl">{summary.open}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
          <FaRegClock className="text-yellow-500 text-3xl mr-2" />
          <div>
            <h3 className="text-lg font-bold">In Progress</h3>
            <p className="text-xl">{summary['in-progress']}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
          <FaCheckCircle className="text-green-500 text-3xl mr-2" />
          <div>
            <h3 className="text-lg font-bold">Resolved</h3>
            <p className="text-xl">{summary.resolved}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
          <FaTimesCircle className="text-red-500 text-3xl mr-2" />
          <div>
            <h3 className="text-lg font-bold">Closed</h3>
            <p className="text-xl">{summary.closed}</p>
          </div>
        </div>
      </div>

      {/* Button to open the popup */}
      <div className="flex w-full justify-end mb-4">
        <button
          onClick={openPopup}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          <span className='text-lg font-extrabold mr-2'>+</span> Create a New Ticket
        </button>
      </div>

      {/* Pop-up form for creating/editing tickets */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2" htmlFor="title">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2" htmlFor="description">
                  Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2" htmlFor="teamName">
                  Team Name
                </label>
                <select
                  name="teamName"
                  id="teamName"
                  value={formData.teamName}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                >
                  <option value="">Select a team</option>
                  {loading ? (
                    <option>Loading teams...</option>
                  ) : error ? (
                    <option>Error loading teams</option>
                  ) : (
                    teams.map((team) => (
                      <option key={team.id} value={team.teamname}>
                        {team.teamname}
                      </option>
                    ))
                  )}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2" htmlFor="status">
                  Status
                </label>
                <select
                  name="status"
                  id="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                >
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2" htmlFor="assignee">
                  Assignee
                </label>
                <input
                  type="text"
                  name="assignee"
                  id="assignee"
                  value={formData.assignee}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2" htmlFor="reporter">
                  Reporter
                </label>
                <input
                  type="text"
                  name="reporter"
                  id="reporter"
                  value={formData.reporter}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              {error && <p className="text-red-500 mb-4">{error}</p>}
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  {editingTicket ? 'Update Ticket' : 'Create Ticket'}
                </button>
                <button
                  type="button"
                  onClick={closePopup}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Ticket List */}
      <h2 className="text-2xl font-bold mb-4 w-full">Existing Tickets</h2>
      {loading ? (
        <p>Loading tickets...</p>
      ) : error ? (
        <p>Error loading tickets: {error}</p>
      ) : (
        <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-lg">
          <thead className='bg-gray-100'>
            <tr>
              <th className="px-4 py-2 text-left font-semibold text-gray-700">Ticket ID</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700">Title</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700">Description</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700">Team</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700">Status</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700">Assignee</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700">Reporter</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id} className="border-t border-gray-200">
                <td className="border px-4 py-2">{ticket.id}</td>
                <td className="border px-4 py-2">{ticket.title}</td>
                <td className="border px-4 py-2">{ticket.description}</td>
                <td className="border px-4 py-2">{ticket.team}</td>
                <td
                    className={`border px-4 py-2 ${
                      ticket.status === 'open'
                        ? 'text-blue-500 font-bold'
                        : ticket.status === 'in-progress'
                        ? 'text-yellow-500 font-bold'
                        : ticket.status === 'resolved'
                        ? 'text-green-500 font-bold'
                        : ticket.status === 'closed'
                        ? 'text-red-500 font-bold'
                        : ''
                    }`}
                  >
                    {ticket.status}
                </td>
                <td className="border px-4 py-2">{ticket.assignee}</td>
                <td className="border px-4 py-2">{ticket.reporter}</td>
                <td className="border px-4 py-2">
                  <div className='flex'>
                  <button
                    onClick={() => handleEdit(ticket)}
                    className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2 mb-2"
                  >
                    Edit
                  </button>

                  
                  <ConfirmationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={handleConfirmDelete} message="Delete Confirmation"/>

                      <div key={ticket.id} className="ticket-item">
                        {/* Display ticket info */}
                        <button
                          className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-700"
                          onClick={() => openModal(ticket.id)}
                        >
                          Delete
                        </button>
                      </div>
                  
                    </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Ticket;
