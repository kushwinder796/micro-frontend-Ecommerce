import type { CategoryDto } from "../api/categoryService";

interface Props {
  categories: CategoryDto[];
  active: number | null;        
  onSelect: (id: number | null) => void;
  productCounts: Record<number, number>;
}

const CategorySidebar = ({ categories, active, onSelect, productCounts }: Props) => {
  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-4">
      <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-3">
        Categories
      </p>

      {/* All */}
      <button
        onClick={() => onSelect(null)}
        className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium flex justify-between items-center mb-1 transition-all ${
          active === null
            ? "bg-cyan-500/10 text-cyan-400 border-l-2 border-cyan-500"
            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]"
        }`}
      >
        <span>🏪 All</span>
        <span className="text-xs opacity-60">{Object.values(productCounts).reduce((a, b) => a + b, 0)}</span>
      </button>

  
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium flex justify-between items-center mb-1 transition-all ${
            active === cat.id
              ? "bg-cyan-500/10 text-cyan-400 border-l-2 border-cyan-500"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]"
          }`}
        >
          <span>{cat.name}</span>
          <span className="text-xs opacity-60">{productCounts[cat.id] ?? 0}</span>
        </button>
      ))}
    </div>
  );
};

export default CategorySidebar;
