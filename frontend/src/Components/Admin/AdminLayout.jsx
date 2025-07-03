import React, { useState } from "react";
import { FaBars } from "react-icons/fa";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Sidebar */}
      <div
        className={`bg-gray-900 text-white w-64 fixed top-0 left-0 h-full z-30 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 md:translate-x-0 md:static md:block`}
      >
        <AdminSidebar />
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col md:ml-64 h-screen">
        {/* Mobile header */}
        <div className="md:hidden bg-gray-900 text-white p-4 flex items-center">
          <button onClick={toggleSidebar}>
            <FaBars size={24} />
          </button>
          <h1 className="ml-4 text-xl font-medium">Admin Dashboard</h1>
        </div>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
