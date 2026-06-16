import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const CustomSelect = ({ options, value, onChange, name, icon: Icon, getOptionIcon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="custom-select-container" ref={ref} style={{ position: 'relative', width: '100%' }}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 14px 0 44px',
          height: '44px',
          backgroundColor: 'rgba(0,0,0,0.4)',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '8px',
          cursor: 'pointer',
          color: '#ffffff',
          fontSize: '1rem'
        }}
      >
        <div style={{ position: 'absolute', left: '14px', display: 'flex', alignItems: 'center' }}>
          {getOptionIcon ? getOptionIcon(value) : <Icon size={18} color="#ffffff" />}
        </div>
        <span>{value}</span>
        <ChevronDown size={18} color="#ffffff" style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </div>

      {isOpen && (
        <div className="custom-select-dropdown premium-scrollbar" style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          left: 0,
          right: 0,
          backgroundColor: '#141414',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '12px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.8)',
          zIndex: 50,
          maxHeight: '220px',
          overflowY: 'auto',
          padding: '8px'
        }}>
          {options.map(opt => (
            <div 
              key={opt}
              onClick={() => {
                onChange({ target: { name, value: opt } });
                setIsOpen(false);
              }}
              style={{
                padding: '10px 14px',
                cursor: 'pointer',
                color: opt === value ? '#ffffff' : '#a0a0a0',
                backgroundColor: opt === value ? 'rgba(255,255,255,0.08)' : 'transparent',
                borderRadius: '8px',
                transition: 'all 0.2s ease',
                fontSize: '0.95rem',
                fontWeight: opt === value ? 600 : 400,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '2px'
              }}
              onMouseEnter={(e) => {
                if (opt !== value) {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)';
                  e.currentTarget.style.color = '#ffffff';
                }
              }}
              onMouseLeave={(e) => {
                if (opt !== value) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#a0a0a0';
                }
              }}
            >
              {getOptionIcon ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {getOptionIcon(opt)}
                  <span>{opt}</span>
                </div>
              ) : (
                opt
              )}
              {opt === value && (
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#00aaff', boxShadow: '0 0 8px rgba(0,170,255,0.6)' }} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
