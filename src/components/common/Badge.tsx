import React from 'react';

export type BadgeVariant = 'simulated' | 'success' | 'warning' | 'danger' | 'primary' | 'neutral' | 'sage';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  className = '',
  icon,
}) => {
  const variantStyles: Record<BadgeVariant, string> = {
    simulated: 'bg-amber-50 text-amber-800 border border-amber-200/80 font-medium',
    success: 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium',
    warning: 'bg-orange-50 text-orange-800 border border-orange-200 font-medium',
    danger: 'bg-rose-50 text-rose-800 border border-rose-200 font-medium',
    primary: 'bg-[#174B32]/10 text-[#103D2B] border border-[#174B32]/20 font-semibold',
    sage: 'bg-[#A8BFA5]/25 text-[#103D2B] border border-[#A8BFA5]/40 font-medium',
    neutral: 'bg-stone-100 text-stone-700 border border-stone-200 font-normal',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs transition-colors ${variantStyles[variant]} ${className}`}
    >
      {icon && <span className="inline-block">{icon}</span>}
      {children}
    </span>
  );
};
