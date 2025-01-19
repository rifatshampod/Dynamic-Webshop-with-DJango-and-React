import axios from 'axios';
const API_URL = import.meta.env.VITE_BASE_URL;

// Fetch all cart items
export const getCartItems = async () => {
  const userId =localStorage.getItem('userId')
  try {
    const response = await axios.get(`${API_URL}/cart?user_id=${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching cart items:', error);
    throw error;
  }
};

// Add or update an item in the cart
export const addToCart = async (item) => {
  const userId =localStorage.getItem('userId')
  try {
    // Fetch the current cart items
    const cartItems = await getCartItems();
    const existingItem = cartItems.find((cartItem) => cartItem.id === item.id);

    if (existingItem) {
      // Increment the quantity if the item exists
      existingItem.quantity += 1;
      await axios.patch(`${API_URL}/cart/${existingItem.id}`, {
        quantity: existingItem.quantity,
      });
    } else {
      const itemWithProductId = {                // Keep all item data
        product_id: item.id, 
        quantity: 1,
        user_id: userId
      };
      await axios.post(`${API_URL}/cart/create`, itemWithProductId);
    }

    // Fetch and return the updated cart to ensure the frontend has the latest data
    return await getCartItems();
  } catch (error) {
    console.error('Error adding item to cart:', error);
    throw error;
  }
};

// Update an item in the cart (increment/decrement quantity)
export const updateCartItem = async (id, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/cart/edit?cart_id=${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error('Error updating cart item:', error);
    throw error;
  }
};

// Delete an item from the cart
export const deleteCartItem = async (id) => {
  try {
    // Delete the cart item
    await axios.delete(`${API_URL}/cart/delete?cart_id=${id}`);

    // Fetch and return the updated cart
    return await getCartItems();
  } catch (error) {
    console.error('Error deleting cart item:', error);
    throw error;
  }
};


export const placeOrder = async (items) => {
  const userId = localStorage.getItem('userId');
  
  // Loop through the items to send each order request
  try {
    const promises = items.map(item => {
      const orderData = {
        quantity: item.quantity,
        product_id: item.product_id,  // Ensure product_id is correctly passed
        total_price: item.total_price,  // Ensure total_price is correctly passed
        buyer_id: userId,
      };
      return axios.post(`${API_URL}/orders/create`, orderData); // Create order
    });

    // Wait for all order requests to complete
    const responses = await Promise.all(promises);
    console.log('Order response:', responses.map(response => response.data));
    return { success: true }; // Indicate success after all requests
  } catch (error) {
    console.error('Error placing order:', error);
    throw error;
  }
};



export const getMyOrders = async () => {
  const userId = localStorage.getItem('userId')
  try {
    const response = await axios.get(`${API_URL}/orders?user_id=${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching cart items:', error);
    throw new Error('No Data');
  }
};
