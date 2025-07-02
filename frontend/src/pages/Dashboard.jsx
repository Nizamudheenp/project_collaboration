import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MdOutlineGroupAdd } from 'react-icons/md';
import { FiMoreVertical } from 'react-icons/fi';
import api from '../api';
import { setSelectedTeam } from '../redux/slices/teamSlice';

const Dashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const { selectedTeam } = useSelector((state) => state.team);
    const dispatch = useDispatch();

    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [showModal, setShowModal] = useState(false);
    const [teamName, setTeamName] = useState('');
    const [createError, setCreateError] = useState('');


    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const res = await api.get('/teams', {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setTeams(res.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch teams');
            } finally {
                setLoading(false);
            }
        }
        if (user?.token) fetchTeams();
    }, [user])

    return (
        <div className="h-screen flex">
            {/* left side*/}
            <div className="w-full md:w-1/4 bg-white border-r border-gray-200 flex flex-col">
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
                                className={`p-4 flex justify-between cursor-pointer border hover:bg-blue-50 ${selectedTeam?._id === team._id ? 'bg-blue-100 font-medium' : ''
                                    }`}
                            >
                                {team.teamName}
                                <span>
                                    <FiMoreVertical size={20} />
                                </span>
                            </div>
                        ))
                    )}
                </div>

            </div>

            {/* modal */}

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
                            required
                        />
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400 text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={async () => {
                                    try {
                                        const res = await api.post('/teams',{ teamName },
                                            {
                                                headers: { Authorization: `Bearer ${user.token}` },
                                            }
                                        );
                                        setTeams((prev) => [...prev, res.data]);
                                        setTeamName('');
                                        setCreateError('');
                                        setShowModal(false);
                                    } catch (err) {
                                        setCreateError(err.response?.data?.message || 'Failed to create team');
                                    }
                                }}
                                className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm"
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* right side */}
            <div className="hidden md:flex w-3/4 p-6 flex-col overflow-y-auto">
                {!selectedTeam ? (
                    <p className="text-gray-500">Select a team to view projects</p>
                ) : (
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">
                            Projects for Team: {selectedTeam.teamName}
                        </h2>
                        <div className="text-gray-600">[Projects will go here]</div>
                    </div>
                )}
            </div>
        </div>


    );
};

export default Dashboard;
