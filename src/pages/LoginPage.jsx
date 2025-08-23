import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Components/Layout/Navbar';
import Login from '../components/Authentication/Login';

const LoginPage = ({ onLoginSuccess }) => {
  const navigate = useNavigate();

  const handleLogin = (userData) => {
    onLoginSuccess(userData);
    navigate('/dashboard'); // Redirect to dashboard after successful login
  };

  return (
    <>
      <Navbar user={null} />
      <Login onLoginSuccess={handleLogin} />
    </>
  );
};

export default LoginPage;