
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";  
import { Toaster } from "react-hot-toast";           
import App from "./App.tsx";
import "./index.css";

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
            background: "#18181b",
            color: "#fff",
            border: "1px solid #27272a",
            borderRadius: "12px",
            fontSize: "14px",
            fontWeight: "500",
          },
          success: {
            duration: 3000,
            style: {
              background: "#18181b",
              color: "#fff",
              border: "1px solid #22c55e",
            },
            iconTheme: { primary: "#22c55e", secondary: "#fff" },
          },
          error: {
            duration: 5000,
            style: {
              background: "#18181b",
              color: "#fff",
              border: "1px solid #ef4444",
            },
            iconTheme: { primary: "#ef4444", secondary: "#fff" },
          },
        }}
      />
      <App />
    </div>
    </BrowserRouter>
  </StrictMode>
);