import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'; // To get query parameters from URL
import { getProductsBySearch } from '../services/productService'; // Import your search API
import ProductCard from '../components/Card/ProductCard'; // Import your ProductCard component
import { useCart } from '../store/CartContext'; // Access the cart context

const Search = () => {
  const [products, setProducts] = useState([]); // State to hold the search results
  const location = useLocation(); // Access the current URL location
  const { cart, addToCart } = useCart(); // Access cart state and addToCart function

  // Extract the search query from the URL
  const queryParams = new URLSearchParams(location.search);
  const searchKeyword = queryParams.get('query'); // Extract 'query' parameter

  useEffect(() => {
    if (searchKeyword) {
      // Fetch products matching the search keyword
      const fetchProducts = async () => {
        try {
          const data = await getProductsBySearch(searchKeyword); // Use your API to fetch products
          setProducts(data); // Update the product list state
        } catch (error) {
          console.error('Error fetching search results:', error);
        }
      };

      fetchProducts(); // Call the function to fetch search results
    }
  }, [searchKeyword]); // Re-run the effect when searchKeyword changes

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold title text-center">
        Search Results for &quot;{searchKeyword}&quot;
      </h1>
      {products.length > 0 ? (
        <div className="grid grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              cart={cart} // Pass cart from context
              onAddToCart={addToCart} // Pass addToCart from context
              isMyProductPage={false}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-6">
          No products found matching &quot;{searchKeyword}&quot;
        </p>
      )}
    </div>
  );
};

export default Search;
