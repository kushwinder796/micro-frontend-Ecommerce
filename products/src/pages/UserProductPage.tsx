import { useState, useEffect } from "react";
import { productService } from "../api/productService";
import { categoryService } from "../api/categoryService";
import type { ProductDto } from "../api/productService";
import type { CategoryDto } from "../api/categoryService";

import ProductGrid from "../Components/ProductGrid";
import CategorySidebar from "../Components/CategorySidebar";


const UserProductPage = () => {
  const [products, setProducts]             = useState<ProductDto[]>([]);
  const [categories, setCategories]         = useState<CategoryDto[]>([]);
  const [loading, setLoading]               = useState(true);
  const [search, setSearch]                 = useState("");
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  useEffect(() => {
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
    fetchData();
  }, []);

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat    = activeCategory === null || p.categoryId === activeCategory;
    return matchSearch && matchCat;
  });

  const productCounts = categories.reduce<Record<number, number>>((acc, cat) => {
    acc[cat.id] = products.filter((p) => p.categoryId === cat.id).length;
    return acc;
  }, {});

  return (
    <div style={{
      height: "calc(100vh - 64px)",
      background: "#050507",
      display: "flex",
      overflow: "hidden",
      fontFamily: "'DM Sans', sans-serif",
    }}>

      {/* ── LEFT SIDEBAR ── */}
      <div style={{
        width: 240,
        flexShrink: 0,
        borderRight: "1px solid #111",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}>

        {/* Categories */}
        <div style={{ flex: 1, overflowY: "auto", padding: 12, scrollbarWidth: "none" }}>
          <CategorySidebar
            categories={categories}
            active={activeCategory}
            onSelect={setActiveCategory}
            productCounts={productCounts}
          />
        </div>
      </div>

      {/* ── MAIN ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>

        {/* Top bar */}
        <div style={{
          padding: "16px 24px",
          borderBottom: "1px solid #111",
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: "#fff", margin: 0 }}>
              {activeCategory
                ? categories.find(c => c.id === activeCategory)?.name ?? "Products"
                : "All Products"
              }
            </h1>
            <p style={{ fontSize: 18, color: "#3f3f46", margin: "3px 0 0" }}>
              {filtered.length} products available
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Search */}
            <div style={{ position: "relative" }}>
              <span style={{
                position: "absolute", left: 12, top: "50%",
                transform: "translateY(-50%)", fontSize: 14, color: "#3f3f46",
              }}>🔍</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                style={{
                  paddingLeft: 36, paddingRight: 14, paddingTop: 9, paddingBottom: 9,
                  background: "#0a0a0a", border: "1px solid #1a1a1a",
                  borderRadius: 10, color: "#fff", fontSize: 20, outline: "none",
                  width: 200, transition: "border 0.2s",
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = "#0891b2"}
                onBlur={(e) => e.currentTarget.style.borderColor = "#1a1a1a"}
              />
            </div>
          </div>
        </div>

        {/* Product grid */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", scrollbarWidth: "none" }}>
          <ProductGrid products={filtered} categories={categories} loading={loading} />
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800&display=swap');
        ::-webkit-scrollbar { display: none; }
        input::placeholder { color: #3f3f46; }
      `}</style>
    </div>
  );
};

export default UserProductPage;