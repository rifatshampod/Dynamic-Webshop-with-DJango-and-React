/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCartItems } from '../services/cartService';
import { getProducts } from '../services/productService';
import { placeOrder } from '../services/cartService'; // Import Axios-based service
import { useCart } from '../store/CartContext';

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [priceMessages, setPriceMessages] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      navigate('/login');
    } else {
      fetchCartItems();
      fetchProducts();
    }
  }, [navigate]);

  const fetchCartItems = async () => {
    try {
      const data = await getCartItems();
      setCartItems(data);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const comparePrices = () => {
    let updatedCartItems = [...cartItems];
    const messages = cartItems.map((cartItem) => {
      const product = products.find((product) => product.id === cartItem.product_id);
      if (product) {
        const cartItemTotalPrice = (cartItem.price || 0) * (cartItem.quantity || 0);
        const productTotalPrice = (product.price || 0) * (cartItem.quantity || 0);

        if (cartItemTotalPrice !== productTotalPrice) {
          updatedCartItems = updatedCartItems.map(item =>
            item.id === cartItem.id ? { ...item, price: product.price } : item
          );
          return {
            id: cartItem.id,
            message: cartItemTotalPrice < productTotalPrice
              ? `Price increased for ${product.name}. New price is $${product.price}.`
              : `Price decreased for ${product.name}. New price is $${product.price}.`,
          };
        }
      }
      return null;
    });

    const filteredMessages = messages.filter((message) => message !== null);
    if (filteredMessages.length > 0) {
      setPriceMessages(filteredMessages);
    }

    if (JSON.stringify(updatedCartItems) !== JSON.stringify(cartItems)) {
      setCartItems(updatedCartItems);
    }
  };

  const calculateTotalPrice = () => {
    const total = cartItems.reduce((acc, item) => {
      // Convert price to number and ensure it's valid
      const itemPrice = parseFloat(item.product.price) || 0;
      const itemQuantity = item.quantity || 0;  // Default to 0 if quantity is undefined or null
  
      const itemTotal = itemPrice * itemQuantity;  // Calculate the total price for this item
      console.log(`Item: ${item.product.name}, Price: ${itemPrice}, Quantity: ${itemQuantity}, Total: ${itemTotal}`);
  
      return acc + itemTotal;  // Add item total to the accumulator
    }, 0);
  
    console.log('Calculated Total Price:', total);
    setTotalPrice(total.toFixed(2));  // Update the state with the calculated total price
  };
  

  useEffect(() => {
    if (cartItems.length > 0 && products.length > 0) {
      comparePrices();
      calculateTotalPrice();
    }
  }, [cartItems, products]);

  const handleProceedCheckout = async () => {
    const payload = cartItems.map((item) => {
      const price = item.product.price || 0;  // Default to 0 if price is undefined or null
      const quantity = item.quantity || 0;  // Default to 0 if quantity is undefined or null
  
      const totalPrice = (price * quantity).toFixed(2);  // Ensure valid calculation
  
      // Log for debugging purposes
      console.log(`Item ID: ${item.id}, Price: ${price}, Quantity: ${quantity}, Total Price: ${totalPrice}`);
  
      return {
        quantity: quantity,  // Send the quantity
        product_id: item.product.id,  // Send the product ID
        total_price: totalPrice,  // Send the total price
        buyer_id: localStorage.getItem('userId'),  // Send buyer ID from local storage
      };
    });
  
    try {
      const result = await placeOrder(payload); // Send the transformed payload
      console.log('Order placed successfully:', result);
      alert('Order placed successfully!');
      clearCart();
      navigate('/my-orders')
    } catch (error) {
      console.error('Failed to place the order:', error);
      alert('Failed to place the order. Please try again.');
    }
  };
  
  

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold title text-center">Checkout</h1>

      {cartItems.length === 0 ? (
        <p>Your cart is empty!</p>
      ) : (
        <div>
          <div className='flex justify-between items-center'>
            <h2 className="text-xl font-semibold">Cart Items:</h2>
            <p className="font-bold">Total Price: ${totalPrice}</p> 
          </div>
          <ul>
            {cartItems.map((item) => (
              <li key={item.id} className="flex justify-between p-2 checkoutCard">
                <span>{item.product.name}</span>
                <span>Price: ${item.product.price}</span>
                <span>Quantity: {item.quantity}</span>
                <span>Total: ${(item.product.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>

          <div className="mt-4">
            {priceMessages.length > 0 && (
              <div>
                {priceMessages.map((msg) => (
                  <p key={msg.id} className="text-red-500">{msg.message}</p>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-6 text-center">
        <button
          onClick={handleProceedCheckout}
          className="btnTwo"
        >
          Proceed
        </button>
      </div>
    </div>
  );
};

export default Checkout;
