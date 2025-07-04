import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import api from '../api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const MembersPage = () => {
    const { user } = useSelector((state) => state.auth);
    const { selectedTeam } = useSelector((state) => state.team);
    const navigate = useNavigate();

    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        if (!selectedTeam) return;
        const role = selectedTeam.members?.find(m => m.userId === user._id)?.role;
        setIsAdmin(role === 'admin');
    }, [selectedTeam, user]);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                setLoading(true);
                const res = await api.get(`/teams/${selectedTeam._id}`, {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                setMembers(res.data.members || []);
            } catch (err) {
                toast.error(err.response?.data?.message || 'Failed to load members');
            } finally {
                setLoading(false);
            }
        };

        if (selectedTeam?._id) fetchMembers();
    }, [selectedTeam]);

    const handleRemove = async (memberId) => {
        if (!window.confirm('Are you sure you want to remove this member?')) return;

        try {
            await api.delete(`/teams/${selectedTeam._id}/remove/${memberId}`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            setMembers((prev) => prev.filter((m) => m.userId !== memberId));
            toast.success('Member removed successfully');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to remove member');
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Team Members - {selectedTeam?.teamName}</h2>
                <button
                    className="text-sm text-blue-600"
                    onClick={() => navigate(-1)}
                >
                    ← Back
                </button>
            </div>

            {loading ? (
                <p className="text-gray-500 text-sm">Loading members...</p>
            ) : members.length === 0 ? (
                <p className="text-gray-500 text-sm">No members found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm border">
                        <thead>
                            <tr className="bg-gray-100 text-left">
                                <th className="p-2 border">Name</th>
                                <th className="p-2 border">Email</th>
                                <th className="p-2 border">Role</th>
                                {isAdmin && <th className="p-2 border">Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {members.map((member) => {
                                const userObj = typeof member.userId === 'object' ? member.userId : {};

                                return (
                                    <tr key={userObj._id || member.userId} className="border-t">
                                        <td className="p-2">{userObj.name || '—'}</td>
                                        <td className="p-2">{userObj.email || '—'}</td>
                                        <td className="p-2 capitalize">{member.role}</td>
                                        {isAdmin && (
                                            <td className="p-2">
                                                {userObj._id !== user._id && (
                                                    <button
                                                        className="text-red-600 hover:underline text-xs"
                                                        onClick={() => handleRemove(userObj._id)}
                                                    >
                                                        Remove
                                                    </button>
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                );
                            })}

                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MembersPage;
