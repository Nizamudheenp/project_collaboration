import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MdOutlineGroupAdd } from 'react-icons/md';
import { FiMoreVertical } from 'react-icons/fi';
import { Menu } from '@headlessui/react';
import { confirmAlert } from 'react-confirm-alert';
import api from '../api';
import { setSelectedTeam } from '../redux/slices/teamSlice';
import InviteMemberModal from './InviteMemberModal';
import { toast } from 'sonner';
import MyInvitations from './MyInvitations';

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
  const [showMyInvites, setShowMyInvites] = useState(false);
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
      toast.success('Team deleted successfully');
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
      toast.success('Team created successfully');
    } catch (err) {
      setCreateError(err.response?.data?.message || 'Failed to create team');
    }
  };

  return (
    <div className="h-full bg-white dark:bg-neutral-900 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-colors">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Teams</h2>
        <div className="flex items-center space-x-2">
          <Menu as="div" className="relative inline-block text-left">
            <Menu.Button className="p-1 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white">
              <FiMoreVertical size={18} />
            </Menu.Button>
            <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded shadow-md z-50 text-sm">
              <div className="py-1 px-2">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => setShowModal(true)}
                      className={`block w-full text-left px-2 py-1 rounded ${active ? 'bg-gray-100 dark:bg-neutral-700' : ''
                        }`}
                    >
                    Create Team
                    </button>
                  )}
                </Menu.Item>

                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => setShowMyInvites((prev) => !prev)}
                      className={`block w-full text-left px-2 py-1 rounded ${active ? 'bg-gray-100 dark:bg-neutral-700' : ''
                        }`}
                    >
                    My Invites
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Menu>
        </div>

      </div>

      <div className="overflow-y-auto flex-1">
        {loading ? (
          <p className="p-4 text-sm text-gray-500 dark:text-gray-400">Loading teams...</p>
        ) : error ? (
          <p className="p-4 text-sm text-red-500">{error}</p>
        ) : teams.length === 0 ? (
          <p className="p-4 text-sm text-gray-500 dark:text-gray-400">No teams yet.</p>
        ) : (
          teams.map((team) => (
            <div
              key={team._id}
              onClick={() => dispatch(setSelectedTeam(team))}
              className={`relative p-4 flex justify-between items-center cursor-pointer border-b border-gray-100 dark:border-gray-800 hover:bg-green-50 dark:hover:bg-neutral-800 transition ${selectedTeam?._id === team._id
                ? 'bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-300 font-medium'
                : 'text-gray-800 dark:text-white'
                }`}
            >
              <span className="truncate">{team.teamName}</span>

              <Menu as="div" className="relative inline-block text-left" onClick={(e) => e.stopPropagation()}>
                <Menu.Button className="p-1 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white">
                  <FiMoreVertical />
                </Menu.Button>
                <Menu.Items className="absolute right-0 mt-2 w-32 origin-top-right bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded shadow-md z-50 text-sm">
                  <div className="py-1 px-2">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => {
                            setShowInviteModal(true);
                            setSelectedTeamForInvite(team);
                          }}
                          className={`block w-full text-left px-2 py-1 rounded ${active ? 'bg-gray-100 dark:bg-neutral-700' : ''
                            }`}
                        >
                          Invite
                        </button>
                      )}
                    </Menu.Item>

                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => {
                            confirmAlert({         //remember to style alerts
                              title: 'Confirm to delete',
                              message: `Are you sure to delete "${team.teamName}"? This will erase all your team data`,
                              buttons: [
                                {
                                  label: 'Yes',
                                  onClick: () => deleteTeam(team._id),
                                },
                                { label: 'No' },
                              ],
                            });
                          }}
                          className={`block w-full text-left px-2 py-1 rounded text-red-600 ${active ? 'bg-gray-100 dark:bg-neutral-700' : ''
                            }`}
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
          <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-xl w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Create New Team</h2>
            {createError && <p className="text-sm text-red-500 mb-2">{createError}</p>}
            <input
              type="text"
              placeholder="Team Name"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-neutral-900 text-gray-800 dark:text-white mb-4"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-1 rounded bg-gray-300 dark:bg-neutral-700 text-gray-800 dark:text-white hover:bg-gray-400 dark:hover:bg-neutral-600 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTeam}
                className="px-3 py-1 rounded bg-green-900 hover:bg-green-700 text-white text-sm"
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

      {showMyInvites && (
  <div className="fixed inset-0 p-3 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-xl w-full max-w-md max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">My Invitations</h2>
        <button
          className="text-sm px-2 py-1 rounded bg-gray-200 dark:bg-neutral-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-neutral-600"
          onClick={() => setShowMyInvites(false)}
        >
          ✖
        </button>
      </div>
      <MyInvitations />
    </div>
  </div>
)}


    </div>
  );
};

export default TeamListSidebar;
