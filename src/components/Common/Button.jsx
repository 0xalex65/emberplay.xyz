import React from "react";

const Button = ({
  onClick,
  children,
  color = "primary",
  size = "sm",
  fullWidth = false,
}) => {
  const colorStyles = {
    primary: "bg-gradient-to-br from-[#88F7FE] to-[#397EFF]",
    danger: "bg-gradient-to-br from-[#FE6464] to-[#FE0909]",
    success: "bg-gradient-to-br from-[#56E17C] to-[#39FEEA]",
    light: "bg-gradient-to-br from-[#EBF1F1] to-[#FFFFFF] text-black",
    warning: "bg-gradient-to-br from-[#FDFE00] to-[#FE9900]",
  };

  const sizeStyles = {
    sm: "h-9 text-sm",
    lg: "h-12 font-medium text-base",
  };

  return (
    <button
      onClick={onClick}
      className={`${fullWidth ? `w-full` : `w-auto`} ${
        sizeStyles[size]
      } px-5 rounded shadow ${colorStyles[color]}`}
    >
      {children}
    </button>
  );
};

export default Button;
