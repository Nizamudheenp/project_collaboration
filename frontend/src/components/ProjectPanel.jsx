import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiMoreVertical } from 'react-icons/fi';
import { Menu } from '@headlessui/react';
import api from '../api';
import ProjectCard from './ProjectCard';
import CreateProjectModal from './CreateProjectModal';
import { setSelectedProject, clearSelectedProject } from '../redux/slices/projectSlice';
import TaskBoard from './TaskBoard';
import { useNavigate } from 'react-router-dom';

const ProjectPanel = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { selectedTeam } = useSelector((state) => state.team);
  const [isAdmin, setIsAdmin] = useState(false);
  const { selectedProject } = useSelector((state) => state.project);
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    if (!selectedTeam || !user) return;
    const role = selectedTeam.members?.find(m => m.userId === user._id)?.role;
    setIsAdmin(role === 'admin');
  }, [selectedTeam, user]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/projects/team/${selectedTeam._id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setProjects(res.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load projects');
      } finally {
        setLoading(false);
      }
    };

    if (selectedTeam?._id) {
      fetchProjects();
      dispatch(clearSelectedProject());
    }
  }, [selectedTeam]);

  const handleProjectCreated = (newProject) => {
    setProjects((prev) => [...prev, newProject]);
  };

  if (!selectedTeam) return <div className="p-6 text-gray-500">Select a team to view projects</div>;

  if (selectedProject) {
    return (
      <div className="p-4 overflow-y-auto h-full">
        <button
          onClick={() => dispatch(clearSelectedProject())}
          className="inline-flex items-center gap-1 text-sm font-medium text-green-700 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 mb-4 transition"
        >
          <span className="text-lg">←</span>
          Back to Projects
        </button>



        <TaskBoard />
      </div>
    );
  }

  return (
    <div className="p-6 overflow-y-auto h-full bg-white dark:bg-neutral-900 text-gray-800 dark:text-white transition-colors">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Projects for {selectedTeam.teamName}</h2>
        {isAdmin && (
          <Menu as="div" className="relative inline-block text-left">
            <Menu.Button className="p-1 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white">
              <FiMoreVertical size={20} />
            </Menu.Button>
            <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded shadow-md z-50">
              <div className="py-1 px-2 text-sm">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className={`block w-full text-left rounded px-2 py-1 ${active ? 'bg-gray-100 dark:bg-neutral-700' : ''
                        }`}
                    >
                      New Project
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => navigate('/dashboard/members')}
                      className={`block w-full text-left rounded px-2 py-1 ${active ? 'bg-gray-100 dark:bg-neutral-700' : ''
                        }`}
                    >
                      Members
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Menu>
        )}
      </div>

      {loading ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading projects...</p>
      ) : error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : projects.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">No projects yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              onClick={() => dispatch(setSelectedProject(project))}
            />
          ))}
        </div>
      )}

      {showCreateModal && (
        <CreateProjectModal
          onClose={() => setShowCreateModal(false)}
          onProjectCreated={handleProjectCreated}
          teamId={selectedTeam._id}
        />
      )}
    </div>
  );
};

export default ProjectPanel;
