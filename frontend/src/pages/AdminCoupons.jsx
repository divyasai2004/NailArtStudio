import { useEffect, useState } from "react";
import { couponApi } from "../api/couponApi";
import { adminApi } from "../api/adminApi";

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);

  const [form, setForm] = useState({
    code: "",
    discountType: "PERCENTAGE",
    discountValue: "",
    minOrderAmount: "",
    expiryDate: "",
    usageLimit: "",
    isActive: true,
    assignedUsers: [],
  });

  const loadData = async () => {
    try {
      const [couponsData, usersData] = await Promise.all([
        couponApi.getAllCoupons(),
        adminApi.getAllUsers(),
      ]);
      setCoupons(couponsData);
      setUsers(usersData);
    } catch (err) {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenModal = (coupon = null) => {
    setError("");
    if (coupon) {
      setEditingCoupon(coupon);
      setForm({
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minOrderAmount: coupon.minOrderAmount || "",
        expiryDate: new Date(coupon.expiryDate).toISOString().split('T')[0],
        usageLimit: coupon.usageLimit || "",
        isActive: coupon.isActive,
        assignedUsers: coupon.assignedUsers ? coupon.assignedUsers.map(u => u._id) : [],
      });
    } else {
      setEditingCoupon(null);
      setForm({
        code: "",
        discountType: "PERCENTAGE",
        discountValue: "",
        minOrderAmount: "",
        expiryDate: "",
        usageLimit: "",
        isActive: true,
        assignedUsers: [],
      });
    }
    setShowModal(true);
  };

  const handleUserSelect = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setForm(prev => ({ ...prev, assignedUsers: selectedOptions }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form };
      if (editingCoupon) {
        await couponApi.updateCoupon(editingCoupon._id, payload);
      } else {
        await couponApi.createCoupon(payload);
      }
      setShowModal(false);
      loadData();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to save coupon");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      try {
        await couponApi.deleteCoupon(id);
        loadData();
      } catch (err) {
        alert("Failed to delete coupon");
      }
    }
  };

  if (loading) return <div className="page-shell"><h2>Loading Coupons...</h2></div>;

  return (
    <div className="page-shell">
      <div className="admin-page-header" style={{ marginBottom: "20px" }}>
        <h2>Manage Coupons</h2>
        <button className="btn-primary" onClick={() => handleOpenModal()}>
          + Create Coupon
        </button>
      </div>

      <div className="panel" style={{ overflowX: "auto" }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Discount</th>
              <th>Min Order</th>
              <th>Expires</th>
              <th>Usage</th>
              <th>Status</th>
              <th>Assigned</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <tr key={coupon._id}>
                <td><strong>{coupon.code}</strong></td>
                <td>
                  {coupon.discountType === "PERCENTAGE" 
                    ? `${coupon.discountValue}%` 
                    : `₹${coupon.discountValue}`}
                </td>
                <td>₹{coupon.minOrderAmount || 0}</td>
                <td>{new Date(coupon.expiryDate).toLocaleDateString()}</td>
                <td>
                  {coupon.usedCount} / {coupon.usageLimit > 0 ? coupon.usageLimit : "∞"}
                </td>
                <td>
                  <span className={`status-badge ${coupon.isActive ? 'status-badge--success' : 'status-badge--danger'}`}>
                    {coupon.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td>
                  {coupon.assignedUsers && coupon.assignedUsers.length > 0 
                    ? `${coupon.assignedUsers.length} user(s)` 
                    : "All users"}
                </td>
                <td>
                  <div className="admin-actions">
                    <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => handleOpenModal(coupon)}>
                      Edit
                    </button>
                    <button className="btn-danger" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => handleDelete(coupon._id)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {coupons.length === 0 && (
              <tr>
                <td colSpan="8" style={{ textAlign: "center", padding: "20px" }}>
                  No coupons found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingCoupon ? "Edit Coupon" : "Create Coupon"}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            
            <div style={{ padding: '20px', maxHeight: '70vh', overflowY: 'auto' }}>
              {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}
              
              <form onSubmit={handleSubmit} className="stack-sm">
                <div className="admin-form-grid">
                  <label>
                    Coupon Code
                    <input 
                      required
                      value={form.code}
                      onChange={e => setForm({...form, code: e.target.value.toUpperCase()})}
                      placeholder="e.g. SUMMER50"
                    />
                  </label>
                  <label>
                    Status
                    <select value={form.isActive} onChange={e => setForm({...form, isActive: e.target.value === 'true'})}>
                      <option value={true}>Active</option>
                      <option value={false}>Inactive</option>
                    </select>
                  </label>
                </div>

                <div className="admin-form-grid">
                  <label>
                    Discount Type
                    <select value={form.discountType} onChange={e => setForm({...form, discountType: e.target.value})}>
                      <option value="PERCENTAGE">Percentage (%)</option>
                      <option value="FIXED">Fixed Amount (₹)</option>
                    </select>
                  </label>
                  <label>
                    Discount Value
                    <input 
                      type="number" required min="0" step="any"
                      value={form.discountValue}
                      onChange={e => setForm({...form, discountValue: e.target.value})}
                      placeholder={form.discountType === 'PERCENTAGE' ? "e.g. 20" : "e.g. 500"}
                    />
                  </label>
                </div>

                <div className="admin-form-grid">
                  <label>
                    Minimum Order Amount (₹)
                    <input 
                      type="number" min="0" step="any"
                      value={form.minOrderAmount}
                      onChange={e => setForm({...form, minOrderAmount: e.target.value})}
                      placeholder="e.g. 1000"
                    />
                  </label>
                  <label>
                    Usage Limit (0 for unlimited)
                    <input 
                      type="number" min="0"
                      value={form.usageLimit}
                      onChange={e => setForm({...form, usageLimit: e.target.value})}
                      placeholder="e.g. 100"
                    />
                  </label>
                </div>

                <label>
                  Expiry Date
                  <input 
                    type="date" required
                    value={form.expiryDate}
                    onChange={e => setForm({...form, expiryDate: e.target.value})}
                  />
                </label>

                <label>
                  Assign to Specific Users (Leave unselected for all users)
                  <select multiple value={form.assignedUsers} onChange={handleUserSelect} style={{ height: '120px' }}>
                    {users.map(user => (
                      <option key={user._id} value={user._id}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                  </select>
                  <small className="muted">Hold Ctrl/Cmd to select multiple users</small>
                </label>

                <div style={{ marginTop: '20px', textAlign: 'right' }}>
                  <button type="button" className="btn-ghost" onClick={() => setShowModal(false)} style={{ marginRight: '10px' }}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingCoupon ? "Update Coupon" : "Save Coupon"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCoupons;
