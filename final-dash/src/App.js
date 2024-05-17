// App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UpdatePasswordForm from './components/UpdatePasswordForm';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard/*" element={<Dashboard />} />
      <Route path='/update-password' element={<UpdatePasswordForm />} />
    </Routes>
  );
};

export default App;
