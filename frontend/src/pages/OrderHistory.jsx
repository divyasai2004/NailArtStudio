import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { orderApi } from "../api/orderApi";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await orderApi.getMyOrders();
        setOrders(data);
      } catch (err) {
        setError("Failed to load order history");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  useEffect(() => {
    let next = [...orders];

    if (status !== "all") {
      next = next.filter((order) => {
        const orderStatus = (order.orderStatus || "").toLowerCase();
        return orderStatus === status;
      });
    }

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      next = next.filter((order) => order._id?.toLowerCase().includes(q));
    }

    // Sort by createdAt descending (if available)
    next.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    setFilteredOrders(next);
  }, [orders, status, query]);

  if (loading) return (
    <div className="page-shell" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <div style={{ animation: 'spin 1s linear infinite', border: '3px solid var(--border-light)', borderTop: '3px solid var(--brand-primary)', borderRadius: '50%', width: '40px', height: '40px' }}></div>
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );

  const getStatusColor = (status) => {
    switch(status?.toUpperCase()) {
      case 'DELIVERED': return '#10b981'; // green
      case 'SHIPPED': return '#3b82f6'; // blue
      case 'CANCELLED': return '#ef4444'; // red
      case 'CONFIRMED': return 'var(--brand-primary)'; // pink
      default: return '#f59e0b'; // orange (Processing/Pending)
    }
  };

  return (
    <section className="page-shell" style={{ paddingBottom: '4rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ margin: '0 0 0.5rem 0', fontFamily: 'var(--ff-serif)', fontSize: '2.5rem', color: 'var(--brand-primary-dark)' }}>Order History</h1>
        <p className="muted" style={{ margin: 0, fontSize: '1.1rem' }}>View and manage your recent orders.</p>
      </div>

      <section className="panel" style={{ background: 'var(--bg-card)', border: 'none', boxShadow: 'var(--shadow-md)', borderRadius: 'var(--radius-lg)', marginBottom: '2rem' }}>
        <div className="toolbar" style={{ gridTemplateColumns: "1fr 240px auto auto", gap: '1rem' }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontWeight: '500' }}>
            Search by Order ID
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., 60f1b..."
              style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}
            />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontWeight: '500' }}>
            Filter by Status
            <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </label>
          <div className="toolbar-actions" style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem' }}>
            <button type="button" className="btn-ghost" onClick={() => { setQuery(""); setStatus("all"); }} style={{ padding: '10px 16px', height: '42px' }}>
              Reset Filters
            </button>
          </div>
        </div>
      </section>

      {error && (
        <div style={{ background: '#fee2e2', color: '#991b1b', padding: '1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem' }}>
          {error}
        </div>
      )}

      {!loading && !error && filteredOrders.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border-light)' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--border-light)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1rem', display: 'inline-block' }}><path d="M21 8v13H3V8M1 3h22v5H1zM10 12h4"/></svg>
          <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-main)' }}>No orders found</h3>
          <p className="muted" style={{ margin: '0 0 1.5rem 0' }}>{orders.length > 0 ? "Try adjusting your search or filters." : "You haven't placed any orders yet."}</p>
          <Link to="/products" className="btn-primary">Start Shopping</Link>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredOrders.map((order) => {
          const statusCol = getStatusColor(order.orderStatus);
          return (
            <div key={order._id} className="hover-lift" style={{ 
              background: 'var(--bg-card)', padding: '1.5rem', 
              borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)',
              display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'space-between', alignItems: 'center',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--brand-primary-dark)' }}>Order #{order._id.slice(-8)}</h3>
                  <span style={{ 
                    background: `${statusCol}15`, color: statusCol, 
                    padding: '4px 12px', borderRadius: 'var(--radius-full)', 
                    fontSize: '0.75rem', fontWeight: '600', border: `1px solid ${statusCol}30`
                  }}>
                    {order.orderStatus || 'Pending'}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  <span>{new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  <span>•</span>
                  <span>{order.products?.length || 0} Items</span>
                  <span>•</span>
                  <span>{order.paymentMethod}</span>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Amount</p>
                  <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-main)' }}>₹{order.totalPrice?.toFixed(2)}</p>
                </div>
                
                <Link to={`/order/${order._id}`} className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.95rem' }}>
                  View Details
                </Link>
              </div>
            </div>
          );
        })}
      </div>
      
      <style>{`
        .hover-lift:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-sm) !important;
          border-color: var(--brand-primary-light) !important;
        }
        @media (max-width: 768px) {
          .toolbar {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};

export default OrderHistory;

