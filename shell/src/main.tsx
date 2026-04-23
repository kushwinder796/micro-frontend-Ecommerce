import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App.tsx";
import "./index.css";
import "../../cart/src/Components/store/cart.store.ts";

const savedTheme = (() => {
  try {
    const raw = localStorage.getItem("theme-storage");
    if (raw) {
      const parsed = JSON.parse(raw) as { state?: { mode?: string } };
      return parsed?.state?.mode ?? "dark";
    }
  } catch {
    // ignore
  }
  return "dark";
})();
document.documentElement.setAttribute("data-theme", savedTheme);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <div>
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            duration: 4000,
            style: {
              background: "var(--bg-secondary)",
              color: "var(--text-primary)",
              border: "1px solid var(--border-color)",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: "500",
            },
            success: {
              duration: 3000,
              style: {
                background: "var(--bg-secondary)",
                color: "var(--text-primary)",
                border: "1px solid #22c55e",
              },
              iconTheme: { primary: "#22c55e", secondary: "var(--bg-secondary)" },
            },
            error: {
              duration: 5000,
              style: {
                background: "var(--bg-secondary)",
                color: "var(--text-primary)",
                border: "1px solid #ef4444",
              },
              iconTheme: { primary: "#ef4444", secondary: "var(--bg-secondary)" },
            },
          }}
        />
        <App />
      </div>
    </BrowserRouter>
  </StrictMode>
);
