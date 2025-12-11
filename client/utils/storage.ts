export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface User {
  email: string;
  name: string;
  phone?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  date: string;
  paymentMethod: "online" | "cod";
  status: "pending" | "delivered";
  userEmail?: string;
}

// Cart functions
export const getCart = (): CartItem[] => {
  const cart = localStorage.getItem("cart");
  return cart ? JSON.parse(cart) : [];
};

export const saveCart = (cart: CartItem[]) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

export const addToCart = (item: CartItem) => {
  const cart = getCart();
  const existingItem = cart.find((c) => c.id === item.id);

  if (existingItem) {
    existingItem.quantity += item.quantity;
  } else {
    cart.push(item);
  }

  saveCart(cart);
};

export const removeFromCart = (id: number) => {
  const cart = getCart();
  const filtered = cart.filter((item) => item.id !== id);
  saveCart(filtered);
};

export const updateCartItemQuantity = (id: number, quantity: number) => {
  const cart = getCart();
  const item = cart.find((c) => c.id === id);

  if (item) {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      item.quantity = quantity;
      saveCart(cart);
    }
  }
};

export const clearCart = () => {
  localStorage.setItem("cart", JSON.stringify([]));
};

// User functions
export const getUser = (): User | null => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const saveUser = (user: User) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const logout = () => {
  localStorage.removeItem("user");
};

// Orders functions
export const getOrders = (): Order[] => {
  const orders = localStorage.getItem("orders");
  return orders ? JSON.parse(orders) : [];
};

export const saveOrder = (order: Order) => {
  const orders = getOrders();
  orders.push(order);
  localStorage.setItem("orders", JSON.stringify(orders));
};

export const generateOrderId = () => {
  return "ORD-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9);
};
