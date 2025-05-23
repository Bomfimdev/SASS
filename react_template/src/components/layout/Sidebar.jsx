import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const navLinkClasses = (path) => {
    return `flex items-center px-4 py-3 text-gray-600 transition-colors duration-300 transform rounded-lg hover:bg-gray-100 hover:text-primary ${
      isActive(path) ? 'bg-gray-100 text-primary font-medium' : ''
    }`;
  };

  return (
    <div className="flex flex-col h-full py-8 bg-white border-r border-gray-200">
      <div className="flex flex-col flex-grow">
        <nav className="flex-1 px-2 space-y-1">
          <NavLink to="/" className={navLinkClasses('/')}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <span className="ml-4">Dashboard</span>
          </NavLink>
          
          <NavLink to="/propostas" className={navLinkClasses('/propostas')}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
            </svg>
            <span className="ml-4">Propostas</span>
          </NavLink>
          
          <NavLink to="/clientes" className={navLinkClasses('/clientes')}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
            </svg>
            <span className="ml-4">Clientes</span>
          </NavLink>
          
          <NavLink to="/modelos" className={navLinkClasses('/modelos')}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
            </svg>
            <span className="ml-4">Modelos</span>
          </NavLink>
        </nav>
      </div>
      
      {user?.role === 'ADMIN' && (
        <div className="px-4 pt-4 mt-4 border-t border-gray-200">
          <h5 className="text-xs font-semibold tracking-wider text-gray-500 uppercase">Administração</h5>
          <nav className="mt-2 space-y-1">
            <NavLink to="/usuarios" className={navLinkClasses('/usuarios')}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <span className="ml-4">Usuários</span>
            </NavLink>
            <NavLink to="/configuracoes" className={navLinkClasses('/configuracoes')}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
              <span className="ml-4">Configurações</span>
            </NavLink>
          </nav>
        </div>
      )}
      
      {/* Upgrade banner for free/trial users */}
      {user?.plan === 'FREE' || user?.plan === 'TRIAL' ? (
        <div className="px-4 py-4 mt-6 mx-2 bg-gradient-to-r from-primary to-primary-dark rounded-lg">
          <h3 className="text-white font-medium">Acesso limitado</h3>
          <p className="mt-1 text-sm text-white/90">Atualize seu plano para recursos premium.</p>
          <NavLink
            to="/assinatura"
            className="mt-4 flex items-center justify-center px-4 py-2 text-sm text-primary font-medium bg-white rounded-md hover:bg-gray-50"
          >
            Atualizar agora
          </NavLink>
        </div>
      ) : null}
    </div>
  );
};

export default Sidebar;