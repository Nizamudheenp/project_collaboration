import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import api from '../api';
import { setSelectedTask } from '../redux/slices/taskSlice';
import { Menu } from '@headlessui/react';
import { FiMoreVertical, FiTrash2, FiActivity, FiMessageCircle } from 'react-icons/fi';
import { toast } from 'sonner';


const TaskCard = ({ task, onDelete, onShowActivity }) => {
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
      toast.success('Task deleted');
    } catch (err) {
      console.error('Failed to delete task:', err);
      toast.error('Failed to delete task');
    }
  };

  return (
    <div className=" group p-4 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md space-y-2 text-black dark:text-white transition relative">
      <div
        className="absolute top-1 left-1/2 -translate-x-1/2 
               bg-black text-white text-xs px-2 py-1 rounded shadow 
               opacity-0 group-hover:opacity-100 
               transition-opacity delay-1000 duration-300 z-50"
      >
        Drag and drop to update status
      </div>
      <div className="flex justify-between items-start">
        <h4 className="font-semibold text-base pr-6">{task.title}</h4>

        {isAdmin && (
          <Menu as="div" className="relative">
            <Menu.Button className="p-1 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white">
              <FiMoreVertical size={18} />
            </Menu.Button>

            <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded shadow-md z-50">
              <div className="py-1 text-sm">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleDelete}
                      className={`flex items-center gap-2 w-full text-left px-3 py-2 ${active ? 'bg-gray-100 dark:bg-neutral-700' : ''
                        }`}
                    >
                      <FiTrash2 className="text-red-500" /> Delete
                    </button>
                  )}
                </Menu.Item>

                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => onShowActivity(task)}
                      className={`flex items-center gap-2 w-full text-left px-3 py-2 ${active ? 'bg-gray-100 dark:bg-neutral-700' : ''
                        }`}
                    >
                      <FiActivity /> Activity
                    </button>
                  )}
                </Menu.Item>

                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => dispatch(setSelectedTask(task))}
                      className={`flex items-center gap-2 w-full text-left px-3 py-2 ${active ? 'bg-gray-100 dark:bg-neutral-700' : ''
                        }`}
                    >
                      <FiMessageCircle /> Comments
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Menu>
        )}
      </div>

      <p className="text-sm text-gray-700 dark:text-gray-300">{task.description}</p>

      <p className="text-xs text-gray-500 dark:text-gray-400">
        Due: {new Date(task.dueDate).toLocaleDateString()}
      </p>

      <p className="text-xs text-gray-500 dark:text-gray-400">
        Assigned to:{' '}
        <span className="text-green-700 dark:text-green-400">
          {task.assignedTo?.name || 'Unassigned'}
        </span>
      </p>
    </div>
  );

};

export default TaskCard;
