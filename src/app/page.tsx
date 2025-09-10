
'use client';

import React, { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import './login.css';

interface LoginResponse {
  success: boolean;
  message?: string;
  roleFlag?: string;
}

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter(); 

  const loginBackgroundStyle: React.CSSProperties = {
    backgroundImage: "url('/bg-coulson.jpg')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#a6a2a2',
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data: LoginResponse = await res.json();

      if (data.success) {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('username', username);
        localStorage.setItem('password', password);
        if (data.roleFlag) {
          localStorage.setItem('roleFlag', data.roleFlag);
        }
        setMessage('');
        router.push('/home'); 
      } else {
        localStorage.setItem('isAuthenticated', 'false');
        setMessage(data.message || 'Login failed');
        setUsername('');
        setPassword('');
      }
    } catch (err) {
      console.error(err);
      setMessage('Server error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container" style={loginBackgroundStyle}>
      <form onSubmit={handleLogin} className="login-form">
        <h2>Project Marvel Agent Coulson</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
          required
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
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