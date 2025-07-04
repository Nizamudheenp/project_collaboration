import React from 'react';

const ProjectCard = ({ project, onClick }) => (
  <div
    onClick={() => onClick(project)}
    className="cursor-pointer border rounded-lg p-4 shadow hover:shadow-md hover:bg-blue-50 transition"
  >
    <h3 className="text-lg font-semibold mb-1">{project.projectName}</h3>
    <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>
  </div>
);

export default ProjectCard;