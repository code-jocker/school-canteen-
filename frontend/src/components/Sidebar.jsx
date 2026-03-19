import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Wallet,
  ShoppingCart,
  ArrowDownLeft,
  ArrowUpRight,
  FileText,
  BarChart3,
  UserCog,
  Settings,
  LogOut,
  GraduationCap,
  MessageCircle,
  X
} from 'lucide-react';

const Sidebar = ({ onClose }) => {
  const { user, isSuperAdmin, isDeanAdmin, isCanteen, logout } = useAuth();

  const adminLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/classes', icon: GraduationCap, label: 'Classes' },
    { to: '/students', icon: Users, label: 'Students' },
    { to: '/deposit', icon: ArrowDownLeft, label: 'Deposit' },
    { to: '/purchase', icon: ShoppingCart, label: 'Purchase' },
    { to: '/withdrawals', icon: ArrowUpRight, label: 'Withdrawals' },
    { to: '/transactions', icon: FileText, label: 'Transactions' },
    { to: '/reports', icon: BarChart3, label: 'Reports' },
    { to: '/users', icon: UserCog, label: 'Users' },
    { to: '/chat', icon: MessageCircle, label: 'Chat' },
    { to: '/settings', icon: Settings, label: 'Settings' }
  ];

  const deanLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/classes', icon: GraduationCap, label: 'Classes' },
    { to: '/students', icon: Users, label: 'Students' },
    { to: '/deposit', icon: ArrowDownLeft, label: 'Deposit' },
    { to: '/withdrawals', icon: ArrowUpRight, label: 'Withdrawals' },
    { to: '/transactions', icon: FileText, label: 'Transactions' },
    { to: '/reports', icon: BarChart3, label: 'Reports' },
    { to: '/users', icon: UserCog, label: 'Users' },
    { to: '/chat', icon: MessageCircle, label: 'Chat' },
    { to: '/settings', icon: Settings, label: 'Settings' }
  ];

  const canteenLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/purchase', icon: ShoppingCart, label: 'Purchase' },
    { to: '/transactions', icon: FileText, label: 'Transactions' },
    { to: '/chat', icon: MessageCircle, label: 'Chat' }
  ];

  let links = canteenLinks;
  if (isSuperAdmin()) {
    links = adminLinks;
  } else if (isDeanAdmin()) {
    links = deanLinks;
  }

  const getRoleLabel = () => {
    if (isSuperAdmin()) return 'Super Admin';
    if (isDeanAdmin()) return 'Dean + Admin';
    return 'Canteen Staff';
  };

  return (
    <div className="w-64 h-full flex flex-col text-white" style={{ backgroundColor: '#002B7F' }}>
      {/* Logo */}
      <div className="p-3 md:p-4 border-b border-blue-900 flex justify-between items-center">
        <div className="text-center flex-1">
          <h1 className="text-lg md:text-xl font-bold">Kageyo TSS</h1>
          <p className="text-xs text-blue-200 mt-0.5 md:mt-1 hidden sm:block">School Canteen System</p>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="md:hidden p-1 hover:bg-blue-800 rounded absolute right-2 top-2"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded transition-colors ${
                    isActive
                      ? 'font-semibold'
                      : ''
                  }`
                }
                style={({ isActive }) => isActive ? { backgroundColor: '#FFD100', color: '#212121' } : {}}
              >
                <link.icon size={20} />
                <span>{link.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-blue-900">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold" style={{ backgroundColor: '#FFD100', color: '#212121' }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{user?.name}</p>
            <p className="text-xs text-blue-200">{getRoleLabel()}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition-colors"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
