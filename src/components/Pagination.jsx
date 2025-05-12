import React from 'react';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  onPrev, 
  onNext 
}) => {
  const handleJump = (e) => {
    e.preventDefault();
    const page = parseInt(e.target.pageInput.value);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      onPageChange(page);
      e.target.pageInput.value = '';
    }
  };

  return (
    <div className="page-btn">
      <button 
        id="previous-page-btn" 
        onClick={onPrev}
        disabled={currentPage === 1}
      >
        Prev
      </button>
      
      <p>Page {currentPage} / {totalPages}</p>
      
      <button 
        id="next-page-btn" 
        onClick={onNext}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
      
      <form className="jump-to-page" onSubmit={handleJump}>
        <input 
          type="number" 
          name="pageInput"
          placeholder="Page #" 
          min="1" 
          max={totalPages}
        />
        <button className="jump-btn" type="submit">Go</button>
      </form>
    </div>
  );
};

export default Pagination;