import React from 'react';
import { Package, MapPin, Coffee, Briefcase, Truck, Paperclip, Tag } from 'lucide-react';

export const getCategoryIcon = (category, size = 18, color) => {
  const props = { size, color: color || 'currentColor' };
  switch (category) {
    case 'Event Material': return <Package {...props} />;
    case 'Travel': return <MapPin {...props} />;
    case 'Food & Beverages': return <Coffee {...props} />;
    case 'Vendor Payment': return <Briefcase {...props} />;
    case 'Logistics': return <Truck {...props} />;
    case 'Office Supplies': return <Paperclip {...props} />;
    case 'Other': return <Tag {...props} />;
    default: return <Tag {...props} />;
  }
};
