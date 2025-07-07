import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import api from '../api';
import { toast } from 'sonner';

const MyInvitations = () => {
  const [invitations, setInvitations] = useState([]);
  const { user } = useSelector((state) => state.auth);

  const fetchInvites = async () => {
    try {
      const res = await api.get(`/invites/my`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setInvitations(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const handleResponse = async (id, action) => {
    try {
      const res = await api.post(
        `/invites/respond/${id}`,
        { action },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      toast.success(res.data.message);

      fetchInvites();

      if (action === 'accept') {
        await api.get('/teams', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to respond to invite');
    }
  };

  useEffect(() => {
    fetchInvites();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Pending Invitations</h2>
      {invitations.length === 0 ? (
        <p>No invitations found.</p>
      ) : (
        <ul className="space-y-3">
          {invitations.map((inv) => (
            <li key={inv._id} className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow">
              <p className="text-sm mb-2">
                You were invited to join <strong>{inv.teamId.teamName}</strong> by{' '}
                <strong>{inv.invitedBy.name}</strong>
              </p>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 bg-green-700 text-white rounded-lg"
                  onClick={() => handleResponse(inv._id, 'accept')}
                >
                  Accept
                </button>
                <button
                  className="px-3 py-1 bg-red-700 text-white rounded-lg"
                  onClick={() => handleResponse(inv._id, 'reject')}
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyInvitations;
