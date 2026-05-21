import { useCallback, useEffect, useState } from "react";
import { customRequestApi } from "../api/customRequestApi";

const STATUSES = ["Pending", "Reviewed", "Completed", "Rejected"];

const AdminCustomRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await customRequestApi.getRequests();
      setRequests(data);
    } catch (err) {
      setError("Failed to load custom requests.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      setUpdatingId(id);
      await customRequestApi.updateStatus(id, newStatus);
      setRequests((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status: newStatus } : r))
      );
    } catch (err) {
      alert("Failed to update status.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <section className="stack-md page-shell">
      <div className="admin-page-header">
        <div>
          <h2>Custom Requests</h2>
          <p className="muted">Manage custom design requests ({requests.length} total)</p>
        </div>
      </div>

      {loading && <p>Loading requests…</p>}
      {error && <p className="text-danger">{error}</p>}

      {!loading && !error && (
        <div className="panel" style={{ overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Customer</th>
                <th>Specs</th>
                <th>Description</th>
                <th>Reference</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "24px", color: "#999" }}>
                    No custom requests found.
                  </td>
                </tr>
              ) : (
                requests.map((r) => (
                  <tr key={r._id}>
                    <td style={{ whiteSpace: "nowrap" }}>
                      {new Date(r.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <strong>{r.name}</strong>
                      <br />
                      <a href={`mailto:${r.email}`} className="muted" style={{ fontSize: "0.85rem", textDecoration: "none" }}>
                        {r.email}
                      </a>
                    </td>
                    <td style={{ fontSize: "0.9rem" }}>
                      <strong>Shape:</strong> {r.shape} <br />
                      <strong>Length:</strong> {r.length} <br />
                      <strong>Size:</strong> {r.size} <br />
                      {r.measurements && (
                        <><strong>Meas:</strong> {r.measurements} <br /></>
                      )}
                      <strong>Color:</strong> {r.baseColor}
                    </td>
                    <td style={{ maxWidth: 300, whiteSpace: "normal" }}>
                      <p style={{ fontSize: "0.9rem", margin: 0, color: "var(--text)" }}>
                        {r.description}
                      </p>
                    </td>
                    <td>
                      {r.referenceImage ? (
                        <a href={r.referenceImage} target="_blank" rel="noopener noreferrer" style={{ color: "var(--brand-primary-dark)", fontSize: "0.9rem", textDecoration: "underline" }}>
                          View Image
                        </a>
                      ) : (
                        <span className="muted" style={{ fontSize: "0.85rem" }}>None</span>
                      )}
                    </td>
                    <td>
                      <select
                        value={r.status}
                        onChange={(e) => handleStatusChange(r._id, e.target.value)}
                        disabled={updatingId === r._id}
                        style={{
                          padding: "6px 10px",
                          borderRadius: "4px",
                          border: "1px solid var(--border-light)",
                          fontSize: "0.85rem",
                          backgroundColor:
                            r.status === "Pending"
                              ? "#fff3cd"
                              : r.status === "Reviewed"
                              ? "#cce5ff"
                              : r.status === "Completed"
                              ? "#d4edda"
                              : "#f8d7da",
                        }}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
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

export default AdminCustomRequests;
