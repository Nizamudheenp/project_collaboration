import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearSelectedTask } from '../redux/slices/taskSlice';
import api from '../api';
import { toast } from 'sonner';
import socket from '../socket';

const CommentModal = () => {
  const { user } = useSelector((state) => state.auth);
  const { selectedTask } = useSelector((state) => state.task);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const dispatch = useDispatch();

  const fetchComments = async () => {
    try {
      const res = await api.get(`/comments/${selectedTask._id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setComments(res.data);
    } catch (err) {
      toast.error('Failed to load comments');
    }
  };

  useEffect(() => {
    if (selectedTask?._id) fetchComments();
  }, [selectedTask, user.token]);

  useEffect(() => {
    const handleNewComment = (incoming) => {
      if (incoming.taskId === selectedTask._id) {
        fetchComments();
      }
    };

    socket.on('newComment', handleNewComment);
    return () => socket.off('newComment', handleNewComment);
  }, [selectedTask._id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await api.post(
        '/comments',
        { taskId: selectedTask._id, text: newComment },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setNewComment('');
      fetchComments();
      socket.emit('newComment', { taskId: selectedTask._id });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post comment');
    }
  };

  const handleClose = () => {
    dispatch(clearSelectedTask());
  };

  if (!selectedTask) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white dark:bg-black w-full max-w-lg p-6 rounded-2xl shadow-xl relative text-black dark:text-white">
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white text-xl font-bold"
        >
          &times;
        </button>

        <h3 className="text-xl font-semibold mb-3">Comments for: {selectedTask.title}</h3>

        <div className="max-h-64 overflow-y-auto pr-2 space-y-3 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-neutral-700">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div
                key={comment._id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-gray-50 dark:bg-neutral-900"
              >
                <p className="text-sm text-gray-800 dark:text-gray-100">{comment.text}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {comment.userId?.name || 'Unknown'} &middot;{' '}
                  {new Date(comment.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">No comments yet.</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-900 px-3 py-2 rounded-lg text-sm text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Write a comment..."
          />
          <button
            type="submit"
            className="px-4 py-2 bg-green-700 hover:bg-green-900 text-white rounded-lg text-sm transition"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default CommentModal;
