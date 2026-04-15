import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, MessageCircle, LogOut } from 'lucide-react';

export default function Sidebar() {
  const menuItems = [
    { name: 'Tasks', path: '/tasks', icon: <LayoutDashboard size={20}/> },
    { name: 'Invoices', path: '/invoices', icon: <FileText size={20}/> },
    { name: 'Messages', path: '/messages', icon: <MessageCircle size={20}/> },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col transition-all duration-300">
      <div className="p-6 font-bold text-2xl border-b border-slate-800">
        Emp<span className="text-indigo-400">Panel</span>
      </div>
      <nav className="flex-1 mt-6 px-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                isActive ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            {item.icon}
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-800">
        <button className="flex items-center gap-3 p-3 w-full text-slate-400 hover:text-red-400 transition-colors">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}