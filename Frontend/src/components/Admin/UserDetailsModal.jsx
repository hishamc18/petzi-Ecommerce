import React from 'react';

const Modal = ({ onClose, children }) => {
    const handleOverlayClick = (e) => {
        // Close the modal when clicking on the overlay
        if (e.target === e.currentTarget) {
            onClose();  // Trigger the onClose function passed from UserDetails
        }
    };

    return (
        <div className="admin-modal-overlay" onClick={handleOverlayClick}>
            <div className="admin-modal-content">
                <button className="admin-modal-close" onClick={onClose}>×</button>
                {children}
            </div>
        </div>
    );
};

export default Modal;