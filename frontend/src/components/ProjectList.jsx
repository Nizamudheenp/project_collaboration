import React from 'react';
import ProjectCard from './ProjectCard';

const ProjectList = ({ projects, onSelect }) => {
  if (!projects || projects.length === 0) {
    return <p className="text-gray-500 text-center mt-10">No projects yet. Create one to get started.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map((project) => (
        <ProjectCard key={project._id} project={project} onClick={onSelect} />
      ))}
    </div>
  );
};

export default ProjectList;
