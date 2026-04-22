import React, { useState, useEffect } from "react";
import {
  type OfferDto,
  type CreateOfferDto,
  type UpdateOfferDto,offerService,} from "../../../../cart/src/Services/offerService";
import type { ProductDto } from "../../api/productService";
import { toast } from "react-hot-toast";
import { OFFER_CHANGED_KEY, OFFER_CHANGED_EVENT } from "../../pages/UserProductPage";

interface Props {
  products: ProductDto[];
}

interface OfferFormData {
  productId: string;
  offeredPrice: string;
}

const clearForm: OfferFormData = { productId: "", offeredPrice: "" };
const isOk = (res: { isSuccess?: boolean; success?: boolean }): boolean =>
  res.isSuccess === true || (res as { success?: boolean }).success === true;

const notifyOfferChanged = () => {
  window.dispatchEvent(new CustomEvent(OFFER_CHANGED_EVENT));
  localStorage.setItem(OFFER_CHANGED_KEY, String(Date.now()));
};

const OfferManagement = ({ products }: Props) => {
  const [offers, setOffers]         = useState<OfferDto[]>([]);
  const [loading, setLoading]       = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId]   = useState<string | null>(null);
  const [form, setForm]             = useState<OfferFormData>(clearForm);
  const [deleteId, setDeleteId]     = useState<string | null>(null);


  const selectedProduct = products.find((p) => p.id === form.productId) ?? null;
  const offeredPrice    = parseFloat(form.offeredPrice) || 0;
  const originalPrice   = selectedProduct?.price ?? 0;
  const savings =
    originalPrice > 0 && offeredPrice > 0 && offeredPrice < originalPrice
      ? Math.round((1 - offeredPrice / originalPrice) * 100)
      : 0;

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const res = await offerService.getAll();
      if (isOk(res) && Array.isArray(res.data)) {
        setOffers(res.data);
      } else {
        setOffers([]);
      }
    } catch {
      toast.error("Failed to load offers");
      setOffers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOffers(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId && !form.productId) {
      toast.error("Please select a product");
      return;
    }
    if (offeredPrice <= 0) {
      toast.error("Offered price must be greater than 0");
      return;
    }
    if (selectedProduct && offeredPrice >= selectedProduct.price) {
      toast.error("Offered price must be less than the original price");
      return;
    }

    setSubmitting(true);
    try {
      if (editingId) {
        const payload: UpdateOfferDto = { offeredPrice };
        const res = await offerService.update(editingId, payload);
        if (isOk(res)) {
          toast.success("Offer price updated !!");
          setEditingId(null);
          setForm(clearForm);
          fetchOffers();
          notifyOfferChanged();
        } else {
          toast.error(res.message ?? "Update price failed");
        }
      } else {
        const payload: CreateOfferDto = {
          productId: form.productId,
          offeredPrice,
        };
        const res = await offerService.create(payload);
        if (isOk(res)) {
          toast.success("Offer created successfully !!");
          setForm(clearForm);
          fetchOffers();
          notifyOfferChanged();
        } else {
          toast.error(res.message ?? "Create failed");
        }
      }
    } catch (err) {
      console.error("Offer submit error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (offer: OfferDto) => {
    const newStatus =
      offer.status?.toLowerCase() === "accepted" ? "Pending" : "Accepted";
    try {
      const res = await offerService.update(offer.id, { status: newStatus });
      if (isOk(res)) {
        toast.success(
          newStatus === "Accepted"
            ? "Offer activated"
            : "Offer DeActivated"
        );
        fetchOffers();
        notifyOfferChanged();
      } else {
        toast.error(res.message ?? "Status update failed");
      }
    } catch (err) {
      console.error("Toggle status error:", err);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleteId(id);
    try {
      const res = await offerService.delete(id);
      if (isOk(res)) {
        toast.success("Offer removed");
        fetchOffers();
        notifyOfferChanged();
      } else {
        toast.error(res.message ?? "Delete failed");
      }
    } catch (err) {
      console.error("Offer delete error:", err);
    } finally {
      setDeleteId(null);
    }
  };

  const startEdit = (offer: OfferDto) => {
    setEditingId(offer.id);
    setForm({
      productId: offer.productId ?? "",
      offeredPrice: String(offer.offeredPrice),
    });
    document.getElementById("offer-form")?.scrollIntoView({ behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(clearForm);
  };

  const statusBadge = (status?: string) => {
    const s = status?.toLowerCase();
    if (s === "accepted")
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
          ● Active
        </span>
      );
    if (s === "rejected")
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/15 text-red-400 border border-red-500/25">
          ● Rejected
        </span>
      );
    return (
      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-yellow-500/15 text-yellow-400 border border-yellow-500/25">
        ● Pending
      </span>
    );
  };


  return (
    <div className="space-y-3">
      <div
        id="offer-form"
        style={{ background: "#0f0f0f", border: "1px solid #1a1a1a", borderRadius: 14, padding: 14 }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>
            {editingId ? "✏️ Edit Offer" : "🏷️ New Offer"}
          </span>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              style={{ fontSize: 11, color: "#52525b", background: "none", border: "none", cursor: "pointer" }}
            >
              ✕ Cancel
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>

          {/* Product */}
          <div>
            <label style={{ fontSize: 10, fontWeight: 700, color: "#52525b", textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 5 }}>
              Product
            </label>
            {editingId ? (
              <div style={{ background: "#1a1a1a", border: "1px solid #27272a", borderRadius: 8, padding: "8px 10px", fontSize: 12, color: "#a1a1aa" }}>
                {products.find((p) => p.id === form.productId)?.name ?? "—"}
              </div>
            ) : (
              <select
                required
                value={form.productId}
                onChange={(e) => setForm({ productId: e.target.value, offeredPrice: "" })}
                style={{ width: "100%", background: "#0a0a0a", border: "1px solid #27272a", borderRadius: 8, padding: "8px 10px", fontSize: 12, color: "#fff", outline: "none", cursor: "pointer" }}
              >
                <option value="">— Select product —</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (₹{p.price.toLocaleString()})
                  </option>
                ))}
              </select>
            )}
          </div>

    
          <div>
            <label style={{ fontSize: 10, fontWeight: 700, color: "#52525b", textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 5 }}>
              Original Price
            </label>
            <div style={{ background: "#1a1a1a", border: "1px solid #27272a", borderRadius: 8, padding: "8px 10px", fontSize: 12, color: "#52525b" }}>
              {selectedProduct ? `₹${selectedProduct.price.toLocaleString()}` : "—"}
            </div>
          </div>

  
          <div>
            <label style={{ fontSize: 10, fontWeight: 700, color: "#52525b", textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 5 }}>
              Offered Price <span style={{ color: "#7c3aed" }}>*</span>
            </label>
            <input
              type="number"
              required
              step="0.01"
              min="0.01"
              value={form.offeredPrice}
              onChange={(e) => setForm({ ...form, offeredPrice: e.target.value })}
              style={{ width: "100%", background: "#0a0a0a", border: "1px solid #27272a", borderRadius: 8, padding: "8px 10px", fontSize: 12, color: "#fff", outline: "none", boxSizing: "border-box" }}
            />
          </div>


          {selectedProduct && offeredPrice > 0 && (
            <div style={{
              borderRadius: 8, padding: "8px 10px", border: `1px solid ${savings > 0 ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
              background: savings > 0 ? "rgba(34,197,94,0.05)" : "rgba(239,68,68,0.05)",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#fff", margin: 0 }}>
                  {savings > 0 ? `Saves ${savings}%` : "⚠️ Must be lower"}
                </p>
                {savings > 0 && (
                  <p style={{ fontSize: 10, color: "#52525b", margin: "2px 0 0" }}>
                    ₹{selectedProduct.price.toLocaleString()} → <span style={{ color: "#22c55e", fontWeight: 700 }}>₹{offeredPrice.toLocaleString()}</span>
                  </p>
                )}
              </div>
              {savings > 0 && (
                <span style={{ fontSize: 13, fontWeight: 900, color: "#22c55e" }}>-{savings}%</span>
              )}
            </div>
          )}


          <button
            type="submit"
            disabled={submitting || (offeredPrice > 0 && selectedProduct !== null && offeredPrice >= (selectedProduct?.price ?? 0))}
            style={{
              width: "100%", padding: "9px 0", borderRadius: 8, border: "none",
              fontSize: 12, fontWeight: 700, color: "#fff", cursor: submitting ? "not-allowed" : "pointer",
              background: "linear-gradient(135deg,#7c3aed,#a855f7)",
              opacity: submitting ? 0.6 : 1,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            }}
          >
            {submitting ? (
              <><span style={{ width: 12, height: 12, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} /> Saving...</>
            ) : editingId ? " Update Price" : " Create Offer"}
          </button>
        </form>
      </div>

      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>All Offers</span>
          <span style={{ fontSize: 10, color: "#3f3f46" }}>{offers.length} total</span>
        </div>

        {loading ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 0", gap: 8 }}>
            <span style={{ width: 16, height: 16, border: "2px solid #27272a", borderTopColor: "#7c3aed", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
            <span style={{ fontSize: 12, color: "#52525b" }}>Loading...</span>
          </div>
        ) : offers.length === 0 ? (
          <div style={{ textAlign: "center", padding: "24px 0", border: "1px dashed #1a1a1a", borderRadius: 12 }}>
            <p style={{ fontSize: 20, margin: "0 0 6px" }}>🏷️</p>
            <p style={{ fontSize: 11, color: "#52525b", margin: 0 }}>No offers yet</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {offers.map((offer) => {
              const prod = products.find((p) => p.id === offer.productId);
              const pct = prod && prod.price > 0
                ? Math.round((1 - offer.offeredPrice / prod.price) * 100)
                : null;
              const isAccepted = offer.status?.toLowerCase() === "accepted";

              return (
                <div
                  key={offer.id}
                  style={{
                    background: "#0f0f0f",
                    border: `1px solid ${isAccepted ? "rgba(34,197,94,0.2)" : "#1a1a1a"}`,
                    borderRadius: 12,
                    padding: 12,
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 4 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>
                        {offer.productName ?? prod?.name ?? "—"}
                      </span>
                      {statusBadge(offer.status)}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                      {prod && (
                        <span style={{ fontSize: 11, color: "#52525b", textDecoration: "line-through" }}>
                          ₹{prod.price.toLocaleString()}
                        </span>
                      )}
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#22c55e" }}>
                        ₹{offer.offeredPrice.toLocaleString()}
                      </span>
                      {pct !== null && pct > 0 && (
                        <span style={{ fontSize: 10, fontWeight: 800, padding: "1px 5px", borderRadius: 4, background: "rgba(249,115,22,0.1)", color: "#fb923c", border: "1px solid rgba(249,115,22,0.2)" }}>
                          -{pct}% OFF
                        </span>
                      )}
                    </div>
                    {offer.createdAt && (
                      <p style={{ fontSize: 10, color: "#3f3f46", margin: "3px 0 0" }}>
                        {new Date(offer.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    )}
                  </div>

                  {/* Actions — single row */}
                  <div style={{ display: "flex", gap: 5 }}>
                    {/* Activate / Pause */}
                    <button
                      onClick={() => handleToggleStatus(offer)}
                      style={{
                        flex: 1, padding: "6px 0", borderRadius: 7,
                        border: `1px solid ${isAccepted ? "rgba(239,68,68,0.25)" : "rgba(34,197,94,0.25)"}`,
                        background: isAccepted ? "rgba(239,68,68,0.08)" : "rgba(34,197,94,0.08)",
                        color: isAccepted ? "#f87171" : "#4ade80",
                        fontSize: 10, fontWeight: 700, cursor: "pointer",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {isAccepted ? "⏸ Pause" : "▶ Activate"}
                    </button>

           
                    <button
                      onClick={() => startEdit(offer)}
                      style={{
                        flex: 1, padding: "6px 0", borderRadius: 7,
                        border: "1px solid #27272a", background: "#1a1a1a",
                        color: "#a1a1aa", fontSize: 10, fontWeight: 700,
                        cursor: "pointer", whiteSpace: "nowrap",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 3,
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "#7c3aed"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "#7c3aed"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "#1a1a1a"; e.currentTarget.style.color = "#a1a1aa"; e.currentTarget.style.borderColor = "#27272a"; }}
                    >
                      ✏️ Edit
                    </button>

                    <button
                      onClick={() => handleDelete(offer.id)}
                      disabled={deleteId === offer.id}
                      style={{
                        width: 30, flexShrink: 0, padding: "6px 0", borderRadius: 7,
                        border: "1px solid #27272a", background: "#1a1a1a",
                        color: "#a1a1aa", fontSize: 12, cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        opacity: deleteId === offer.id ? 0.4 : 1,
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "#ef4444"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "#ef4444"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "#1a1a1a"; e.currentTarget.style.color = "#a1a1aa"; e.currentTarget.style.borderColor = "#27272a"; }}
                    >
                      {deleteId === offer.id
                        ? <span style={{ width: 11, height: 11, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
                        : "🗑️"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default OfferManagement;
