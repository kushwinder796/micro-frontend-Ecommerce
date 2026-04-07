import { useState, useEffect } from "react";
import { categoryService } from "../../api/categoryService";
import type { CategoryDto } from "../../api/categoryService";

interface Props {
  categories: CategoryDto[];
  onSuccess: () => void;
}

const AddCategory = ({ categories, onSuccess }: Props) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [focused, setFocused] = useState("");

  // Modal state
  const [deleteModal, setDeleteModal] = useState<{
    show: boolean;
    category: CategoryDto | null;
  }>({
    show: false,
    category: null,
  });

  
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && deleteModal.show) {
        setDeleteModal({ show: false, category: null });
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [deleteModal.show]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      await categoryService.create({ name, description });
      setName("");
      setDescription("");
      onSuccess();
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (category: CategoryDto) => {
    setDeleteModal({ show: true, category });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ show: false, category: null });
  };

  const confirmDelete = async () => {
    if (!deleteModal.category) return;
    setDeletingId(deleteModal.category.id);
    closeDeleteModal();
    try {
      await categoryService.delete(deleteModal.category.id);
      onSuccess();
    } finally {
      setDeletingId(null);
    }
  };

  const inputStyle = (field: string): React.CSSProperties => ({
    width: "100%",
    padding: "10px 14px",
    background: "#09090b",
    border:
      focused === field ? "1px solid rgba(6,182,212,0.6)" : "1px solid #27272a",
    borderRadius: 10,
    color: "#f4f4f5",
    fontSize: 13,
    outline: "none",
    transition: "all 0.2s",
    boxSizing: "border-box",
    boxShadow: focused === field ? "0 0 0 3px rgba(6,182,212,0.08)" : "none",
  });

  return (
    <>
      <div
        style={{
          background: "linear-gradient(145deg,#18181b,#1c1c1f)",
          border: "1px solid #27272a",
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
              background: "rgba(6,182,212,0.15)",
              border: "1px solid rgba(6,182,212,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            📁
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: "#f4f4f5" }}>
              Categories
            </p>
            <p style={{ fontSize: 11, color: "#52525b" }}>
              {categories.length} total
            </p>
          </div>
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
                color: "#52525b",
                textTransform: "uppercase",
                letterSpacing: 1,
                display: "block",
                marginBottom: 6,
              }}
            >
              Name *
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
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
                color: "#52525b",
                textTransform: "uppercase",
                letterSpacing: 1,
                display: "block",
                marginBottom: 6,
              }}
            >
              Description
            </label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onFocus={() => setFocused("desc")}
              onBlur={() => setFocused("")}
              placeholder=""
              style={inputStyle("desc")}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !name.trim()}
            style={{
              padding: "10px 0",
              borderRadius: 10,
              border: "none",
              background: name.trim()
                ? "linear-gradient(135deg,#0891b2,#2563eb)"
                : "#27272a",
              color: "#fff",
              fontSize: 13,
              fontWeight: 700,
              cursor: !name.trim() || loading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              boxShadow: name.trim()
                ? "0 4px 12px rgba(8,145,178,0.3)"
                : "none",
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
                Adding...
              </>
            ) : (
              "+ Add Category"
            )}
          </button>
        </form>

        {/* Existing Categories List */}
        <div>
          <p
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: "#52525b",
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: 8,
            }}
          >
            Existing Categories
          </p>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              maxHeight: 200,
              overflowY: "auto",
            }}
          >
            {categories.length === 0 ? (
              <p
                style={{
                  fontSize: 12,
                  color: "#3f3f46",
                  textAlign: "center",
                  padding: "12px 0",
                }}
              >
                No categories yet
              </p>
            ) : (
              categories.map((cat) => (
                <div
                  key={cat.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 12px",
                    background: "#09090b",
                    border: "1px solid #27272a",
                    borderRadius: 10,
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#f4f4f5",
                      }}
                    >
                      {cat.name}
                    </p>
                    {cat.description && (
                      <p style={{ fontSize: 11, color: "#52525b" }}>
                        {cat.description}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => openDeleteModal(cat)}
                    disabled={deletingId === cat.id}
                    style={{
                      padding: "4px 10px",
                      borderRadius: 8,
                      border: "1px solid rgba(239,68,68,0.3)",
                      background: "rgba(239,68,68,0.1)",
                      color: "#f87171",
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: deletingId === cat.id ? "not-allowed" : "pointer",
                      transition: "all 0.2s",
                      opacity: deletingId === cat.id ? 0.5 : 1,
                    }}
                  >
                    {deletingId === cat.id ? "..." : "🗑️"}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            animation: "fadeIn 0.2s ease-out",
          }}
          onClick={closeDeleteModal}
        >
          <div
            style={{
              background: "linear-gradient(145deg,#18181b,#1c1c1f)",
              border: "1px solid #27272a",
              borderRadius: 20,
              padding: 24,
              maxWidth: 420,
              width: "90%",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
              animation: "scaleIn 0.2s ease-out",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "rgba(239,68,68,0.15)",
                  border: "1px solid rgba(239,68,68,0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  flexShrink: 0,
                }}
              >
                ⚠️
              </div>
              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#f4f4f5",
                    margin: "0 0 4px 0",
                  }}
                >
                  Delete Category
                </h3>
                <p
                  style={{
                    fontSize: 13,
                    color: "#71717a",
                    margin: 0,
                    lineHeight: 1.5,
                  }}
                >
                  This action cannot be undone. This will permanently delete the
                  category.
                </p>
              </div>
            </div>

            {/* Category Info */}
            <div
              style={{
                background: "#09090b",
                border: "1px solid #27272a",
                borderRadius: 12,
                padding: 12,
                marginBottom: 20,
              }}
            >
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#52525b",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  marginBottom: 6,
                }}
              >
                Category to delete
              </p>
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#f4f4f5",
                  margin: 0,
                }}
              >
                {deleteModal.category?.name}
              </p>
              {deleteModal.category?.description && (
                <p
                  style={{
                    fontSize: 12,
                    color: "#71717a",
                    margin: "4px 0 0 0",
                  }}
                >
                  {deleteModal.category.description}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={closeDeleteModal}
                style={{
                  flex: 1,
                  padding: "10px 0",
                  borderRadius: 10,
                  border: "1px solid #27272a",
                  background: "#18181b",
                  color: "#f4f4f5",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#27272a")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#18181b")
                }
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                style={{
                  flex: 1,
                  padding: "10px 0",
                  borderRadius: 10,
                  border: "none",
                  background: "linear-gradient(135deg,#dc2626,#ef4444)",
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(239,68,68,0.3)",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.02)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                Delete Category
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </>
  );
};

export default AddCategory;
