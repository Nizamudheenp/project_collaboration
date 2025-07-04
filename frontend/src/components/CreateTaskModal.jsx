import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import api from '../api';

const CreateTaskModal = ({ onClose, onTaskCreated }) => {
  const { user } = useSelector((state) => state.auth);
  const { selectedProject } = useSelector((state) => state.project);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [members, setMembers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const res = await api.get(`/teams/${selectedProject.teamId}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setMembers(res.data.members || []);
      } catch (err) {
        console.error('Failed to fetch members');
      }
    };
    fetchTeamMembers();
  }, [selectedProject]);

  const handleCreate = async () => {
    try {
      const res = await api.post(
        '/tasks',
        { title, description, dueDate, assignedTo, projectId: selectedProject._id },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      onTaskCreated(res.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Task creation failed');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Create Task</h2>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 mb-3 rounded"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 mb-3 rounded"
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full border p-2 mb-3 rounded"
        />
        <select
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          className="w-full border p-2 mb-4 rounded"
        >
          <option value="">Select Member</option>
          {members.map((member) => (
            <option key={member.userId._id} value={member.userId._id}>
              {member.userId.name}
            </option>
          ))}
        </select>
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
            Cancel
          </button>
          <button onClick={handleCreate} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskModal;
