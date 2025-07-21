const LoadingSpinner = () => {
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh' 
    }}>
      <div style={{ 
        animation: 'spin 1s linear infinite',
        borderRadius: '50%',
        height: '32px',
        width: '32px',
        border: '2px solid #f3f3f3',
        borderTop: '2px solid #3498db'
      }}></div>
    </div>
  );
};

export default LoadingSpinner;
