// Layout.jsx
import { Outlet } from 'react-router-dom';
import Header from './Shared/Header';

const Layout = () => {
  return (
    <div>
      <Header />

      {/* Main Content */}
      <main className='container mx-auto'>
        <Outlet /> {/* Renders child routes */}
      </main>

      {/* Footer */}
      <footer style={{ background: '#f4f4f4', padding: '1rem', textAlign: 'center' }}>
        <p>&copy; {new Date().getFullYear()} Rifat's Webshop. All Rights Reserved by Åbo Akademi Web Technology Course.</p>
      </footer>
    </div>
  );
};

export default Layout;
