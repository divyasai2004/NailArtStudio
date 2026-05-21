import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { orderApi } from "../api/orderApi";
import { couponApi } from "../api/couponApi";
import { useCart } from "../context/CartContext";

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  
  const subtotal = cartItems.reduce((acc, item) => acc + Number(item.price) * Number(item.quantity), 0);
  const deliveryFee = subtotal > 999 ? 0 : 79;
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Coupon state
  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [isApplying, setIsApplying] = useState(false);

  const total = subtotal + deliveryFee - discountAmount;

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

  const handleApplyCoupon = async () => {
    if (!couponCodeInput.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }
    
    setIsApplying(true);
    setCouponError("");
    
    try {
      const res = await couponApi.validateCoupon({
        code: couponCodeInput,
        orderAmount: subtotal
      });
      
      setAppliedCoupon(res.coupon);
      setDiscountAmount(res.discountAmount);
      setCouponCodeInput(""); // clear input on success
    } catch (err) {
      setCouponError(err?.response?.data?.message || "Invalid coupon");
      setAppliedCoupon(null);
      setDiscountAmount(0);
    } finally {
      setIsApplying(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setCouponError("");
  };

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

      const order = await orderApi.createCodOrder({
        products: cartItems,
        shippingAddress,
        paymentMethod: "COD",
        shippingPrice: deliveryFee,
        discountAmount: discountAmount,
        couponCode: appliedCoupon?.code || undefined
      });

      clearCart();
      navigate(`/order/${order._id}`);
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
      
      <div className="stack-sm">
        <aside className="panel stack-sm" style={{ marginBottom: '1rem' }}>
          <h3>Order Preview</h3>
          {cartItems.map((item) => (
            <p key={`${item.product}-${item.selectedSize || ""}-${item.selectedShape || ""}`}>
              {item.name} x {item.quantity} - ₹{(item.price * item.quantity).toFixed(2)}
            </p>
          ))}
          <hr />
          <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
          <p>Delivery: {deliveryFee === 0 ? "Free" : `₹${deliveryFee}`}</p>
          
          {discountAmount > 0 && (
            <p style={{ color: 'var(--brand-primary)' }}>Discount ({appliedCoupon?.code}): -₹{discountAmount.toFixed(2)}</p>
          )}
          
          <h4>Total: ₹{total.toFixed(2)}</h4>
          <p className="muted">COD available across India.</p>
        </aside>

        <aside className="panel stack-sm">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '10px' }}>Apply Coupon</h3>
          
          {appliedCoupon ? (
            <div style={{ background: 'var(--bg-accent)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--brand-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ color: 'var(--brand-primary-dark)' }}>{appliedCoupon.code}</strong> applied
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {appliedCoupon.discountType === 'PERCENTAGE' ? `${appliedCoupon.discountValue}% off` : `₹${appliedCoupon.discountValue} off`}
                </div>
              </div>
              <button type="button" onClick={handleRemoveCoupon} style={{ color: 'red', background: 'none', border: 'none', fontSize: '0.9rem', cursor: 'pointer', textDecoration: 'underline' }}>
                Remove
              </button>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="text" 
                  placeholder="Enter code" 
                  value={couponCodeInput}
                  onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                  style={{ textTransform: 'uppercase' }}
                />
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={handleApplyCoupon}
                  disabled={isApplying || !couponCodeInput.trim() || subtotal === 0}
                  style={{ padding: '0 16px', whiteSpace: 'nowrap' }}
                >
                  {isApplying ? "..." : "Apply"}
                </button>
              </div>
              {couponError && <p className="text-danger" style={{ fontSize: '0.85rem', marginTop: '8px' }}>{couponError}</p>}
            </div>
          )}
        </aside>
      </div>
    </section>
  );
};

export default Checkout;

