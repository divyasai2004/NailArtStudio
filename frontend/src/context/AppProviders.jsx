import { AuthProvider } from "./AuthContext";
import { CartProvider } from "./CartContext";

export const AppProviders = ({ children }) => {
  return (
    <AuthProvider>
      <CartProvider>{children}</CartProvider>
    </AuthProvider>
  );
};

