
import React from 'react';
import { AppView, NavItem } from '../types';
import LogoIcon from './icons/LogoIcon';
import { NAV_ITEMS } from '../constants';

interface HeaderProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  serverConnected: boolean;
  interfaceSelected: boolean;
}

const Header: React.FC<HeaderProps> = ({ currentView, onNavigate, serverConnected, interfaceSelected }) => {
  return (
    <header className="bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <LogoIcon className="w-8 h-8 text-indigo-500" />
            <span className="ml-3 text-2xl font-bold text-gray-100">PacketForge</span>
          </div>
          <nav className="flex space-x-4">
            {NAV_ITEMS.map((item) => {
              const isDisabled = item.disabled ? item.disabled(serverConnected, interfaceSelected) : false;
              return (
                <button
                  key={item.name}
                  onClick={() => onNavigate(item.view)}
                  disabled={isDisabled}
                  className={`
                    px-3 py-2 rounded-md text-sm font-medium transition-colors
                    ${isDisabled ? 'text-gray-500 cursor-not-allowed' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}
                    ${!isDisabled && currentView === item.view ? 'bg-gray-900 text-white' : ''}
                  `}
                >
                  {item.name}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
