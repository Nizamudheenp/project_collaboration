import React, { useEffect, useState } from 'react';
import api from '../api';
import { toast } from 'sonner';

const ActivityLogModal = ({ task, onClose }) => {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const res = await api.get(`/tasks/${task._id}/activity`, {
                    headers: {
                        Authorization:
                            `Bearer ${localStorage.getItem('user') &&
                            JSON.parse(localStorage.getItem('user')).token
                            }`,
                    },
                });
                setLogs(res.data || []);
            } catch (err) {
                toast.error('Failed to load activity logs');
            }
        };

        fetchLogs();
    }, [task._id]);

    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4">
            <div className="w-full max-w-lg bg-white dark:bg-black rounded-2xl shadow-xl p-6 relative text-black dark:text-white">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white text-xl font-bold"
                >
                    &times;
                </button>

                <h3 className="text-xl font-semibold mb-4">Activity Log for: {task.title}</h3>

                <div className="max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-neutral-700">
                    {logs.length > 0 ? (
                        logs.map((log) => (
                            <div key={log._id} className="border-b border-gray-200 dark:border-gray-700 py-2 text-sm space-y-1">
                                <p>
                                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                                        {log.userId.name}
                                    </span>{' '}
                                    <span className="italic text-gray-600 dark:text-gray-400">{log.action}</span>
                                    {': '}
                                    {log.details}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {new Date(log.createdAt).toLocaleString()}
                                </p>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400">No activity yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ActivityLogModal;
