import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { productApi } from "../api/productApi";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedShape, setSelectedShape] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productApi.getProductById(id);
        setProduct(data);
        setSelectedSize(data?.sizeOptions?.[0] || "");
        setSelectedShape(data?.shapeOptions?.[0] || "");
      } catch (err) {
        setError("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart({
      product: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      quantity,
      selectedSize,
      selectedShape,
    });
    // FIX #2: Toast notification on Add to Cart
    addToast(`${product.name} added to cart! 🛒`, "success");
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="pd-loading">
        <div className="pd-loading-img" />
        <div className="pd-loading-info">
          <div className="pd-skel pd-skel--title" />
          <div className="pd-skel pd-skel--price" />
          <div className="pd-skel pd-skel--btn" />
        </div>
        <style>{`.pd-loading{display:grid;grid-template-columns:1fr 1fr;gap:40px;padding:60px clamp(16px,7vw,100px);max-width:1200px;margin:0 auto}.pd-loading-img{background:var(--blush);aspect-ratio:4/5;animation:pd-pulse 1.5s ease infinite}.pd-loading-info{display:flex;flex-direction:column;gap:16px;padding-top:20px}.pd-skel{background:var(--blush);border-radius:2px;animation:pd-pulse 1.5s ease infinite}.pd-skel--title{height:36px;width:70%}.pd-skel--price{height:24px;width:40%}.pd-skel--btn{height:48px;width:100%;margin-top:16px}@keyframes pd-pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="pd-error">
        <p>😕 {error || "Product not found"}</p>
        <Link to="/products" className="pd-back-link">← Back to Shop</Link>
        <style>{`.pd-error{padding:80px clamp(16px,7vw,100px);text-align:center;color:var(--muted)}.pd-back-link{display:inline-block;margin-top:16px;color:var(--crimson);font-size:0.9rem;text-decoration:underline}`}</style>
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <>
      <style>{`
        .pd-wrap {
          max-width: 1200px;
          margin: 0 auto;
          padding: clamp(24px, 5vw, 60px) clamp(16px, 7vw, 100px);
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(24px, 5vw, 64px);
          align-items: start;
        }
        @media (max-width: 768px) { .pd-wrap { grid-template-columns: 1fr; } }
        .pd-img-main {
          width: 100%;
          aspect-ratio: 4/5;
          object-fit: cover;
          display: block;
          background: var(--blush);
        }
        .pd-img-gallery {
          display: flex;
          gap: 8px;
          margin-top: 10px;
          overflow-x: auto;
        }
        .pd-img-thumb {
          width: 68px;
          height: 80px;
          object-fit: cover;
          cursor: pointer;
          border: 2px solid transparent;
          flex-shrink: 0;
          transition: border-color 0.2s;
          background: var(--blush);
        }
        .pd-img-thumb.active { border-color: var(--crimson); }
        .pd-breadcrumb {
          font-size: 0.75rem;
          color: var(--muted);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 14px;
        }
        .pd-breadcrumb a { color: var(--crimson); }
        .pd-category-chip {
          display: inline-block;
          font-size: 0.65rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          background: var(--blush);
          color: var(--crimson);
          padding: 4px 12px;
          margin-bottom: 12px;
          font-weight: 500;
        }
        .pd-name {
          font-family: var(--ff-serif);
          font-size: clamp(1.8rem, 3.5vw, 2.8rem);
          font-weight: 300;
          color: var(--crimson);
          line-height: 1.12;
          margin-bottom: 8px;
        }
        .pd-short-benefit {
          font-size: 0.9rem;
          color: var(--muted);
          margin-bottom: 18px;
          line-height: 1.6;
        }
        .pd-price-row {
          display: flex;
          align-items: baseline;
          gap: 12px;
          margin-bottom: 22px;
          flex-wrap: wrap;
        }
        .pd-price {
          font-family: var(--ff-serif);
          font-size: 2rem;
          font-weight: 400;
          color: var(--crimson);
        }
        .pd-price-orig {
          font-size: 1.1rem;
          text-decoration: line-through;
          color: var(--nude);
        }
        .pd-discount-tag {
          background: #f0fdf4;
          color: #16a34a;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 2px;
        }
        .pd-divider { height: 1px; background: var(--blush); margin: 18px 0; }
        .pd-option-label {
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .pd-option-label span {
          background: var(--cream);
          border: 1px solid var(--blush);
          color: var(--crimson);
          padding: 2px 10px;
          font-size: 0.7rem;
          border-radius: 20px;
        }
        .pd-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 20px;
        }
        .pd-pill {
          padding: 8px 16px;
          border: 1.5px solid var(--blush);
          background: var(--white);
          font-family: var(--ff-sans);
          font-size: 0.8rem;
          color: var(--text);
          cursor: pointer;
          transition: all 0.2s;
          border-radius: 2px;
        }
        .pd-pill:hover { border-color: var(--nude); }
        .pd-pill.active {
          border-color: var(--crimson);
          background: var(--crimson);
          color: var(--cream);
        }
        .pd-qty-row {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 20px;
        }
        .pd-qty {
          display: flex;
          align-items: center;
          border: 1.5px solid var(--blush);
          overflow: hidden;
        }
        .pd-qty button {
          width: 40px;
          height: 40px;
          background: var(--parchment);
          border: none;
          font-size: 1.2rem;
          color: var(--crimson);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }
        .pd-qty button:hover { background: var(--blush); }
        .pd-qty input {
          width: 52px;
          text-align: center;
          border: none;
          border-left: 1.5px solid var(--blush);
          border-right: 1.5px solid var(--blush);
          height: 40px;
          font-size: 0.95rem;
          color: var(--text);
          background: var(--white);
          font-family: var(--ff-sans);
          outline: none;
        }
        .pd-qty-note { font-size: 0.8rem; color: var(--muted); }
        .pd-atc-btn {
          width: 100%;
          padding: 16px 24px;
          background: var(--crimson);
          color: var(--cream);
          border: none;
          font-family: var(--ff-sans);
          font-size: 0.78rem;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        .pd-atc-btn:hover { background: var(--rose); transform: translateY(-2px); box-shadow: var(--shadow-md); }
        .pd-atc-btn.added { background: #16a34a; }
        .pd-trust-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 20px;
        }
        .pd-trust-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          color: var(--muted);
          padding: 6px 12px;
          border: 1px solid var(--blush);
          border-radius: 2px;
          background: var(--cream);
        }
        .pd-tabs {
          display: flex;
          border-bottom: 1.5px solid var(--blush);
          margin-top: 32px;
          gap: 0;
        }
        .pd-tab {
          padding: 10px 18px;
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--muted);
          cursor: pointer;
          border: none;
          background: none;
          border-bottom: 2px solid transparent;
          margin-bottom: -1.5px;
          transition: color 0.2s, border-color 0.2s;
          font-family: var(--ff-sans);
        }
        .pd-tab:hover { color: var(--crimson); }
        .pd-tab.active { color: var(--crimson); border-bottom-color: var(--crimson); }
        .pd-tab-body {
          padding: 20px 0;
          font-size: 0.88rem;
          color: var(--muted);
          line-height: 1.8;
        }
        .pd-tab-body h4 {
          font-family: var(--ff-serif);
          font-size: 1.1rem;
          font-weight: 400;
          color: var(--crimson);
          margin: 16px 0 8px;
        }
        .pd-tab-body ul {
          padding-left: 18px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .pd-delivery {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.82rem;
          color: var(--muted);
          margin-top: 4px;
        }
        .pd-delivery-dot {
          width: 8px;
          height: 8px;
          background: #16a34a;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .pd-rating {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 14px;
        }
        .pd-stars { color: var(--rose); font-size: 0.85rem; letter-spacing: 2px; }
        .pd-rating-count { font-size: 0.8rem; color: var(--muted); }
      `}</style>

      <div className="pd-wrap">
        {/* ── Image Column ── */}
        <div>
          <img
            src={product.image}
            alt={product.name}
            className="pd-img-main"
          />
          {product.images && product.images.length > 0 && (
            <div className="pd-img-gallery">
              <img
                src={product.image}
                alt="main"
                className="pd-img-thumb active"
              />
              {product.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`view ${i + 2}`}
                  className="pd-img-thumb"
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Info Column ── */}
        <div>
          <p className="pd-breadcrumb">
            <Link to="/">Home</Link> / <Link to="/products">Shop</Link> / {product.category}
          </p>

          <span className="pd-category-chip">{product.category} Collection</span>

          {product.numReviews > 0 && (
            <div className="pd-rating">
              <span className="pd-stars">{"★".repeat(Math.round(product.rating))}{"☆".repeat(5 - Math.round(product.rating))}</span>
              <span className="pd-rating-count">{product.rating.toFixed(1)} ({product.numReviews} reviews)</span>
            </div>
          )}

          <h1 className="pd-name">{product.title || product.name}</h1>
          {product.shortBenefit && (
            <p className="pd-short-benefit">{product.shortBenefit}</p>
          )}

          <div className="pd-price-row">
            <span className="pd-price">₹{product.price}</span>
            {product.originalPrice && (
              <span className="pd-price-orig">₹{product.originalPrice}</span>
            )}
            {discount > 0 && (
              <span className="pd-discount-tag">{discount}% OFF</span>
            )}
          </div>

          <div className="pd-divider" />

          {/* Size */}
          {product.sizeOptions?.length > 0 && (
            <>
              <p className="pd-option-label">
                Size <span>{selectedSize}</span>
              </p>
              <div className="pd-pills">
                {product.sizeOptions.map((s) => (
                  <button
                    key={s}
                    className={`pd-pill${selectedSize === s ? " active" : ""}`}
                    onClick={() => setSelectedSize(s)}
                    type="button"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Shape */}
          {product.shapeOptions?.length > 0 && (
            <>
              <p className="pd-option-label">
                Shape <span>{selectedShape}</span>
              </p>
              <div className="pd-pills">
                {product.shapeOptions.map((sh) => (
                  <button
                    key={sh}
                    className={`pd-pill${selectedShape === sh ? " active" : ""}`}
                    onClick={() => setSelectedShape(sh)}
                    type="button"
                  >
                    {sh}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Quantity */}
          <div className="pd-qty-row">
            <div className="pd-qty">
              <button type="button" onClick={() => setQuantity((p) => Math.max(1, p - 1))}>−</button>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
              />
              <button type="button" onClick={() => setQuantity((p) => p + 1)}>+</button>
            </div>
            <span className="pd-qty-note">
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </span>
          </div>

          {/* Add to Cart */}
          <button
            className={`pd-atc-btn${added ? " added" : ""}`}
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            type="button"
          >
            {added ? "✓ Added to Cart!" : `🛒 Add to Cart — ₹${(Number(product.price) * quantity).toFixed(0)}`}
          </button>

          {/* Delivery note */}
          <div className="pd-delivery">
            <div className="pd-delivery-dot" />
            Estimated delivery: 3–5 business days · Free above ₹999
          </div>

          <div className="pd-divider" />

          {/* Trust badges */}
          <div className="pd-trust-row">
            {(product.trustBadges?.length ? product.trustBadges : ["Cash on Delivery", "Easy Return"]).map((b) => (
              <span key={b} className="pd-trust-badge">✓ {b}</span>
            ))}
          </div>

          {/* Tabs */}
          <div className="pd-tabs">
            {["description", "details", "shipping"].map((tab) => (
              <button
                key={tab}
                className={`pd-tab${activeTab === tab ? " active" : ""}`}
                onClick={() => setActiveTab(tab)}
                type="button"
              >
                {tab === "description" ? "Description" : tab === "details" ? "What You Get" : "Shipping"}
              </button>
            ))}
          </div>

          <div className="pd-tab-body">
            {activeTab === "description" && (
              <>
                <p>{product.description}</p>
                {product.whyYouWillLoveIt?.length > 0 && (
                  <>
                    <h4>Why You'll Love It</h4>
                    <ul>{product.whyYouWillLoveIt.map((p, i) => <li key={i}>{p}</li>)}</ul>
                  </>
                )}
                {product.perfectFor?.length > 0 && (
                  <p style={{ marginTop: 12 }}>
                    <strong>Perfect for:</strong> {product.perfectFor.join(", ")}
                  </p>
                )}
              </>
            )}
            {activeTab === "details" && (
              <>
                {product.whatYouGet?.length > 0 && (
                  <>
                    <h4>What's Included</h4>
                    <ul>{product.whatYouGet.map((p, i) => <li key={i}>{p}</li>)}</ul>
                  </>
                )}
                {product.sizeGuide && (
                  <p style={{ marginTop: 12 }}>
                    <strong>Size Guide:</strong> {product.sizeGuide}
                  </p>
                )}
              </>
            )}
            {activeTab === "shipping" && (
              <p>{product.shippingPaymentInfo || "Cash on Delivery available across India. Dispatch within 24–48 hours. Estimated delivery: 3–5 business days. Free shipping on orders above ₹999."}</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;