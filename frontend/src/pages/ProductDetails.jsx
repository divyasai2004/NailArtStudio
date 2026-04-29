import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { productApi } from "../api/productApi";
import { useCart } from "../context/CartContext";

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedShape, setSelectedShape] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  if (loading) {
    return <div style={{ padding: "20px" }}>Loading product details...</div>;
  }

  if (error || !product) {
    return (
      <div style={{ padding: "20px", color: "red" }}>
        {error || "Product not found"}
      </div>
    );
  }

  return (
    <div className="product-detail page-shell">
      <div>
        <img src={product.image} alt={product.name} className="detail-image" />
      </div>
      <div className="stack-sm">
        <h2>{product.title || product.name}</h2>
        <p>{product.shortBenefit}</p>
        <p>
          {product.originalPrice ? (
            <>
              <span className="line-through">₹{product.originalPrice}</span>{" "}
            </>
          ) : null}
          <strong>₹{product.price}</strong>
        </p>

        <label>
          Size
          <select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
          >
            {(product.sizeOptions || []).map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>

        <label>
          Shape
          <select
            value={selectedShape}
            onChange={(e) => setSelectedShape(e.target.value)}
          >
            {(product.shapeOptions || []).map((shape) => (
              <option key={shape} value={shape}>
                {shape}
              </option>
            ))}
          </select>
        </label>

        <div className="trust-badges">
          {(product.trustBadges || ["COD", "Easy Return"]).map((badge) => (
            <span key={badge} className="badge">
              {badge}
            </span>
          ))}
        </div>

        <label>
          Quantity
          <div className="qty-control">
            <button
              type="button"
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
            >
              -
            </button>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
            />
            <button type="button" onClick={() => setQuantity((prev) => prev + 1)}>
              +
            </button>
          </div>
        </label>
        <p className="muted">Estimated delivery: 3-5 business days</p>

        <button
          className="btn-primary"
          onClick={() =>
            addToCart({
              product: product._id,
              name: product.name,
              image: product.image,
              price: product.price,
              quantity,
              selectedSize,
              selectedShape,
            })
          }
        >
          Add to Cart - ₹{(Number(product.price) * quantity).toFixed(2)}
        </button>

        <article className="panel">
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <h4>Why You'll Love It</h4>
          <ul className="plain-list">
            {(product.whyYouWillLoveIt || []).map((point, idx) => (
              <li key={`${point}-${idx}`}>{point}</li>
            ))}
          </ul>
          <h4>What You Get</h4>
          <ul className="plain-list">
            {(product.whatYouGet || []).map((point, idx) => (
              <li key={`${point}-${idx}`}>{point}</li>
            ))}
          </ul>
          <p>
            <strong>Size guide:</strong>{" "}
            {product.sizeGuide || "Standard and custom sizing"}
          </p>
          <p>
            <strong>Perfect for:</strong>{" "}
            {(product.perfectFor || []).join(", ")}
          </p>
          <p>
            <strong>Shipping & payment:</strong>{" "}
            {product.shippingPaymentInfo || "COD and prepaid options available."}
          </p>
        </article>
      </div>
    </div>
  );
};

export default ProductDetails;