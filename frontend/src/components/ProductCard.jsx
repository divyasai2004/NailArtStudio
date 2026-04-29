import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const canOpenDetails = Boolean(product._id);

  return (
    <div className="card">
      <img src={product.image} alt={product.name} className="card-image" />
      <h3>{product.name}</h3>
      <p>
        {product.originalPrice ? (
          <>
            <span className="line-through">₹{product.originalPrice}</span>{" "}
          </>
        ) : null}
        <strong>₹{product.price}</strong>
      </p>
      {canOpenDetails ? (
        <Link to={`/product/${product._id}`}>
          <button className="btn-primary">View Details</button>
        </Link>
      ) : (
        <button className="btn-ghost" type="button" title="Details are available when API is connected">
          Details soon
        </button>
      )}
    </div>
  );
};

export default ProductCard;