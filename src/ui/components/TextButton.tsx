type TextButtonProps = {
  onClick?: () => void;
  children: React.ReactNode;
};

const TextButton = ({
  onClick,
  children,
}: TextButtonProps) => {
  const base = 'cursor-pointer hover:opacity-60 transition-opacity duration-200 ease-in-out';

  return (
    <span
      className={`${base}`}
      onClick={onClick}
    >
      {children}
    </span>
  );
};

export default TextButton;
