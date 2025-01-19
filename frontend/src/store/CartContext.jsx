/* eslint-disable react/prop-types */
import { createContext, useContext, useState, useEffect } from 'react';
import { getCartItems, addToCart as apiAddToCart, updateCartItem as apiUpdateCartItem, deleteCartItem as apiDeleteCartItem } from '../services/cartService'; // Import your cart service

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Fetch the cart items on initial load
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const cartItems = await getCartItems();
        setCart(cartItems); // Set the initial cart items in the context
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };

    fetchCartItems(); // Fetch the cart items when the app starts
  }, []);

  // Function to add an item to the cart and update the state
  const addToCart = async (product) => {
    try {
      const updatedCartItems = await apiAddToCart(product); // Call the service to update the cart
      setCart(updatedCartItems); // Update the cart state in context with the new cart
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  // Function to remove an item from the cart and update the state
  const removeFromCart = async (id) => {
    try {
      await apiDeleteCartItem(id); // Call the service to delete the item
      const updatedCartItems = cart.filter(item => item.id !== id); // Remove item from local state
      setCart(updatedCartItems); // Update the cart state in context
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  const clearCart = async () => {
    try {
      setCart([]); // Clear the cart in the local state
      await apiDeleteCartItem('all'); // Optional: Call a backend API to clear all cart items
    } catch (error) {
      console.error('Error clearing the cart:', error);
    }
  };  

  // Function to update the quantity of an item in the cart
  const updateCartItem = async (id, quantity) => {
    try {
      await apiUpdateCartItem(id, { quantity }); // Update the cart on the server
      const updatedCartItems = cart.map(item =>
        item.id === id ? { ...item, quantity } : item
      ); // Update the local state
      setCart(updatedCartItems); // Update the cart state in context
    } catch (error) {
      console.error('Error updating cart item:', error);
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateCartItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to access the CartContext
export const useCart = () => useContext(CartContext);
