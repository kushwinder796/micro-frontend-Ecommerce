import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../store/cart.store";
import apiClient from "../../../../auth/src/api/api-client"; 
import toast from "react-hot-toast";

const ReceiptPage = () => {
  const { clearCart } = useCartStore();
  const navigate = useNavigate();

  const [orderId] = useState(
    () =>
      new URLSearchParams(window.location.search).get("orderId") ||
      "ORD-" + Date.now()
  );
  const [sessionId] = useState(
    () => new URLSearchParams(window.location.search).get("session_id") || ""
  );
  const [shippingAddress] = useState(
    () => localStorage.getItem("shippingAddress") || "India"
  );
  const [shippingMap] = useState(
    () => localStorage.getItem("shippingMap") || ""
  );
  const [shippingDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 3);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  });


  const handleClear = useCallback(() => {
    clearCart(true);
  }, [clearCart]);

  useEffect(() => {
    handleClear();

    const email: string | null = localStorage.getItem("shippingEmail");
    const phone: string | null = localStorage.getItem("shippingPhone");
    const customerName: string =
      localStorage.getItem("customerName") || "Customer";
    const totalAmount: string = localStorage.getItem("totalAmount") || "0";

    console.log("email:", email);
    console.log("phone:", phone);

    if (email || phone) {
      const timer = setTimeout(async () => {
        const loadingToast = toast.loading("Sending order confirmation...");

        try {
          let formattedPhone = "";
          if (phone) {
            const cleaned = phone.replace(/[\s\-()]/g, "");
            formattedPhone = cleaned.startsWith("+") ? cleaned : "+91" + cleaned;
          }

          const response = await apiClient.post<{
            success: boolean;
            message: string;
          }>(
            "/order/confirm",
            {
              Id: orderId,
              CustomerName: customerName,
              Email: email || "",
              Phone: formattedPhone,
              ShippingDate: shippingDate,
              TotalAmount: parseFloat(totalAmount) || 0,
            },
            {
              headers: { "x-skip-toast": "true" }, 
            }
          );

          toast.dismiss(loadingToast);

          if (response.data.success) {
            toast.success(
              `Order confirmation sent!\n📧 ${email}`,
              {
                duration: 8000,
                style: {
                  background: "#0a0a0a",
                  color: "#fff",
                  border: "1px solid #27272a",
                  fontSize: 14,
                },
                icon: "🚀",
              }
            );
          } else {
            toast.error(`Failed: ${response.data.message}`);
          }
        } catch (err: unknown) {
          toast.dismiss(loadingToast);

          let errorMessage = "An unexpected error occurred";
          if (err instanceof Error) {
            errorMessage = err.message;
          }

          toast.error(`Confirmation failed: ${errorMessage}`, {
            duration: 6000,
            style: {
              background: "#0a0a0a",
              color: "#fff",
              border: "1px solid #7f1d1d",
              fontSize: 14,
            },
          });

          console.error("Full Error:", err);
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [handleClear, orderId, shippingDate]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#050507",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'DM Sans', sans-serif",
        padding: 24,
      }}
    >
      <div
        style={{
          maxWidth: 460,
          width: "100%",
          background: "#0a0a0a",
          border: "1px solid #1a1a1a",
          borderRadius: 24,
          padding: "40px 36px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            margin: "0 auto 24px",
            background: "radial-gradient(circle,rgba(34,197,94,0.15),transparent)",
            border: "2px solid rgba(34,197,94,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 34,
            boxShadow: "0 0 30px rgba(34,197,94,0.15)",
          }}
        >
          ✅
        </div>

        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#fff", margin: "0 0 8px" }}>
          Your order is successfully done!
        </h1>
        <p style={{ fontSize: 14, color: "#52525b", margin: "0 0 32px" }}>
          Your order has been placed successfully. Your expected shipping date is {shippingDate}.
        </p>

        {/* Receipt */}
        <div
          style={{
            background: "#050507",
            border: "1px solid #1a1a1a",
            borderRadius: 14,
            padding: "18px 20px",
            marginBottom: 28,
            textAlign: "left",
          }}
        >
          <p style={{ fontSize: 10, fontWeight: 700, color: "#3f3f46", textTransform: "uppercase", letterSpacing: 1.5, margin: "0 0 14px" }}>
            Receipt
          </p>
          {[
            { label: "Order ID", value: orderId },
            { label: "Session", value: sessionId ? sessionId.slice(0, 20) + "..." : "N/A" },
            { label: "Date", value: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) },
            { label: "Payment", value: "Stripe · Paid ✅" },
            { label: "Shipping Date", value: shippingDate },
          ].map((row) => (
            <div
              key={row.label}
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: "1px solid #111" }}
            >
              <span style={{ fontSize: 12, color: "#52525b" }}>{row.label}</span>
              <span style={{ fontSize: 12, color: "#fff", fontWeight: 600 }}>{row.value}</span>
            </div>
          ))}
        </div>

        {/* Delivery Map */}
        <div
          style={{
            background: "#050507",
            border: "1px solid #1a1a1a",
            borderRadius: 14,
            padding: "18px 20px",
            marginBottom: 28,
            textAlign: "left",
          }}
        >
          <p style={{ fontSize: 10, fontWeight: 700, color: "#3f3f46", textTransform: "uppercase", letterSpacing: 1.5, margin: "0 0 14px", display: "flex", justifyContent: "space-between" }}>
            <span>Delivery Location</span>
            <span style={{ color: "#22c55e" }}>📍 {shippingAddress.slice(0, 25)}{shippingAddress.length > 25 ? "..." : ""}</span>
          </p>
          <div style={{ width: "100%", height: 180, borderRadius: 10, overflow: "hidden", border: "1px solid #1a1a1a", background: "#111" }}>
            <iframe
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={shippingMap || `https://maps.google.com/maps?q=${encodeURIComponent(shippingAddress)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
            />
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button
            onClick={() => navigate("/user/dashboard")}
            style={{ padding: "14px 0", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#7c3aed,#a855f7)", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 20px rgba(124,58,237,0.3)" }}
          >
            Continue Shopping
          </button>
          <button
            onClick={() => window.print()}
            style={{ padding: "12px 0", borderRadius: 12, border: "1px solid #27272a", background: "transparent", color: "#71717a", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
          >
            Print Receipt
          </button>
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