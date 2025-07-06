// src/components/GanttChartView.jsx
import React from 'react';
import { Chart } from 'react-google-charts';

const GanttChartView = ({ tasks, onClose }) => {
  const chartData = [
    [
      { type: 'string', label: 'Task ID' },
      { type: 'string', label: 'Task Name' },
      { type: 'string', label: 'Resource' },
      { type: 'date', label: 'Start Date' },
      { type: 'date', label: 'End Date' },
      { type: 'number', label: 'Duration' },
      { type: 'number', label: 'Percent Complete' },
      { type: 'string', label: 'Dependencies' },
    ],
    ...tasks.map((task) => {
      const start = new Date(task.createdAt || Date.now());
      const end = new Date(task.dueDate || Date.now());

      if (start.getTime() === end.getTime()) {
        end.setDate(end.getDate() + 1);
      }

      let percent = 0;
      if (task.status === 'inprogress') percent = 50;
      else if (task.status === 'done') percent = 100;

      return [
        task._id,
        task.title || 'Untitled',
        task.assignedTo?.name || 'Unassigned',
        start,
        end,
        null,
        percent,
        null,
      ];
    }),
  ];

  const options = {
    height: Math.max(400, tasks.length * 45),
    gantt: {
      trackHeight: 32,
      barCornerRadius: 4,
      labelStyle: {
        fontSize: 12,
        color: '#374151', // neutral text
        fontName: 'Inter',
      },
      criticalPathEnabled: false,
      innerGridTrack: { fill: '#f4f4f5' },      // light rows
      innerGridDarkTrack: { fill: '#e5e7eb' },  // alternating rows
    },
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center px-2">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">📊 Gantt Chart</h2>
          <button
            onClick={onClose}
            className="text-sm text-red-500 hover:underline font-medium"
          >
            Close
          </button>
        </div>

        <div className="w-full overflow-auto">
          <Chart
            chartType="Gantt"
            width="100%"
            height="100%"
            data={chartData}
            options={options}
          />
        </div>
      </div>
    </div>
  );
};

export default GanttChartView;
