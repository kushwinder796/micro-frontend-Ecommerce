import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-zinc-900/50 backdrop-blur-md border-b border-zinc-800 text-white px-8 py-4 flex justify-between items-center sticky top-0 z-50">
      <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent transition-transform hover:scale-105">
        ECommerce
      </Link>
      <div className="flex gap-8 items-center">
        <Link to="/" className="text-zinc-400 hover:text-white transition-colors">Home</Link>
        
        {isAuthenticated ? (
          <>
            {user?.role === 'Admin' ? (
              <Link to="/admin" className="text-zinc-400 hover:text-white transition-colors">Admin Panel</Link>
            ) : (
              <Link to="/user/dashboard" className="text-zinc-400 hover:text-white transition-colors">Dashboard</Link>
            )}
            <div className="flex items-center gap-6 ml-4 pl-6 border-l border-zinc-800">
              <div className="flex flex-col items-end">
                <span className="text-zinc-100 font-medium text-sm">{user?.firstName} {user?.lastName}</span>
                <span className="text-zinc-500 text-[10px] uppercase tracking-wider font-bold">{user?.role}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl text-sm font-semibold transition-all"
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <>
            <Link to="/auth/login" className="text-zinc-400 hover:text-white transition-colors font-medium">Login</Link>
            <Link 
              to="/auth/register" 
              className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-xl text-sm font-bold transition-all shadow-xl shadow-cyan-900/20"
            >
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}