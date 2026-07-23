import React from 'react';
import { PAGINATION } from '../../utils/constants';

const Pagination = ({ currentPage, totalPages, total, limit, onPageChange, onLimitChange }) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push('...');
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center mt-4 gap-3">
      <div className="text-muted small">
        Showing {((currentPage - 1) * limit) + 1}-{Math.min(currentPage * limit, total)} of {total} results
      </div>

      <nav aria-label="Page navigation">
        <ul className="pagination pagination-sm mb-0">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
              <i className="bi bi-chevron-left"></i>
            </button>
          </li>
          {getPageNumbers().map((page, index) =>
            page === '...' ? (
              <li key={`ellipsis-${index}`} className="page-item disabled">
                <span className="page-link">...</span>
              </li>
            ) : (
              <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
                <button className="page-link" onClick={() => onPageChange(page)}>
                  {page}
                </button>
              </li>
            )
          )}
          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
              <i className="bi bi-chevron-right"></i>
            </button>
          </li>
        </ul>
      </nav>

      <div className="d-flex align-items-center gap-2">
        <label className="text-muted small mb-0">Per page:</label>
        <select
          className="form-select form-select-sm"
          style={{ width: 'auto' }}
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
        >
          {PAGINATION.LIMIT_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Pagination;


