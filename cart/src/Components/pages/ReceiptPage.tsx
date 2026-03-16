import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../store/cart.store";

const ReceiptPage = () => {
  const { clearCart } = useCartStore();
  const navigate      = useNavigate();

  const [orderId] = useState(() =>
    new URLSearchParams(window.location.search).get("orderId") || "ORD-" + Date.now()
  );
  const [sessionId] = useState(() =>
    new URLSearchParams(window.location.search).get("session_id") || ""
  );

  const handleClear = useCallback(() => {
    clearCart();
  }, [clearCart]);

  useEffect(() => {
    handleClear();
  }, [handleClear]);

  return (
    <div style={{
      minHeight: "100vh", background: "#050507",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'DM Sans', sans-serif", padding: 24,
    }}>
      <div style={{
        maxWidth: 460, width: "100%",
        background: "#0a0a0a", border: "1px solid #1a1a1a",
        borderRadius: 24, padding: "40px 36px", textAlign: "center",
      }}>

        <div style={{
          width: 80, height: 80, borderRadius: "50%", margin: "0 auto 24px",
          background: "radial-gradient(circle,rgba(34,197,94,0.15),transparent)",
          border: "2px solid rgba(34,197,94,0.3)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34,
          boxShadow: "0 0 30px rgba(34,197,94,0.15)",
        }}>✅</div>

        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#fff", margin: "0 0 8px" }}>
          Payment Successful!
        </h1>
        <p style={{ fontSize: 14, color: "#52525b", margin: "0 0 32px" }}>
          Your order has been placed. You'll receive a confirmation email shortly.
        </p>

        {/* Receipt */}
        <div style={{
          background: "#050507", border: "1px solid #1a1a1a",
          borderRadius: 14, padding: "18px 20px",
          marginBottom: 28, textAlign: "left",
        }}>
          <p style={{
            fontSize: 10, fontWeight: 700, color: "#3f3f46",
            textTransform: "uppercase", letterSpacing: 1.5, margin: "0 0 14px",
          }}>Receipt</p>

          {[
            { label: "Order ID",  value: orderId },
            { label: "Session",   value: sessionId ? sessionId.slice(0, 20) + "..." : "N/A" },
            { label: "Date",      value: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) },
            { label: "Payment",   value: "Stripe · Paid ✅" },
            { label: "Delivery",  value: "3–5 Business Days" },
          ].map((row) => (
            <div key={row.label} style={{
              display: "flex", justifyContent: "space-between",
              alignItems: "center", padding: "9px 0",
              borderBottom: "1px solid #111",
            }}>
              <span style={{ fontSize: 12, color: "#52525b" }}>{row.label}</span>
              <span style={{ fontSize: 12, color: "#fff", fontWeight: 600 }}>{row.value}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button
            onClick={() => navigate("/user/dashboard")}
            style={{
              padding: "14px 0", borderRadius: 12, border: "none",
              background: "linear-gradient(135deg,#7c3aed,#a855f7)",
              color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer",
              boxShadow: "0 4px 20px rgba(124,58,237,0.3)",
            }}
          >Continue Shopping</button>

          <button
            onClick={() => window.print()}
            style={{
              padding: "12px 0", borderRadius: 12,
              border: "1px solid #27272a", background: "transparent",
              color: "#71717a", fontSize: 13, fontWeight: 600, cursor: "pointer",
            }}
          >🖨️ Print Receipt</button>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800&display=swap');
        @media print { button { display: none !important; } }
      `}</style>
    </div>
  );
};

export default ReceiptPage;