import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.content}>

        <div style={styles.iconContainer}>
          <div style={styles.icon}>404</div>
        </div>

        <h1 style={styles.title}>Página não encontrada</h1>
        
        <div style={styles.buttonContainer}>
          <Button
            label="Voltar"
            onClick={() => navigate(-1)}
            style={styles.secondaryButton}
          />
          <Button
            label="Ir para Home"
            onClick={() => navigate('/')}
            style={styles.primaryButton}
          />
        </div>

      </div>

      <div style={styles.backgroundDecoration}>
        <div style={styles.circle1}></div>
        <div style={styles.circle2}></div>
        <div style={styles.circle3}></div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
    position: 'relative',
    overflow: 'hidden',
    padding: '20px',
  },
  content: {
    textAlign: 'center',
    zIndex: 2,
    maxWidth: '600px',
    width: '100%',
  },
  iconContainer: {
    marginBottom: '30px',
  },
  icon: {
    fontSize: '120px',
    fontWeight: 'bold',
    color: '#3b82f6',
    textShadow: '0 4px 8px rgba(59, 130, 246, 0.3)',
    lineHeight: 1,
    margin: '0 auto',
    display: 'inline-block',
    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '16px',
    lineHeight: 1.2,
  },
  description: {
    fontSize: '1.125rem',
    color: '#6b7280',
    marginBottom: '40px',
    lineHeight: 1.6,
  },
  buttonContainer: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    marginBottom: '40px',
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 6px rgba(59, 130, 246, 0.3)',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    color: '#3b82f6',
    padding: '12px 24px',
    borderRadius: '8px',
    border: '2px solid #3b82f6',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  infoContainer: {
    marginTop: '20px',
  },
  infoText: {
    fontSize: '0.875rem',
    color: '#9ca3af',
    margin: 0,
  },
  backgroundDecoration: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    pointerEvents: 'none',
  },
  circle1: {
    position: 'absolute',
    top: '10%',
    left: '10%',
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(29, 78, 216, 0.1))',
  },
  circle2: {
    position: 'absolute',
    top: '60%',
    right: '10%',
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1))',
  },
  circle3: {
    position: 'absolute',
    bottom: '20%',
    left: '20%',
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.1))',
  },
};


export default NotFound;
