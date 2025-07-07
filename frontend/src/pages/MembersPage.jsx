import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import api from '../api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const MembersPage = () => {
  const { user } = useSelector((state) => state.auth);
  const { selectedTeam } = useSelector((state) => state.team);
  const navigate = useNavigate();

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!selectedTeam) return;
    const role = selectedTeam.members?.find((member) => member.userId === user._id)?.role;
    setIsAdmin(role === 'admin');
  }, [selectedTeam, user]);

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

  useEffect(() => {
    if (selectedTeam?._id) fetchMembers();
  }, [selectedTeam]);

  const handleRemove = (memberId) => {
    confirmAlert({
      title: 'Confirm Member Removal',
      message: 'Are you sure you want to remove this member from the team?',
      buttons: [
        {
          label: 'Yes, Remove',
          onClick: () => removeMember(memberId),
          className: 'text-red-600',
        },
        {
          label: 'Cancel',
          onClick: () => { },
        },
      ],
    });
  };

  const removeMember = async (memberId) => {
    try {
      await api.delete(`/teams/${selectedTeam._id}/remove/${memberId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      fetchMembers()
      toast.success('Member removed successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove member');
    }
  };

  return (
    <div className="p-3 pt-16 bg-gray-100 dark:bg-neutral-900 text-gray-800 dark:text-white min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">
          Team Members - {selectedTeam?.teamName}
        </h2>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1 text-sm font-medium text-green-700 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 mb-4 transition"
        >
          <span className="text-lg">←</span>
          <span>Back</span>
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500 dark:text-gray-400 text-sm">Loading members...</p>
      ) : members.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-sm">No members found.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-300 dark:border-gray-700">
          <table className="min-w-full text-sm bg-white dark:bg-neutral-800 text-gray-800 dark:text-white">
            <thead>
              <tr className="bg-gray-100 dark:bg-neutral-700 text-left">
                <th className="p-3 border-b border-gray-300 dark:border-gray-600">Name</th>
                <th className="p-3 border-b border-gray-300 dark:border-gray-600">Email</th>
                <th className="p-3 border-b border-gray-300 dark:border-gray-600">Role</th>
                {isAdmin && (
                  <th className="p-3 border-b border-gray-300 dark:border-gray-600">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {members.map((member) => {
                const userObj = typeof member.userId === 'object' ? member.userId : {};
                return (
                  <tr
                    key={userObj._id || member.userId}
                    className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-neutral-700 transition"
                  >
                    <td className="p-3">{userObj.name || '—'}</td>
                    <td className="p-3">{userObj.email || '—'}</td>
                    <td className="p-3 capitalize">{member.role}</td>
                    {isAdmin && (
                      <td className="p-3">
                        {userObj._id !== user._id && (
                          <button
                            className="text-red-600 dark:text-red-400 hover:underline text-xs"
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
