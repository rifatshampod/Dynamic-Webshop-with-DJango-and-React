import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './store/CartContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Search from './pages/SearchProduct';
import Profile from './pages/Profile';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ProductDetails from './pages/ProductDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import AddProduct from './pages/AddProduct';
import MyOrder from './pages/myOrders';
import MyProduct from './pages/myProduct';
import EditProduct from './pages/EditProduct';
import ChangePass from './pages/ChangesPass';
import './App.css';

const App = () => {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Define routes inside the layout */}
            <Route index element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="profile" element={<Profile />} />
            <Route path="cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="product/:id" element={<ProductDetails />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/edit-product/:id" element={<EditProduct />} />
            <Route path="/my-orders" element={<MyOrder />} />
            <Route path="/my-products" element={<MyProduct />} />
            <Route path="/change-pass" element={<ChangePass />} />
          </Route>
        </Routes>
      </Router>
    </CartProvider>
  );
};

export default App;
