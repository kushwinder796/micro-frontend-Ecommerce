import { useState, useEffect } from "react";
import { productService } from "../api/productService";
import { categoryService } from "../api/categoryService";
import type { ProductDto } from "../api/productService";
import type { CategoryDto } from "../api/categoryService";
import ProductGrid from "../Components/ProductGrid";
import CategorySidebar from "../Components/CategorySidebar";
import AddCategory from "../Components/admin/AddCategory";
import AddProduct from "../Components/admin/AddProduct";
import OfferManagement from "../Components/admin/OfferManagement";

const AdminProductPage = () => {
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"category" | "product" | "offer">("category");

  const fetchData = async () => {
    try {
      const [prods, cats] = await Promise.all([
        productService.getAll(),
        categoryService.getAll(),
      ]);
      setProducts(prods);
      setCategories(cats);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === null || p.categoryId === activeCategory;
    return matchSearch && matchCat;
  });

  const productCounts = categories.reduce<Record<number, number>>((acc, cat) => {
    acc[cat.id] = products.filter((p) => p.categoryId === cat.id).length;
    return acc;
  }, {});

  return (
    <div style={{
      height: "calc(100vh - 64px)",
      background: "var(--bg-primary)",
      display: "flex",
      overflow: "hidden",
      fontFamily: "'DM Sans', sans-serif",
    }}>

      {/* ── LEFT SIDEBAR ── */}
      <div style={{
        width: 300,
        flexShrink: 0,
        borderRight: "1px solid var(--border-color)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}>

        {/* Admin header */}
        <div style={{
          padding: "20px 20px 16px",
          borderBottom: "1px solid var(--border-color)",
          background: "linear-gradient(180deg, var(--bg-secondary), var(--bg-primary))",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: "linear-gradient(135deg,#6d28d9,#7c3aed)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 17, boxShadow: "0 0 20px rgba(109,40,217,0.4)",
            }}>🔧</div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>Admin Panel</p>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
                <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>{products.length} products live</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border-color)" }}>
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
            gap: 4, background: "var(--bg-card)", borderRadius: 10, padding: 3,
            border: "1px solid var(--border-color)",
          }}>
            {(["category", "product", "offer"] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                padding: "8px 0", borderRadius: 8, border: "none",
                fontSize: 12, fontWeight: 700, cursor: "pointer",
                transition: "all 0.15s",
                background: activeTab === tab
                  ? "linear-gradient(135deg,#6d28d9,#7c3aed)"
                  : "transparent",
                color: activeTab === tab ? "#fff" : "var(--text-secondary)",
                boxShadow: activeTab === tab ? "0 2px 10px rgba(109,40,217,0.3)" : "none",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
              }}>
                {tab === "category" ? <>Category</> : tab === "product" ? <>Product</> : <>Offer</>}
              </button>
            ))}
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: 16, scrollbarWidth: "none" }}>
          {activeTab === "category"
            ? <AddCategory categories={categories} onSuccess={fetchData} />
            : activeTab === "product"
              ? <AddProduct products={products} categories={categories} onSuccess={fetchData} />
              : <OfferManagement products={products} />
          }

          <div style={{ marginTop: 16 }}>
            <CategorySidebar
              categories={categories}
              active={activeCategory}
              onSelect={setActiveCategory}
              productCounts={productCounts}
            />
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>

        {/* Top bar */}
        <div style={{
          padding: "16px 24px",
          borderBottom: "1px solid var(--border-color)",
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
          background: "var(--bg-primary)",
        }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
              Manage Products
            </h1>
            <p style={{ fontSize: 18, color: "var(--text-secondary)", margin: "3px 0 0" }}>
              {filtered.length} of {products.length} products
              {activeCategory !== null && " · filtered"}
            </p>
          </div>

          {/* Search */}
          <div style={{ position: "relative" }}>
            <span style={{
              position: "absolute", left: 12, top: "50%",
              transform: "translateY(-50%)", fontSize: 14, color: "var(--text-secondary)",
            }}>🔍</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              style={{
                paddingLeft: 36, paddingRight: 14, paddingTop: 9, paddingBottom: 9,
                background: "var(--bg-card)", border: "1px solid var(--border-color)",
                borderRadius: 10, color: "var(--text-primary)", fontSize: 20, outline: "none",
                width: 220, transition: "border 0.2s",
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = "#6d28d9"}
              onBlur={(e) => e.currentTarget.style.borderColor = "var(--border-color)"}
            />
          </div>
        </div>

        {/* Stats row */}
        <div style={{
          display: "flex", gap: 12, padding: "12px 24px",
          borderBottom: "1px solid var(--border-color)", flexShrink: 0,
        }}>
          {[
            { label: "Total Products", value: products.length, color: "#7c3aed" },
            { label: "Categories", value: categories.length, color: "#0891b2" },

          ].map((stat) => (
            <div key={stat.label} style={{
              flex: 1, padding: "10px 14px", borderRadius: 10,
              background: "var(--bg-card)", border: "1px solid var(--border-color)",
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <div style={{
                width: 3, height: 28, borderRadius: 99,
                background: stat.color, flexShrink: 0,
              }} />
              <div>
                <p style={{ fontSize: 18, fontWeight: 800, color: "var(--text-primary)", margin: 0, lineHeight: 1 }}>
                  {stat.value}
                </p>
                <p style={{ fontSize: 10, color: "var(--text-secondary)", margin: "3px 0 0", fontWeight: 600 }}>
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Product grid - scrollable */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", scrollbarWidth: "none" }}>
          <ProductGrid products={filtered} categories={categories} loading={loading} />
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800&display=swap');
        ::-webkit-scrollbar { display: none; }
        input::placeholder { color: var(--text-secondary); }
      `}</style>
    </div>
  );
};

export default AdminProductPage;
