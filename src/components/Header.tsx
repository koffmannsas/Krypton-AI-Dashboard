import { Bell, Search, User } from 'lucide-react';

export default function Header() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg w-64">
        <Search size={18} className="text-gray-400" />
        <input type="text" placeholder="Search..." className="bg-transparent outline-none w-full" />
      </div>
      <div className="flex items-center gap-4">
        <button className="text-gray-500 hover:text-gray-700">
          <Bell size={20} />
        </button>
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
          <User size={18} />
        </div>
      </div>
    </header>
  );
}
