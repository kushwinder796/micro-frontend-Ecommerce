import { useState } from "react";
import type { ProductDto } from "../api/productService";
import { useCartStore, type CartStore  } from "../../../cart/src/Components/store/cart.store";
import toast from "react-hot-toast";

interface Props {
  product: ProductDto;
  categoryName?: string;
}

const ProductCard = ({ product, categoryName }: Props) => {
  const addToCart = useCartStore((s: CartStore) => s.addToCart);
  const [imgError, setImgError] = useState(false);
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const isAdmin = user?.role === "Admin";
  const showImage = product.imageUrl && !imgError;

  
  const activeOffer = product.offers?.find(
    (o) => o.status?.toLowerCase() === "accepted"
  );
  const discountedPrice = activeOffer ? activeOffer.offeredPrice : product.price;

  const handleBuyNow = () => {
    addToCart({ ...product, price: discountedPrice });
    toast.success(`Redirecting to checkout...`, {
      icon: "⚡",
      style: { background: "#0a0a0a", color: "#fff", border: "1px solid #7c3aed", fontSize: 13 },
      duration: 1500,
    });
  };
  const handleAddToCart = () => {
    addToCart({ ...product, price: discountedPrice });
  };

    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden group hover:border-cyan-500/40 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-cyan-900/20 transition-all duration-300">
        <div className="bg-zinc-950 relative overflow-hidden">
          {showImage ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-[300px] object-cover group-hover:scale-110 transition-transform duration-500"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-1 bg-zinc-900">
              <span className="text-5xl">📦</span>
              <span className="text-xs text-zinc-600">No image</span>
            </div>
          )}
          
          {activeOffer && !isAdmin && product.price > 0 && (
            <div className="absolute top-3 left-3 px-2 py-1 rounded-lg text-[10px] font-black bg-gradient-to-r from-orange-500 to-red-500 text-white border border-orange-400/30 shadow-lg shadow-orange-500/20 uppercase tracking-tighter">
              {Math.round((1 - activeOffer.offeredPrice / product.price) * 100)}% OFF
            </div>
          )}
        </div>
  
        {/* Content */}
        <div className="p-4">
          <p className="text-xs text-cyan-400 font-bold uppercase tracking-wider mb-1">
            {categoryName || `Category #${product.categoryId}`}
          </p>
          <h3 className="text-white font-bold text-base mb-1 line-clamp-1">
            {product.name}
          </h3>
  
          <div className="flex justify-between items-center mb-4">
            <div>
              {/* Star Rating Display */}
              <div className="flex items-center gap-0.5 mb-1">
                {[1, 2, 3, 4, 5].map((star) => {
                  const mockRating = (product.name.length % 3) + 3;
                  return (
                    <svg
                      key={star}
                      className={"w-3 h-3"}
                      fill={star <= mockRating ? "#facc15" : "#d1d5db"}
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.962a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.366 2.445a1 1 0 00-.364 1.118l1.286 3.962c.3.921-.755 1.688-1.54 1.118l-3.366-2.445a1 1 0 00-1.175 0l-3.366 2.445c-.784.57-1.838-.197-1.539-1.118l1.286-3.962a1 1 0 00-.364-1.118L2.98 9.389c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.951-.69l1.368-3.962z" />
                    </svg>
                  );
                })}
              </div>
              <div className="flex flex-col gap-0.5">
                {/* Offered price — big and bold */}
                <span className="text-2xl font-extrabold text-white">
                  ₹{discountedPrice.toLocaleString()}
                </span>
                {/* Original price with strikethrough + % OFF — users only */}
                {activeOffer && !isAdmin && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-zinc-500 line-through font-medium">
                      ₹{product.price.toLocaleString()}
                    </span>
                    <span className="text-[10px] font-black text-orange-400 bg-orange-500/10 border border-orange-500/20 px-1.5 py-0.5 rounded-md">
                      -{Math.round((1 - activeOffer.offeredPrice / product.price) * 100)}% OFF
                    </span>
                  </div>
                )}
              </div>
            </div>
          
          {!isAdmin && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.dispatchEvent(
                  new CustomEvent("open-chat-product", {
                    detail: {
                      id: product.id,
                      name: product.name,
                      price: product.price,
                    },
                  })
                );
              }}
              className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500 hover:text-white border border-emerald-500/20 hover:border-emerald-500 text-emerald-400 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Ask
            </button>
          )}
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
