import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import TeamListSidebar from '../components/TeamListSidebar';
import ProjectPanel from '../components/ProjectPanel';
import TaskBoard from '../components/TaskBoard';
import { clearSelectedTeam } from '../redux/slices/teamSlice';
import { clearSelectedProject } from '../redux/slices/projectSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { selectedTeam } = useSelector((state) => state.team);
  const { selectedProject } = useSelector((state) => state.project);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [viewState, setViewState] = useState('teams');

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      if (!mobile) setViewState('projects');
      else if (!selectedTeam) setViewState('teams');
      else if (selectedTeam && !selectedProject) setViewState('projects');
      else setViewState('tasks');
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [selectedTeam, selectedProject]);

  useEffect(() => {
    if (isMobile) {
      if (!selectedTeam) setViewState('teams');
      else if (!selectedProject) setViewState('projects');
      else setViewState('tasks');
    }
  }, [selectedTeam, selectedProject, isMobile]);

  const handleBack = () => {
    if (viewState === 'tasks') {
      dispatch(clearSelectedProject());
      setViewState('projects');
    } else if (viewState === 'projects') {
      dispatch(clearSelectedTeam());
      setViewState('teams');
    }
  };

  return (
    <div className="h-screen pt-14 flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-900 text-gray-800 dark:text-white transition-colors">
      {!isMobile && (
        <>
          <div className="w-full md:w-1/4 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-neutral-800 transition-colors">
            <TeamListSidebar />
          </div>
          <div className="w-full md:w-3/4 bg-white dark:bg-neutral-900 transition-colors">
            <ProjectPanel />
          </div>
        </>
      )}

      {isMobile && (
        <>
          {viewState !== 'teams' && (
            <div className="p-3 bg-white dark:bg-neutral-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors">
              <button
                onClick={handleBack}
                className="text-sm text-green-700 dark:text-green-400 hover:underline font-medium"
              >
                ← Back
              </button>
            </div>
          )}

          {viewState === 'teams' && (
            <div className="w-full bg-white dark:bg-neutral-900 transition-colors">
              <TeamListSidebar />
            </div>
          )}
          {viewState === 'projects' && (
            <div className="w-full bg-white dark:bg-neutral-900 transition-colors">
              <ProjectPanel />
            </div>
          )}
          {viewState === 'tasks' && (
            <div className="w-full bg-white dark:bg-neutral-900 p-4 transition-colors">
              <TaskBoard />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
