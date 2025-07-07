import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import api from '../api';
import { toast } from 'sonner';

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
    if (!title || !dueDate) {
      setError('Title and due date are required.');
      return;
    }

    try {
      const res = await api.post(
        '/tasks',
        { title, description, dueDate, assignedTo, projectId: selectedProject._id },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      onTaskCreated(res.data);
      toast.success('Task created successfully')
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Task creation failed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="w-full max-w-md bg-white dark:bg-black p-6 rounded-2xl shadow-lg text-black dark:text-white">
        <h2 className="text-xl font-semibold mb-4">Create New Task</h2>

        {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 mb-3 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 mb-3 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full px-3 py-2 mb-3 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          className="w-full px-3 py-2 mb-4 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Assign to</option>
          {members.map((member) => (
            <option key={member.userId._id} value={member.userId._id}>
              {member.userId.name}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-sm text-black dark:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="px-4 py-2 rounded bg-green-700 hover:bg-green-800 text-white text-sm"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskModal;
