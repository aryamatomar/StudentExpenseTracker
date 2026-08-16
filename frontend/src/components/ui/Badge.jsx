import React from 'react';
import { 
  UtensilsCrossed, 
  Bus, 
  GraduationCap, 
  ShoppingBag, 
  Film, 
  MoreHorizontal,
  Tag
} from 'lucide-react';
import { CATEGORY_CONFIG } from '../../utils/constants';

const categoryIcons = {
  Food: UtensilsCrossed,
  Transport: Bus,
  Education: GraduationCap,
  Shopping: ShoppingBag,
  Entertainment: Film,
  Other: MoreHorizontal,
};

export const CategoryBadge = ({ category, size = 'md', showIcon = true }) => {
  const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG['Other'];
  const IconComponent = categoryIcons[category] || Tag;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3 py-1.5 gap-2 font-medium',
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border transition-colors ${config.badge} ${sizeClasses[size]}`}
      title={config.description}
    >
      {showIcon && <IconComponent size={iconSizes[size]} className="shrink-0" />}
      <span>{category}</span>
    </span>
  );
};

export default CategoryBadge;
