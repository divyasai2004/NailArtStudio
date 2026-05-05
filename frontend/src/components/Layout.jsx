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
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        .site-header {
          position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
          height: var(--nav-h);
          background: rgba(248,244,240,0.92);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--blush);
          display: flex; align-items: center;
        }

        /* ── Admin header variant ── */
        .site-header--admin {
          background: rgba(69,17,22,0.97);
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
          font-family: var(--ff-serif); font-size: 1.35rem; font-weight: 400;
          color: var(--crimson); letter-spacing: 0.01em; white-space: nowrap;
          text-decoration: none;
        }
        .site-header--admin .nav-brand { color: var(--cream); }

        /* Admin badge */
        .nav-admin-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(255,255,255,0.12); color: var(--cream);
          font-size: 0.6rem; font-weight: 500; letter-spacing: 0.18em;
          text-transform: uppercase; padding: 4px 10px; border-radius: 2px;
          border: 1px solid rgba(255,255,255,0.2);
        }

        /* Nav links */
        .nav-links {
          display: flex; align-items: center; gap: 4px; list-style: none;
        }
        .nav-link {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 8px 14px; border-radius: 2px;
          font-size: 0.78rem; font-weight: 400; letter-spacing: 0.06em;
          color: var(--text); text-decoration: none;
          transition: background 0.2s, color 0.2s;
          white-space: nowrap;
        }
        .nav-link:hover { background: var(--blush); color: var(--crimson); }
        .nav-link.active { color: var(--crimson); font-weight: 500; }

        /* Admin nav links */
        .site-header--admin .nav-link {
          color: rgba(241,236,231,0.75);
        }
        .site-header--admin .nav-link:hover {
          background: rgba(255,255,255,0.1); color: var(--cream);
        }
        .site-header--admin .nav-link.active { color: var(--cream); }

        /* Cart button */
        .nav-cart-btn {
          position: relative; display: inline-flex; align-items: center;
          gap: 6px; padding: 8px 16px;
          background: var(--crimson); color: var(--cream);
          border: none; border-radius: 2px;
          font-family: var(--ff-sans); font-size: 0.75rem;
          font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase;
          text-decoration: none; transition: background 0.25s, transform 0.2s;
          cursor: pointer;
        }
        .nav-cart-btn:hover { background: var(--rose); transform: translateY(-1px); }
        .nav-cart-count {
          background: var(--cream); color: var(--crimson);
          font-size: 0.6rem; font-weight: 700; border-radius: 50%;
          width: 16px; height: 16px; display: inline-flex;
          align-items: center; justify-content: center;
        }

        /* Auth/logout */
        .nav-logout-btn {
          padding: 8px 14px; background: none; border: 1px solid var(--blush);
          border-radius: 2px; font-family: var(--ff-sans);
          font-size: 0.75rem; font-weight: 400; letter-spacing: 0.1em;
          color: var(--muted); cursor: pointer; text-transform: uppercase;
          transition: all 0.2s;
        }
        .nav-logout-btn:hover { border-color: var(--crimson); color: var(--crimson); }
        .site-header--admin .nav-logout-btn {
          border-color: rgba(255,255,255,0.2); color: rgba(241,236,231,0.6);
        }
        .site-header--admin .nav-logout-btn:hover {
          border-color: rgba(241,236,231,0.6); color: var(--cream);
        }

        .nav-auth-link {
          padding: 8px 14px; font-size: 0.78rem; letter-spacing: 0.06em;
          color: var(--muted); text-decoration: none;
          transition: color 0.2s;
        }
        .nav-auth-link:hover { color: var(--crimson); }
        .nav-register-btn {
          padding: 9px 20px; background: var(--crimson); color: var(--cream);
          border-radius: 2px; font-size: 0.72rem; font-weight: 500;
          letter-spacing: 0.14em; text-transform: uppercase; text-decoration: none;
          transition: background 0.25s;
        }
        .nav-register-btn:hover { background: var(--rose); }

        /* Admin section pill */
        .nav-section-pill {
          font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase;
          color: rgba(241,236,231,0.4); padding: 0 8px;
          border-left: 1px solid rgba(255,255,255,0.12);
          margin-left: 4px;
        }

        /* Divider */
        .nav-divider {
          width: 1px; height: 18px; background: var(--blush); margin: 0 4px;
        }
        .site-header--admin .nav-divider { background: rgba(255,255,255,0.12); }

        /* Hamburger */
        .nav-hamburger {
          display: none; flex-direction: column; gap: 5px;
          background: none; border: none; padding: 8px; cursor: pointer;
        }
        .nav-hamburger span {
          display: block; width: 22px; height: 1.5px;
          background: var(--crimson); transition: all 0.3s;
        }
        .site-header--admin .nav-hamburger span { background: var(--cream); }

        /* Mobile nav */
        .nav-mobile {
          display: none; position: fixed;
          top: var(--nav-h); left: 0; right: 0;
          background: var(--parchment); border-bottom: 1px solid var(--blush);
          flex-direction: column; padding: 16px;
          gap: 4px; z-index: 999;
          box-shadow: var(--shadow-md);
        }
        .nav-mobile.open { display: flex; }
        .nav-mobile .nav-link { padding: 12px 16px; font-size: 0.9rem; }

        @media (max-width: 768px) {
          .nav-links { display: none; }
          .nav-hamburger { display: flex; }
        }

        /* Footer */
        .site-footer {
          background: var(--crimson); color: var(--cream);
          padding: clamp(40px,6vw,64px) clamp(16px,7vw,100px);
        }
        .footer-inner {
          max-width: 1280px; margin: 0 auto;
          display: grid; grid-template-columns: 1fr auto;
          align-items: center; gap: 32px;
        }
        .footer-brand {
          font-family: var(--ff-serif); font-size: 1.6rem; font-weight: 300;
          color: var(--cream); margin-bottom: 8px;
        }
        .footer-tagline { font-size: 0.82rem; color: rgba(241,236,231,0.55); }
        .footer-copy {
          font-size: 0.75rem; color: rgba(241,236,231,0.4);
          letter-spacing: 0.08em;
        }
        @media (max-width: 600px) {
          .footer-inner { grid-template-columns: 1fr; }
        }

        /* Admin footer is minimal */
        .site-footer--admin {
          background: rgba(69,17,22,0.06);
          border-top: 1px solid var(--blush);
          padding: 16px clamp(16px,7vw,100px);
        }
        .site-footer--admin .footer-copy { color: var(--muted); }
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
            >
              💅 NailArt Studio
              {isAdmin && <span className="nav-admin-badge" style={{ marginLeft: 12 }}>Admin</span>}
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
                <p className="footer-brand">NailArt Studio</p>
                <p className="footer-tagline">Handmade press-on nails for every vibe. ✨</p>
              </div>
              <p className="footer-copy">© {new Date().getFullYear()} NailArt Studio</p>
            </div>
          </footer>
        )}
        {isAdmin && (
          <footer className="site-footer site-footer--admin">
            <p className="footer-copy">Admin Panel · NailArt Studio © {new Date().getFullYear()}</p>
          </footer>
        )}
      </div>
    </>
  );
};

export default Layout;
