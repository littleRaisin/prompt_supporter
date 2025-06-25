import React from 'react';
import { useTranslation } from 'react-i18next';

type PaginationProps = {
  page: number;
  maxPage: number;
  onPageChange: (page: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({ page, maxPage, onPageChange }) => {
  const { t } = useTranslation();
  return (
    <div className="flex gap-2 items-center">
      <button
        className="px-3 py-1 border rounded disabled:opacity-50"
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
      >
        {t('Previous')}
      </button>
      <span>{t('Page')} {page} / {maxPage}</span>
      <button
        className="px-3 py-1 border rounded disabled:opacity-50"
        onClick={() => onPageChange(Math.min(maxPage, page + 1))}
        disabled={page >= maxPage}
      >
        {t('Next')}
      </button>
    </div>
  );
}

export default Pagination;
