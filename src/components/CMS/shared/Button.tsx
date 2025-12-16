interface ButtonProps {
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "danger";
  label?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

export default function Button({
  type = "button",
  variant = "secondary",
  label,
  onClick,
  children,
}: ButtonProps) {
  const baseClass = "px-3 py-1 rounded";
  const variantClasses = {
    primary: "bg-blue-600 text-white",
    secondary: "border",
    danger: "border text-red-600",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClass} ${variantClasses[variant]}`}
    >
      {label || children}
    </button>
  );
}
