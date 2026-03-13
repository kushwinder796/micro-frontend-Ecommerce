import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../store/cart.store";
import toast from "react-hot-toast";

interface ShippingForm {
  fullName: string;
  email:    string;
  phone:    string;
  address:  string;
  city:     string;
  pincode:  string;
}

const CheckoutPage = () => {
  const { items, totalPrice } = useCartStore();
  const navigate = useNavigate();
  const [form, setForm]       = useState<ShippingForm>({
    fullName: "", email: "", phone: "",
    address: "", city: "", pincode: "",
  });
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Validation
    if (!form.fullName || !form.email || !form.phone || !form.address || !form.city || !form.pincode) {
      toast.error("Please fill all required fields");
      return;
    }
    if (items.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("https://localhost:7227/api/Payment/create-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:  `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderId:       crypto.randomUUID(),
          customerEmail: form.email,
          currency:      "inr",
          successUrl:    "http://localhost:3000/cart/receipt",
          cancelUrl:     "http://localhost:3000/cart",
          items: items.map((i) => ({
            name:     i.name,
            price:    i.price,
            quantity: i.quantity,
            imageUrl: i.imageUrl ?? "",
          })),
        }),
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.message || "Payment session failed");
        return;
      }
      window.location.href = data.data.url;

    } catch (err) {
      toast.error("Something went wrong");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (field: string): React.CSSProperties => ({
    width: "100%", padding: "11px 14px",
    background: "#0a0a0a",
    border: focused === field ? "1px solid #7c3aed" : "1px solid #1a1a1a",
    borderRadius: 10, color: "#f4f4f5", fontSize: 13,
    outline: "none", transition: "all 0.2s",
    boxShadow: focused === field ? "0 0 0 3px rgba(124,58,237,0.1)" : "none",
    boxSizing: "border-box",
  });

  const labelStyle: React.CSSProperties = {
    fontSize: 11, fontWeight: 700, color: "#52525b",
    textTransform: "uppercase", letterSpacing: 1,
    display: "block", marginBottom: 6,
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#050507",
      fontFamily: "'DM Sans', sans-serif", padding: "32px 24px",
    }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <button
            onClick={() => navigate("/cart")}
            style={{
              background: "none", border: "none", color: "#52525b",
              fontSize: 13, cursor: "pointer", padding: 0,
              fontWeight: 600, marginBottom: 10, display: "block",
            }}
          >← Back to Cart</button>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#fff", margin: 0 }}>
            Checkout
          </h1>
          <p style={{ fontSize: 13, color: "#52525b", margin: "4px 0 0" }}>
            Fill shipping details to complete your order
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 }}>

          {/* Form */}
          <form onSubmit={handlePlaceOrder}>
            <div style={{
              background: "#0a0a0a", border: "1px solid #1a1a1a",
              borderRadius: 16, padding: 24, marginBottom: 16,
            }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: "#fff", margin: "0 0 20px",
                display: "flex", alignItems: "center", gap: 8,
              }}>
                <span>📦</span> Shipping Details
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>

                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Full Name *</label>
                  <input
                    name="fullName" value={form.fullName}
                    onChange={handleChange}
                    onFocus={() => setFocused("fullName")}
                    onBlur={() => setFocused("")}
                    placeholder="Kushwinder Thakur"
                    style={inputStyle("fullName")}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Email *</label>
                  <input
                    name="email" type="email" value={form.email}
                    onChange={handleChange}
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused("")}
                    placeholder="you@email.com"
                    style={inputStyle("email")}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Phone *</label>
                  <input
                    name="phone" value={form.phone}
                    onChange={handleChange}
                    onFocus={() => setFocused("phone")}
                    onBlur={() => setFocused("")}
                    placeholder=""
                    style={inputStyle("phone")}
                  />
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Address *</label>
                  <input
                    name="address" value={form.address}
                    onChange={handleChange}
                    onFocus={() => setFocused("address")}
                    onBlur={() => setFocused("")}
                    placeholder="House no, Street, Area"
                    style={inputStyle("address")}
                  />
                </div>

                <div>
                  <label style={labelStyle}>City *</label>
                  <input
                    name="city" value={form.city}
                    onChange={handleChange}
                    onFocus={() => setFocused("city")}
                    onBlur={() => setFocused("")}
                    placeholder="chd."
                    style={inputStyle("city")}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Pincode *</label>
                  <input
                    name="pincode" value={form.pincode}
                    onChange={handleChange}
                    onFocus={() => setFocused("pincode")}
                    onBlur={() => setFocused("")}
                    placeholder="141001"
                    style={inputStyle("pincode")}
                  />
                </div>
              </div>
            </div>

            {/* Pay button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", padding: "15px 0",
                borderRadius: 12, border: "none",
                fontSize: 15, fontWeight: 800, color: "#fff",
                cursor: loading ? "not-allowed" : "pointer",
                background: "linear-gradient(135deg,#7c3aed,#a855f7)",
                boxShadow: "0 4px 20px rgba(124,58,237,0.4)",
                display: "flex", alignItems: "center",
                justifyContent: "center", gap: 10,
                opacity: loading ? 0.7 : 1, transition: "all 0.2s",
              }}
            >
              {loading ? (
                <>
                  <span style={{
                    width: 16, height: 16,
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTopColor: "#fff", borderRadius: "50%",
                    animation: "spin 0.7s linear infinite",
                    display: "inline-block", flexShrink: 0,
                  }} />
                  Processing...
                </>
              ) : (
                <> 💳 Pay ₹{totalPrice().toLocaleString()} with Stripe </>
              )}
            </button>
          </form>

          {/* Order Summary */}
          <div style={{
            background: "#0a0a0a", border: "1px solid #1a1a1a",
            borderRadius: 16, padding: 20,
            position: "sticky", top: 20, alignSelf: "start",
          }}>
            <p style={{ fontSize: 15, fontWeight: 700, color: "#fff", margin: "0 0 16px" }}>
              Order Summary
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
              {items.map((item) => (
                <div key={item.id} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 8,
                    background: "#111", flexShrink: 0, overflow: "hidden",
                  }}>
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <div style={{
                        width: "100%", height: "100%",
                        display: "flex", alignItems: "center",
                        justifyContent: "center", fontSize: 18,
                      }}>📦</div>
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontSize: 12, fontWeight: 600, color: "#fff", margin: 0,
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>{item.name}</p>
                    <p style={{ fontSize: 11, color: "#52525b", margin: "2px 0 0" }}>
                      ×{item.quantity} · ₹{item.price.toLocaleString()}
                    </p>
                  </div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#a855f7", margin: 0, flexShrink: 0 }}>
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            <div style={{ borderTop: "1px solid #1a1a1a", paddingTop: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: "#71717a" }}>Subtotal</span>
                <span style={{ fontSize: 13, color: "#fff", fontWeight: 600 }}>
                  ₹{totalPrice().toLocaleString()}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                <span style={{ fontSize: 13, color: "#71717a" }}>Delivery</span>
                <span style={{ fontSize: 13, color: "#22c55e", fontWeight: 700 }}>FREE</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 17, fontWeight: 800, color: "#fff" }}>Total</span>
                <span style={{ fontSize: 19, fontWeight: 800, color: "#a855f7" }}>
                  ₹{totalPrice().toLocaleString()}
                </span>
              </div>
            </div>

            {/* Security */}
            <div style={{
              marginTop: 16, padding: "10px 14px", borderRadius: 10,
              background: "rgba(34,197,94,0.05)",
              border: "1px solid rgba(34,197,94,0.15)",
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <span style={{ fontSize: 16 }}>🔒</span>
              <p style={{ fontSize: 11, color: "#52525b", margin: 0 }}>
                Secured by <strong style={{ color: "#22c55e" }}>Stripe</strong> · 256-bit SSL
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder { color: #3f3f46; }
      `}</style>
    </div>
  );
};

export default CheckoutPage;