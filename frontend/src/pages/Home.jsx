import { useEffect, useState } from 'react';
import { getProducts } from '../services/productService';
import { useCart } from '../store/CartContext'; // Use the CartContext
import { getCartItems } from '../services/cartService';
import ProductCard from '../components/Card/ProductCard';

const Home = () => {
  const [products, setProducts] = useState([]);
  const { cart, addToCart } = useCart(); // Get cart state and addToCart function from context
  const { setCart } = useCart();

  useEffect(() => {
    // Fetch products
    getProducts()
      .then((data) => setProducts(data))
      .catch((error) => console.error('Error fetching products:', error));
    
    // Fetch cart
    getCartItems()
      .then((data) => setCart(data))
      .catch((error) => console.error('Error fetching cart:', error));

  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold title text-center">Product List</h1>
      <div className="grid grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            cart={cart} // Pass cart from context to ProductCard
            onAddToCart={addToCart} // Pass addToCart from context to ProductCard
            isMyProductPage={false}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
