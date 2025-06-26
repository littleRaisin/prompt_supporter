import { useTranslation } from 'react-i18next';

type FavoriteIconProps = {
  isFavorite: boolean;
  onClick?: () => void;
};

const FavoriteIcon = ({
  isFavorite,
  onClick,
}: FavoriteIconProps) => {
  const { t } = useTranslation();
  const props = {
    className: `inline-block cursor-pointer text-xl ${isFavorite ? 'text-red-500' : 'text-gray-400'}`,
    title: isFavorite ? t('common.Remove from favorites') : t('common.Add to favorites'),
    ...(onClick ? { onClick } : {}),
  };

  return (
    <span {...props}>
      <img
        src={isFavorite ? './ico_star_filled.svg' : './ico_star_blank.svg'}
        alt={isFavorite ? t('common.Favorite') : t('common.Not favorite')}
        width={20}
        height={20}
      />
    </span>
  );
};

export default FavoriteIcon;
