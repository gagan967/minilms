import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export function Layout({ children }) {
  const { user, logout } = useAuth();
  const { dark, toggleDark } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200">
      <nav className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
          <Link to="/dashboard" className="font-semibold text-lg text-indigo-600 dark:text-indigo-400">
            Mini LMS
          </Link>
          <div className="flex items-center gap-4">
<Link to="/dashboard" className="text-sm hover:text-indigo-600 dark:hover:text-indigo-400">
            Dashboard
          </Link>
          <Link to="/courses" className="text-sm hover:text-indigo-600 dark:hover:text-indigo-400">
              Courses
            </Link>
            <button
              onClick={toggleDark}
              className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              aria-label="Toggle theme"
            >
              {dark ? (
                <span className="text-lg" title="Light mode">☀️</span>
              ) : (
                <span className="text-lg" title="Dark mode">🌙</span>
              )}
            </button>
            <span className="text-sm text-slate-500 dark:text-slate-400">{user?.name}</span>
            <button
              onClick={handleLogout}
              className="text-sm text-red-600 dark:text-red-400 hover:underline"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
