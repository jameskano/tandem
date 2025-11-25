import React from 'react';

interface OutlineButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const OutlineButton = ({ children, className = '', onClick }: OutlineButtonProps) => (
  <button
    onClick={onClick}
    className={`border-2 px-4 py-2 rounded-xl text-primary border-primary hover:bg-primary/10 ${className}`}
  >
    {children}
  </button>
)

export default OutlineButton