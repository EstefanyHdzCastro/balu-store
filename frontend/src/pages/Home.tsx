import '../styles/navbar.css';

const Home = () => {
  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero Section */}
      <section style={{ 
        background: 'linear-gradient(135deg, #9ACD32 0%, #6B8E23 100%)',
        color: 'white',
        padding: '5rem 1rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ marginBottom: '2rem' }}>
            <img 
              src="/images/baluu-logo.png" 
              alt="Balù Logo" 
              style={{ 
                width: '120px', 
                height: '120px', 
                borderRadius: '50%',
                marginBottom: '1rem',
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                border: '4px solid rgba(255,255,255,0.2)'
              }} 
            />
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
            Bienvenido a Balù Store
          </h1>
          <p style={{ fontSize: '1.25rem', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
            Haz realidad tus ideas con nuestros pedidos personalizados.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a 
              href="/productos" 
              className="main-button"
              style={{
                backgroundColor: '#D7A49A',
                color: 'white',
                padding: '0.75rem 2rem',
                borderRadius: '0.5rem',
                fontWeight: '600',
                textDecoration: 'none',
                display: 'inline-block',
                boxShadow: '0 4px 15px rgba(215,164,154,0.3)',
                transition: 'all 0.3s ease'
              }}
            >
              Ver Productos
            </a>
            <a 
              href="/pedido-personalizado" 
              className="main-button"
              style={{
                backgroundColor: '#A4B1BA',
                color: 'white',
                padding: '0.75rem 2rem',
                borderRadius: '0.5rem',
                fontWeight: '600',
                textDecoration: 'none',
                display: 'inline-block',
                boxShadow: '0 4px 15px rgba(164,177,186,0.3)',
                transition: 'all 0.3s ease'
              }}
            >
              Pedido Personalizado
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '4rem 1rem', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
              ¿Por qué elegir Baluu?
            </h2>
            <p style={{ fontSize: '1.125rem', color: '#6b7280', maxWidth: '500px', margin: '0 auto' }}>
              Ofrecemos la mejor experiencia en productos personalizados
            </p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '2rem' 
          }}>
            <div style={{ textAlign: 'center', padding: '1.5rem' }}>
              <div style={{
                backgroundColor: '#dbeafe',
                width: '4rem',
                height: '4rem',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
                fontSize: '2rem'
              }}>
                🎨
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>Diseños Únicos</h3>
              <p style={{ color: '#6b7280' }}>
                Cada producto es diseñado especialmente según tus necesidades y gustos.
              </p>
            </div>

            <div style={{ textAlign: 'center', padding: '1.5rem' }}>
              <div style={{
                backgroundColor: '#dcfce7',
                width: '4rem',
                height: '4rem',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
                fontSize: '2rem'
              }}>
                ⚡
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>Entrega Rápida</h3>
              <p style={{ color: '#6b7280' }}>
                Procesamos y enviamos tu pedido en el menor tiempo posible.
              </p>
            </div>

            <div style={{ textAlign: 'center', padding: '1.5rem' }}>
              <div style={{
                backgroundColor: '#f3e8ff',
                width: '4rem',
                height: '4rem',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
                fontSize: '2rem'
              }}>
                💎
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>Calidad Premium</h3>
              <p style={{ color: '#6b7280' }}>
                Utilizamos materiales de la más alta calidad en todos nuestros productos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '4rem 1rem', backgroundColor: '#E1DAD3' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#5A4A42', marginBottom: '1rem' }}>
            ¿Listo para crear algo único?
          </h2>
          <p style={{ fontSize: '1.125rem', color: '#6A6A6A', marginBottom: '2rem' }}>
            Comienza tu pedido personalizado hoy y recibe exactamente lo que imaginas.
          </p>
          <a 
            href="/pedido-personalizado" 
            className="main-button"
            style={{
              backgroundColor: '#A4B1BA',
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: '0.5rem',
              fontWeight: '600',
              fontSize: '1.125rem',
              textDecoration: 'none',
              display: 'inline-block',
              boxShadow: '0 4px 15px rgba(164,177,186,0.3)',
              transition: 'all 0.3s ease'
            }}
          >
            Comenzar Pedido Personalizado
          </a>
        </div>
      </section>
    </div>
  );
};

export default Home;
