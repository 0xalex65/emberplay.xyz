import React from "react";

const Button = ({
  onClick,
  children,
  color = "primary",
  size = "sm",
  fullWidth = false,
  className = "",
  loading = false,
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
      } flex items-center justify-center px-5 rounded shadow disabled:opacity-60 ${
        colorStyles[color]
      } ${className}`}
      disabled={loading}
    >
      {loading ? (
        <span className="block w-6 h-6 rounded-full border-2 border-white border-t-2 border-t-gray-300 animate-spin" />
      ) : (
        <>{children}</>
      )}
    </button>
  );
};

export default Button;
