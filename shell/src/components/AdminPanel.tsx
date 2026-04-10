
import React from 'react';
import AdminChatDashboard from './AdminChatDashboard';

const AdminPanel: React.FC = () => {
  return (
    <div className="p-8 bg-zinc-950 min-h-screen text-white">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
        Admin Dashboard
      </h1>
      <AdminChatDashboard />
    </div>
  );
};

export default AdminPanel;
