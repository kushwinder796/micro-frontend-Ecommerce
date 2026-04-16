import ProductCard from "./ProductCard";
import type { ProductDto } from "../api/productService";
import type { CategoryDto } from "../api/categoryService";

interface Props {
  products: ProductDto[];
  categories: CategoryDto[];
  loading: boolean;
}

const ProductGrid = ({ products, categories, loading }: Props) => {
  const categoryMap = categories.reduce<Record<number, string>>(
    (acc, cat) => { acc[cat.id] = cat.name; return acc; }, {}
  );

  if (loading) {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 4fr)", gap: 16 }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} style={{
            background: "#0a0a0a", border: "1px solid #111",
            borderRadius: 16, overflow: "hidden",
          }}>
            <div style={{ height: 180, background: "#111",
              animation: "pulse 1.5s ease-in-out infinite" }} />
            <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ height: 10, background: "#111", borderRadius: 6, width: "40%",
                animation: "pulse 1.5s ease-in-out infinite" }} />
              <div style={{ height: 14, background: "#111", borderRadius: 6, width: "70%",
                animation: "pulse 1.5s ease-in-out infinite" }} />
              <div style={{ height: 10, background: "#111", borderRadius: 6,
                animation: "pulse 1.5s ease-in-out infinite" }} />
              <div style={{ height: 36, background: "#111", borderRadius: 10, marginTop: 4,
                animation: "pulse 1.5s ease-in-out infinite" }} />
            </div>
          </div>
        ))}
        <style>{`
          @keyframes pulse {
            0%,100% { opacity: 1 }
            50% { opacity: 0.4 }
          }
        `}</style>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div style={{
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "80px 0", textAlign: "center",
      }}>
        <div style={{
          width: 80, height: 80, borderRadius: 20,
          background: "#0a0a0a", border: "1px solid #1a1a1a",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 32, marginBottom: 16,
        }}>📦</div>
        <p style={{ fontSize: 16, fontWeight: 700, color: "#fff", margin: 0 }}>
          No products found
        </p>
        <p style={{ fontSize: 13, color: "#3f3f46", margin: "6px 0 0" }}>
          Try a different category or search term
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 4fr)", gap: 16 }}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          categoryName={categoryMap[product.categoryId ?? 0]}
        />
      ))}
    </div>
  );
};

export default ProductGrid;