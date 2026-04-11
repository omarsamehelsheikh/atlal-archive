import React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';

export const AdminLayout = () => {
  return (
    // Changed bg-gray-50 to a solid dark black to match your archive theme
    <div className="flex min-h-screen bg-[#050505]"> 
      <AdminSidebar />
      <main className="flex-1 ml-72 p-12 overflow-y-auto">
        {/* This is where your Unified Search and Yellow buttons will live */}
        <Outlet />
      </main>
    </div>
  );
};