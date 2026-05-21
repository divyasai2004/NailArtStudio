import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const [added, setAdded] = useState(false);

  const handleQuickAdd = (e) => {
    e.preventDefault();
    if (!product._id) return;
    addToCart({
      product: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      quantity: 1,
      selectedSize: product.sizeOptions?.[0] || "",
      selectedShape: product.shapeOptions?.[0] || "",
    });
    addToast(`${product.name} added to cart! 🛒`, "success");
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <>
      <style>{`
        .pc-card {
          background: var(--bg-card);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          overflow: hidden;
          transition: transform 0.35s var(--ease-out), box-shadow 0.35s;
          position: relative;
          display: flex;
          flex-direction: column;
        }
        .pc-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-lg); border-color: var(--brand-primary-light); }
        .pc-img-wrap {
          aspect-ratio: 4/5;
          overflow: hidden;
          position: relative;
          background: var(--bg-subtle);
          display: block;
        }
        .pc-img {
          width: 100%; height: 100%; object-fit: cover;
          transition: transform 0.6s var(--ease-out);
        }
        .pc-card:hover .pc-img { transform: scale(1.06); }
        .pc-badge {
          position: absolute; top: 12px; left: 12px;
          background: var(--brand-primary-gradient); color: var(--text-light);
          font-size: 0.65rem; letter-spacing: 0.1em; text-transform: uppercase;
          padding: 6px 12px; font-weight: 600; z-index: 2; border-radius: var(--radius-full);
          box-shadow: var(--shadow-sm);
        }
        .pc-discount-badge {
          position: absolute; top: 12px; right: 12px;
          background: #10b981; color: #fff;
          font-size: 0.65rem; font-weight: 600;
          padding: 6px 10px; z-index: 2; border-radius: var(--radius-full);
          box-shadow: var(--shadow-sm);
        }
        .pc-quick-add {
          position: absolute; bottom: 0; left: 0; right: 0;
          background: rgba(255, 255, 255, 0.9); color: var(--brand-primary-dark);
          backdrop-filter: blur(4px);
          border: none; padding: 14px;
          font-size: 0.75rem; font-weight: 600; letter-spacing: 0.1em;
          text-transform: uppercase; font-family: var(--ff-sans);
          opacity: 0; transform: translateY(10px);
          transition: all 0.3s var(--ease-out);
          z-index: 3;
        }
        .pc-card:hover .pc-quick-add { opacity: 1; transform: translateY(0); }
        .pc-quick-add:hover { background: var(--brand-primary-gradient); color: var(--text-light); }
        .pc-quick-add.added { background: #10b981; color: #fff; opacity: 1; transform: translateY(0); }
        .pc-info {
          padding: 16px 18px 20px;
          flex: 1; display: flex;
          justify-content: space-between; align-items: flex-end;
        }
        .pc-name {
          font-family: var(--ff-serif); font-size: 1.15rem; font-weight: 600;
          color: var(--text-main); margin-bottom: 4px; line-height: 1.2;
        }
        .pc-cat {
          font-size: 0.7rem; letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--text-muted);
        }
        .pc-price { font-family: var(--ff-serif); font-size: 1.15rem; font-weight: 600; color: var(--brand-primary-dark); white-space: nowrap; }
        .pc-price-orig { font-size: 0.85rem; text-decoration: line-through; color: var(--text-muted); display: block; text-align: right; }
      `}</style>
      <div className="pc-card">
        <Link to={product._id ? `/product/${product._id}` : "#"} className="pc-img-wrap">
          <img src={product.image} alt={product.name} className="pc-img" loading="lazy" />
          {product.isBestSeller && <span className="pc-badge">Bestseller</span>}
          {discount > 0 && <span className="pc-discount-badge">−{discount}%</span>}
          {product._id && (
            <button
              className={`pc-quick-add${added ? " added" : ""}`}
              onClick={handleQuickAdd}
              type="button"
            >
              {added ? "✓ Added!" : "+ Quick Add"}
            </button>
          )}
        </Link>
        <div className="pc-info">
          <div>
            <p className="pc-name">{product.name}</p>
            <p className="pc-cat">{product.category}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            {product.originalPrice && (
              <span className="pc-price-orig">₹{product.originalPrice}</span>
            )}
            <span className="pc-price">₹{product.price}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductCard;