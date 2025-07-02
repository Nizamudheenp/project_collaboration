import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { setUser } from '../redux/slices/authSlice';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/register', formData);
      dispatch(setUser(res.data));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-tr from-green-500 to-teal-600 items-center justify-center text-white flex-col">
        <h1 className="text-5xl font-bold mb-4">Join ProjectFlow</h1>
        <p className="text-lg max-w-md text-center">Start organizing your team's work and boosting productivity.</p>
      </div>

      {/* Right Panel */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 bg-gray-100">
        <form
          onSubmit={handleRegister}
          className="bg-white/70 backdrop-blur-lg border border-gray-200 p-8 rounded-2xl shadow-lg w-[90%] max-w-sm"
        >
          <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">Register</h2>

          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

          <input
            name="name"
            type="text"
            placeholder="Name"
            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            className="w-full mb-6 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition font-medium">
            Register
          </button>
          <p className="text-sm mt-4 text-center">
            Already have an account?{' '}
            <a href="/login" className="text-green-600 hover:underline">
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
