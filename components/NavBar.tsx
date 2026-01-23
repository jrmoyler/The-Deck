import React from 'react';
import { NavLink } from 'react-router-dom';

const NavBar: React.FC = () => {
  const navClass = ({ isActive }: { isActive: boolean }) => 
    `flex flex-col items-center justify-center w-full h-full transition-colors duration-200 ${isActive ? 'text-white' : 'text-zinc-600'}`;

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-zinc-900 border-t border-zinc-800 flex justify-around items-center z-50 pb-2">
      <NavLink to="/dashboard" className={navClass}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mb-1">
            <path fillRule="evenodd" d="M3 6a3 3 0 013-3h2.25a3 3 0 013 3v2.25a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm9.75 0a3 3 0 013-3H18a3 3 0 013 3v2.25a3 3 0 01-3 3h-2.25a3 3 0 01-3-3V6zM3 15.75a3 3 0 013-3h2.25a3 3 0 013 3V18a3 3 0 01-3 3H6a3 3 0 01-3-3v-2.25zm9.75 0a3 3 0 013-3H18a3 3 0 013 3V18a3 3 0 01-3 3h-2.25a3 3 0 01-3-3v-2.25z" clipRule="evenodd" />
        </svg>
        <span className="text-[10px] font-bold uppercase tracking-widest">Dash</span>
      </NavLink>
      
      <NavLink to="/workout" className={({ isActive }) => `relative -top-6 bg-white rounded-full p-4 shadow-[0_0_20px_rgba(255,255,255,0.4)] ${isActive ? 'scale-110' : ''}`}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" className="w-8 h-8">
            <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
        </svg>
      </NavLink>

      <NavLink to="/coach" className={navClass}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mb-1">
            <path fillRule="evenodd" d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z" clipRule="evenodd" />
        </svg>
        <span className="text-[10px] font-bold uppercase tracking-widest">Coach</span>
      </NavLink>
    </nav>
  );
};

export default NavBar;
