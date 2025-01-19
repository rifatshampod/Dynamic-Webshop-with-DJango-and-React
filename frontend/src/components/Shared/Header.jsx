import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faMagnifyingGlass, faUser } from '@fortawesome/free-solid-svg-icons';
import { useCart } from '../../store/CartContext';
import './Header.css';

const Header = () => {
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const [searchInput, setSearchInput] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state
  const [username, setUsername] = useState(''); // Track username

  const handleSearch = () => {
    if (searchInput.trim() !== '') {
      navigate(`/search?query=${searchInput}`);
    }
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
    localStorage.clear(); // Clear all items from localStorage
    setIsLoggedIn(false); // Update login state
    navigate('/'); // Redirect to the home page
  };

  // Check login state on initial load and when location changes
  useEffect(() => {
    const userName = localStorage.getItem('username');
    setUsername(userName || '');
    const userToken = localStorage.getItem('accessToken'); // Replace 'userToken' with your auth token key
    setIsLoggedIn(!!userToken); // Update state based on token existence
    setShowDropdown(false); // Close dropdown when location changes
  }, [location]);

  return (
    <>
      <header className="border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="logo">
              <Link to="/">
                <img src="src/assets/logo.svg.png" alt="Logo" className="h-16" />
              </Link>
            </div>
            <div className="search-bar flex gap-2 items-center">
              <input
                type="text"
                placeholder="Search..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="border rounded-lg px-4 py-2"
              />
              <button
                type="button"
                onClick={handleSearch}
                className="searchBtn rounded-lg text-white px-4 py-2"
              >
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </button>
            </div>
            <div className="icons flex gap-2 items-center">
              <button className="relative cartBtn px-4 py-2 rounded-lg text-white">
                <Link to="/cart">
                  <FontAwesomeIcon icon={faCartShopping} />
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                </Link>
              </button>
              {isLoggedIn ? (
                <div className="relative">
                  <button
                    className="relative cartBtn px-4 py-2 rounded-lg text-white"
                    onClick={toggleDropdown}
                  >
                    <FontAwesomeIcon icon={faUser} />
                  </button>
                  {showDropdown && (
                    <div className="absolute bg-white right-0 mt-2 w-48 border rounded-lg shadow-lg z-10">
                      <p className='p-2 text-center text-gray-600'>{username}</p>
                      <hr />
                      <ul className="py-2">
                        <li>
                          <Link
                            to="/add-product"
                            className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
                          >
                            Add Product
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/my-products"
                            className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
                          >
                            Inventory
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/my-orders"
                            className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
                          >
                            My Orders
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/change-pass"
                            className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
                          >
                            Change Password
                          </Link>
                        </li>
                        <li>
                          <button
                            onClick={handleLogout}
                            className="block px-4 py-2 hover:bg-gray-100 text-gray-700 w-full text-left"
                          >
                            Logout
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  className="cartBtn text-white rounded-lg  px-4 py-2"
                  onClick={() => navigate('/login')} // Navigate to login page
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
