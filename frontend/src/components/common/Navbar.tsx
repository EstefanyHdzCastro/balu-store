import '../../styles/navbar.css';

const Navbar = () => {
  const linkHoverStyle = {
    color: '#5A4A42',
    textDecoration: 'none',
    fontWeight: '500',
    padding: '0.5rem 1rem',
    borderRadius: '0.25rem',
    transition: 'all 0.3s ease',
    position: 'relative' as const
  };

  const linkActiveStyle = {
    ...linkHoverStyle,
    backgroundColor: '#E4C9B6',
    color: '#D7A49A',
    transform: 'translateY(-2px)'
  };

  return (
    <nav style={{ 
      backgroundColor: '#E1DAD3', 
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      padding: '1rem'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <img 
              src="/images/baluu-logo.png" 
              alt="Balù Logo" 
              className="logo"
              style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '50%',
                objectFit: 'cover',
                transition: 'transform 0.3s ease'
              }} 
            />
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#D7A49A' }}>
              Balù
            </span>
          </a>
        </div>
        
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <a 
            href="/" 
            style={{ 
              color: '#5A4A42', 
              textDecoration: 'none', 
              fontWeight: '500',
              padding: '0.5rem 1rem',
              borderRadius: '0.25rem',
              transition: 'all 0.3s ease'
            }}
            className="nav-link"
          >
            Inicio
          </a>
          <a 
            href="/productos" 
            style={{ 
              color: '#5A4A42', 
              textDecoration: 'none', 
              fontWeight: '500',
              padding: '0.5rem 1rem',
              borderRadius: '0.25rem',
              transition: 'all 0.3s ease'
            }}
            className="nav-link"
          >
            Productos
          </a>
          <a 
            href="/pedido-personalizado" 
            style={{ 
              color: '#5A4A42', 
              textDecoration: 'none', 
              fontWeight: '500',
              padding: '0.5rem 1rem',
              borderRadius: '0.25rem',
              transition: 'all 0.3s ease'
            }}
            className="nav-link"
          >
            Pedido Personalizado
          </a>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <a 
            href="/login" 
            style={{ 
              color: '#5A4A42', 
              textDecoration: 'none', 
              fontWeight: '500',
              padding: '0.5rem 1rem',
              borderRadius: '0.25rem',
              transition: 'all 0.3s ease'
            }}
            className="nav-link"
          >
            Iniciar Sesión
          </a>
          <a 
            href="/registro" 
            style={{ 
              backgroundColor: '#D7A49A', 
              color: 'white', 
              padding: '0.5rem 1rem', 
              borderRadius: '6px', 
              textDecoration: 'none',
              boxShadow: '0 2px 8px rgba(215,164,154,0.3)',
              transition: 'all 0.3s ease',
              fontWeight: '500'
            }}
            className="nav-button"
          >
            Registrarse
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
