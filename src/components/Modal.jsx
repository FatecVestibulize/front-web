import React from 'react';
import { Button } from 'primereact/button';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  };

  const contentWrapperStyle = {
    backgroundColor: '#1f1f2e',
    borderRadius: '16px',
    padding: '30px',
    width: '100%',
    maxWidth: '450px',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)',
    color: '#e0e0e0',
    animation: 'fadeIn 0.3s ease-out',
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '30px',
  };

  const titleStyle = {
    margin: 0,
    fontSize: '1.4em',
    fontWeight: '500',
    color: '#e0e0e0',
  };
  
  return (
    <div style={overlayStyle} onClick={handleOverlayClick}>
      <div style={contentWrapperStyle} onClick={(e) => e.stopPropagation()}>
        
        <div style={headerStyle}>
          <Button
            icon="pi pi-arrow-left"
            className="p-button-rounded p-button-text"
            style={{ color: '#e0e0e0', marginRight: '15px' }}
            onClick={onClose}
          />
          {title && <h2 style={titleStyle}>{title}</h2>}
        </div>

        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;