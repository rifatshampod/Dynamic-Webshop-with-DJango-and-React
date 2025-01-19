import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById } from '../services/productService';
import { getCartItems } from '../services/cartService';
import { useCart } from '../store/CartContext'; // Import your cart context

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [user, setUser] = useState('');
  const { cart, addToCart, setCart } = useCart(); // Access cart and addToCart from context
  const [isInCart, setIsInCart] = useState(false); // Local state to track whether the product is in the cart

  // Fetch product details and cart items
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    setUser(userId);

    // Fetch product details
    getProductById(id)
      .then((data) => {
        setProduct(data);
      })
      .catch((error) => {
        console.error('Error fetching product:', error);
        setError('Product not found');
      });

    // Fetch cart items (if not already fetched)
    const fetchCart = async () => {
      try {
        const cartData = await getCartItems(); // Fetch the cart
        setCart(cartData); // Update the Cart Context
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };

    fetchCart(); // Call fetchCart immediately

  }, [id, setCart]); // Only re-run when id changes

  // Check if the product is in the cart after cart is updated
  useEffect(() => {
    if (product && cart.length > 0) {
      // Check if the product is already in the cart
      const productInCart = cart.find((item) => item.product_id === product.id);
      setIsInCart(!!productInCart); // Set isInCart to true if the product is found in the cart, else false
    }
  }, [cart, product]); // Re-run when cart or product changes

  const handleAddToCart = async () => {
    try {
      const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
      };

      await addToCart(cartItem); // Use the addToCart function from context

      setIsInCart(true); // Update local state to show the product is added
      alert('Product added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Error adding to cart');
    }
  };

  if (error) {
    return <div className="text-center text-red-500 text-lg">{error}</div>;
  }

  if (!product) {
    return <div className="text-center text-gray-500 text-lg">Loading...</div>;
  }

  const isOwnProduct = product.user_id === Number(user);

  return (
    <div className="formCard my-10">
      <div className="w-full bg-white rounded-lg shadow-md p-6">
        <div className="text-xl text-center font-bold title">
          <h1>Single Product</h1>
        </div>
        <div className="flex gap-4">
          <img
            src="/src/assets/feature_gray.jpg" // Use dynamic image URL
            alt={product.name}
            className="rounded-lg w-1/2 border"
          />
          <div className="flex-1 bg-gray-100 p-4">
            <h1 className="text-2xl font-semibold text-gray-800 mb-4">{product.name}</h1>
            <p className="text-gray-600 mb-2">{product.description}</p>
            <p className="text-lg font-semibold text-gray-800 mb-4">
              Price: <span className="text-blue-500">${product.price}</span>
            </p>
            <p
              className={`text-sm font-semibold ${
                product.quantity <= 0 ? 'text-red-500' : 'text-green-500'
              } mb-6`}
            >
              {product.quantity <= 0 ? 'Sold Out' : 'Available'}
            </p>
            <div>
              {isOwnProduct ? (
                <button
                  disabled
                  className="px-4 py-2 bg-gray-300 text-gray-600 rounded-lg cursor-not-allowed"
                >
                  Own Product
                </button>
              ) : (
                <button
                  onClick={handleAddToCart}
                  disabled={isInCart || product.quantity <= 0}
                  className="btnTwo"
                >
                  {isInCart
                    ? 'Added' // If the product is already in cart, show 'Added'
                    : product.isSold
                    ? 'Sold Out' // If the product is sold, show 'Sold Out'
                    : 'Add to Cart'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
