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
      className="bg-blue-500 px-3 py-1 rounded"
      onClick={onClick}
    >
      {text}
    </button>
  );
}
export default Button;