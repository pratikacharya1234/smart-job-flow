
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Home, FileText, FileSignature, BarChart2, Trello, User, Settings, LogOut } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useUser();
  
  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: <Home className="h-5 w-5" /> },
    { name: 'Resume Builder', href: '/resume', icon: <FileText className="h-5 w-5" /> },
    { name: 'Cover Letter', href: '/cover-letter', icon: <FileSignature className="h-5 w-5" /> },
    { name: 'Job Analyzer', href: '/analyzer', icon: <BarChart2 className="h-5 w-5" /> },
    { name: 'Application Tracker', href: '/tracker', icon: <Trello className="h-5 w-5" /> },
  ];

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 flex items-center justify-center border-b">
        <Link to="/" className="flex items-center">
          <span className="text-xl font-bold bg-gradient-to-r from-brand-purple to-brand-purple-dark bg-clip-text text-transparent">
            AutoApply AI
          </span>
        </Link>
      </div>
      
      <div className="flex-1 overflow-auto py-4">
        <nav className="space-y-1 px-3">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                location.pathname === item.href
                  ? 'text-brand-purple bg-brand-purple/10'
                  : 'text-gray-600 hover:text-brand-purple hover:bg-brand-purple/5'
              )}
            >
              <span className="mr-3">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>
      
      <div className="p-4 border-t">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <User className="h-5 w-5 text-gray-500" />
          </div>
          <div>
            <p className="text-sm font-medium">
              {user.name || 'Guest User'}
            </p>
            <p className="text-xs text-gray-500">
              {user.email || 'guest@example.com'}
            </p>
          </div>
        </div>
        
        <div className="flex flex-col space-y-2">
          <Link
            to="/dashboard"
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-brand-purple rounded-md hover:bg-brand-purple/5"
          >
            <Settings className="h-4 w-4 mr-3" />
            <span>Settings</span>
          </Link>
          
          <button
            onClick={logout}
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-red-500 rounded-md hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-4 w-4 mr-3" />
            <span>Log out</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
