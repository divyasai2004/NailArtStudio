import { useCallback, useEffect, useState } from "react";
import { productApi } from "../api/productApi";

const CATEGORIES = ["Extra Small", "Short", "Medium", "Long", "Extra Long", "Bridal", "Custom"];

const emptyForm = {
  name: "",
  title: "",
  shortBenefit: "",
  price: "",
  originalPrice: "",
  description: "",
  image: "",
  imageGallery: "",
  category: "Short",
  stock: 1,
  sizeOptions: "XS,S,M,L",
  shapeOptions: "Round,Almond,Square,Coffin,Stiletto",
  trustBadges: "Cash on Delivery,Easy Return",
  whatYouGet: "24 nail tips,Nail glue,Adhesive tabs,Prep kit",
  whyYouWillLoveIt: "Reusable,Salon finish,Handmade",
  perfectFor: "Daily wear,Party,Wedding",
  shippingPaymentInfo: "COD and prepaid available. Dispatch in 24-48 hours.",
  isBestSeller: false,
  isFeatured: false,
};

const parseList = (value) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterQuery, setFilterQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const [modalMode, setModalMode] = useState(null); // "add" | "edit" | null
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formMsg, setFormMsg] = useState("");
  const [formErr, setFormErr] = useState("");

  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await productApi.getProducts({ page: 1, limit: 200 });
      setProducts(data.products || []);
    } catch {
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const openAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setFormMsg("");
    setFormErr("");
    setModalMode("add");
  };

  const openEdit = (product) => {
    setForm({
      name: product.name || "",
      title: product.title || "",
      shortBenefit: product.shortBenefit || "",
      price: product.price ?? "",
      originalPrice: product.originalPrice ?? "",
      description: product.description || "",
      image: product.image || "",
      imageGallery: (product.images || []).join(", "),
      category: product.category || "Short",
      stock: product.stock ?? 1,
      sizeOptions: (product.sizeOptions || []).join(", "),
      shapeOptions: (product.shapeOptions || []).join(", "),
      trustBadges: (product.trustBadges || []).join(", "),
      whatYouGet: (product.whatYouGet || []).join(", "),
      whyYouWillLoveIt: (product.whyYouWillLoveIt || []).join(", "),
      perfectFor: (product.perfectFor || []).join(", "),
      shippingPaymentInfo: product.shippingPaymentInfo || "",
      isBestSeller: product.isBestSeller || false,
      isFeatured: product.isFeatured || false,
    });
    setEditingId(product._id);
    setFormMsg("");
    setFormErr("");
    setModalMode("edit");
  };

  const closeModal = () => {
    setModalMode(null);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormMsg("");
    setFormErr("");
    try {
      const payload = {
        name: form.name.trim(),
        title: form.title.trim(),
        shortBenefit: form.shortBenefit.trim(),
        price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
        description: form.description.trim(),
        image: form.image.trim(),
        images: parseList(form.imageGallery),
        category: form.category,
        stock: Number(form.stock),
        sizeOptions: parseList(form.sizeOptions),
        shapeOptions: parseList(form.shapeOptions),
        trustBadges: parseList(form.trustBadges),
        whatYouGet: parseList(form.whatYouGet),
        whyYouWillLoveIt: parseList(form.whyYouWillLoveIt),
        perfectFor: parseList(form.perfectFor),
        shippingPaymentInfo: form.shippingPaymentInfo.trim(),
        isBestSeller: form.isBestSeller,
        isFeatured: form.isFeatured,
      };

      if (modalMode === "add") {
        await productApi.createProduct(payload);
        setFormMsg("Product added successfully.");
        setForm(emptyForm);
      } else {
        await productApi.updateProduct(editingId, payload);
        setFormMsg("Product updated successfully.");
      }
      await fetchProducts();
    } catch (err) {
      setFormErr(err?.response?.data?.message || "Failed to save product.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (productId) => {
    setDeletingId(productId);
    try {
      await productApi.deleteProduct(productId);
      setProducts((prev) => prev.filter((p) => p._id !== productId));
      setConfirmDeleteId(null);
    } catch {
      alert("Failed to delete product.");
    } finally {
      setDeletingId(null);
    }
  };

  const displayed = products.filter((p) => {
    const matchQ = !filterQuery || p.name?.toLowerCase().includes(filterQuery.toLowerCase());
    const matchCat = filterCategory === "all" || p.category === filterCategory;
    return matchQ && matchCat;
  });

  return (
    <section className="stack-md page-shell">
      <div className="admin-page-header">
        <div>
          <h2>Products</h2>
          <p className="muted">Manage your product catalog ({products.length} total)</p>
        </div>
        <button className="btn-primary" onClick={openAdd}>
          + Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="panel">
        <div className="toolbar">
          <label>
            Search
            <input
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Search by name…"
            />
          </label>
          <label>
            Category
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
              <option value="all">All categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>
          <div />
          <div className="toolbar-actions">
            <button className="btn-ghost" onClick={() => { setFilterQuery(""); setFilterCategory("all"); }} type="button">
              Reset
            </button>
          </div>
        </div>
        <p className="muted" style={{ marginTop: 8 }}>
          Showing {displayed.length} of {products.length} products
        </p>
      </div>

      {loading && <p>Loading products…</p>}
      {error && <p className="text-danger">{error}</p>}

      {/* Products Table */}
      {!loading && (
        <div className="panel" style={{ overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Flags</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayed.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", color: "#999", padding: "24px 0" }}>
                    No products found.
                  </td>
                </tr>
              ) : (
                displayed.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <img
                        src={p.image}
                        alt={p.name}
                        className="admin-thumb"
                        onError={(e) => { e.target.style.display = "none"; }}
                      />
                    </td>
                    <td>
                      <strong>{p.name}</strong>
                      {p.title && <div className="muted" style={{ fontSize: 12 }}>{p.title}</div>}
                    </td>
                    <td><span className="badge">{p.category}</span></td>
                    <td>
                      <strong>₹{p.price}</strong>
                      {p.originalPrice && (
                        <span className="line-through muted" style={{ fontSize: 12, marginLeft: 4 }}>
                          ₹{p.originalPrice}
                        </span>
                      )}
                    </td>
                    <td>
                      <span className={p.stock === 0 ? "status-badge status-badge--danger" : "status-badge status-badge--success"}>
                        {p.stock}
                      </span>
                    </td>
                    <td>
                      {p.isBestSeller && <span className="status-badge status-badge--info" style={{ marginRight: 4 }}>BS</span>}
                      {p.isFeatured && <span className="status-badge status-badge--info">FT</span>}
                    </td>
                    <td>
                      <div className="admin-actions">
                        <button className="btn-ghost" style={{ padding: "5px 10px", fontSize: 13 }} onClick={() => openEdit(p)}>
                          Edit
                        </button>
                        {confirmDeleteId === p._id ? (
                          <>
                            <button
                              className="btn-danger"
                              style={{ padding: "5px 10px", fontSize: 13 }}
                              onClick={() => handleDelete(p._id)}
                              disabled={deletingId === p._id}
                            >
                              {deletingId === p._id ? "Deleting…" : "Confirm"}
                            </button>
                            <button
                              className="btn-ghost"
                              style={{ padding: "5px 10px", fontSize: 13 }}
                              onClick={() => setConfirmDeleteId(null)}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            className="btn-danger"
                            style={{ padding: "5px 10px", fontSize: 13 }}
                            onClick={() => setConfirmDeleteId(p._id)}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Overlay */}
      {modalMode && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{modalMode === "add" ? "Add Product" : "Edit Product"}</h3>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>
            <form className="stack-sm" onSubmit={handleSubmit} style={{ overflowY: "auto", maxHeight: "70vh", paddingRight: 4 }}>
              <div className="admin-form-grid">
                <input name="name" placeholder="Product name *" value={form.name} onChange={onChange} required />
                <input name="title" placeholder="Title (optional)" value={form.title} onChange={onChange} />
                <input name="shortBenefit" placeholder="Short benefit" value={form.shortBenefit} onChange={onChange} />
                <select name="category" value={form.category} onChange={onChange}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <input name="price" type="number" min="0" placeholder="Price *" value={form.price} onChange={onChange} required />
                <input name="originalPrice" type="number" min="0" placeholder="Original price" value={form.originalPrice} onChange={onChange} />
                <input name="stock" type="number" min="0" placeholder="Stock *" value={form.stock} onChange={onChange} required />
                <input name="image" placeholder="Main image URL *" value={form.image} onChange={onChange} required />
              </div>
              <textarea name="description" placeholder="Description *" rows={3} value={form.description} onChange={onChange} required />
              <input name="imageGallery" placeholder="Extra image URLs (comma separated)" value={form.imageGallery} onChange={onChange} />
              <input name="sizeOptions" placeholder="Size options (comma separated)" value={form.sizeOptions} onChange={onChange} />
              <input name="shapeOptions" placeholder="Shape options (comma separated)" value={form.shapeOptions} onChange={onChange} />
              <input name="trustBadges" placeholder="Trust badges (comma separated)" value={form.trustBadges} onChange={onChange} />
              <input name="whatYouGet" placeholder="What you get (comma separated)" value={form.whatYouGet} onChange={onChange} />
              <input name="whyYouWillLoveIt" placeholder="Why you'll love it (comma separated)" value={form.whyYouWillLoveIt} onChange={onChange} />
              <input name="perfectFor" placeholder="Perfect for (comma separated)" value={form.perfectFor} onChange={onChange} />
              <textarea name="shippingPaymentInfo" placeholder="Shipping and payment info" rows={2} value={form.shippingPaymentInfo} onChange={onChange} />
              <div className="toolbar-actions" style={{ justifyContent: "flex-start", gap: 16 }}>
                <label>
                  <input type="checkbox" name="isBestSeller" checked={form.isBestSeller} onChange={onChange} />{" "}
                  Best Seller
                </label>
                <label>
                  <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={onChange} />{" "}
                  Featured
                </label>
              </div>
              {formMsg && <p style={{ color: "green" }}>{formMsg}</p>}
              {formErr && <p className="text-danger">{formErr}</p>}
              <div className="admin-actions">
                <button className="btn-primary" disabled={saving}>
                  {saving ? "Saving…" : modalMode === "add" ? "Add Product" : "Save Changes"}
                </button>
                <button type="button" className="btn-ghost" onClick={closeModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default AdminProducts;
