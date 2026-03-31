import { useNavigate } from "react-router-dom";
import { useCartStore } from "../store/cart.store";

const CartPage = () => {
  const {
    items,
    removeFromCart,
    increaseQty,
    decreaseQty,
    totalPrice,
    clearCart,
  } = useCartStore();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div
        style={{
          minHeight: "100dvh",
          width: "100%",
          background: "#050507",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          textAlign: "center",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <div
          style={{
            width: 90,
            height: 90,
            borderRadius: 24,
            background: "#0a0a0a",
            border: "1px solid #1a1a1a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 38,
          }}
        >
          🛒
        </div>
        <p style={{ color: "#fff", fontSize: 20, fontWeight: 800, margin: 0 }}>
          Your cart is empty
        </p>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800&display=swap');`}</style>
      </div>
    );
  }

  // Calculate discount and final price
  const subtotal = totalPrice();
 

  return (
    <div
      style={{
        minHeight: "100vh",
        fontFamily: "'DM Sans', sans-serif",
        padding: "32px 24px",
      }}
    >
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 28,
          }}
        >
          <div>
            <button
              onClick={() => navigate("/user/dashboard")}
              className="bg-cyan-400 mb-4 "
            >
              ← Continue Shopping
            </button>

            <h1
              style={{
                fontSize: 26,
                fontWeight: 800,
                color: "#fff",
                margin: 0,
              }}
            >
              Your Cart
            </h1>

            <p style={{ fontSize: 13, color: "#52525b", margin: "4px 0 0" }}>
              {items.length} item{items.length > 1 ? "s" : ""}
            </p>
          </div>

          <button
            onClick={clearCart}
            style={{
              padding: "8px 16px",
              borderRadius: 10,
              border: "1px solid rgba(239,68,68,0.2)",
              background: "rgba(239,68,68,0.08)",
              color: "#f87171",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            🗑️ Clear Cart
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 340px",
            gap: 20,
            alignItems: "start",
          }}
        >
          {/* Cart Items */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {items.map((item) => (
              <div
                key={item.id}
                style={{
                  background: "#0a0a0a",
                  border: "1px solid #1a1a1a",
                  borderRadius: 16,
                  padding: 16,
                  display: "flex",
                  gap: 16,
                  alignItems: "center",
                  transition: "border 0.2s",
                }}
              >
                {/* Image */}
                <div
                  style={{
                    width: 88,
                    height: 88,
                    borderRadius: 12,
                    background: "#111",
                    flexShrink: 0,
                    overflow: "hidden",
                  }}
                >
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 30,
                      }}
                    >
                      📦
                    </div>
                  )}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: "#fff",
                      margin: 0,
                    }}
                  >
                    {item.name}
                  </p>
                  <p
                    style={{
                      fontSize: 17,
                      fontWeight: 800,
                      color: "#a855f7",
                      margin: 0,
                    }}
                  >
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>

                {/* Qty controls */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    flexShrink: 0,
                  }}
                >
                  <button
                    onClick={() => decreaseQty(item.id)}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: "#1a1a1a",
                      border: "1px solid #27272a",
                      color: "#fff",
                      fontSize: 18,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                    }}
                  >
                    −
                  </button>
                  <span
                    style={{
                      fontSize: 15,
                      fontWeight: 800,
                      color: "#fff",
                      minWidth: 24,
                      textAlign: "center",
                    }}
                  >
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => increaseQty(item.id)}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: "#1a1a1a",
                      border: "1px solid #27272a",
                      color: "#fff",
                      fontSize: 18,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                    }}
                  >
                    +
                  </button>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 9,
                    flexShrink: 0,
                    background: "rgba(239,68,68,0.08)",
                    border: "1px solid rgba(239,68,68,0.2)",
                    color: "#f87171",
                    cursor: "pointer",
                    fontSize: 15,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div
            style={{
              background: "#0a0a0a",
              border: "1px solid #1a1a1a",
              borderRadius: 16,
              padding: 20,
              position: "sticky",
              top: 20,
            }}
          >
            <p
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "#fff",
                margin: "0 0 16px",
              }}
            >
              Order Summary
            </p>

            {/* Item list */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                marginBottom: 16,
              }}
            >
              {items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 13,
                  }}
                >
                  <span style={{ color: "#71717a" }}>
                    {item.name} × {item.quantity}
                  </span>

                  <span style={{ color: "#fff", fontWeight: 600 }}>
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: "1px solid #1a1a1a", paddingTop: 14 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <span style={{ fontSize: 13, color: "#71717a" }}>Subtotal</span>
                <span style={{ fontSize: 13, color: "#fff", fontWeight: 600 }}>
                  ₹{subtotal.toLocaleString()}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 16,
                }}
              >
                <span style={{ fontSize: 13, color: "#71717a" }}>Delivery</span>
                <span
                  style={{ fontSize: 13, color: "#22c55e", fontWeight: 700 }}
                >
                  FREE
                </span>
              </div>


              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 20,
                  alignItems: "flex-end",
                  gap: 12,
                }}
              >
                <span style={{ fontSize: 17, fontWeight: 800, color: "#fff" }}>
                  Total
                </span>
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#71717a",
                      textDecoration: "line-through",
                      marginBottom: 4,
                    }}
                  >
                    ₹{subtotal.toLocaleString()}
                  </div>
                  <span
                    style={{ fontSize: 19, fontWeight: 800, color: "#a855f7" }}
                  >
                  ₹{totalPrice().toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigate("/cart/checkout")}
                style={{
                  width: "100%",
                  padding: "14px 0",
                  borderRadius: 12,
                  border: "none",
                  fontSize: 14,
                  fontWeight: 800,
                  background: "linear-gradient(135deg,#7c3aed,#a855f7)",
                  color: "#fff",
                  cursor: "pointer",
                  boxShadow: "0 4px 20px rgba(124,58,237,0.35)",
                }}
              >
                Proceed to Checkout →
              </button>
            </div>

            <div
              style={{
                marginTop: 12,
                padding: "10px 14px",
                borderRadius: 10,
                background: "rgba(34,197,94,0.05)",
                border: "1px solid rgba(34,197,94,0.15)",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span style={{ fontSize: 16 }}>🔒</span>
              <p style={{ fontSize: 11, color: "#52525b", margin: 0 }}>
                100% secure checkout
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800&display=swap');
      `}</style>
    </div>
  );
};

export default CartPage;