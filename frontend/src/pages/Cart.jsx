import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../store/CartContext';  // Import CartContext

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const { cart, removeFromCart, updateCartItem } = useCart();  // Access cart, removeFromCart, and updateCartItem functions from context
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');

    // If no access token, redirect to login page
    if (!accessToken) {
      navigate('/login');
    } else {
      setCartItems(cart); // Set cart items from context
    }
  }, [navigate, cart]);

  // Handle Increment for item quantity
  const handleIncrement = (id, currentQuantity) => {
    updateCartItem(id, currentQuantity + 1);  // Update quantity in context
  };

  // Handle Decrement for item quantity
  const handleDecrement = (id, currentQuantity) => {
    if (currentQuantity > 1) {
      updateCartItem(id, currentQuantity - 1);  // Update quantity in context
    }
  };

  // Delete an item from the cart
  const handleDelete = (id) => {
    removeFromCart(id);  // Remove item using context method
  };

  // Handle the "Proceed to Checkout" button click
  const handleProceedToCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div>
      {cartItems.length === 0 ? (
        <p className=' text-center title'>Your cart is empty!</p>
      ) : (
        <section className="py-24 relative">
          <div className="w-full max-w-7xl px-4 md:px-5 lg-6 mx-auto">
            <div className="text-xl text-center font-bold title ">
              <h1>Shopping Cart</h1>
            </div>
            {cartItems.map((item) => (
              <div className="rounded-3xl border-2 border-gray-200 p-4 flex mb-2 gap-4" key={item.id}>
                <div className="col-span-2 img box">
                  <img src={item.image} alt={item.image} className="max-lg:w-full lg:w-[180px] imageMaxHeight rounded-lg object-cover" />
                </div>
                <div className="col-span-10 detail w-full lg:pl-3">
                  <div className="flex items-center justify-between w-full mb-4">
                    <h5 className="font-manrope font-bold text-2xl leading-9 text-gray-900">{item.product.name}</h5>
                    <button
                      className="rounded-full group flex items-center justify-center focus-within:outline-red-500"
                      onClick={() => handleDelete(item.id)}
                    >
                      <svg width="54" height="54" viewBox="0 0 34 34" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <circle className="fill-red-50 transition-all duration-500 group-hover:fill-red-400"
                          cx="17" cy="17" r="17" />
                        <path className="stroke-red-500 transition-all duration-500 group-hover:stroke-white"
                          d="M14.1673 13.5997V12.5923C14.1673 11.8968 14.7311 11.333 15.4266 11.333H18.5747C19.2702 11.333 19.834 11.8968 19.834 12.5923V13.5997M19.834 13.5997C19.834 13.5997 14.6534 13.5997 11.334 13.5997C6.90804 13.5998 27.0933 13.5998 22.6673 13.5997C21.5608 13.5997 19.834 13.5997 19.834 13.5997ZM12.4673 13.5997H21.534V18.8886C21.534 20.6695 21.534 21.5599 20.9807 22.1131C20.4275 22.6664 19.5371 22.6664 17.7562 22.6664H16.2451C14.4642 22.6664 13.5738 22.6664 13.0206 22.1131C12.4673 21.5599 12.4673 20.6695 12.4673 18.8886V13.5997Z"
                          stroke="#EF4444" strokeWidth="1.6" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>
                  <p className="font-normal text-base leading-7 text-gray-500 mb-6">
                    {item.product.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <button
                        className="group border border-gray-200 shadow-sm shadow-transparent p-2 h-10 w-10 rounded-lg flex items-center justify-center bg-white transition-all duration-500 hover:shadow-gray-200 hover:bg-gray-50 hover:border-gray-300"
                        onClick={() => handleDecrement(item.id, item.quantity)}
                      >
                        -
                      </button>
                      {item.quantity}
                      <button
                        className="group border border-gray-200 shadow-sm shadow-transparent p-2 h-10 w-10 rounded-lg flex items-center justify-center bg-white transition-all duration-500 hover:shadow-gray-200 hover:bg-gray-50 hover:border-gray-300"
                        onClick={() => handleIncrement(item.id, item.quantity)}
                      >
                        +
                      </button>
                    </div>
                    <h6 className="text-indigo-600 font-manrope font-bold text-2xl leading-9 text-right">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </h6>
                  </div>
                </div>
              </div>
            ))}
            <div className="max-lg:max-w-lg max-lg:mx-auto">
              <button
                className="rounded-full py-4 px-6 bg-indigo-600 text-white font-semibold text-lg w-full text-center transition-all duration-500 hover:bg-indigo-700"
                onClick={handleProceedToCheckout}
              >
                Checkout
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Cart;
