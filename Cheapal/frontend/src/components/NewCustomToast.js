import React from 'react';

/**
 * NewCustomToast Component
 * Renders a toast notification using the new HTML structure and CSS classes.
 * Relies on Font Awesome being loaded globally for icons.
 *
 * @param {object} props - Component props.
 * @param {Function} [props.closeToast] - Function provided by react-toastify to close the toast.
 * @param {'info' | 'success' | 'warning' | 'error' | 'regular'} [props.type='regular'] - The type of the toast.
 * @param {string} props.headline - The title/header text for the toast.
 * @param {string} props.text - The main body message for the toast.
 */
const NewCustomToast = ({ closeToast, type = 'regular', headline, text }) => {

  // Map types to CSS modifier classes and default content
  const typeConfig = {
    info: { className: '--info', iconClass: '--info', defaultHeadline: 'Info' },
    success: { className: '--success', iconClass: '--success', defaultHeadline: 'Success!' },
    warning: { className: '--warning', iconClass: '--warning', defaultHeadline: 'Warning!' },
    error: { className: '--error', iconClass: '--error', defaultHeadline: 'Error!' },
    regular: { className: '', iconClass: '--default', defaultHeadline: 'Notification' }, // Default style
  };

  const config = typeConfig[type] || typeConfig.regular;
  const displayHeadline = headline || config.defaultHeadline;
  const displayText = text || 'Notification message.'; // Default text

  return (
    // Base element with dynamic type class
    <div className={`new-notification ${config.className}`}>
      {/* Icon Column */}
      <div className={`notification__icon ${config.iconClass}`}></div>

      {/* Content Column */}
      <div className="notification__content">
        <h3 className="notification__headline">{displayHeadline}</h3>
        <p className="notification__text">{displayText}</p>
      </div>

      {/* Close Button (using react-toastify's function) */}
      {/* This button uses the styles defined in index.css */}
      <button onClick={closeToast} className="notification__close" aria-label="Close"></button>
    </div>
  );
};

export default NewCustomToast;
