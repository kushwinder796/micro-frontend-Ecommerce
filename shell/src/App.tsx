import { Suspense, lazy, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LandingPage from "./components/LandingPage";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./routes/ProtectedRoute";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import { useChatStore } from "./store/useChatStore";
import { signalRService } from "./api/signalrService";
import AIChatBox from "./components/AIChatBox";
import AdminChatDashboard from "./components/AdminChatDashboard";

const AuthApp = lazy(() => import("authApp/AuthApp"));
const ProductsApp = lazy(() => import("productsApp/ProductsApp"));
const CartApp = lazy(()=>import ("cartApp/CartApp"));

const Spinner = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="relative">
      <div className="h-16 w-16 rounded-full border-t-2 border-b-2 border-cyan-500 animate-spin" />
      <div className="absolute inset-0 h-16 w-16 rounded-full border-r-2 border-l-2 border-purple-500 animate-spin [animation-duration:1.5s]" />
    </div>
  </div>
);

const App = () => {
  const { mode } = useThemeStore();
  const { isAdminChatOpen } = useChatStore();
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'Admin';

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode);
  }, [mode]);

  useEffect(() => {
    // Initialize real-time chat connection
    signalRService.init();
  }, []);

  return (
    <div className="w-full min-h-screen transition-colors duration-300" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <Navbar />
      <main className="max-w-screen-2xl mx-auto px-4">
        <ErrorBoundary>
          <Suspense fallback={<Spinner />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth/*" element={<AuthApp />} />

              <Route element={<ProtectedRoute role="User" />}>
                <Route path="/user/dashboard/*" element={<ProductsApp />} />
                <Route path="/cart/*" element={<CartApp />} />
              </Route>

              <Route element={<ProtectedRoute role="Admin" />}>
                <Route path="/admin/*" element={<ProductsApp />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
              
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />

      {/* Global Overlays */}
      {!isAdmin && <AIChatBox />}
      {isAdmin && isAdminChatOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-5xl animate-in zoom-in-95 duration-200">
             <AdminChatDashboard />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

