
import React from 'react';

const UserPanel: React.FC = () => {
  return (
    <div className="p-8 bg-zinc-950 min-h-screen text-white">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-600 bg-clip-text text-transparent">
        Welcome Back!
      </h1>
      <p className="mt-4 text-zinc-400">Here's what's happening in your account today.</p>
      
      <div className="mt-8">
        <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-3xl backdrop-blur-xl">
          <h2 className="text-2xl font-semibold mb-4">Your Recent Orders</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((order) => (
              <div key={order} className="flex justify-between items-center p-4 bg-zinc-800/50 rounded-xl">
                <span>Order #ORD-00{order}</span>
                <span className="text-cyan-400 font-medium">Delivered</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPanel;
