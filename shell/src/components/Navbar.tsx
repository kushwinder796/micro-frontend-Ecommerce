import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";
import { useChatStore } from "../store/useChatStore";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { mode, cycleTheme } = useThemeStore();
  const { isAdminChatOpen, setIsAdminChatOpen, messages } = useChatStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getThemeIcon = () => {
    switch (mode) {
      case 'light': return '☀️';
      case 'midnight': return '🌌';
      default: return '🌙';
    }
  };

  return (
    <nav className="backdrop-blur-md border-b text-white px-8 py-4 flex justify-between items-center sticky top-0 z-50 transition-colors duration-300"
      style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
      <Link
        to="/"
        className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent transition-transform hover:scale-105"
      >
        ECommerce
      </Link>

      <div className="flex gap-4 items-center">
        {/* Theme Toggle Button - Always show for accessibility */}
        <button
          onClick={cycleTheme}
          title={`Theme: ${mode}`}
          className="p-2.5 rounded-xl border transition-all hover:scale-110 active:scale-95"
          style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)', fontSize: '18px' }}
        >
          {getThemeIcon()}
        </button>

        {isAuthenticated ? (
          /* ONLY Logout and User Name when logged in */
          <div className="flex items-center gap-6 ml-4 pl-6 border-l" style={{ borderColor: 'var(--border-color)' }}>
            <div className="flex flex-col items-end">
              <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                {user?.firstName} {user?.lastName}
              </span>
              <span className="text-[10px] uppercase tracking-wider font-bold" style={{ color: 'var(--accent-color)' }}>
                {user?.role}
              </span>
            </div>

            {user?.role === 'Admin' && (
              <button
                onClick={() => setIsAdminChatOpen(!isAdminChatOpen)}
                className={`p-2.5 rounded-xl border transition-all relative ${isAdminChatOpen ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' : 'hover:scale-110 active:scale-95'}`}
                style={{ backgroundColor: !isAdminChatOpen ? 'var(--bg-primary)' : '', borderColor: !isAdminChatOpen ? 'var(--border-color)' : '', fontSize: '18px' }}
                title="Customer Inquiries"
              >
                💬
                {messages.filter(m => m.role === 'User' && m.status === 'sent').length > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-zinc-900 animate-pulse" />
                )}
              </button>
            )}

            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-500 rounded-xl text-sm font-semibold transition-all"
            >
              Logout
            </button>
          </div>
        ) : (
          /* Standard Guest Links */
          <div className="flex items-center gap-6">
            <Link to="/" className="hover:text-cyan-400 transition-colors" style={{ color: 'var(--text-secondary)' }}>
              Home
            </Link>
            <Link to="/auth/login" className="hover:text-cyan-400 transition-colors font-medium" style={{ color: 'var(--text-secondary)' }}>
              Login
            </Link>
            <Link
              to="/auth/register"
              className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-xl text-sm font-bold transition-all shadow-xl shadow-cyan-900/20 text-white"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}