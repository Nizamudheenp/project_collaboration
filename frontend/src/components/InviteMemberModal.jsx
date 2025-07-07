import React, { useState } from 'react';
import { toast } from 'sonner';
import api from '../api';
import { useSelector } from 'react-redux';

const InviteMemberModal = ({ teamId, onClose, teamName }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const handleInvite = async () => {
    if (!email.trim()) return toast.error("Email is required");
    try {
      setLoading(true);
      await api.post(`/teams/${teamId}/invite`, { email }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      toast.success('Invitation sent');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to invite');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white dark:bg-black p-6 rounded-2xl shadow-xl w-[90%] max-w-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4 text-black dark:text-white">
          Invite Member to <span className="text-green-700">{teamName}</span>
        </h3>
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-black text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 mb-4 focus:outline-none focus:ring-2 focus:ring-green-700"
        />
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-xl border border-gray-300 dark:border-gray-600 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleInvite}
            className="px-4 py-2 text-sm rounded-xl bg-green-700 hover:bg-green-800 text-white transition"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Invite'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InviteMemberModal;
