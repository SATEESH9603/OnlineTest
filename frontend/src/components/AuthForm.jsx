import React, { useState } from 'react';
import { register, login } from '../services/api';
import { useNavigate } from 'react-router-dom';
import './AuthForm.css';

export default function AuthForm({ mode = "login", onAuth }) {
  const [isLogin, setIsLogin] = useState(mode === "login");
  const [form, setForm] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    firstName: '',
    lastName: '',
    role: 'USER'
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLogin && form.password !== form.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      if (isLogin) {
        const { data } = await login({ username: form.username, password: form.password });
        if (data.token && data.user) {
          onAuth(data.token, data.user);
          navigate('/dashboard');
        } else {
          alert(data.error?.message || 'Login failed');
        }
      } else {
        const { data } = await register(form);
        if (!data.error) {
          alert('Registration successful! Please log in.');
          setIsLogin(true);
          navigate('/login', { replace: true });
        } else {
          alert(data.error?.message || 'Registration failed');
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isLogin ? 'Login' : 'Register'}</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          {!isLogin && (
            <>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
              <div className="name-fields">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </>
          )}
          <button type="submit" disabled={loading}>
            {loading ? 'Please wait...' : isLogin ? 'Login' : 'Register'}
          </button>
        </form>
        <p className="auth-toggle">
          {isLogin
            ? <>Need an account? <span onClick={() => { setIsLogin(false); navigate('/register'); }}>Register</span></>
            : <>Already have an account? <span onClick={() => { setIsLogin(true); navigate('/login'); }}>Login</span></>
          }
        </p>
        {/* Forgot Password link (only in login mode) */}
        {isLogin && (
          <p className="forgot-password">
            <span onClick={() => navigate('/forgot-password')}>Forgot Password?</span>
          </p>
        )}
      </div>
    </div>
  );
}
