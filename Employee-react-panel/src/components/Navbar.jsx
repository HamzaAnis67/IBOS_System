import { Bell, UserCircle } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-between shadow-sm">
      <div className="text-gray-400 font-medium">Employee Workspace</div>
      <div className="flex items-center gap-6">
        <Bell size={20} className="text-gray-500 cursor-pointer hover:text-indigo-600 transition" />
        <div className="flex items-center gap-2 border-l pl-4 border-gray-100">
          <div className="text-right">
            <p className="text-sm font-bold leading-tight">Sara Rehan</p>
            <p className="text-xs text-indigo-600">Fullstack Developer</p>
          </div>
          <UserCircle size={32} className="text-gray-400" />
        </div>
      </div>
    </header>
  );
}