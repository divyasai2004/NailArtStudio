import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Layout = () => {
  const { authUser, isAuthenticated, logout } = useAuth();
  const { cartItems } = useCart();
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const isAdmin = Boolean(authUser?.isAdmin);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

        .site-header {
          position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
          height: var(--nav-h);
          background: rgba(251, 248, 247, 0.95);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border-light);
          display: flex; align-items: center;
          box-shadow: var(--shadow-sm);
        }

        /* ── Admin header variant ── */
        .site-header--admin {
          background: rgba(74, 59, 60, 0.97);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }

        .nav-inner {
          max-width: 1280px; margin: 0 auto; width: 100%;
          padding: 0 clamp(16px,4vw,48px);
          display: flex; align-items: center; justify-content: space-between; gap: 24px;
        }

        /* Brand */
        .nav-brand {
          font-family: var(--ff-serif); font-size: 1.6rem; font-weight: 600;
          color: var(--brand-primary-dark); letter-spacing: 0.01em; white-space: nowrap;
          text-decoration: none;
        }
        .site-header--admin .nav-brand { color: var(--text-light); }

        /* Admin badge */
        .nav-admin-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(255,255,255,0.12); color: var(--text-light);
          font-size: 0.65rem; font-weight: 600; letter-spacing: 0.18em;
          text-transform: uppercase; padding: 4px 10px; border-radius: var(--radius-full);
          border: 1px solid rgba(255,255,255,0.2);
        }

        /* Nav links */
        .nav-links {
          display: flex; align-items: center; gap: 4px; list-style: none;
        }
        .nav-link {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 8px 14px; border-radius: var(--radius-sm);
          font-size: 0.9rem; font-weight: 500; letter-spacing: 0.02em;
          color: var(--text-main); text-decoration: none;
          transition: background 0.2s, color 0.2s;
          white-space: nowrap;
        }
        .nav-link:hover { background: var(--bg-accent); color: var(--brand-primary-dark); }
        .nav-link.active { color: var(--brand-primary-dark); font-weight: 600; }

        /* Admin nav links */
        .site-header--admin .nav-link {
          color: rgba(255,255,255,0.75);
        }
        .site-header--admin .nav-link:hover {
          background: rgba(255,255,255,0.1); color: var(--text-light);
        }
        .site-header--admin .nav-link.active { color: var(--text-light); font-weight: 600; }

        /* Cart button */
        .nav-cart-btn {
          position: relative; display: inline-flex; align-items: center;
          gap: 6px; padding: 10px 18px;
          background: var(--brand-primary-gradient); color: var(--text-light);
          border: none; border-radius: var(--radius-full);
          font-family: var(--ff-sans); font-size: 0.85rem;
          font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase;
          text-decoration: none; transition: all var(--ease-out) 0.3s;
          cursor: pointer; box-shadow: var(--shadow-sm);
        }
        .nav-cart-btn:hover { background: var(--brand-primary-dark); transform: translateY(-2px); box-shadow: var(--shadow-md); }
        .nav-cart-count {
          background: var(--bg-card); color: var(--brand-primary-dark);
          font-size: 0.75rem; font-weight: 700; border-radius: 50%;
          width: 20px; height: 20px; display: inline-flex;
          align-items: center; justify-content: center;
        }

        /* Auth/logout */
        .nav-logout-btn {
          padding: 10px 18px; background: transparent; border: 1.5px solid var(--border-light);
          border-radius: var(--radius-full); font-family: var(--ff-sans);
          font-size: 0.85rem; font-weight: 600; letter-spacing: 0.05em;
          color: var(--text-muted); cursor: pointer; text-transform: uppercase;
          transition: all 0.2s;
        }
        .nav-logout-btn:hover { border-color: var(--brand-primary-dark); color: var(--brand-primary-dark); background: var(--bg-accent); }
        .site-header--admin .nav-logout-btn {
          border-color: rgba(255,255,255,0.3); color: rgba(255,255,255,0.8);
        }
        .site-header--admin .nav-logout-btn:hover {
          border-color: rgba(255,255,255,0.8); color: var(--text-light); background: rgba(255,255,255,0.1);
        }

        .nav-auth-link {
          padding: 8px 14px; font-size: 0.9rem; font-weight: 500;
          color: var(--text-main); text-decoration: none;
          transition: color 0.2s;
        }
        .nav-auth-link:hover { color: var(--brand-primary-dark); }
        
        .nav-register-btn {
          padding: 10px 22px; background: var(--brand-primary-gradient); color: var(--text-light);
          border-radius: var(--radius-full); font-size: 0.85rem; font-weight: 600;
          letter-spacing: 0.05em; text-transform: uppercase; text-decoration: none;
          transition: all var(--ease-out) 0.3s; box-shadow: var(--shadow-sm);
        }
        .nav-register-btn:hover { background: var(--brand-primary-dark); transform: translateY(-2px); box-shadow: var(--shadow-md); }

        /* Admin section pill */
        .nav-section-pill {
          font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase;
          color: rgba(255,255,255,0.5); padding: 0 8px;
          border-left: 1px solid rgba(255,255,255,0.2);
          margin-left: 4px;
        }

        /* Divider */
        .nav-divider {
          width: 1px; height: 20px; background: var(--border-light); margin: 0 8px;
        }
        .site-header--admin .nav-divider { background: rgba(255,255,255,0.2); }

        /* Hamburger */
        .nav-hamburger {
          display: none; flex-direction: column; gap: 5px;
          background: none; border: none; padding: 8px; cursor: pointer;
        }
        .nav-hamburger span {
          display: block; width: 24px; height: 2px; border-radius: 2px;
          background: var(--brand-primary-dark); transition: all 0.3s;
        }
        .site-header--admin .nav-hamburger span { background: var(--text-light); }

        /* Mobile nav */
        .nav-mobile {
          display: none; position: fixed;
          top: var(--nav-h); left: 0; right: 0;
          background: var(--bg-card); border-bottom: 1px solid var(--border-light);
          flex-direction: column; padding: 16px;
          gap: 4px; z-index: 999;
          box-shadow: var(--shadow-md);
        }
        .nav-mobile.open { display: flex; }
        .nav-mobile .nav-link { padding: 12px 16px; font-size: 1rem; border-radius: var(--radius-sm); }
        .nav-mobile .nav-link:hover { background: var(--bg-accent); }

        @media (max-width: 768px) {
          .nav-links { display: none; }
          .nav-hamburger { display: flex; }
        }

        /* Footer */
        .site-footer {
          background: var(--brand-primary-dark); color: var(--text-light);
          padding: clamp(40px,6vw,64px) clamp(16px,7vw,100px);
        }
        .footer-inner {
          max-width: 1280px; margin: 0 auto;
          display: grid; grid-template-columns: 1fr auto;
          align-items: center; gap: 32px;
        }
        .footer-brand {
          font-family: var(--ff-serif); font-size: 1.8rem; font-weight: 500;
          color: var(--text-light); margin-bottom: 8px;
        }
        .footer-tagline { font-size: 0.95rem; color: rgba(255,255,255,0.8); }
        .footer-copy {
          font-size: 0.85rem; color: rgba(255,255,255,0.6);
          letter-spacing: 0.05em;
        }
        @media (max-width: 600px) {
          .footer-inner { grid-template-columns: 1fr; }
        }

        /* Admin footer is minimal */
        .site-footer--admin {
          background: var(--bg-main);
          border-top: 1px solid var(--border-light);
          padding: 24px clamp(16px,7vw,100px);
        }
        .site-footer--admin .footer-copy { color: var(--text-muted); }
      `}</style>

      <div className="app-shell">
        {/* ─────────────── HEADER ─────────────── */}
        <header className={`site-header${isAdmin ? " site-header--admin" : ""}`}>
          <div className="nav-inner">
            {/* Brand */}
            <Link
              to={isAdmin ? "/admin" : "/"}
              className="nav-brand"
              onClick={closeMobile}
              style={{ display: "flex", alignItems: "center", gap: "10px" }}
            >
              <img src="/logo.jpeg" alt="Logo" style={{ height: "40px", width: "auto", objectFit: "contain", borderRadius: "50%" }} />
              <span>Dreamy nails</span>
              {isAdmin && <span className="nav-admin-badge">Admin</span>}
            </Link>

            {/* Desktop nav */}
            <nav>
              <ul className="nav-links">
                {isAdmin ? (
                  /* ── ADMIN NAV ── */
                  <>
                    {/* Admin section */}
                    <li>
                      <Link className={`nav-link${location.pathname === "/admin/products" || location.pathname === "/admin" ? " active" : ""}`} to="/admin/products" onClick={closeMobile}>
                        📦 Products
                      </Link>
                    </li>
                    <li>
                      <Link className={`nav-link${location.pathname === "/admin/orders" ? " active" : ""}`} to="/admin/orders" onClick={closeMobile}>
                        🛍️ Orders
                      </Link>
                    </li>
                    <li>
                      <Link className={`nav-link${location.pathname === "/admin/users" ? " active" : ""}`} to="/admin/users" onClick={closeMobile}>
                        👥 Users
                      </Link>
                    </li>
                    <li>
                      <Link className={`nav-link${location.pathname === "/admin/coupons" ? " active" : ""}`} to="/admin/coupons" onClick={closeMobile}>
                        🎟️ Coupons
                      </Link>
                    </li>
                    <li>
                      <Link className={`nav-link${location.pathname === "/admin/custom-requests" ? " active" : ""}`} to="/admin/custom-requests" onClick={closeMobile}>
                        🎨 Custom
                      </Link>
                    </li>
                    <li><div className="nav-divider" /></li>
                    <li>
                      <button className="nav-logout-btn" onClick={() => { logout(); closeMobile(); }}>
                        Logout
                      </button>
                    </li>
                  </>
                ) : (
                  /* ── CUSTOMER NAV ── */
                  <>
                    <li>
                      <Link className={`nav-link${location.pathname === "/products" ? " active" : ""}`} to="/products" onClick={closeMobile}>
                        Shop
                      </Link>
                    </li>

                    {isAuthenticated && (
                      <li>
                        <Link className={`nav-link${location.pathname === "/orders" ? " active" : ""}`} to="/orders" onClick={closeMobile}>
                          My Orders
                        </Link>
                      </li>
                    )}

                    <li><div className="nav-divider" /></li>

                    {/* Cart */}
                    <li>
                      <Link className="nav-cart-btn" to="/cart" onClick={closeMobile}>
                        🛒
                        {cartCount > 0 && (
                          <span className="nav-cart-count">{cartCount}</span>
                        )}
                      </Link>
                    </li>

                    {isAuthenticated ? (
                      <li>
                        <button className="nav-logout-btn" onClick={() => { logout(); closeMobile(); }}>
                          Logout
                        </button>
                      </li>
                    ) : (
                      <>
                        <li>
                          <Link className="nav-auth-link" to="/login" onClick={closeMobile}>Login</Link>
                        </li>
                        <li>
                          <Link className="nav-register-btn" to="/register" onClick={closeMobile}>Register</Link>
                        </li>
                      </>
                    )}
                  </>
                )}
              </ul>
            </nav>

            {/* Hamburger */}
            <button
              className="nav-hamburger"
              onClick={() => setMobileOpen((p) => !p)}
              aria-label="Toggle menu"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </header>

        {/* Mobile Nav */}
        <div className={`nav-mobile${mobileOpen ? " open" : ""}`}>
          {isAdmin ? (
            <>
              <Link className="nav-link" to="/admin/products" onClick={closeMobile}>📦 Products</Link>
              <Link className="nav-link" to="/admin/orders" onClick={closeMobile}>🛍️ Orders</Link>
              <Link className="nav-link" to="/admin/users" onClick={closeMobile}>👥 Users</Link>
              <Link className="nav-link" to="/admin/coupons" onClick={closeMobile}>🎟️ Coupons</Link>
              <Link className="nav-link" to="/admin/custom-requests" onClick={closeMobile}>🎨 Custom</Link>
              <button className="nav-logout-btn" style={{ marginTop: 8 }} onClick={() => { logout(); closeMobile(); }}>Logout</button>
            </>
          ) : (
            <>
              <Link className="nav-link" to="/products" onClick={closeMobile}>Shop</Link>
              {isAuthenticated && <Link className="nav-link" to="/orders" onClick={closeMobile}>My Orders</Link>}
              <Link className="nav-link" to="/cart" onClick={closeMobile}>🛒 Cart ({cartCount})</Link>
              {isAuthenticated ? (
                <button className="nav-logout-btn" style={{ marginTop: 8 }} onClick={() => { logout(); closeMobile(); }}>Logout</button>
              ) : (
                <>
                  <Link className="nav-link" to="/login" onClick={closeMobile}>Login</Link>
                  <Link className="nav-link" to="/register" onClick={closeMobile}>Register</Link>
                </>
              )}
            </>
          )}
        </div>

        {/* Main content */}
        <main className="main-content" style={{ paddingTop: "calc(var(--nav-h) + 24px)" }}>
          <Outlet />
        </main>

        {/* Footer — hide for admin */}
        {!isAdmin && (
          <footer className="site-footer">
            <div className="footer-inner">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <img src="/logo.jpeg" alt="Logo" style={{ height: "50px", width: "auto", objectFit: "contain", borderRadius: "50%", background: "#fff", padding: "4px" }} />
                  <p className="footer-brand" style={{ margin: 0 }}>Dreamy nails</p>
                </div>
                <p className="footer-tagline">Handmade press-on nails for every vibe. ✨</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                <a href="https://www.instagram.com/the_dreamy_nails_?igsh=dHQ0eHdyNWprMDlx" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.9rem", transition: "color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.8)'}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                  Follow us on Instagram
                </a>
                <p className="footer-copy" style={{ margin: 0 }}>© {new Date().getFullYear()} Dreamy nails</p>
              </div>
            </div>
          </footer>
        )}
        {isAdmin && (
          <footer className="site-footer site-footer--admin">
            <p className="footer-copy">Admin Panel · Dreamy nails © {new Date().getFullYear()}</p>
          </footer>
        )}
      </div>
    </>
  );
};

export default Layout;
