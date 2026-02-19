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
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 text-slate-800 dark:text-slate-200">
      <nav className="border-b border-white/20 bg-white/10 dark:bg-black/10 backdrop-blur-md shadow-sm">
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
              className="p-2 rounded-lg bg-white/20 dark:bg-black/20 hover:bg-white/30 dark:hover:bg-black/30 transition-colors border border-white/20"
              aria-label="Toggle theme"
            >
              {dark ? (
                <span className="text-lg" title="Light mode">☀️</span>
              ) : (
                <span className="text-lg" title="Dark mode">🌙</span>
              )}
            </button>
            <span className="text-sm text-slate-600 dark:text-slate-300">{user?.name}</span>
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
