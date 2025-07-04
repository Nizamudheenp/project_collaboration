import React, { useState } from 'react';
import api from '../api';
import { useSelector } from 'react-redux';

const CreateProjectModal = ({ onClose, onProjectCreated, teamId }) => {
  const { user } = useSelector((state) => state.auth);
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleCreate = async () => {
    try {
      const res = await api.post(
        '/projects',
        { projectName, description, teamId },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      onProjectCreated(res.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Create New Project</h2>
        {error && <p className="text-sm text-red-500 mb-2">{error}</p>}
        <input
          type="text"
          placeholder="Project Name"
          className="w-full p-2 border rounded mb-3"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />
        <textarea
          placeholder="Description (optional)"
          className="w-full p-2 border rounded mb-4"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectModal;