import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearSelectedTask } from '../redux/slices/taskSlice';
import api from '../api';
import { toast } from 'sonner';

const CommentModal = () => {
  const { user } = useSelector((state) => state.auth);
  const { selectedTask } = useSelector((state) => state.task);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
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

    if (selectedTask?._id) fetchComments();
  }, [selectedTask, user.token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const res = await api.post(
        '/comments',
        { taskId: selectedTask._id, text: newComment },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setComments((prev) => [...prev, res.data]);
      setNewComment('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post comment');
    }
  };

  const handleClose = () => {
    dispatch(clearSelectedTask());
  };

  if (!selectedTask) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white w-full max-w-lg p-6   rounded-xl relative">
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
        >
          &times;
        </button>
        <h3 className="text-lg font-semibold mb-2">Comments for: {selectedTask.title}</h3>

        <div className="max-h-64 overflow-y-auto mb-4 space-y-3">
          {comments.map((comment) => (
            <div key={comment._id} className="border-b pb-2">
              <p className="text-sm font-semibold text-gray-900">{comment.text}</p>
              <p className="text-xs text-gray-500">
                 {comment.userId.name} ({new Date(comment.createdAt).toLocaleString()})
              </p>
            </div>
          ))}
          {comments.length === 0 && <p className="text-sm text-gray-500">No comments yet.</p>}
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Write a comment..."
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default CommentModal;