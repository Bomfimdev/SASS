import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar for larger screens */}
      <aside className="hidden md:flex md:w-64 md:flex-col">
        <Sidebar />
      </aside>
      
      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
        
        <footer className="bg-white border-t border-gray-200 p-4">
          <div className="max-w-7xl mx-auto text-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} PropostaFácil. Todos os direitos reservados.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;