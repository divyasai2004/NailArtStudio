import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { orderApi } from "../api/orderApi";

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await orderApi.getOrderById(id);
        setOrder(data);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to fetch order details");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return (
    <div className="page-shell" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <div style={{ animation: 'spin 1s linear infinite', border: '3px solid var(--border-light)', borderTop: '3px solid var(--brand-primary)', borderRadius: '50%', width: '40px', height: '40px' }}></div>
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
  
  if (error) return (
    <div className="page-shell" style={{ textAlign: 'center', padding: '4rem 0' }}>
      <div style={{ background: '#fee2e2', color: '#991b1b', padding: '2rem', borderRadius: 'var(--radius-lg)', display: 'inline-block' }}>
        <h2 style={{ margin: '0 0 1rem 0' }}>Oops!</h2>
        <p>{error}</p>
        <Link to="/orders" className="btn-primary" style={{ marginTop: '1rem' }}>Back to Orders</Link>
      </div>
    </div>
  );
  
  if (!order) return null;

  const getStatusColor = (status) => {
    switch(status?.toUpperCase()) {
      case 'DELIVERED': return '#10b981'; // green
      case 'SHIPPED': return '#3b82f6'; // blue
      case 'CANCELLED': return '#ef4444'; // red
      case 'CONFIRMED': return 'var(--brand-primary)'; // pink
      default: return '#f59e0b'; // orange (Processing/Pending)
    }
  };

  const statusColor = getStatusColor(order.orderStatus);

  return (
    <div className="page-shell" style={{ paddingBottom: '4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ margin: '0 0 0.5rem 0', fontFamily: 'var(--ff-serif)', fontSize: '2.5rem', color: 'var(--brand-primary-dark)' }}>Order Details</h1>
          <p className="muted" style={{ margin: 0, fontSize: '1.1rem' }}>Order #{order._id}</p>
        </div>
        <Link to="/orders" className="btn-ghost" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Back to Orders
        </Link>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Status Tracker */}
        <div className="panel" style={{ background: 'var(--bg-card)', border: 'none', boxShadow: 'var(--shadow-md)', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Order Status</h3>
            <span style={{ 
              background: `${statusColor}20`, 
              color: statusColor, 
              padding: '8px 16px', 
              borderRadius: 'var(--radius-full)', 
              fontWeight: '600', 
              fontSize: '0.9rem',
              border: `1px solid ${statusColor}40`
            }}>
              {order.orderStatus || 'Processing'}
            </span>
          </div>
          
          {/* Timeline Visual (Simplified) */}
          <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', margin: '2rem 1rem 1rem' }}>
            <div style={{ position: 'absolute', top: '15px', left: '0', right: '0', height: '2px', background: 'var(--border-light)', zIndex: 1 }}></div>
            
            {['Placed', 'Processing', 'Shipped', 'Delivered'].map((step, idx) => {
              const statusMap = { 'PENDING': 0, 'CONFIRMED': 0, 'PROCESSING': 1, 'SHIPPED': 2, 'DELIVERED': 3 };
              const currentStatusIdx = statusMap[order.orderStatus?.toUpperCase()] ?? -1;
              const isCompleted = idx <= currentStatusIdx;
              const isCurrent = idx === currentStatusIdx;
              
              return (
                <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, gap: '0.5rem' }}>
                  <div style={{ 
                    width: '32px', height: '32px', borderRadius: '50%', 
                    background: isCompleted ? 'var(--brand-primary-gradient)' : 'var(--bg-card)',
                    border: isCompleted ? 'none' : '2px solid var(--border-light)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: isCompleted ? 'white' : 'transparent',
                    boxShadow: isCurrent ? '0 0 0 4px var(--brand-primary-light)' : 'none',
                    transition: 'all 0.3s ease'
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: isCurrent ? '600' : '400', color: isCompleted ? 'var(--text-main)' : 'var(--text-muted)' }}>
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="split-layout" style={{ gridTemplateColumns: '1.6fr 1fr', alignItems: 'stretch' }}>
          
          {/* Products List */}
          <div className="panel" style={{ border: 'none', boxShadow: 'var(--shadow-md)', borderRadius: 'var(--radius-lg)' }}>
            <h3 style={{ margin: '0 0 1.5rem 0', paddingBottom: '1rem', borderBottom: '1px solid var(--border-light)', fontSize: '1.25rem' }}>Items Ordered</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {order.products.map((item, index) => (
                <div key={index} style={{ 
                  display: 'flex', gap: '1.5rem', alignItems: 'center', 
                  padding: '1rem', background: 'var(--bg-main)', 
                  borderRadius: 'var(--radius-md)', transition: 'transform 0.2s ease',
                  cursor: 'default'
                }} className="hover-lift">
                  <img src={item.image} alt={item.name} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow-sm)' }} />
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', color: 'var(--brand-primary-dark)' }}>{item.name}</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <span className="badge">Qty: {item.quantity}</span>
                      {item.selectedSize && <span className="badge">Size: {item.selectedSize}</span>}
                      {item.selectedShape && <span className="badge">Shape: {item.selectedShape}</span>}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', fontWeight: '600', fontSize: '1.1rem' }}>
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar: Summary & Address */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Payment Summary */}
            <div className="panel" style={{ border: 'none', boxShadow: 'var(--shadow-md)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-accent)' }}>
              <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.25rem', color: 'var(--brand-primary-dark)' }}>Payment Summary</h3>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', color: 'var(--text-main)' }}>
                <span>Payment Method</span>
                <span style={{ fontWeight: '500' }}>{order.paymentMethod}</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', color: 'var(--text-main)' }}>
                <span>Items Subtotal</span>
                <span>₹{order.itemsPrice?.toFixed(2)}</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', color: 'var(--text-main)' }}>
                <span>Delivery Fee</span>
                <span>₹{order.shippingPrice?.toFixed(2)}</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '2px dashed var(--brand-primary-light)', fontSize: '1.25rem', fontWeight: '700', color: 'var(--brand-primary-dark)' }}>
                <span>Total</span>
                <span>₹{order.totalPrice?.toFixed(2)}</span>
              </div>
              
              <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--brand-primary)', background: 'var(--bg-card)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  Secure Checkout
                </span>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="panel" style={{ border: 'none', boxShadow: 'var(--shadow-md)', borderRadius: 'var(--radius-lg)' }}>
              <h3 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--brand-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                Shipping Details
              </h3>
              
              <div style={{ background: 'var(--bg-main)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
                <p style={{ margin: '0 0 0.5rem 0', fontWeight: '600', fontSize: '1.1rem', color: 'var(--brand-primary-dark)' }}>{order.shippingAddress.fullName}</p>
                <div style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                  <p style={{ margin: '0' }}>{order.shippingAddress.addressLine1}</p>
                  {order.shippingAddress.addressLine2 && <p style={{ margin: '0' }}>{order.shippingAddress.addressLine2}</p>}
                  <p style={{ margin: '0' }}>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                  <p style={{ margin: '0' }}>{order.shippingAddress.country}</p>
                </div>
                
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  {order.shippingAddress.phone}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      
      <style>{`
        .hover-lift:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md) !important;
        }
        @media (max-width: 768px) {
          .split-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default OrderDetails;
