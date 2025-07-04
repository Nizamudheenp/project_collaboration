import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useDispatch, useSelector } from 'react-redux';
import api from '../api';
import { toast } from 'sonner';
import TaskCard from './TaskCard';
import CreateTaskModal from './CreateTaskModal';

const statusOrder = ['todo', 'inprogress', 'done'];
const statusLabels = {
  todo: 'To Do',
  inprogress: 'In Progress',
  done: 'Done',
};

const TaskBoard = () => {
  const { user } = useSelector((state) => state.auth);
  const { selectedProject } = useSelector((state) => state.project);
  const [tasksByStatus, setTasksByStatus] = useState({ todo: [], inprogress: [], done: [] });
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [isAdmin, setIsAdmin] = useState(false);
  const { selectedTeam } = useSelector((state) => state.team);

  useEffect(() => {
    if (!selectedTeam || !user) return;
    const role = selectedTeam.members?.find(member => member.userId === user._id)?.role;
    setIsAdmin(role === 'admin');
  }, [selectedTeam, user]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/tasks/project/${selectedProject._id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const tasks = res.data;
      const grouped = { todo: [], inprogress: [], done: [] };
      tasks.forEach((task) => grouped[task.status || 'todo'].push(task));
      setTasksByStatus(grouped);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedProject?._id) fetchTasks();
  }, [selectedProject]);

  const handleDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const draggedTask = tasksByStatus[source.droppableId][source.index];
    const isAdmin = draggedTask.createdBy === user._id;
    const isAssigned = draggedTask.assignedTo?._id === user._id;
    if (!isAdmin && !isAssigned) return; 

    const newTasksByStatus = { ...tasksByStatus };
    newTasksByStatus[source.droppableId].splice(source.index, 1);
    newTasksByStatus[destination.droppableId].splice(destination.index, 0, draggedTask);
    setTasksByStatus(newTasksByStatus);

    try {
      const res = await api.put(`/tasks/${draggableId}/status`, { status: destination.droppableId }, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const updatedTask = res.data.task;
      setTasksByStatus((prev) => {
        const updated = { ...prev };
        updated[destination.droppableId] = updated[destination.droppableId].map((t) =>
          t._id === updatedTask._id ? updatedTask : t
        );
        return updated;
      });
    } catch (err) {
      toast.error('Failed to update status');
      fetchTasks();
    }
  };

  const handleDelete = (taskId) => {
    setTasksByStatus((prev) => {
      const updated = {};
      for (const status in prev) {
        updated[status] = prev[status].filter((task) => task._id !== taskId);
      }
      return updated;
    });
  };

  const handleStatusChange = (updatedTask) => {
    setTasksByStatus((prev) => {
      const newGrouped = { todo: [], inprogress: [], done: [] };
      for (const status in prev) {
        prev[status].forEach((t) => {
          if (t._id === updatedTask._id) return;
          newGrouped[t.status].push(t);
        });
      }
      newGrouped[updatedTask.status].push(updatedTask);
      return newGrouped;
    });
  };

  const handleTaskCreated = (newTask) => {
    setTasksByStatus((prev) => ({
      ...prev,
      [newTask.status]: [newTask, ...prev[newTask.status]],
    }));
  };

  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">{selectedProject.projectName} - Tasks</h2>
        {isAdmin && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            + New Task
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Loading tasks...</p>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {statusOrder.map((status) => (
              <div key={status} className="bg-gray-100 p-4 rounded shadow-sm">
                <h3 className="text-md font-semibold mb-2">{statusLabels[status]}</h3>
                <Droppable droppableId={status}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="space-y-2 min-h-[100px]"
                    >
                      {tasksByStatus[status].map((task, index) => {
                        const isAdmin = task.createdBy === user._id;
                        const isAssigned = task.assignedTo?._id === user._id;
                        const isDraggable = isAdmin || isAssigned;

                        return isDraggable ? (
                          <Draggable key={task._id} draggableId={task._id} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <TaskCard
                                  task={task}
                                  onDelete={handleDelete}
                                  onStatusChange={handleStatusChange}
                                />
                              </div>
                            )}
                          </Draggable>
                        ) : (
                          <div
                            key={task._id}
                            className="p-3 bg-gray-100 border rounded text-gray-400 cursor-not-allowed"
                          >
                            <TaskCard
                              task={task}
                              onDelete={handleDelete}
                              onStatusChange={handleStatusChange}
                            />
                          </div>
                        );
                      })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      )}

      {showCreateModal && (
        <CreateTaskModal
          onClose={() => setShowCreateModal(false)}
          onTaskCreated={handleTaskCreated}
        />
      )}
    </div>
  );
};

export default TaskBoard;
