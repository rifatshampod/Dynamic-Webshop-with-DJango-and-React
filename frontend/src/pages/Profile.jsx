import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();

  // Mocking authentication status
  const isAuthenticated = !!localStorage.getItem('accessToken'); // Replace with actual authentication logic
  const username = localStorage.getItem('username') || 'Guest'; // Replace with real data fetching if needed

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login'); // Redirect to login if not authenticated
    }
  }, [isAuthenticated, navigate]);

  const handleAddProduct = () => {
    navigate('/add-product');
  };

  if (!isAuthenticated) {
    return null; // Prevent rendering until redirect
  }

  return (
    <div style={styles.container}>
      <h1>Welcome, {username}!</h1>
      <button onClick={handleAddProduct} style={styles.button}>
        Add Product
      </button>
    </div>
  );
};

// Inline styling for demonstration
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    textAlign: 'center',
  },
  button: {
    marginTop: '20px',
    padding: '10px 20px',
    fontSize: '16px',
    color: '#fff',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default Profile;
