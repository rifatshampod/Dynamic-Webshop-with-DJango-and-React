/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import { getMyOrders } from '../services/cartService'; // Import the service function

const MyOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize navigate for redirection

  useEffect(() => {
    // Check if the user is authenticated by looking for the access token
    const accessToken = localStorage.getItem('accessToken');
    
    // If no access token, redirect to login page
    if (!accessToken) {
      navigate('/login');
    } else {
      // Fetch orders if authenticated
      const fetchOrders = async () => {
        try {
          const data = await getMyOrders();
          setOrders(data); // Update state with fetched orders
        } catch (error) {
          setError('Failed to fetch orders. Please try again later.');
        } finally {
          setLoading(false);
        }
      };

      fetchOrders();
    }
  }, [navigate]);

  if (loading) {
    return <p>Loading orders...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="title font-semibold text-center my-6">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-center text-lg text-gray-600">You have no orders.</p>
      ) : (
        <div>
          <ul className="space-y-6">
            {orders.map((order, index) => (
              <li
                key={index}
                className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all"
              >
                <div className="flex items-center gap-4">
                  {/* Static Image */}
                  <div className="flex-shrink-0 w-24 h-24 bg-gray-200 rounded-md">
                    <img
                      src="src/assets/images.jpeg" // Static Image URL
                      alt={order.productName}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>

                  {/* Order Details */}
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold text-gray-800">Product: {order.product}</h2>
                      <span className="text-lg text-gray-600"><strong>Total Price:</strong> ${order.total_price}</span>
                    </div>

                    <div className="space-y-2">
                      <p className="text-gray-700">
                        <strong>Order ID:</strong> {order.id}
                      </p>
                      <p className="text-gray-700">
                        <strong>Price:</strong> ${order.total_price}
                      </p>
                      <p className="text-gray-700">
                        <strong>Quantity:</strong> {order.quantity}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MyOrder;
