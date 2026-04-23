import { useState, useEffect, useRef, useCallback } from "react";
import { productService } from "../api/productService";
import { categoryService } from "../api/categoryService";
import { offerService, type OfferDto } from "../../../cart/src/Services/offerService";
import type { ProductDto } from "../api/productService";
import type { CategoryDto } from "../api/categoryService";
import ProductGrid from "../Components/ProductGrid";
import CategorySidebar from "../Components/CategorySidebar";


export const OFFER_CHANGED_KEY = "offer_last_changed";
export const OFFER_CHANGED_EVENT = "offer:changed";

const UserProductPage = () => {
  const [products, setProducts]             = useState<ProductDto[]>([]);
  const [categories, setCategories]         = useState<CategoryDto[]>([]);
  const [loading, setLoading]               = useState(true);
  const [search, setSearch]                 = useState("");
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  const baseProdsRef = useRef<ProductDto[]>([]);

  const mergeOffers = useCallback((prods: ProductDto[], offers: OfferDto[]): ProductDto[] =>
    prods.map((p) => ({
      ...p,
      offers: offers.filter(
        (o) => o.productId === p.id && o.status?.toLowerCase() === "accepted"
      ),
    }))
  , []);

  const refreshOffers = useCallback(async () => {
    if (baseProdsRef.current.length === 0) return;
    try {
      const offersRes = await offerService.getAll();
      setProducts(mergeOffers(baseProdsRef.current, offersRes.data ?? []));
    } catch {
      // silent
    }
  }, [mergeOffers]);


  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const [prods, cats, offersRes] = await Promise.all([
          productService.getAll(),
          categoryService.getAll(),
          offerService.getAll(),
        ]);
        if (cancelled) return;
        baseProdsRef.current = prods;
        setCategories(cats);
        setProducts(mergeOffers(prods, offersRes.data ?? []));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [mergeOffers]);


 
  useEffect(() => {
    const onCustom = () => { refreshOffers(); };
    window.addEventListener(OFFER_CHANGED_EVENT, onCustom);
    const onStorage = (e: StorageEvent) => {
      if (e.key === OFFER_CHANGED_KEY) refreshOffers();
    };
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener(OFFER_CHANGED_EVENT, onCustom);
      window.removeEventListener("storage", onStorage);
    };
  }, [refreshOffers]);

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
      background: "var(--bg-primary)",
      display: "flex",
      overflow: "hidden",
      fontFamily: "'DM Sans', sans-serif",
    }}>

      {/* ── LEFT SIDEBAR ── */}
      <div style={{
        width: 240,
        flexShrink: 0,
        borderRight: "1px solid var(--border-color)",
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
          borderBottom: "1px solid var(--border-color)",
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
              {activeCategory
                ? categories.find(c => c.id === activeCategory)?.name ?? "Products"
                : "All Products"
              }
            </h1>
            <p style={{ fontSize: 18, color: "var(--text-secondary)", margin: "3px 0 0" }}>
              {filtered.length} products available
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Search */}
            <div style={{ position: "relative" }}>
              <span style={{
                position: "absolute", left: 12, top: "50%",
                transform: "translateY(-50%)", fontSize: 14, color: "var(--text-secondary)",
              }}>🔍</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                style={{
                  paddingLeft: 36, paddingRight: 14, paddingTop: 9, paddingBottom: 9,
                  background: "var(--bg-card)", border: "1px solid var(--border-color)",
                  borderRadius: 10, color: "var(--text-primary)", fontSize: 20, outline: "none",
                  width: 200, transition: "border 0.2s",
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = "#0891b2"}
                onBlur={(e) => e.currentTarget.style.borderColor = "var(--border-color)"}
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
        input::placeholder { color: var(--text-secondary); }
      `}</style>
    </div>
  );
};

export default UserProductPage;
