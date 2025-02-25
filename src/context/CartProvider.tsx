import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { toast } from "sonner"; // ✅ Usamos Sonner para los Toasts
import { Toaster } from "@/components/ui/sonner"; // ✅ Toaster global
import { CartItem, CartContextType } from "../types/interfaces";

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    const newTotal = cart.reduce((acc, item) => acc + item.price * item.count, 0);
    setTotal(newTotal);

    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      const exists = prevCart.find((p) => p.id === item.id);

      if (exists) {
        toast.info("Cantidad actualizada", {
          description: `Has agregado otro ${item.name} al carrito.`,
        });
        return prevCart.map((p) =>
          p.id === item.id ? { ...p, count: p.count + 1 } : p
        );
      } else {
        toast.success("Producto agregado", {
          description: `${item.name} añadido al carrito.`,
        });
        return [...prevCart, { ...item, count: 1 }];
      }
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    toast.warning("Producto eliminado", { description: "Se eliminó del carrito." });
  };

  const clearCart = () => {
    setCart([]);
    setTotal(0);
    localStorage.removeItem("cart");
    toast.warning("Carrito vaciado", { description: "Tu carrito ha sido limpiado." });
  };

  return (
    <CartContext.Provider value={{ cart, total, addToCart, removeFromCart, clearCart }}>
      <Toaster />
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de un CartProvider");
  }
  return context;
};
