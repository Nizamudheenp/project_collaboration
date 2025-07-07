import React, { useState } from 'react';
import api from '../api';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

const CreateProjectModal = ({ onClose, onProjectCreated, teamId }) => {
  const { user } = useSelector((state) => state.auth);
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleCreate = async () => {
    if (!projectName.trim()) {
      setError('Project name is required');
      return;
    }

    try {
      const res = await api.post(
        '/projects',
        { projectName, description, teamId },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      onProjectCreated(res.data);
      toast.success('Project created successfully');
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="w-full max-w-md bg-white dark:bg-neutral-900 text-gray-900 dark:text-white p-6 rounded-2xl shadow-2xl border border-gray-200 dark:border-neutral-700 transition-colors">
        <h2 className="text-xl font-semibold mb-4">Create New Project</h2>

        {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

        <input
          type="text"
          placeholder="Project Name"
          className="w-full px-4 py-2 mb-3 rounded-xl bg-white dark:bg-neutral-800 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-600 transition"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />

        <textarea
          placeholder="Description (optional)"
          className="w-full px-4 py-2 mb-4 rounded-xl bg-white dark:bg-neutral-800 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-600 transition"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-gray-300 dark:bg-neutral-700 text-gray-800 dark:text-white hover:bg-gray-400 dark:hover:bg-neutral-600 text-sm transition"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="px-4 py-1.5 rounded-xl bg-green-700 text-white hover:bg-green-800 text-sm transition"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectModal;
