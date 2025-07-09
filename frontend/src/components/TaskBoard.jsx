import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useDispatch, useSelector } from 'react-redux';
import api from '../api';
import { toast } from 'sonner';
import TaskCard from './TaskCard';
import CreateTaskModal from './CreateTaskModal';
import CommentModal from './CommentModal';
import { clearSelectedTask } from '../redux/slices/taskSlice';
import socket from '../socket';
import ActivityLogModal from './ActivityLogModal';
import GanttChartView from './GanttChartView';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Menu } from '@headlessui/react';
import { FiMoreVertical } from 'react-icons/fi';


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
  const { selectedTask } = useSelector((state) => state.task);
  const dispatch = useDispatch();
  const [activeTaskForLog, setActiveTaskForLog] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const { selectedTeam } = useSelector((state) => state.team);
  const [showGantt, setShowGantt] = useState(false);


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

  useEffect(() => {
    socket.on('taskStatusUpdated', (updatedTask) => {
      setTasksByStatus((prev) => {
        const newGrouped = { todo: [], inprogress: [], done: [] };

        for (const status in prev) {
          prev[status].forEach((t) => {
            if (t._id !== updatedTask._id) {
              newGrouped[t.status].push(t);
            }
          });
        }

        newGrouped[updatedTask.status].push(updatedTask);
        return newGrouped;
      });
    });

    return () => {
      socket.off('taskStatusUpdated');
    };
  }, []);


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
      socket.emit('taskStatusUpdated', updatedTask);
      setTasksByStatus((prev) => {
        const updated = { ...prev };
        updated[destination.droppableId] = updated[destination.droppableId].map((t) =>
          t._id === updatedTask._id ? updatedTask : t
        );
        return updated;
      });
      toast.success('Task status updated');
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

  const handleTaskCreated = () => {
   fetchTasks();
  };

  const exportBoardAsPDF = () => {
    const board = document.getElementById('task-board-area');
    if (!board) return;

    html2canvas(board, { scale: 2, useCORS: true }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape', 'pt', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${selectedProject?.projectName || 'task-board'}.pdf`);
    });
  };



  return (
    <div className="h-full px-2 md:px-4 py-4">
      <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
        <h2 className="text-xl font-semibold text-black dark:text-white">
          {selectedProject.projectName} - Tasks
        </h2>

        <Menu as="div" className="relative inline-block text-left">
          <Menu.Button className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition">
            <FiMoreVertical size={20} />
          </Menu.Button>
          <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden">
            <div className="py-1 text-sm">
              {isAdmin && (
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className={`block w-full text-left px-4 py-2 ${active ? 'bg-gray-100 dark:bg-neutral-700' : ''
                        }`}
                    >
                      New Task
                    </button>
                  )}
                </Menu.Item>
              )}

              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => setShowGantt(true)}
                    className={`block w-full text-left px-4 py-2 ${active ? 'bg-gray-100 dark:bg-neutral-700' : ''
                      }`}
                  >
                    Gantt Chart
                  </button>
                )}
              </Menu.Item>

              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={exportBoardAsPDF}
                    className={`block w-full text-left px-4 py-2 ${active ? 'bg-gray-100 dark:bg-neutral-700' : ''
                      }`}
                  >
                    Export PDF
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Menu>
      </div>


      {loading ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading tasks...</p>
      ) : (
        <div id="task-board-area">
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {statusOrder.map((status) => (
                <div
                  key={status}
                  className="bg-white dark:bg-black border dark:border-gray-700 p-4 rounded-2xl shadow-md"
                >
                  <h3 className="text-md font-semibold mb-3 text-black dark:text-white">
                    {statusLabels[status]}
                  </h3>
                  <Droppable droppableId={status}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="space-y-3 min-h-[100px]"
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
                                    onShowActivity={() => setActiveTaskForLog(task)}
                                  />
                                </div>
                              )}
                            </Draggable>
                          ) : (
                            <div
                              key={task._id}
                              className="p-3 bg-gray-100 dark:bg-gray-900 border border-dashed dark:border-gray-700 rounded-xl text-gray-400 cursor-not-allowed"
                            >
                              <TaskCard
                                task={task}
                                onDelete={handleDelete}
                                onStatusChange={handleStatusChange}
                                onShowActivity={() => setActiveTaskForLog(task)}
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
        </div>
      )}

      {showCreateModal && (
        <CreateTaskModal
          onClose={() => setShowCreateModal(false)}
          onTaskCreated={handleTaskCreated}
        />
      )}

      {selectedTask && (
        <CommentModal
          task={selectedTask}
          onClose={() => dispatch(clearSelectedTask())}
        />
      )}

      {activeTaskForLog && (
        <ActivityLogModal
          task={activeTaskForLog}
          onClose={() => setActiveTaskForLog(null)}
        />
      )}

      {showGantt && (
        <GanttChartView
          tasks={[...tasksByStatus.todo, ...tasksByStatus.inprogress, ...tasksByStatus.done]}
          onClose={() => setShowGantt(false)}
        />
      )}
    </div>
  );
};

export default TaskBoard;
