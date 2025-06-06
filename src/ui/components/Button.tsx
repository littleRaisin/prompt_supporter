const Button = ({
  text,
  type = 'button',
  onClick,
}: {
  text: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
}) => {
  return (
    <button 
      type={type} 
      className="bg-blue-500 px-3 py-1 rounded hover:opacity-50 transition-opacity text-white"
      onClick={onClick}
    >
      {text}
    </button>
  );
}
export default Button;
