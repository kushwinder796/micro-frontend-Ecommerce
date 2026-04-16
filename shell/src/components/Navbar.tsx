import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";
import { useChatStore } from "../store/useChatStore";
import { useCartStore } from "../../../cart/src/Components/store/cart.store";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { mode, cycleTheme } = useThemeStore();
  const { isAdminChatOpen, setIsAdminChatOpen, messages } = useChatStore();
  const navigate = useNavigate();
  const isAdmin = user?.role === "Admin";
  const totalItems = useCartStore((s) => s.totalItems());

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getThemeIcon = () => {
    switch (mode) {
      case "midnight":
        return "🌌";
      default:
        return "🌙";
    }
  };

  return (
    // <nav
    //   className="w-[1480px] mx-auto backdrop-blur-md border-b text-white px-8 py-4 flex justify-between items-center sticky top-0 z-50 transition-colors duration-300"
    //   style={{
    //     backgroundColor: "var(--bg-secondary)",
    //     borderColor: "var(--border-color)",
    //     color: "var(--text-primary)",
    //   }}
    // >
    //   <Link to="#" className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent transition-transform hover:scale-105">
    //     ECommerce
    //   </Link>

    //   <div className="flex gap-4 items-center">
    //     {/* Theme Toggle Button - Always show for accessibility */}
    //     <button
    //       onClick={cycleTheme}
    //       title={`Theme: ${mode}`}
    //       className="p-2.5 rounded-xl border transition-all hover:scale-110 active:scale-95"
    //       style={{
    //         backgroundColor: "var(--bg-primary)",
    //         borderColor: "var(--border-color)",
    //         fontSize: "18px",
    //       }}
    //     >
    //       {getThemeIcon()}
    //     </button>

    //     {user?.role === "Admin" && (
    //       <button
    //         onClick={() => setIsAdminChatOpen(!isAdminChatOpen)}
    //         className={`p-2.5 rounded-xl border transition-all relative ${isAdminChatOpen ? "bg-cyan-500/20 border-cyan-500 text-cyan-400" : "hover:scale-110 active:scale-95"}`}
    //         style={{
    //           backgroundColor: !isAdminChatOpen ? "var(--bg-primary)" : "",
    //           borderColor: !isAdminChatOpen ? "var(--border-color)" : "",
    //           fontSize: "18px",
    //         }}
    //         title="Customer Inquiries"
    //       >
    //         💬
    //         {messages.filter((m) => m.role === "User" && m.status === "sent")
    //           .length > 0 && (
    //           <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-zinc-900 animate-pulse" />
    //         )}
    //       </button>
    //     )}
    //     {!isAdmin && (
    //       <div
    //         onClick={() => navigate("/cart")}
    //         style={{
    //           position: "relative",
    //           width: 45,
    //           height: 45,
    //           background: "#0a0a0a",
    //           border: "1px solid #1a1a1a",
    //           borderRadius: 12,
    //           display: "flex",
    //           alignItems: "center",
    //           justifyContent: "center",
    //           cursor: "pointer",
    //           fontSize: 16,
    //           transition: "border 0.2s",
    //         }}
    //       >
    //         🛒
    //         {totalItems > 0 && (
    //           <span
    //             style={{
    //               position: "absolute",
    //               top: -4,
    //               right: -4,
    //               background: "#7c3aed",
    //               color: "#fff",
    //               fontSize: 9,
    //               fontWeight: 800,
    //               width: 16,
    //               height: 16,
    //               borderRadius: "50%",
    //               display: "flex",
    //               alignItems: "center",
    //               justifyContent: "center",
    //               border: "2px solid #050507",
    //             }}
    //           >
    //             {totalItems}
    //           </span>
    //         )}
    //       </div>
    //     )}

    //     {isAuthenticated ? (
    //       /* ONLY Logout and User Name when logged in */
    //       <div
    //         className="flex items-center gap-6 ml-4 pl-6 border-l"
    //         style={{ borderColor: "var(--border-color)" }}
    //       >
    //         <div className="flex flex-col items-end">
    //           <span
    //             className="font-medium text-sm"
    //             style={{ color: "var(--text-primary)" }}
    //           >
    //             {user?.firstName} {user?.lastName}
    //           </span>
    //           <span
    //             className="text-[10px] uppercase tracking-wider font-bold"
    //             style={{ color: "var(--accent-color)" }}
    //           >
    //             {user?.role}
    //           </span>
    //         </div>

    //         <button
    //           onClick={handleLogout}
    //           className="px-6 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-500 rounded-xl text-sm font-semibold transition-all"
    //         >
    //           Logout
    //         </button>
    //       </div>
    //     ) : (
    //       /* Standard Guest Links */
    //       <div className="flex items-center gap-6">
    //         <Link
    //           to="/"
    //           className="hover:text-cyan-400 transition-colors"
    //           style={{ color: "var(--text-secondary)" }}
    //         >
    //           Home
    //         </Link>
    //         <Link
    //           to="/auth/login"
    //           className="hover:text-cyan-400 transition-colors font-medium"
    //           style={{ color: "var(--text-secondary)" }}
    //         >
    //           Login
    //         </Link>
    //         <Link
    //           to="/auth/register"
    //           className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-xl text-sm font-bold transition-all shadow-xl shadow-cyan-900/20 text-white"
    //         >
    //           Get Started
    //         </Link>
    //       </div>
    //     )}
    //   </div>
    // </nav>
    <nav className="sticky top-0 z-50 px-4 py-4">
  <div
    className="max-w-[1485px] mx-auto flex justify-between items-center px-6 py-3 rounded-2xl border backdrop-blur-md shadow-lg"
    style={{
      backgroundColor: "rgba(20, 20, 25, 0.6)",
      borderColor: "var(--border-color)",
      color: "var(--text-primary)",
    }}
  >
    {/* LOGO */}
    <Link
      to="#"
      className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent hover:scale-105 transition-transform"
    >
      ECommerce
    </Link>

    {/* RIGHT SECTION */}
    <div className="flex items-center gap-4">
      
      {/* Theme Toggle */}
      <button
        onClick={cycleTheme}
        title={`Theme: ${mode}`}
        className="p-2.5 rounded-xl border hover:scale-110 active:scale-95 transition-all"
        style={{
          backgroundColor: "var(--bg-primary)",
          borderColor: "var(--border-color)",
          fontSize: "18px",
        }}
      >
        {getThemeIcon()}
      </button>

      {/* ADMIN CHAT */}
      {user?.role === "Admin" && (
        <button
          onClick={() => setIsAdminChatOpen(!isAdminChatOpen)}
          className={`p-2.5 rounded-xl border relative transition-all ${
            isAdminChatOpen
              ? "bg-cyan-500/20 border-cyan-500 text-cyan-400"
              : "hover:scale-110 active:scale-95"
          }`}
          style={{
            backgroundColor: !isAdminChatOpen
              ? "var(--bg-primary)"
              : "",
            borderColor: !isAdminChatOpen
              ? "var(--border-color)"
              : "",
            fontSize: "18px",
          }}
        >
          💬

          {messages.filter(
            (m) => m.role === "User" && m.status === "sent"
          ).length > 0 && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-zinc-900 animate-pulse" />
          )}
        </button>
      )}

      {/* CART */}
      {!isAdmin && (
        <div
          onClick={() => navigate("/cart")}
          className="relative w-[45px] h-[45px] flex items-center justify-center rounded-xl border cursor-pointer hover:scale-110 transition-all"
          style={{
            background: "#0a0a0a",
            borderColor: "#1a1a1a",
          }}
        >
          🛒

          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 text-[10px] font-bold flex items-center justify-center rounded-full bg-violet-600 text-white border-2 border-black">
              {totalItems}
            </span>
          )}
        </div>
      )}

      {/* AUTH SECTION */}
      {isAuthenticated ? (
        <div
          className="flex items-center gap-6 ml-4 pl-6 border-l"
          style={{ borderColor: "var(--border-color)" }}
        >
          <div className="flex flex-col items-end">
            <span className="text-sm font-medium">
              {user?.firstName} {user?.lastName}
            </span>
            <span
              className="text-[10px] uppercase font-bold tracking-wider"
              style={{ color: "var(--accent-color)" }}
            >
              {user?.role}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="px-5 py-2 rounded-xl text-sm font-semibold border border-red-500/20 text-red-500 bg-red-500/10 hover:bg-red-500/20 transition-all"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="hover:text-cyan-400 transition-colors"
            style={{ color: "var(--text-secondary)" }}
          >
            Home
          </Link>

          <Link
            to="/auth/login"
            className="hover:text-cyan-400 font-medium transition-colors"
            style={{ color: "var(--text-secondary)" }}
          >
            Login
          </Link>

          <Link
            to="/auth/register"
            className="px-6 py-2 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-lg shadow-cyan-900/20 transition-all"
          >
            Get Started
          </Link>
        </div>
      )}
    </div>
  </div>
</nav>
  );
}
