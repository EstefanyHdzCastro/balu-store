// Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import LoadingSpinner from './components/common/LoadingSpinner';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import CustomOrder from './pages/CustomOrder';
import OrderTracking from './pages/OrderTracking';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AdminDashboard from './pages/admin/Dashboard';

// Styles
import './App.css';

function App() {
  // Simple router simulation
  const path = window.location.pathname;
  
  const renderPage = () => {
    switch (path) {
      case '/productos':
        return <Products />;
      case '/pedido-personalizado':
        return <CustomOrder />;
      case '/login':
        return <Login />;
      case '/registro':
        return <Register />;
      case '/perfil':
        return <Profile />;
      case '/admin':
        return <AdminDashboard />;
      case '/checkout':
        return <Checkout />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="App">
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 200px)' }}>
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
}

export default App;
