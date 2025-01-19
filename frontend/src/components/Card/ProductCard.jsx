/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { format } from 'date-fns';

const ProductCard = ({ product, cart, onAddToCart, isMyProductPage }) => {
  const navigate = useNavigate();
  // Get the logged-in user's id from localStorage
  const loggedInUserId = localStorage.getItem('userId');

  // Check if the product is already in the cart
  const isInCart = cart.some((item) => item.product_id === product.id);

  // Disable the "Add to Cart" button if the product's userId is the same as the logged-in user's userId
  const isOwnProduct = product.user_id === Number(loggedInUserId);

  const accessToken = localStorage.getItem('accessToken');
  const date = new Date(product.created_at);
  const formattedDate = format(date, 'yyyy-MM-dd');

  const handleAddToCart = () => {
    if (!accessToken) {
      navigate('/login'); // Redirect to login page if not logged in
      return;
    }
    if (!isOwnProduct && !isInCart && !product.isSold) {
      onAddToCart(product); // Call the onAddToCart function passed from Home
    }
  };

  return (
    <div className="border border-gray-300 rounded-md shadow-md px-2 py-2">
      <div className="w-100">
        <img
          src="src/assets/feature_gray.jpg"
          alt={product.name}
          className="w-full h-100 object-cover mb-2 rounded-lg"
        />
      </div>
      <div className="px-4 py-2">
        <div className='flex justify-center mb-2'>
          <span>{formattedDate}</span>
        </div>
        <div className="flex justify-between align-center">
          <div>
            <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
          </div>
          <div>
            <p
              className={`${
                product.quantity <= 0 ? 'text-red-500' : 'text-green-500'
              } font-medium mb-4`}
            >
              {product.quantity <= 0 ? 'Sold Out' : 'Available'}
            </p>
          </div>
        </div>
        <div>
          <p className="text-gray-600 mb-2">{product.description}</p>
        </div>
        <div>
          <p className="text-gray-800 font-bold mb-5">Price: ${product.price}</p>
        </div>
        <div className="flex justify-between align-center">
          {/* Conditional rendering based on the page */}
          {!isMyProductPage ? (
            <>
              {/* Home Page: Show View Details and Add to Cart */}
              <button className='btnOne'>
                <Link to={`/product/${product.id}`} className="">
                  View Details
                </Link>
              </button>
              <button
                onClick={handleAddToCart}
                disabled={isInCart || product.quantity <= 0 || isOwnProduct} // Disable button if product is owned by user
                className={`px-4 py-2 btnTwo ${
                  isInCart || product.quantity <= 0 || isOwnProduct
                    ? ' cursor-not-allowed'
                    : ''
                }`}
              >
                {isInCart ? 'Added' : isOwnProduct ? "Own Product" : product.quantity <= 0 ? 'Sold Out' : 'Add to Cart'}
              </button>
            </>
          ) : (
            // My Product Page: Show Edit Button
            <button className="btnOne">
              <Link to={`/edit-product/${product.id}`} className="">
                Edit
              </Link>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    isSold: PropTypes.bool.isRequired,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    userId: PropTypes.string.isRequired, // userId of the product owner
  }).isRequired,
  cart: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    })
  ).isRequired,
  onAddToCart: PropTypes.func.isRequired,
};

export default ProductCard;
