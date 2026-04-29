import { useEffect, useState } from "react";
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
      next = next.filter((order) => (order.orderStatus || "").toLowerCase() === status);
    }

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      next = next.filter((order) => order._id?.toLowerCase().includes(q));
    }

    setFilteredOrders(next);
  }, [orders, status, query]);

  if (loading) return <p>Loading your orders...</p>;

  return (
    <section className="stack-md page-shell">
      <h2>Order History</h2>
      <section className="panel stack-sm">
        <div className="toolbar" style={{ gridTemplateColumns: "1fr 240px auto auto" }}>
          <label>
            Search by order ID
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type order id"
            />
          </label>
          <label>
            Status
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </label>
          <div className="toolbar-actions">
            <button type="button" className="btn-ghost" onClick={() => setQuery("")}>
              Clear Search
            </button>
            <button type="button" className="btn-ghost" onClick={() => setStatus("all")}>
              Clear Status
            </button>
          </div>
        </div>
        <p className="muted">Showing {filteredOrders.length} orders</p>
      </section>
      {error ? <p className="text-danger">{error}</p> : null}
      {filteredOrders.map((order) => (
        <article className="panel" key={order._id}>
          <h4>Order #{order._id.slice(-8)}</h4>
          <p>Total: ₹{order.totalPrice}</p>
          <p>Status: {order.orderStatus}</p>
          <p>Payment: {order.paymentStatus}</p>
        </article>
      ))}
      {!filteredOrders.length ? <p>No matching orders found.</p> : null}
    </section>
  );
};

export default OrderHistory;

