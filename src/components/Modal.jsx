import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  };

  const contentWrapperStyle = {
    transform: 'scale(1)',
    transition: 'transform 0.3s ease-out',
    margin: '20px',
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div style={overlayStyle} onClick={handleOverlayClick}>
      <div style={contentWrapperStyle}>
        <div style={{width: '500px', height: '500px', backgroundColor: 'white'}}>
         {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;