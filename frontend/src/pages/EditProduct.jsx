import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProductById } from '../services/productService'; // Import the getProductById function
import { updateProduct } from '../services/productService'; // Function to update product

const EditProduct = () => {
  const [product, setProduct] = useState({
    name: '',
    price: '',
    description: '',
    isSold: false,
    image: '',
    userId: localStorage.getItem('userId'),
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams(); // Get the product id from the URL

  // Check if the user is logged in
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      navigate('/login'); // Redirect to login page if not logged in
    } else {
      // Fetch product details if logged in
      const fetchProduct = async () => {
        try {
          const data = await getProductById(id); // Get product by id
          setProduct(data); // Populate product data in the form
        } catch (error) {
          console.error('Error fetching product details:', error);
          setError('Failed to fetch product details');
        }
      };

      fetchProduct();
    }
  }, [id, navigate]); // Only run once on component mount

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Update the product using the updateProduct service function
      await updateProduct(id, product);
      alert('Product updated successfully!');
      navigate(`/`); // Redirect to product details page after update
    } catch (err) {
      console.error('Error updating product:', err);
      setError('Failed to update product. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center my-10">
      <div className="w-full max-w-lg bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">Edit Product</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter product name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter product price"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={product.quantity}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter product quantity"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={product.description}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter product description"
              rows="4"
            ></textarea>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="btnTwo"
            >
              Update Product
            </button>
          </div>
        </form>
        {error && <p className="mt-4 text-sm text-red-600 text-center">{error}</p>}
      </div>
    </div>
  );
};

export default EditProduct;
