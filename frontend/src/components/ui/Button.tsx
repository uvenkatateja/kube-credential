import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'default' | 'outline';
  size?: 'sm' | 'lg';
  asChild?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'default', 
  size = 'sm',
  asChild = false,
  className = '',
  onClick
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-colors duration-200 rounded-lg';
  
  const variantClasses = {
    default: 'bg-blue-600 hover:bg-blue-700 text-white',
    outline: 'border border-gray-300 bg-white hover:bg-gray-50 text-gray-700'
  };
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, { 
      className: classes,
      onClick 
    });
  }
  
  return (
    <button className={classes} onClick={onClick}>
      {children}
    </button>
  );
};