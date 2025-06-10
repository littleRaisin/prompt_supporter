import React from 'react';

type PaginationProps = {
  page: number;
  maxPage: number;
  onPageChange: (page: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({ page, maxPage, onPageChange }) => (
  <div className="flex gap-2 items-center">
    <button
      className="px-3 py-1 border rounded disabled:opacity-50"
      onClick={() => onPageChange(Math.max(1, page - 1))}
      disabled={page === 1}
    >
      前へ
    </button>
    <span>ページ {page} / {maxPage}</span>
    <button
      className="px-3 py-1 border rounded disabled:opacity-50"
      onClick={() => onPageChange(Math.min(maxPage, page + 1))}
      disabled={page >= maxPage}
    >
      次へ
    </button>
  </div>
);

export default Pagination;