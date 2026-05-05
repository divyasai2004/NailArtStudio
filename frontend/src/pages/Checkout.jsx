import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { orderApi } from "../api/orderApi";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const { authUser } = useAuth();
  const isAdmin = Boolean(authUser?.isAdmin);
  const subtotal = cartItems.reduce((acc, item) => acc + Number(item.price) * Number(item.quantity), 0);
  const deliveryFee = subtotal > 999 ? 0 : 79;
  const total = subtotal + deliveryFee;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    paymentMethod: "COD",
  });

  const onChange = (e) =>
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

  const placeOrder = async (e) => {
    e.preventDefault();
    setError("");

    if (!cartItems.length) {
      setError("Your cart is empty. Add products before checkout.");
      return;
    }

    setLoading(true);

    try {
      if (form.paymentMethod !== "COD") {
        setError("Razorpay UI integration will be connected in Step 9.");
        setLoading(false);
        return;
      }

      const shippingAddress = {
        fullName: form.fullName,
        phone: form.phone,
        addressLine1: form.addressLine1,
        addressLine2: form.addressLine2,
        city: form.city,
        state: form.state,
        postalCode: form.postalCode,
        country: form.country,
      };

      await orderApi.createCodOrder({
        products: cartItems,
        shippingAddress,
        paymentMethod: "COD",
        shippingPrice: 0,
        discountAmount: 0,
      });

      clearCart();
      navigate(isAdmin ? "/admin/orders" : "/orders");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="split-layout page-shell">
      <form className="stack-sm panel" onSubmit={placeOrder}>
        <h2>Checkout</h2>
        <input name="fullName" placeholder="Full Name" onChange={onChange} required />
        <input name="phone" placeholder="Phone" onChange={onChange} required />
        <input name="addressLine1" placeholder="Address Line 1" onChange={onChange} required />
        <input name="addressLine2" placeholder="Address Line 2" onChange={onChange} />
        <input name="city" placeholder="City" onChange={onChange} required />
        <input name="state" placeholder="State" onChange={onChange} required />
        <input name="postalCode" placeholder="Postal Code" onChange={onChange} required />
        <select name="paymentMethod" onChange={onChange} value={form.paymentMethod}>
          <option value="COD">Cash on Delivery</option>
          <option value="RAZORPAY">Razorpay (UPI/Card/Netbanking)</option>
        </select>
        {error ? <p className="text-danger">{error}</p> : null}
        <button className="btn-primary" disabled={loading || !cartItems.length}>
          {loading ? "Placing order..." : "Place Order"}
        </button>
      </form>
      <aside className="panel stack-sm">
        <h3>Order Preview</h3>
        {cartItems.map((item) => (
          <p key={`${item.product}-${item.selectedSize || ""}-${item.selectedShape || ""}`}>
            {item.name} x {item.quantity} - ₹{(item.price * item.quantity).toFixed(2)}
          </p>
        ))}
        <hr />
        <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
        <p>Delivery: {deliveryFee === 0 ? "Free" : `₹${deliveryFee}`}</p>
        <h4>Total: ₹{total.toFixed(2)}</h4>
        <p className="muted">COD available across India. Razorpay UI will be added next.</p>
      </aside>
    </section>
  );
};

export default Checkout;

