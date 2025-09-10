// coulson_front/src/app/login/page.tsx
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from '../../services/api';
import '../login.css';
import { AxiosError } from "axios";

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await loginUser(username, password);
      const data = res.data;

      if (data.success) {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('username', username);
        localStorage.setItem('password', password);
        localStorage.setItem('roleFlag', data.roleFlag.toString());
        setMessage('');
        router.push('/home');
      } else {
        localStorage.setItem('isAuthenticated', 'false');
        setMessage(data.message || 'Login failed');
      }
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof AxiosError) {
        setMessage(err.response?.data?.message || 'Login failed.');
      } else {
        setMessage('Server error. Please try again later.');
      }
    }
  };

  const loginBackgroundStyle = {
    backgroundImage: `url('/bg-coulson.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#a6a2a2',
  };

  return (
    <div className="login-container" style={loginBackgroundStyle}>
      <form onSubmit={handleLogin} className="login-form">
        <h2>Project Marvel Agent Coulson</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        {message && <p className="login-message">{message}</p>}
        <span style={{ fontWeight: 'bold', color: '#183859', fontSize: '9px', textAlign: 'center' }}>
          Data Dictionary - Internal Use Only - © Projects And Analytics 2025
        </span>
      </form>
    </div>
  );
};

export default Login;
