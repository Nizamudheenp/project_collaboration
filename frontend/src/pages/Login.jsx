import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { setUser } from '../redux/slices/authSlice';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', formData);
      dispatch(setUser(res.data));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden md:flex w-1/2 bg-gradient-to-tr from-blue-500 to-indigo-700 items-center justify-center text-white flex-col">
        <h1 className="text-5xl font-bold mb-4">ProjectFlow</h1>
        <p className="text-lg max-w-md text-center">Collaborate efficiently. Build together. Track progress visually.</p>
      </div>

      <div className="flex flex-col justify-center items-center w-full md:w-1/2 bg-gray-100">
        <form
          onSubmit={handleSubmit}
          className="bg-white/70 backdrop-blur-lg border border-gray-200 p-8 rounded-2xl shadow-lg w-[90%] max-w-sm"
        >
          <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">Login</h2>

          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

          <input
            name="email"
            type="email"
            placeholder="Email"
            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            className="w-full mb-6 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition font-medium">
            Login
          </button>
          <p className="text-sm mt-4 text-center">
            Don't have an account?{' '}
            <a href="/register" className="text-blue-600 hover:underline">
              Register
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
