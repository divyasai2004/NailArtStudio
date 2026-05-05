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
          background: var(--white);
          overflow: hidden;
          transition: transform 0.35s var(--ease-out), box-shadow 0.35s;
          position: relative;
          display: flex;
          flex-direction: column;
        }
        .pc-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-lg); }
        .pc-img-wrap {
          aspect-ratio: 4/5;
          overflow: hidden;
          position: relative;
          background: var(--blush);
          display: block;
        }
        .pc-img {
          width: 100%; height: 100%; object-fit: cover;
          transition: transform 0.6s var(--ease-out);
        }
        .pc-card:hover .pc-img { transform: scale(1.06); }
        .pc-badge {
          position: absolute; top: 12px; left: 12px;
          background: var(--crimson); color: var(--cream);
          font-size: 0.57rem; letter-spacing: 0.18em; text-transform: uppercase;
          padding: 4px 10px; font-weight: 500; z-index: 2;
        }
        .pc-discount-badge {
          position: absolute; top: 12px; right: 12px;
          background: #16a34a; color: #fff;
          font-size: 0.6rem; font-weight: 600;
          padding: 4px 8px; z-index: 2;
        }
        .pc-quick-add {
          position: absolute; bottom: 0; left: 0; right: 0;
          background: var(--crimson); color: var(--cream);
          border: none; padding: 10px;
          font-size: 0.65rem; font-weight: 500; letter-spacing: 0.18em;
          text-transform: uppercase; font-family: var(--ff-sans);
          opacity: 0; transform: translateY(6px);
          transition: opacity 0.3s, transform 0.3s, background 0.2s;
          z-index: 3;
        }
        .pc-card:hover .pc-quick-add { opacity: 1; transform: translateY(0); }
        .pc-quick-add:hover { background: var(--rose); }
        .pc-quick-add.added { background: #16a34a; opacity: 1; transform: translateY(0); }
        .pc-info {
          padding: 14px 16px 18px;
          border-top: 1px solid var(--blush);
          flex: 1; display: flex;
          justify-content: space-between; align-items: flex-end;
        }
        .pc-name {
          font-family: var(--ff-serif); font-size: 1.05rem; font-weight: 400;
          color: var(--crimson); margin-bottom: 3px; line-height: 1.2;
        }
        .pc-cat {
          font-size: 0.65rem; letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--muted);
        }
        .pc-price { font-family: var(--ff-serif); font-size: 1.05rem; color: var(--rose); white-space: nowrap; }
        .pc-price-orig { font-size: 0.75rem; text-decoration: line-through; color: var(--nude); display: block; text-align: right; }
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