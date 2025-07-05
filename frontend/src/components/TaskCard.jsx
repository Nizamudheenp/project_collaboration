import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiTrash2 } from 'react-icons/fi';
import api from '../api';
import { setSelectedTask } from '../redux/slices/taskSlice';

const TaskCard = ({ task, onDelete }) => {
  const { user } = useSelector((state) => state.auth);
  const isAssigned = task.assignedTo?._id === user._id;
  const isAdmin = task.createdBy === user._id;
  const dispatch = useDispatch();

  const handleDelete = async () => {
    try {
      await api.delete(`/tasks/${task._id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      onDelete(task._id);
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  return (
    <div onClick={() => dispatch(setSelectedTask(task))} className="p-3 bg-white border rounded shadow space-y-2">
      <div className="flex justify-between items-center">
        <h4 className="font-semibold">{task.title}</h4>
        {isAdmin && (
          <button onClick={handleDelete} className="text-red-500 hover:text-red-700">
            <FiTrash2 />
          </button>
        )}
      </div>
      <p className="text-sm text-gray-600">{task.description}</p>
      <p className="text-xs text-gray-500">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
      <p className="text-xs text-gray-500">Assigned to: {task.assignedTo?.name || 'Unassigned'}</p>
    </div>
  );
};

export default TaskCard;
