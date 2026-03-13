import { useState } from "react";
import AddCategory from "./AddCategory";
import AddProduct from "./AddProduct";
import type { CategoryDto } from "../../api/categoryService";
import type { ProductDto } from "../../api/productService";

interface Props {
  categories: CategoryDto[];
  products: ProductDto[];
  onSuccess: () => void;
}

const AdminPanel = ({ categories, products, onSuccess }: Props) => {
  const [activeTab, setActiveTab] = useState<"category" | "product">(
    "category",
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Badge */}
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 16,
          padding: "14px 16px",
          background: "linear-gradient(135deg,#1e1b4b,#2e1065)",
          border: "1px solid rgba(139,92,246,0.3)",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: "linear-gradient(135deg,#7c3aed,#a855f7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
            flexShrink: 0,
          }}
        >
          🔧
        </div>
        <div style={{ flex: 1 }}>
          <p
            style={{ fontSize: 14, fontWeight: 700, color: "#fff", margin: 0 }}
          >
            Admin Dashboard
          </p>
          <p style={{ fontSize: 11, color: "#a78bfa", margin: 0 }}>
            Full store control
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#22c55e",
              animation: "pulse 2s infinite",
              display: "inline-block",
            }}
          />
          <span style={{ fontSize: 11, color: "#22c55e", fontWeight: 600 }}>
            Live
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 6,
          padding: 4,
          background: "#09090b",
          border: "1px solid #27272a",
          borderRadius: 12,
          // width:"100%"
        }}
      >
        {(["category", "product"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "9px 0",
              borderRadius: 9,
              border: "none",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s",
              background:
                activeTab === tab
                  ? "linear-gradient(135deg,#7c3aed,#a855f7)"
                  : "transparent",
              color: activeTab === tab ? "#fff" : "#52525b",
              boxShadow:
                activeTab === tab ? "0 4px 12px rgba(124,58,237,0.3)" : "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              whiteSpace: "nowrap", 
            }}
          >
            {
              tab === "category" ? (
                <>
                  {/* <span>📁</span> */}
                  <span>Category</span>
                </> 
              ) : (
                <>
                  {/* <span>📦</span> */}
                  <span>Product</span>
                </>
              ) 
            }
          </button>
        ))}
      </div>

      {/* Forms */}
      {activeTab === "category" ? (
        <AddCategory categories={categories} onSuccess={onSuccess} />
      ) : (
        <AddProduct
          categories={categories}
          products={products}
          onSuccess={onSuccess}
        />
      )}

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </div>
  );
};

export default AdminPanel;
