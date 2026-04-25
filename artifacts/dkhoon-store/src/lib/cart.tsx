import React, { createContext, useContext } from 'react';
import {
  useGetCart,
  useAddToCart,
  useRemoveFromCart,
  useUpdateCartItem,
  CartItem,
  Product,
} from '@workspace/api-client-react';

const SESSION_KEY = 'dkhoon_session_id';

function getSessionId(): string {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = Math.random().toString(36).slice(2, 15) + Math.random().toString(36).slice(2, 15);
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const sessionId = getSessionId();

  const { data: items = [], isLoading, refetch } = useGetCart();
  const { mutate: addMutate } = useAddToCart();
  const { mutate: removeMutate } = useRemoveFromCart();
  const { mutate: updateMutate } = useUpdateCartItem();

  const addToCart = (product: Product, quantity = 1) => {
    addMutate(
      { data: { productId: product.id, sessionId, quantity } },
      { onSuccess: () => refetch() }
    );
  };

  const removeFromCart = (productId: number) => {
    removeMutate(
      { productId },
      { onSuccess: () => refetch() }
    );
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    updateMutate(
      { productId, data: { quantity, sessionId } },
      { onSuccess: () => refetch() }
    );
  };

  const clearCart = () => {
    items.forEach((item) => removeFromCart(item.productId));
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
