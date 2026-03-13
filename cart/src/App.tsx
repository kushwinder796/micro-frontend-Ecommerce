import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";

const CartPage     = lazy(() => import("./Components/pages/CartPage"));
const CheckoutPage = lazy(() => import("./Components/pages/CheckoutPage"));
const ReceiptPage  = lazy(() => import("./Components/pages/ReceiptPage"));

const Spinner = () => (
  <div style={{
    minHeight: "100vh", background: "#050507",
    display: "flex", alignItems: "center", justifyContent: "center",
  }}>
    <div style={{
      width: 40, height: 40, borderRadius: "50%",
      border: "3px solid #1a1a1a", borderTopColor: "#7c3aed",
      animation: "spin 0.7s linear infinite",
    }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

const App = () => {
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route index element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="receipt" element={<ReceiptPage />} />
      </Routes>
    </Suspense>
  );
};

export default App;