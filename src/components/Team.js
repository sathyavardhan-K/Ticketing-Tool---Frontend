import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AiOutlineTeam, AiOutlineUsergroupAdd, AiOutlineUser } from 'react-icons/ai';
import ConfirmationModal from './Confirmation Modal';

function Team() {
  const [teamData, setTeamData] = useState({ teamName: '', members: '' });
  const [teams, setTeams] = useState([]);
  const [editingTeam, setEditingTeam] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState(null);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/teams');
      setTeams(response.data);
    } catch (error) {
      console.error('Error fetching teams:', error.response ? error.response.data : error.message);
      setError('Error fetching teams');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTeamData((prevData) => ({
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
      const membersArray = teamData.members
        .split(',')
        .map((member) => member.trim())
        .filter((member) => member.length > 0);

      if (membersArray.length === 0) {
        throw new Error('Members list cannot be empty');
      }

      const data = { teamname: teamData.teamName, members: membersArray };

      if (editingTeam) {
        await axios.put(`http://localhost:5000/api/teams/${editingTeam.id}`, data, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        setEditingTeam(null);
      } else {
        await axios.post('http://localhost:5000/api/teams', data, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }

      fetchTeams();
      setTeamData({ teamName: '', members: '' });
      setShowForm(false);
    } catch (error) {
      console.error('Error submitting team:', error.response ? error.response.data : error.message);
      setError('Error submitting team: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (team) => {
    setTeamData({ teamName: team.teamname, members: team.members.join(', ') });
    setEditingTeam(team);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/teams/${id}`);
      fetchTeams();
      setError('');
    } catch (error) {
      console.error('Error deleting team:', error.response ? error.response.data : error.message);
      setError('Error deleting team');
    }
  };



  const handleConfirmDelete = () => {
    if (teamToDelete) {
      handleDelete(teamToDelete);
      setIsModalOpen(false);
    }
  };

  const openModal = (id) => {
    setTeamToDelete(id);
    setIsModalOpen(true);
  };


  const validateForm = () => {
    if (!teamData.teamName.trim()) {
      setError('Team name is required');
      return false;
    }

    const membersArray = teamData.members
      .split(',')
      .map((member) => member.trim())
      .filter((member) => member.length > 0);

    if (membersArray.length === 0) {
      setError('Members list cannot be empty');
      return false;
    }

    return true;
  };

  const getTeamStatistics = () => {
    const membersInOneTeam = teams.filter(team => team.members.length === 1).length;
    const membersInMultipleTeams = teams.filter(team => team.members.length > 1).length;
    const totalTeams = teams.length;
    return { membersInOneTeam, membersInMultipleTeams, totalTeams };
  };

  const { membersInOneTeam, membersInMultipleTeams, totalTeams } = getTeamStatistics();

  return (
    <div className="flex flex-col items-center min-h-screen bg-red-100 p-6 ml-10 mr-10 rounded-xl">
      <h2 className="text-3xl font-bold mb-6">Team Management</h2>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6 w-full">
        <div className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-4">
          <AiOutlineUser className="text-blue-500 text-3xl" />
          <div>
            <h4 className="text-xl font-semibold text-gray-800">One Member in Team</h4>
            <p className="text-gray-600 text-lg">{membersInOneTeam}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-4">
          <AiOutlineUsergroupAdd className="text-yellow-500 text-3xl" />
          <div>
            <h4 className="text-xl font-semibold text-gray-800">Multiple Member in Team</h4>
            <p className="text-gray-600 text-lg">{membersInMultipleTeams}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-4">
          <AiOutlineTeam className="text-green-500 text-3xl" />
          <div>
            <h4 className="text-xl font-semibold text-gray-800">Total Teams</h4>
            <p className="text-gray-600 text-lg">{totalTeams}</p>
          </div>
        </div>
      </div>

      {/* Create Team Button */}
      <div className="flex w-full justify-end mb-4">
        <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => setShowForm(true)}
        >
            <span className='text-lg font-extrabold mr-2'>+</span>Create a New Team
        </button>
      </div>

      {/* Team Form (Popup) */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-6">{editingTeam ? 'Edit Team' : 'Create a New Team'}</h2>
            <form onSubmit={handleSubmit} className="w-full">
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2" htmlFor="teamName">
                  Team Name
                </label>
                <input
                  type="text"
                  name="teamName"
                  id="teamName"
                  value={teamData.teamName}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2" htmlFor="members">
                  Members (comma separated)
                </label>
                <input
                  type="text"
                  name="members"
                  id="members"
                  value={teamData.members}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              {error && <p className="text-red-500 mb-4">{error}</p>}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => {
                    setShowForm(false);
                    setEditingTeam(null);
                    setTeamData({ teamName: '', members: '' });
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  disabled={loading}
                >
                  {editingTeam ? 'Update Team' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Teams Table */}


      <div className="w-full">
        <h3 className="text-2xl font-bold mb-4">Teams</h3>
        
        {loading ? (
          <p>Loading teams...</p>
        )  : teams.length === 0 ? (
          <p className='text-xl'>No teams available.</p>
        ): (
          <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 text-left font-semibold text-gray-700">Team ID</th>
                <th className="py-2 px-4 text-left font-semibold text-gray-700">Team Name</th>
                <th className="py-2 px-4 text-left font-semibold text-gray-700">Members</th>
                <th className="py-2 px-4 text-left font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team) => (
                <tr key={team.id} className="border-t border-gray-200">
                  <td className="py-2 px-4">{team.id}</td>
                  <td className="py-2 px-4">{team.teamname}</td>
                  <td className="py-2 px-4">{team.members.join(', ')}</td>
                  <td className="py-2 px-4 space-x-2">

                    <div className='flex gap-3'>
                        <button
                          className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
                          onClick={() => handleEdit(team)}
                        >
                          Edit
                        </button>

                        <ConfirmationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={handleConfirmDelete} message="Delete Confirmation"/>

                          <div key={team.id}>
                            {/* Display ticket info */}
                            <button
                              className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-700"
                              onClick={() => openModal(team.id)}
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
    </div>
  );
}

export default Team;
