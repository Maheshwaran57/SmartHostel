import { useState } from 'react';

export const usePagination = (initialLimit = 10) => {
  const [page, setPage] = useState(1);
  const [limit] = useState(initialLimit);
  const [totalPages, setTotalPages] = useState(1);

  const nextPage = () => {
    if (page < totalPages) setPage(prev => prev + 1);
  };

  const prevPage = () => {
    if (page > 1) setPage(prev => prev - 1);
  };

  return { page, limit, totalPages, setPage, setTotalPages, nextPage, prevPage };
};