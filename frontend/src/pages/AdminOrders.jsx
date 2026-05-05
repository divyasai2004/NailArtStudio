import { useCallback, useEffect, useState } from "react";
import { orderApi } from "../api/orderApi";

const ORDER_STATUSES = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
const PAYMENT_STATUSES = ["PENDING", "COD_PENDING", "PAID", "FAILED", "REFUNDED"];

const statusColor = (status) => {
  switch (status) {
    case "DELIVERED": return "status-badge--success";
    case "CANCELLED": return "status-badge--danger";
    case "SHIPPED":
    case "PROCESSING":
    case "CONFIRMED": return "status-badge--info";
    case "PAID": return "status-badge--success";
    case "FAILED": return "status-badge--danger";
    default: return "";
  }
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPayment, setFilterPayment] = useState("all");
  const [filterQuery, setFilterQuery] = useState("");

  const [updating, setUpdating] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await orderApi.getAllOrders();
      setOrders(data);
    } catch {
      setError("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusUpdate = async (orderId, field, value) => {
    setUpdating(orderId);
    try {
      const payload = { [field]: value };
      const updated = await orderApi.updateOrderStatus(orderId, payload);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, ...updated } : o))
      );
    } catch {
      alert("Failed to update order status.");
    } finally {
      setUpdating(null);
    }
  };

  const formatDate = (iso) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const displayed = orders.filter((o) => {
    const q = filterQuery.toLowerCase();
    const matchQ =
      !filterQuery ||
      o._id?.toLowerCase().includes(q) ||
      o.user?.name?.toLowerCase().includes(q) ||
      o.user?.email?.toLowerCase().includes(q);
    const matchStatus = filterStatus === "all" || o.orderStatus === filterStatus;
    const matchPayment = filterPayment === "all" || o.paymentStatus === filterPayment;
    return matchQ && matchStatus && matchPayment;
  });

  return (
    <section className="stack-md page-shell">
      <div className="admin-page-header">
        <div>
          <h2>Orders</h2>
          <p className="muted">Manage and track all orders ({orders.length} total)</p>
        </div>
        <button className="btn-ghost" onClick={fetchOrders}>Refresh</button>
      </div>

      {/* Filters */}
      <div className="panel">
        <div className="toolbar" style={{ gridTemplateColumns: "1.5fr 1fr 1fr auto" }}>
          <label>
            Search
            <input
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Order ID or customer name…"
            />
          </label>
          <label>
            Order Status
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All statuses</option>
              {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
          <label>
            Payment
            <select value={filterPayment} onChange={(e) => setFilterPayment(e.target.value)}>
              <option value="all">All payments</option>
              {PAYMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
          <div className="toolbar-actions">
            <button
              className="btn-ghost"
              type="button"
              onClick={() => { setFilterQuery(""); setFilterStatus("all"); setFilterPayment("all"); }}
            >
              Reset
            </button>
          </div>
        </div>
        <p className="muted" style={{ marginTop: 8 }}>
          Showing {displayed.length} of {orders.length} orders
        </p>
      </div>

      {loading && <p>Loading orders…</p>}
      {error && <p className="text-danger">{error}</p>}

      {!loading && (
        <div className="stack-sm">
          {displayed.length === 0 ? (
            <div className="panel" style={{ textAlign: "center", color: "#999", padding: "32px 0" }}>
              No orders found.
            </div>
          ) : (
            displayed.map((order) => (
              <div key={order._id} className="panel stack-sm">
                {/* Order Header */}
                <div className="order-row-header">
                  <div>
                    <p style={{ fontSize: 13, color: "#999" }}>Order ID</p>
                    <code style={{ fontSize: 12, background: "#f5f0f0", padding: "2px 6px", borderRadius: 4 }}>
                      {order._id}
                    </code>
                  </div>
                  <div>
                    <p style={{ fontSize: 13, color: "#999" }}>Customer</p>
                    <strong>{order.user?.name || "Guest"}</strong>
                    <span className="muted" style={{ fontSize: 13, marginLeft: 6 }}>{order.user?.email}</span>
                  </div>
                  <div>
                    <p style={{ fontSize: 13, color: "#999" }}>Placed</p>
                    <span style={{ fontSize: 13 }}>{formatDate(order.createdAt)}</span>
                  </div>
                  <div>
                    <p style={{ fontSize: 13, color: "#999" }}>Total</p>
                    <strong>₹{order.totalPrice}</strong>
                  </div>
                  <div>
                    <span className={`status-badge ${statusColor(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>{" "}
                    <span className={`status-badge ${statusColor(order.paymentStatus)}`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                  <button
                    className="btn-ghost"
                    style={{ fontSize: 13, padding: "5px 12px" }}
                    onClick={() => setExpandedId(expandedId === order._id ? null : order._id)}
                  >
                    {expandedId === order._id ? "Collapse ▲" : "Manage ▼"}
                  </button>
                </div>

                {/* Expanded Detail */}
                {expandedId === order._id && (
                  <div className="order-detail-expanded stack-sm">
                    {/* Items */}
                    <div>
                      <p className="muted" style={{ fontSize: 13, marginBottom: 6 }}>Items</p>
                      {(order.products || []).map((item, i) => (
                        <div key={i} className="cart-row" style={{ borderBottom: "1px solid #f0e8e8", paddingBottom: 6, marginBottom: 6 }}>
                          <span>{item.name || item.productId}</span>
                          <span className="muted">× {item.quantity}</span>
                          <strong>₹{item.price}</strong>
                        </div>
                      ))}
                      <div className="cart-row">
                        <span>Shipping</span>
                        <strong>₹{order.shippingPrice}</strong>
                      </div>
                      {order.discountAmount > 0 && (
                        <div className="cart-row">
                          <span>Discount</span>
                          <strong style={{ color: "green" }}>–₹{order.discountAmount}</strong>
                        </div>
                      )}
                      <div className="cart-row" style={{ borderTop: "1px solid #eee", paddingTop: 6, marginTop: 4 }}>
                        <strong>Total</strong>
                        <strong>₹{order.totalPrice}</strong>
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div>
                      <p className="muted" style={{ fontSize: 13, marginBottom: 4 }}>Shipping Address</p>
                      <p>
                        {order.shippingAddress?.addressLine1}
                        {order.shippingAddress?.addressLine2 && `, ${order.shippingAddress.addressLine2}`}
                      </p>
                      <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} – {order.shippingAddress?.pincode}</p>
                      <p>📞 {order.shippingAddress?.phone}</p>
                    </div>

                    {/* Status Update */}
                    <div className="order-status-update">
                      <label style={{ fontSize: 13 }}>
                        Order Status
                        <select
                          value={order.orderStatus}
                          onChange={(e) => handleStatusUpdate(order._id, "orderStatus", e.target.value)}
                          disabled={updating === order._id}
                          style={{ marginLeft: 8 }}
                        >
                          {ORDER_STATUSES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </label>
                      <label style={{ fontSize: 13 }}>
                        Payment Status
                        <select
                          value={order.paymentStatus}
                          onChange={(e) => handleStatusUpdate(order._id, "paymentStatus", e.target.value)}
                          disabled={updating === order._id}
                          style={{ marginLeft: 8 }}
                        >
                          {PAYMENT_STATUSES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </label>
                      {updating === order._id && (
                        <span className="muted" style={{ fontSize: 13 }}>Updating…</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </section>
  );
};

export default AdminOrders;
