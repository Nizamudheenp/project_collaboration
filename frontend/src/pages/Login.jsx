import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import api from '../api';
import { setUser } from '../redux/slices/authSlice';

const Login = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  if (user) return <Navigate to="/dashboard" replace />;

  const validate = (field, value) => {
    let error = '';
    if (field === 'email') {
      if (!value) error = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(value)) error = 'Invalid email format';
    }
    if (field === 'password') {
      if (!value) error = 'Password is required';
      else if (value.length < 5) error = 'Password must be at least 5 characters';
    }
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validate(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailError = !formData.email ? 'Email is required' : '';
    const passwordError = !formData.password ? 'Password is required' : '';
    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      return;
    }

    try {
      const res = await api.post('/auth/login', formData);
      dispatch(setUser(res.data));
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setServerError(err.response?.data?.message || 'Login failed');
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

          {serverError && <p className="text-red-500 text-sm mb-3">{serverError}</p>}

          <div className="mb-3">
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div className="mb-4">
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

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
