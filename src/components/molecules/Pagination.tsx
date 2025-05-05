import React from 'react';
import { Button } from '../atoms/Button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    // Menos páginas en móvil, más en escritorio
    const maxPagesToShow = window.innerWidth < 640 ? 3 : 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    // Ajustar el rango si estamos cerca del final
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    // Siempre mostrar la primera página
    if (startPage > 1) {
      pages.push(
        <Button
          key={1}
          variant={1 === currentPage ? 'default' : 'outline'}
          size="sm"
          onClick={() => onPageChange(1)}
          className="w-8 sm:w-10 px-0 sm:px-2"
        >
          1
        </Button>
      );
      
      // Mostrar puntos suspensivos si hay un salto
      if (startPage > 2) {
        pages.push(
          <span key="start-ellipsis" className="px-1 sm:px-2">
            ...
          </span>
        );
      }
    }

    // Páginas intermedias
    for (let i = startPage; i <= endPage; i++) {
      // Evitar duplicar la primera página
      if (i === 1) continue;
      // Evitar duplicar la última página
      if (i === totalPages && totalPages > endPage - startPage + 1) continue;
      
      pages.push(
        <Button
          key={i}
          variant={i === currentPage ? 'default' : 'outline'}
          size="sm"
          onClick={() => onPageChange(i)}
          className="w-8 sm:w-10 px-0 sm:px-2"
        >
          {i}
        </Button>
      );
    }

    // Siempre mostrar la última página si hay más de una página
    if (endPage < totalPages) {
      // Mostrar puntos suspensivos si hay un salto
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="end-ellipsis" className="px-1 sm:px-2">
            ...
          </span>
        );
      }
      
      pages.push(
        <Button
          key={totalPages}
          variant={totalPages === currentPage ? 'default' : 'outline'}
          size="sm"
          onClick={() => onPageChange(totalPages)}
          className="w-8 sm:w-10 px-0 sm:px-2"
        >
          {totalPages}
        </Button>
      );
    }
    
    return pages;
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2 py-4">
      <Button
        variant="outline"
        size="sm"
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="px-2 sm:px-4"
      >
        <span className="hidden sm:inline">Anterior</span>
        <span className="sm:hidden">←</span>
      </Button>
      {renderPageNumbers()}
      <Button
        variant="outline"
        size="sm"
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="px-2 sm:px-4"
      >
        <span className="hidden sm:inline">Siguiente</span>
        <span className="sm:hidden">→</span>
      </Button>
    </div>
  );
}; 