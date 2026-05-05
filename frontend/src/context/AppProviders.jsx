import { AuthProvider } from "./AuthContext";
import { CartProvider } from "./CartContext";
import { ToastProvider } from "./ToastContext";

export const AppProviders = ({ children }) => {
  return (
    <AuthProvider>
      <CartProvider>
        <ToastProvider>{children}</ToastProvider>
      </CartProvider>
    </AuthProvider>
  );
};
