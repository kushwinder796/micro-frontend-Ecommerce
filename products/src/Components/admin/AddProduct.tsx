import { useState } from "react";
import { productService } from "../../api/productService";
import type { ProductDto } from "../../api/productService";
import type { CategoryDto } from "../../api/categoryService";

interface Props {
  categories: CategoryDto[];
  products: ProductDto[];
  onSuccess: () => void;
}

const AddProduct = ({ categories, products, onSuccess }: Props) => {
  const [form, setForm] = useState({ name: "", price: "", categoryId: "", description: "" });
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null,
  );
  const [focused, setFocused] = useState("");

  const categoryMap = categories.reduce<Record<number, string>>((acc, cat) => {
    acc[cat.id] = cat.name;
    return acc;
  }, {});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleEdit = (product: ProductDto) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      price: product.price.toString(),
      categoryId: product.categoryId.toString(),
      description: product.description ?? "",
    });
    setPreview("");
    setImage(null);
  };

  const handleDeleteClick = async (id: string) => {
    setSelectedProductId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedProductId) return;
    setDeletingId(selectedProductId);
    try {
      await productService.delete(selectedProductId);
      onSuccess();
    } finally {
      setDeletingId(null);
      setShowDeleteModal(false);
      setSelectedProductId(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.categoryId) return;
    setLoading(true);
    try {
      if (editingId) {
        await productService.update(editingId, {
          id: editingId,
          name: form.name,
          description: form.description,
          price: Number(form.price),
          categoryId: Number(form.categoryId),
        });
        setEditingId(null);
      } else {
        await productService.create({
          name: form.name,
          description: form.description,
          price: Number(form.price),
          categoryId: Number(form.categoryId),
          image: image ?? undefined,
        });
      }
      setForm({ name: "", price: "", categoryId: "", description: "" });
      setImage(null);
      setPreview("");
      onSuccess();
    } finally {
      setLoading(false);
    }
  };

  const isReady = form.name && form.price && form.categoryId && form.description;

  const inputStyle = (field: string): React.CSSProperties => ({
    width: "100%",
    padding: "10px 14px",
    background: "var(--bg-primary)",
    border:
      focused === field
        ? "1px solid rgba(139,92,246,0.6)"
        : "1px solid var(--border-color)",
    borderRadius: 10,
    color: "var(--text-primary)",
    fontSize: 13,
    outline: "none",
    transition: "all 0.2s",
    boxSizing: "border-box",
    boxShadow: focused === field ? "0 0 0 3px rgba(139,92,246,0.08)" : "none",
  });

  return (
    <>
      <div
        style={{
          background: "var(--bg-secondary)",
          borderRadius: 20,
          padding: 20,
          maxWidth: 420,
          width: "90%",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 16,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "rgba(139,92,246,0.15)",
              border: "1px solid rgba(139,92,246,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            📦
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>
              {editingId ? "Edit Product" : "Add Product"}
            </p>
            <p style={{ fontSize: 11, color: "var(--text-secondary)" }}>
              {products.length} products total
            </p>
          </div>
          {editingId && (
            <button
              onClick={() => {
                setEditingId(null);
                setForm({ name: "", price: "", categoryId: "", description: "" });
              }}
              style={{
                marginLeft: "auto",
                fontSize: 11,
                color: "#f87171",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              ✕ Cancel
            </button>
          )}
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            marginBottom: 16,
          }}
        >
          <div>
            <label
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "var(--text-secondary)",
                textTransform: "uppercase",
                letterSpacing: 1,
                display: "block",
                marginBottom: 6,
              }}
            >
              Product Name *
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              onFocus={() => setFocused("name")}
              onBlur={() => setFocused("")}
              placeholder=""
              style={inputStyle("name")}
            />
          </div>

          <div>
            <label
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "var(--text-secondary)",
                textTransform: "uppercase",
                letterSpacing: 1,
                display: "block",
                marginBottom: 6,
              }}
            >
              Description *
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              onFocus={() => setFocused("description")}
              onBlur={() => setFocused("")}
              placeholder=""
              rows={3}
              style={{
                ...inputStyle("description"),
                resize: "none",
                fontFamily: "inherit",
              }}
            />
          </div>

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
          >
            <div>
              <label
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "var(--text-secondary)",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  display: "block",
                  marginBottom: 6,
                }}
              >
                Price (₹) *
              </label>
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                onFocus={() => setFocused("price")}
                onBlur={() => setFocused("")}
                placeholder=""
                style={inputStyle("price")}
              />
            </div>
            <div>
              <label
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "var(--text-secondary)",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  display: "block",
                  marginBottom: 6,
                }}
              >
                Category *
              </label>
              <select
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                onFocus={() => setFocused("cat")}
                onBlur={() => setFocused("")}
                style={{ ...inputStyle("cat"), appearance: "none" }}
              >
                <option value="">Select...</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Image - only for new products */}
          {!editingId && (
            <div>
              <label
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "var(--text-secondary)",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  display: "block",
                  marginBottom: 6,
                }}
              >
                Image
              </label>
              <label
                style={{
                  display: "block",
                  border: "2px dashed",
                  borderColor: preview ? "#7c3aed" : "var(--border-color)",
                  borderRadius: 10,
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="preview"
                    style={{ width: "100%", height: 100, objectFit: "cover" }}
                  />
                ) : (
                  <div
                    style={{
                      padding: "16px",
                      textAlign: "center",
                      color: "var(--text-secondary)",
                      fontSize: 12,
                    }}
                  >
                    <div style={{ fontSize: 20, marginBottom: 4 }}>📸</div>
                    Click to upload
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImage}
                  style={{ display: "none" }}
                />
              </label>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !isReady}
            style={{
              padding: "10px 0",
              borderRadius: 10,
              border: "none",
              background: isReady
                ? editingId
                  ? "linear-gradient(135deg,#0891b2,#2563eb)"
                  : "linear-gradient(135deg,#7c3aed,#a855f7)"
                : "var(--border-color)",
              color: "#fff",
              fontSize: 13,
              fontWeight: 700,
              cursor: !isReady || loading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              boxShadow: isReady ? "0 4px 12px rgba(124,58,237,0.3)" : "none",
              transition: "all 0.2s",
            }}
          >
            {loading ? (
              <>
                <span
                  style={{
                    width: 13,
                    height: 13,
                    border: "2px solid rgba(255,255,255,0.2)",
                    borderTopColor: "#fff",
                    borderRadius: "50%",
                    animation: "spin 0.7s linear infinite",
                    display: "inline-block",
                  }}
                />
                {editingId ? "Updating..." : "Adding..."}
              </>
            ) : editingId ? (
              "Update Product"
            ) : (
              "+ Add Product"
            )}
          </button>
        </form>

        {/* Products List */}
        <div>
          <p
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: "var(--text-secondary)",
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: 8,
            }}
          >
            All Products
          </p>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              maxHeight: 260,
              overflowY: "auto",
            }}
          >
            {products.length === 0 ? (
              <p
                style={{
                  fontSize: 12,
                  color: "var(--text-secondary)",
                  textAlign: "center",
                  padding: "12px 0",
                }}
              >
                No products yet
              </p>
            ) : (
              products.map((product) => (
                <div
                  key={product.id}
                  style={{
                    padding: "10px 12px",
                    background: "var(--bg-primary)",
                    border:
                      editingId === product.id
                        ? "1px solid rgba(139,92,246,0.4)"
                        : "1px solid var(--border-color)",
                    borderRadius: 10,
                    transition: "all 0.2s",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: 8,
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: "var(--text-primary)",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {product.name}
                      </p>
                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                          marginTop: 4,
                          alignItems: "center",
                        }}
                      >
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 800,
                            color: "#a855f7",
                          }}
                        >
                          ₹{product.price.toLocaleString()}
                        </span>
                        <span style={{ fontSize: 10, color: "var(--text-secondary)" }}>
                          {categoryMap[product.categoryId] ||
                            `#${product.categoryId}`}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                      <button
                        onClick={() => handleEdit(product)}
                        style={{
                          padding: "4px 10px",
                          borderRadius: 8,
                          fontSize: 11,
                          fontWeight: 700,
                          background: "rgba(6,182,212,0.1)",
                          border: "1px solid rgba(6,182,212,0.2)",
                          color: "#06b6d4",
                          cursor: "pointer",
                        }}
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteClick(product.id)}
                        disabled={deletingId === product.id}
                        style={{
                          padding: "4px 10px",
                          borderRadius: 8,
                          fontSize: 11,
                          fontWeight: 700,
                          border: "1px solid rgba(239,68,68,0.2)",
                          color: "#f87171",
                          cursor: "pointer",
                          background: "transparent",
                          opacity: deletingId === product.id ? 0.5 : 1,
                        }}
                      >
                        {deletingId === product.id ? "..." : "🗑️"}
                      </button>
                      {showDeleteModal && (
                        <div
                          style={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            width: "100vw",
                            height: "100vh",
                            background: "rgba(0,0,0,0.7)",
                            backdropFilter: "blur(8px)",
                            WebkitBackdropFilter: "blur(8px)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 9999,
                          }}
                        >
                          <div
                            style={{
                              background:
                                "var(--bg-secondary)",
                              padding: 24,
                              borderRadius: 16,
                              width: 360,
                              border: "1px solid rgba(255,255,255,0.08)",
                              boxShadow: "0 25px 80px rgba(0,0,0,0.8)",
                              animation: "fadeIn 0.25s ease",
                            }}
                          >
                            <h3 style={{ color: "var(--text-primary)", marginBottom: 8 }}>
                              ⚠️ Delete Product 
                            </h3>

                            <p
                              style={{
                                color: "var(--text-secondary)",
                                fontSize: 13,
                                marginBottom: 20,
                              }}
                            >
                              This action cannot be undone. This will
                              permanently delete the product.
                            </p>

                            <div
                              style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                gap: 10,
                              }}
                            >
                              <button
                                onClick={() => setShowDeleteModal(false)}
                                style={{
                                  padding: "6px 14px",
                                  borderRadius: 8,
                                  border: "1px solid var(--border-color)",
                                  background: "transparent",
                                  color: "var(--text-secondary)",
                                  cursor: "pointer",
                                }}
                              >
                                Cancel
                              </button>

                              <button
                                onClick={confirmDelete}
                                style={{
                                  padding: "6px 14px",
                                  borderRadius: 8,
                                  border: "none",
                                  background:
                                    "linear-gradient(135deg,#ef4444,#dc2626)",
                                  color: "#fff",
                                  fontWeight: 700,
                                  cursor: "pointer",
                                  boxShadow: "0 6px 18px rgba(239,68,68,0.5)",
                                }}
                              >
                                {deletingId ? "Deleting..." : "Delete"}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <style>{`
  @keyframes spin { 
    to { transform: rotate(360deg); } 
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  select option { background: var(--bg-secondary); }

  input[type=number]::-webkit-inner-spin-button { 
    -webkit-appearance: none; 
  }
`}</style>
      </div>
    </>
  );
};

export default AddProduct;
