import React, { useState } from 'react';
import { toast } from 'sonner';
import api from '../api';
import { useSelector } from 'react-redux';

const InviteMemberModal = ({ teamId, onClose,teamName}) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.auth); 

  const handleInvite = async () => {
    if (!email.trim()) return toast.error("Email is required");
    try {
      setLoading(true);
      await api.post(`/teams/${teamId}/invite`, { email },
        {
          headers: {Authorization:`Bearer ${user.token}`}
        }
      );
      toast.success('Invitation sent');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to invite');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-5 rounded shadow-md w-[90%] max-w-sm">
        <h3 className="text-lg font-semibold mb-3">Invite Member to {teamName}</h3>
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1 text-sm rounded border"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleInvite}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
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
