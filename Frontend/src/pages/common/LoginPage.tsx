import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import {jwtDecode} from 'jwt-decode';

type JwtPayload = {
  id: string;
  full_name: string;
  email: string;
  role: string;  
};

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    const user = await login(email, password); // use context login
    if (user.role === 'ROLE_TEACHER') {
      navigate('/teacher/dashboard');
    } else if (user.role === 'ROLE_STUDENT') {
      navigate('/student/dashboard');
    } else {
      setError('Unauthorized role.');
    }
  } catch (err) {
    setError('Invalid credentials or server error.');
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const decoded: JwtPayload = jwtDecode(token);
      if (decoded.exp * 1000 > Date.now()) {
        if (decoded.role === 'ROLE_TEACHER' && location.pathname !== '/teacher/dashboard') {
          navigate('/teacher/dashboard', { replace: true });
        } else if (decoded.role === 'ROLE_STUDENT' && location.pathname !== '/student/dashboard') {
          navigate('/student/dashboard', { replace: true });
        }
      } else {
        localStorage.removeItem('token');
      }
    } catch (err) {
      localStorage.removeItem('token');
      console.error('Token decode error:', err);
    }
  }, [navigate, location.pathname]);

  const handleGoogleLogin = () => {
    alert('Google login not implemented');
    // Implement your Google login logic here
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-bl from-indigo-600 to-purple-600">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md space-y-6">
        <h2 className="text-3xl font-bold text-center text-indigo-700">Login</h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <div className="mt-1 relative">
              <input
                type="email"
                id="email"
                value={email}
                required
                autoComplete="email"
                className="block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                disabled={loading}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="mt-1 relative">
              <input
                type="password"
                id="password"
                value={password}
                required
                autoComplete="current-password"
                className="block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                disabled={loading}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 px-4 rounded-md hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="flex items-center justify-center space-x-2">
          <span className="h-px w-full bg-gray-300"></span>
          <span className="text-gray-500">OR</span>
          <span className="h-px w-full bg-gray-300"></span>
        </div>

        <Button
          variant="outline"
          fullWidth
          className="mt-4 flex items-center justify-center gap-2 bg-white text-gray-800 border border-gray-300 hover:bg-gray-100 transition-colors disabled:opacity-50"
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12.545,12.151L12.545,12.151c0,1.054,0.855,1.909,1.909,1.909h3.536c-0.684,2.405-2.913,4.17-5.545,4.17
                c-3.179,0-5.754-2.576-5.754-5.754s2.576-5.754,5.754-5.754c1.463,0,2.799,0.543,3.821,1.436l2.742-2.742C17.037,3.617,
                14.675,2.727,12,2.727C6.409,2.727,2,7.136,2,12.727s4.409,10,10,10c9.084,0,11.182-8.509,10.271-13.272h-9.726V12.151z"
            />
          </svg>
          <span className="font-semibold">Sign in with Google</span>
        </Button>

        <p className="text-center text-sm text-gray-600">
          Don’t have an account?{' '}
          <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500 transition duration-300">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
