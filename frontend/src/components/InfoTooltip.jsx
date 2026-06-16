import React, { useState, useRef, useEffect } from 'react';
import { Info } from 'lucide-react';

const InfoTooltip = ({ title, description, example }) => {
  const [isOpen, setIsOpen] = useState(false);
  const tooltipRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="tooltip-container" ref={tooltipRef} style={{ position: 'relative', display: 'inline-block', marginLeft: '8px' }}>
      <button 
        className="tooltip-trigger" 
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '4px',
          display: 'flex',
          alignItems: 'center',
          color: 'var(--accent-blue)',
          opacity: isOpen ? 1 : 0.7,
          transition: 'opacity 0.2s'
        }}
        aria-label="More info"
      >
        <Info size={18} />
      </button>

      {isOpen && (
        <div 
          className="tooltip-popover"
          style={{
            position: 'absolute',
            top: 'calc(100% + 10px)',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '280px',
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid var(--glass-border)',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            zIndex: 1000,
            animation: 'fadeInUp 0.2s ease-out'
          }}
        >
          {/* Tooltip Arrow */}
          <div style={{
            position: 'absolute',
            top: '-6px',
            left: '50%',
            transform: 'translateX(-50%) rotate(45deg)',
            width: '10px',
            height: '10px',
            background: 'var(--secondary-black)',
            borderLeft: '1px solid var(--glass-border)',
            borderTop: '1px solid var(--glass-border)',
          }}></div>

          <h4 style={{ margin: '0 0 8px 0', color: 'var(--primary-white)', fontSize: '0.95rem' }}>{title}</h4>
          <p style={{ margin: '0 0 12px 0', color: 'var(--secondary-white)', fontSize: '0.85rem', lineHeight: '1.4' }}>
            {description}
          </p>
          
          {example && (
            <div style={{ 
              background: 'rgba(255,255,255,0.05)', 
              padding: '8px 12px', 
              borderRadius: '6px',
              borderLeft: '3px solid var(--accent-blue)'
            }}>
              <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--accent-blue)', fontWeight: 600, marginBottom: '4px', textTransform: 'uppercase' }}>Example</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--primary-white)' }}>{example}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InfoTooltip;
