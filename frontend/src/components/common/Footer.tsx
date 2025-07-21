const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#E4C9B6', color: '#4A4A4A', padding: '3rem 1rem 1rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#5A5A5A' }}>Balù Store</h3>
            <p style={{ color: '#6A6A6A' }}>
              Productos personalizados únicos para cada cliente.
            </p>
          </div>
          
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: '500', marginBottom: '1rem', color: '#5A5A5A' }}>Enlaces</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="/" style={{ color: '#6A6A6A', textDecoration: 'none' }}>Inicio</a>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="/productos" style={{ color: '#6A6A6A', textDecoration: 'none' }}>Productos</a>
              </li>
              <li>
                <a href="/pedido-personalizado" style={{ color: '#6A6A6A', textDecoration: 'none' }}>Pedidos</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: '500', marginBottom: '1rem', color: '#5A5A5A' }}>Contacto</h4>
            <div style={{ color: '#6A6A6A' }}>
              <p style={{ marginBottom: '0.5rem' }}>Email: info@balu.com</p>
              <p>Teléfono: +52 55 1234 5678</p>
            </div>
          </div>
        </div>
        
        <div style={{ 
          marginTop: '2rem', 
          paddingTop: '2rem', 
          borderTop: '1px solid #D7A49A', 
          textAlign: 'center' 
        }}>
          <p style={{ color: '#6A6A6A' }}>
            © 2025 Balù Store. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
