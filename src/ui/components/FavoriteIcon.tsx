type FavoriteIconProps = {
  isFavorite: boolean;
  onClick?: () => void;
};

const FavoriteIcon = ({
  isFavorite,
  onClick,
}: FavoriteIconProps) => {
  const props = {
    className: `inline-block cursor-pointer text-xl ${isFavorite ? 'text-red-500' : 'text-gray-400'}`,
    title: isFavorite ? 'お気に入り解除' : 'お気に入り登録',
    ...(onClick ? { onClick } : {}),
  };

  return (
    <span {...props}>
      <img
        src={isFavorite ? './ico_star_filled.svg' : './ico_star_blank.svg'}
        alt={isFavorite ? 'お気に入り' : 'お気に入りではない'}
        width={20}
        height={20}
      />
    </span>
  );
};

export default FavoriteIcon;