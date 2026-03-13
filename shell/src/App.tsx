import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./routes/ProtectedRoute";


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
  return (
    <div className="w-full min-h-screen bg-zinc-950 text-zinc-100 selection:bg-cyan-500/30">
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
    </div>
  );
};

export default App;
