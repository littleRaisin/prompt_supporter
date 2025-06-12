type ButtonProps = {
  text: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
};

const Button = ({
  text,
  type = 'button',
  onClick,
  variant = 'primary',
}: ButtonProps) => {
  const base = "px-3 py-1 rounded";
  const styles =
    variant === 'secondary'
      ? "bg-gray-300 text-gray-800 hover:bg-gray-400"
      : "bg-blue-500 text-white hover:bg-blue-600";

  return (
    <button
      type={type}
      className={`${base} ${styles}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;
