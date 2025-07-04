import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MdOutlineGroupAdd } from 'react-icons/md';
import { FiMoreVertical } from 'react-icons/fi';
import { Menu } from '@headlessui/react';
import { confirmAlert } from 'react-confirm-alert';
import api from '../api';
import { setSelectedTeam } from '../redux/slices/teamSlice';
import InviteMemberModal from './InviteMemberModal';

const TeamListSidebar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { selectedTeam } = useSelector((state) => state.team);

  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [createError, setCreateError] = useState('');

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedTeamForInvite, setSelectedTeamForInvite] = useState(null);


  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await api.get('/teams', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setTeams(res.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch teams');
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) fetchTeams();
  }, [user]);

  const deleteTeam = async (teamId) => {
    try {
      await api.delete(`/teams/${teamId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setTeams((prev) => prev.filter((team) => team._id !== teamId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete team');
    }
  };

  const handleCreateTeam = async () => {
    try {
      const res = await api.post(
        '/teams',
        { teamName },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setTeams((prev) => [...prev, res.data]);
      setTeamName('');
      setCreateError('');
      setShowModal(false);
    } catch (err) {
      setCreateError(err.response?.data?.message || 'Failed to create team');
    }
  };

  return (
    <div className="h-full bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-xl font-semibold">Teams</h2>
        <button className="text-blue-600 hover:text-blue-800" onClick={() => setShowModal(true)}>
          <MdOutlineGroupAdd size={22} />
        </button>
      </div>

      <div className="overflow-y-auto flex-1">
        {loading ? (
          <p className="p-4 text-sm text-gray-500">Loading teams...</p>
        ) : error ? (
          <p className="p-4 text-sm text-red-500">{error}</p>
        ) : teams.length === 0 ? (
          <p className="p-4 text-sm text-gray-500">No teams yet.</p>
        ) : (
          teams.map((team) => (
            <div
              key={team._id}
              onClick={() => dispatch(setSelectedTeam(team))}
              className={`relative p-4 flex justify-between cursor-pointer border hover:bg-blue-50 ${selectedTeam?._id === team._id ? 'bg-blue-100 font-medium' : ''
                }`}
            >
              {team.teamName}

              {/* modal for three dots */}
              <Menu as="div" className="relative inline-block text-left" onClick={(e) => e.stopPropagation()}>
                <Menu.Button className="p-1 text-gray-600 hover:text-black">
                  <FiMoreVertical />
                </Menu.Button>
                <Menu.Items className="absolute right-0 mt-2 w-32 origin-top-right bg-white border rounded shadow-md z-50">
                  <div className="py-1 px-2 text-sm">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => {
                            setShowInviteModal(true); 
                            setSelectedTeamForInvite(team); 
                          }}
                          className={`block w-full text-left ${active ? 'bg-gray-100' : ''}`}
                        >
                          Invite
                        </button>
                      )}
                    </Menu.Item>

                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => {
                            confirmAlert({
                              title: 'Confirm to delete',
                              message: `Are you sure to delete "${team.teamName}"? This will erase all your team data`,
                              buttons: [
                                {
                                  label: 'Yes',
                                  onClick: () => deleteTeam(team._id),
                                },
                                {
                                  label: 'No',
                                  onClick: () => { },
                                },
                              ],
                            });
                          }}
                          className={`block w-full text-left text-red-600 ${active ? 'bg-gray-100' : ''}`}
                        >
                          Delete
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Menu>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 p-3 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4">Create New Team</h2>
            {createError && <p className="text-sm text-red-500 mb-2">{createError}</p>}
            <input
              type="text"
              placeholder="Team Name"
              className="w-full p-2 border rounded mb-4"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTeam}
                className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {showInviteModal && selectedTeamForInvite && (
        <InviteMemberModal
          teamId={selectedTeamForInvite._id}
          teamName={selectedTeamForInvite.teamName}
          onClose={() => {
            setShowInviteModal(false);
            setSelectedTeamForInvite(null);
          }}
        />
      )}

    </div>
  );
};

export default TeamListSidebar;
