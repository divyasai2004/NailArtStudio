import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Layout = () => {
  const { authUser, isAuthenticated, logout } = useAuth();
  const { cartItems } = useCart();
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="container nav">
          <Link className="brand" to="/">
            NailArt Studio
          </Link>
          <nav className="nav-links">
            <Link className="nav-item" to="/products">
              Shop
            </Link>
            <Link className="nav-item" to="/cart">
              Cart ({cartCount})
            </Link>
            {isAuthenticated ? (
              <>
                <Link className="nav-item" to="/orders">
                  Orders
                </Link>
                {authUser?.isAdmin ? (
                  <Link className="nav-item" to="/admin">
                    Admin
                  </Link>
                ) : null}
                <button className="link-btn nav-item nav-item-btn" onClick={logout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link className="nav-item" to="/login">
                  Login
                </Link>
                <Link className="nav-item nav-item--primary" to="/register">
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="container">Handmade press-on nails for every vibe.</div>
      </footer>
    </div>
  );
};

export default Layout;

