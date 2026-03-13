import { useState } from "react";
import type { ProductDto } from "../api/productService";
import { useCartStore } from "../store/cart.store";
import toast from "react-hot-toast";

interface Props {
  product: ProductDto;
  categoryName?: string;
}

const ProductCard = ({ product, categoryName }: Props) => {
  const addToCart = useCartStore((s) => s.addToCart);
  const stock = product.stock ?? 0;
  const [imgError, setImgError] = useState(false);

  // Check if user is Admin from localStorage
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const isAdmin = user?.role === "Admin";

  const showImage = product.imageUrl && !imgError;

  const handleBuyNow = () => {
    addToCart(product);
    toast.success(`${product.name} added! Ready for checkout ⚡`);
  };
  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.name} added to cart 🛒`);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden group hover:border-cyan-500/40 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-cyan-900/20 transition-all duration-300">
      {/* Image */}
      <div className="h-44 bg-zinc-950 relative overflow-hidden">
        {showImage ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full  object-cover group-hover:scale-110 transition-transform duration-500"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-1 bg-zinc-900">
            <span className="text-5xl">📦</span>
            <span className="text-xs text-zinc-600">No image</span>
          </div>
        )}

        {/* Dark gradient overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-zinc-900 to-transparent" />

        {/* Stock badge */}
        <div
          className={`absolute top-3 right-3 px-2 py-1 rounded-lg text-xs font-bold backdrop-blur-sm ${stock > 0
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              : "bg-red-500/20 text-red-400 border border-red-500/30"
            }`}
        >
          {stock > 0 ? `${stock} in stock` : "Out of stock"}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-xs text-cyan-400 font-bold uppercase tracking-wider mb-1">
          {categoryName || `Category #${product.categoryId}`}
        </p>
        <h3 className="text-white font-bold text-base mb-1 line-clamp-1">
          {product.name}
        </h3>
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-2xl font-extrabold text-white">
            ₹{product.price.toLocaleString()}
          </span>
        </div>

        {!isAdmin && (
          <div className="flex gap-2 justify-between">
            <button
              onClick={handleAddToCart}
              className="flex-1 py-2.5 border border-zinc-700 hover:border-cyan-500 hover:text-cyan-400 text-zinc-300 rounded-xl text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              🛒 Add to Cart
            </button>

            <button
              onClick={handleBuyNow}
              className="flex-1 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:opacity-90 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ⚡ Buy Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
