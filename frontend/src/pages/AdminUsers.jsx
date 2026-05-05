import { useCallback, useEffect, useState } from "react";
import { adminApi } from "../api/adminApi";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterQuery, setFilterQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [toggling, setToggling] = useState(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await adminApi.getAllUsers();
      setUsers(data);
    } catch {
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleToggle = async (userId) => {
    setToggling(userId);
    try {
      const result = await adminApi.toggleUserActive(userId);
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isActive: result.isActive } : u))
      );
    } catch {
      alert("Failed to update user status.");
    } finally {
      setToggling(null);
    }
  };

  const displayed = users.filter((u) => {
    const q = filterQuery.toLowerCase();
    const matchQ =
      !filterQuery ||
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q);
    const matchRole =
      filterRole === "all" ||
      (filterRole === "admin" && u.isAdmin) ||
      (filterRole === "customer" && !u.isAdmin);
    return matchQ && matchRole;
  });

  const formatDate = (iso) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <section className="stack-md page-shell">
      <div className="admin-page-header">
        <div>
          <h2>Users</h2>
          <p className="muted">Manage customer accounts ({users.length} total)</p>
        </div>
        <button className="btn-ghost" onClick={fetchUsers}>
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="panel">
        <div className="toolbar">
          <label>
            Search
            <input
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Name or email…"
            />
          </label>
          <label>
            Role
            <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
              <option value="all">All roles</option>
              <option value="admin">Admin</option>
              <option value="customer">Customer</option>
            </select>
          </label>
          <div />
          <div className="toolbar-actions">
            <button
              className="btn-ghost"
              type="button"
              onClick={() => { setFilterQuery(""); setFilterRole("all"); }}
            >
              Reset
            </button>
          </div>
        </div>
        <p className="muted" style={{ marginTop: 8 }}>
          Showing {displayed.length} of {users.length} users
        </p>
      </div>

      {loading && <p>Loading users…</p>}
      {error && <p className="text-danger">{error}</p>}

      {!loading && (
        <div className="panel" style={{ overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {displayed.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", color: "#999", padding: "24px 0" }}>
                    No users found.
                  </td>
                </tr>
              ) : (
                displayed.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <div className="user-avatar-row">
                        <div className="user-avatar">
                          {(u.name || "?")[0].toUpperCase()}
                        </div>
                        <strong>{u.name}</strong>
                      </div>
                    </td>
                    <td>{u.email}</td>
                    <td>
                      <span className={u.isAdmin ? "status-badge status-badge--info" : "status-badge"}>
                        {u.isAdmin ? "Admin" : "Customer"}
                      </span>
                    </td>
                    <td>
                      <span className={u.isActive ? "status-badge status-badge--success" : "status-badge status-badge--danger"}>
                        {u.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>{formatDate(u.createdAt)}</td>
                    <td>
                      {u.isAdmin ? (
                        <span className="muted" style={{ fontSize: 13 }}>Protected</span>
                      ) : (
                        <button
                          className={u.isActive ? "btn-danger" : "btn-secondary"}
                          style={{ padding: "5px 12px", fontSize: 13 }}
                          onClick={() => handleToggle(u._id)}
                          disabled={toggling === u._id}
                        >
                          {toggling === u._id
                            ? "Updating…"
                            : u.isActive
                            ? "Deactivate"
                            : "Activate"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default AdminUsers;
