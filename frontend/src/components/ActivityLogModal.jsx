import React, { useEffect, useState } from 'react';
import api from '../api';
import { toast } from 'sonner';

const ActivityLogModal = ({ task, onClose }) => {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const res = await api.get(`/tasks/${task._id}/activity`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')).token}` },
                });
                setLogs(res.data || []);
            } catch (err) {
                toast.error('Failed to load activity logs');
            }
        };

        fetchLogs();
    }, [task._id]);

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-lg p-6 rounded-xl relative">
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-600 text-xl">&times;</button>
                <h3 className="text-lg font-semibold mb-4">Activity Log for: {task.title}</h3>
                <div className="max-h-64 overflow-y-auto space-y-2">
                    {logs.length > 0 ? logs.map((log) => (
                        <div key={log._id} className="text-sm border-b pb-2">
                            <p><strong>{log.userId.name}</strong> - <em>{log.action}</em>: {log.details}</p>
                            <p className="text-xs text-gray-500">{new Date(log.createdAt).toLocaleString()}</p>
                        </div>
                    )) : <p className="text-sm text-gray-500">No activity yet.</p>}
                </div>
            </div>
        </div>
    );
};

export default ActivityLogModal;
