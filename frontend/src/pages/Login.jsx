import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import api from '../api';
import { setUser } from '../redux/slices/authSlice';
import { toast } from 'sonner';

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
      toast.success(`Welcome back, ${res.data.name}!`);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setServerError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen pt-14 flex bg-gray-100 dark:bg-neutral-900 transition-colors">
      <div className="hidden md:flex w-1/2 bg-green-900 items-center justify-center text-white flex-col px-10">
        <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">ProjectFlow</h1>
        <p className="text-lg max-w-md text-center opacity-90">Collaborate efficiently. Build together. Track progress visually.</p>
      </div>

      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-6 sm:p-10">
        <form
          onSubmit={handleSubmit}
          className="bg-white/80 dark:bg-white/10 backdrop-blur-md border border-gray-200 dark:border-gray-600 p-8 sm:p-10 rounded-2xl shadow-xl w-full max-w-md transition-all"
        >
          <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800 dark:text-white">Login</h2>

          {serverError && <p className="text-red-500 text-sm mb-3">{serverError}</p>}

          <div className="mb-4">
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-800 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm transition"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div className="mb-6">
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-800 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm transition"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          <button className="w-full bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700 transition font-medium shadow-md">
            Login
          </button>

          <p className="text-sm mt-6 text-center text-gray-700 dark:text-gray-300">
            Don't have an account?{' '}
            <a href="/register" className="text-green-600 dark:text-green-400 hover:underline">
              Register
            </a>
          </p>
        </form>
      </div>
    </div>

  );
};

export default Login;
