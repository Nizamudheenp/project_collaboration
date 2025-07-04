import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import TeamListSidebar from '../components/TeamListSidebar';
import ProjectPanel from '../components/ProjectPanel';
import TaskBoard from '../components/TaskBoard';

const Dashboard = () => {
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

  return (
    <div className="h-screen flex flex-col md:flex-row">
      {!isMobile && (
        <>
          <div className="w-1/4 border-r border-gray-200">
            <TeamListSidebar />
          </div>
          <div className="w-3/4">
            <ProjectPanel />
          </div>
        </>
      )}

      {isMobile && (
        <>
          {viewState === 'teams' && <div className="w-full"><TeamListSidebar /></div>}
          {viewState === 'projects' && <div className="w-full"><ProjectPanel /></div>}
          {viewState === 'tasks' && <div className="w-full p-4"><TaskBoard /></div>}
        </>
      )}
    </div>
  );
};

export default Dashboard;