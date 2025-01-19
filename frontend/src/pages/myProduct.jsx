import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts } from '../services/productService';
import { useCart } from '../store/CartContext'; // Use the CartContext
import { getCartItems } from '../services/cartService';
import ProductCard from '../components/Card/ProductCard';

const MyProducts = () => {
  const [products, setProducts] = useState([]);
  const [selectedTab, setSelectedTab] = useState('available'); // State for tab selection
  const { cart, addToCart } = useCart(); // Get cart state and addToCart function from context
  const { setCart } = useCart();
  
  // Get the logged-in user's id from localStorage
  const loggedInUserId = localStorage.getItem('userId');
  
  const navigate = useNavigate();

  // Check for authentication (access token)
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    
    // If no access token, redirect to login page
    if (!accessToken) {
      navigate('/login');
    } else {
      // If access token is present, fetch data
      getProducts()
        .then((data) => {
          // Filter products to show only those owned by the logged-in user
          const userId = Number(loggedInUserId);
          const userProducts = data.filter(product => product.user_id === userId);
          setProducts(userProducts); // Set filtered products
        })
        .catch((error) => console.error('Error fetching products:', error));

      // Fetch cart items
      getCartItems()
        .then((data) => setCart(data))
        .catch((error) => console.error('Error fetching cart items:', error));
    }
  }, [loggedInUserId, navigate, setCart]);

  // Filter products based on the selected tab
  const filteredProducts = products.filter(product => {
    const quantity = Number(product.quantity); // Ensure quantity is treated as a number
    if (selectedTab === 'available') {
      return quantity > 0; // Available products (quantity > 0)
    } else if (selectedTab === 'soldout') {
      return quantity === 0; // Sold out products (quantity === 0)
    }
    return true;
  });

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold title text-center">My Products</h1>

      {/* Tab Navigation */}
      <div className="flex justify-center mb-4 ">
        <button
          onClick={() => setSelectedTab('available')}
          className={`px-4 py-2 mr-4 ${selectedTab === 'available' ? 'btnTwo text-white' : 'bg-transparent text-black'}`}
        >
          Available
        </button>
        <button
          onClick={() => setSelectedTab('soldout')}
          className={`px-4 py-2 ${selectedTab === 'soldout' ? 'btnTwo text-white' : 'bg-transparent text-black'}`}
        >
          Sold Out
        </button>
      </div>

      {/* Display products based on the selected tab */}
      <div className="grid grid-cols-4 gap-4">
        {filteredProducts.length === 0 ? (
          <p>No products found for this category.</p> // Show message if no products are found
        ) : (
          filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              cart={cart} // Pass cart from context to ProductCard
              onAddToCart={addToCart} // Pass addToCart from context to ProductCard
              isMyProductPage={true} // Indicate this is the "My Products" page
            />
          ))
        )}
      </div>
    </div>
  );
};

export default MyProducts;
