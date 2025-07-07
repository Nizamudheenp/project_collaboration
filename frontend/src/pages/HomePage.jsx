import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleGetStarted = () => {
    navigate(user ? '/dashboard' : '/register');
  };

  return (
    <div className="min-h-screen pt-14 bg-white text-green-900 dark:bg-black dark:text-white flex flex-col transition-colors duration-300">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center px-6 py-24 bg-green-900 text-white shadow-inner">
        <h1 className="text-5xl font-bold mb-4">Collabix</h1>
        <p className="text-lg max-w-2xl mb-8">
          The simplest way to manage your team’s projects and tasks in one collaborative space.
        </p>
        <button
          onClick={handleGetStarted}
          className="bg-white text-green-900 px-8 py-3 rounded-full font-semibold text-base transition hover:bg-gray-100 hover:scale-105 active:scale-95 shadow"
        >
          {user ? 'Continue to Collabix' : 'Get Started'}
        </button>
      </div>

      {/* Features */}
      <div className="py-16 px-6 md:px-12 lg:px-24 bg-white dark:bg-zinc-900 transition-colors">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Collabix?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: 'Create & Manage Teams',
              desc: 'Easily create teams and manage member roles with flexible permissions.',
              icon: '👥',
            },
            {
              title: 'Project Boards',
              desc: 'Organize your projects into boards and manage tasks visually.',
              icon: '📁',
            },
            {
              title: 'Drag & Drop Tasks',
              desc: 'Update task statuses instantly with smooth drag-and-drop UI.',
              icon: '🧩',
            },
            {
              title: 'Real-time Collaboration',
              desc: 'Work together with teammates in real time and stay in sync.',
              icon: '🔄',
            },
            {
              title: 'Role-based Access',
              desc: 'Control who can create, assign, and update tasks.',
              icon: '🔐',
            },
            {
              title: 'Simple & Fast UI',
              desc: 'Minimal UI optimized for performance and productivity.',
              icon: '⚡',
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="bg-gray-50 dark:bg-zinc-800 p-6 rounded-xl shadow hover:shadow-md transition"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-green-950 text-white py-6 text-center text-sm dark:bg-black">
        © {new Date().getFullYear()} Collabix — Built with 💻 by YourTeam
      </footer>
    </div>
  );
};

export default HomePage;
