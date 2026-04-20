import { useNavigate } from "react-router-dom";
import { useCartStore } from "../../../cart/src/Components/store/cart.store";

const CartSidebar = () => {
  
const items = useCartStore((s) => s.items);
const removeFromCart = useCartStore((s) => s.removeFromCart);
const increaseQty = useCartStore((s) => s.increaseQty);
const decreaseQty = useCartStore((s) => s.decreaseQty);
const totalItems = useCartStore((s) => s.totalItems);
const totalPrice = useCartStore((s) => s.totalPrice);
 const navigate = useNavigate();


  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-bold text-white">🛒 Cart</p>
        {totalItems() > 0 && (
          <span className="bg-violet-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            {totalItems()}
          </span>
        )}
      </div>

      {items.length === 0 ? (
        <p className="text-zinc-600 text-xs text-center py-4">Cart is empty</p>
      ) : (
        <>
          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-white font-semibold truncate">{item.name}</p>
                  <p className="text-xs text-zinc-500">₹{item.price.toLocaleString()}</p>
                </div>

                {/* Qty controls */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => decreaseQty(item.id)}
                    className="w-6 h-6 rounded-lg bg-zinc-800 text-white text-xs hover:bg-zinc-700 transition-all"
                  >−</button>
                  <span className="text-xs text-white w-4 text-center">{item.quantity}</span>
                  <button
                    onClick={() => increaseQty(item.id)}
                    className="w-6 h-6 rounded-lg bg-zinc-800 text-white text-xs hover:bg-zinc-700 transition-all"
                  >+</button>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-zinc-600 hover:text-red-400 transition-colors text-xs"
                >✕</button>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="border-t border-zinc-800 mt-4 pt-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs text-zinc-500 font-semibold">Total</span>
              <span className="text-base font-extrabold text-violet-400">
                ₹{totalPrice().toLocaleString()}
              </span>
            </div>
            <button 
              onClick={() => navigate("/cart/checkout")}
              className="w-full py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:opacity-90 text-white rounded-xl text-sm font-bold transition-all"
            >
              Checkout ⚡
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartSidebar;
