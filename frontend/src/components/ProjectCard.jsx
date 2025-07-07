import React from 'react';

const ProjectCard = ({ project, onClick }) => (
  <div
    onClick={() => onClick(project)}
    className="cursor-pointer border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm hover:shadow-md hover:bg-blue-50 dark:hover:bg-neutral-800 transition-colors bg-white dark:bg-neutral-900 text-gray-800 dark:text-white"
  >
    <h3 className="text-lg font-semibold mb-1">{project.projectName}</h3>
    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
      {project.description}
    </p>
  </div>
);

export default ProjectCard;
