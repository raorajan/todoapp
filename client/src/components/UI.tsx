import React from 'react';

export const Card: React.FC<{ children: React.ReactNode, className?: string, style?: React.CSSProperties }> = ({ children, className = '', style }) => (
  <div className={`card ${className}`} style={style}>
    {children}
  </div>
);

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'danger' | 'ghost' | 'outline' }> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  ...props 
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'danger': return { background: 'var(--error)', color: 'white' };
      case 'ghost': return { background: 'transparent', color: 'var(--text)' };
      case 'outline': return { background: 'transparent', color: 'var(--accent)', border: '1px solid var(--accent)' };
      default: return {};
    }
  };

  return (
    <button 
      className={`btn ${variant === 'primary' ? 'btn-primary' : ''} ${variant === 'ghost' ? 'btn-ghost' : ''} ${className}`} 
      {...props}
      style={{ ...getVariantStyles(), ...props.style }}
    >
      {children}
    </button>
  );
};

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className = '', ...props }) => (
  <input className={`input ${className}`} {...props} />
);

export const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({ className = '', ...props }) => (
  <textarea className={`input ${className}`} {...props} style={{ minHeight: '80px', ...props.style }} />
);

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = ({ className = '', children, ...props }) => (
  <select className={`input ${className}`} {...props}>
    {children}
  </select>
);

export const Badge: React.FC<{ children: React.ReactNode, variant?: string }> = ({ children, variant = '' }) => (
  <span className={`badge ${variant ? `badge-${variant}` : ''}`}>
    {children}
  </span>
);

export const Modal: React.FC<{ 
  isOpen: boolean, 
  onClose: () => void, 
  title: string, 
  children: React.ReactNode,
  footer?: React.ReactNode 
}> = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content glass" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
        {footer && (
          <div className="modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

