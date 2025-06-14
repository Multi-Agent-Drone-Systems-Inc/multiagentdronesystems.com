import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant: 'primary' | 'secondary';
  className?: string;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant, 
  className = '', 
  onClick 
}) => {
  const baseStyles = "px-10 py-5 font-medium text-lg transition-all duration-300 transform hover:scale-105 focus:outline-none relative overflow-hidden";
  
  const variantStyles = {
    primary: "bg-[#ffd700] text-gray-900 ",
    secondary: "border-2 border-[#ffd700] text-[#ffd700] hover:shadow-[0_0_15px_rgba(218,165,32,0.3)] bg-gradient-to-r from-transparent via-[#DAA520]/10 to-transparent hover:bg-gradient-to-r hover:from-[#DAA520]/20 hover:via-[#DAA520]/5 hover:to-[#DAA520]/20"
  };

  return (
    <button 
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;