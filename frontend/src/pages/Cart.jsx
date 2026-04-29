import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const buildItemKey = (item) =>
  `${item.product}|${item.selectedSize || ""}|${item.selectedShape || ""}`;

const Cart = () => {
  const { cartItems, updateCartItemQty, removeCartItem } = useCart();
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = subtotal > 999 ? 0 : 79;
  const total = subtotal + deliveryFee;

  if (!cartItems.length) {
    return (
      <section className="panel">
        <h2>Your Cart</h2>
        <p>Your cart is empty.</p>
        <Link className="btn-primary" to="/products">
          Continue Shopping
        </Link>
      </section>
    );
  }

  return (
    <section className="stack-md page-shell">
      <h2>Your Cart</h2>
      <div className="split-layout">
        <div className="stack-sm">
          {cartItems.map((item) => {
            const itemKey = buildItemKey(item);
            return (
              <article className="panel cart-row" key={itemKey}>
                <div>
                  <h4>{item.name}</h4>
                  <p>
                    ₹{item.price} | {item.selectedSize || "NA"} |{" "}
                    {item.selectedShape || "NA"}
                  </p>
                </div>
                <div className="cart-actions">
                  <div className="qty-control">
                    <button
                      type="button"
                      onClick={() => updateCartItemQty(itemKey, Math.max(1, item.quantity - 1))}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) =>
                        updateCartItemQty(itemKey, Math.max(1, Number(e.target.value) || 1))
                      }
                    />
                    <button type="button" onClick={() => updateCartItemQty(itemKey, item.quantity + 1)}>
                      +
                    </button>
                  </div>
                  <button className="btn-ghost" onClick={() => removeCartItem(itemKey)}>
                    Remove
                  </button>
                </div>
              </article>
            );
          })}
        </div>
        <aside className="panel stack-sm">
          <h3>Order Summary</h3>
          <p>Items: {cartItems.length}</p>
          <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
          <p>Delivery: {deliveryFee === 0 ? "Free" : `₹${deliveryFee}`}</p>
          <h4>Total: ₹{total.toFixed(2)}</h4>
          {deliveryFee > 0 ? (
            <p className="muted">Add ₹{(1000 - subtotal).toFixed(2)} more for free shipping.</p>
          ) : (
            <p className="muted">You unlocked free shipping.</p>
          )}
          <Link className="btn-primary" to="/checkout">
            Proceed to Checkout
          </Link>
          <Link className="btn-secondary" to="/products">
            Continue Shopping
          </Link>
        </aside>
      </div>
    </section>
  );
};

export default Cart;

