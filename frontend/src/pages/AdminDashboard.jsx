import { useState } from "react";
import { Link } from "react-router-dom";
import { productApi } from "../api/productApi";

const CATEGORIES = ["Extra Small", "Short", "Medium", "Long", "Extra Long", "Bridal", "Custom"];

const AdminDashboard = () => {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
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
  });

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const parseList = (value) =>
    value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

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

      await productApi.createProduct(payload);
      setMessage("Product added successfully.");
      setForm((prev) => ({
        ...prev,
        name: "",
        title: "",
        shortBenefit: "",
        price: "",
        originalPrice: "",
        description: "",
        image: "",
        imageGallery: "",
        stock: 1,
      }));
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to add product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="stack-md page-shell">
      <h2>Admin Dashboard</h2>
      <div className="kpi-grid">
        <article className="kpi">
          <p className="muted">Orders Today</p>
          <p className="kpi-value">24</p>
        </article>
        <article className="kpi">
          <p className="muted">Pending Dispatch</p>
          <p className="kpi-value">9</p>
        </article>
        <article className="kpi">
          <p className="muted">Low Stock SKUs</p>
          <p className="kpi-value">5</p>
        </article>
      </div>
      <form className="panel stack-sm" onSubmit={handleAddProduct}>
        <h3>Add Product</h3>
        <div className="admin-form-grid">
          <input name="name" placeholder="Product name" value={form.name} onChange={onChange} required />
          <input name="title" placeholder="Title (optional)" value={form.title} onChange={onChange} />
          <input
            name="shortBenefit"
            placeholder="Short benefit"
            value={form.shortBenefit}
            onChange={onChange}
          />
          <select name="category" value={form.category} onChange={onChange}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <input
            name="price"
            type="number"
            min="0"
            placeholder="Price"
            value={form.price}
            onChange={onChange}
            required
          />
          <input
            name="originalPrice"
            type="number"
            min="0"
            placeholder="Original price (optional)"
            value={form.originalPrice}
            onChange={onChange}
          />
          <input
            name="stock"
            type="number"
            min="0"
            placeholder="Stock"
            value={form.stock}
            onChange={onChange}
            required
          />
          <input
            name="image"
            placeholder="Main image URL"
            value={form.image}
            onChange={onChange}
            required
          />
        </div>
        <textarea
          name="description"
          placeholder="Description"
          rows={4}
          value={form.description}
          onChange={onChange}
          required
        />
        <input
          name="imageGallery"
          placeholder="Extra image URLs (comma separated)"
          value={form.imageGallery}
          onChange={onChange}
        />
        <input
          name="sizeOptions"
          placeholder="Size options comma separated (e.g. XS,S,M,L)"
          value={form.sizeOptions}
          onChange={onChange}
        />
        <input
          name="shapeOptions"
          placeholder="Shape options comma separated"
          value={form.shapeOptions}
          onChange={onChange}
        />
        <input
          name="trustBadges"
          placeholder="Trust badges comma separated"
          value={form.trustBadges}
          onChange={onChange}
        />
        <input
          name="whatYouGet"
          placeholder="What you get comma separated"
          value={form.whatYouGet}
          onChange={onChange}
        />
        <input
          name="whyYouWillLoveIt"
          placeholder="Why you'll love it comma separated"
          value={form.whyYouWillLoveIt}
          onChange={onChange}
        />
        <input
          name="perfectFor"
          placeholder="Perfect for comma separated"
          value={form.perfectFor}
          onChange={onChange}
        />
        <textarea
          name="shippingPaymentInfo"
          placeholder="Shipping and payment info"
          rows={2}
          value={form.shippingPaymentInfo}
          onChange={onChange}
        />
        <div className="toolbar-actions" style={{ justifyContent: "flex-start" }}>
          <label>
            <input
              type="checkbox"
              name="isBestSeller"
              checked={form.isBestSeller}
              onChange={onChange}
            />{" "}
            Best seller
          </label>
          <label>
            <input
              type="checkbox"
              name="isFeatured"
              checked={form.isFeatured}
              onChange={onChange}
            />{" "}
            Featured
          </label>
        </div>
        {message ? <p style={{ color: "green" }}>{message}</p> : null}
        {error ? <p className="text-danger">{error}</p> : null}
        <button className="btn-primary" disabled={saving}>
          {saving ? "Saving..." : "Add Product"}
        </button>
      </form>
      <div className="grid-3">
        <div className="panel">
          <h4>Manage Products</h4>
          <p>Create, update, and delete catalog items.</p>
          <Link className="btn-secondary" to="/admin/products">
            Go to products
          </Link>
        </div>
        <div className="panel">
          <h4>Manage Orders</h4>
          <p>Track processing, shipping, delivery and COD status.</p>
          <Link className="btn-secondary" to="/admin/orders">
            Review orders
          </Link>
        </div>
        <div className="panel">
          <h4>Users</h4>
          <p>View and manage customer accounts.</p>
          <Link className="btn-secondary" to="/admin/users">
            View users
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AdminDashboard;

