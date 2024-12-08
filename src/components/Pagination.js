import React from 'react'
import PropTypes from 'prop-types'
import { CPagination, CPaginationItem } from '@coreui/react'

const Pagination = ({ page, total_pages, onPageChange }) => {
  const getPages = () => {
    const pages = []
    for (let i = 1; i <= total_pages; i++) {
      pages.push(i)
    }
    return pages
  }

  return (
    <CPagination aria-label="Page navigation example" className="flex justify-content-center">
      <CPaginationItem
        aria-label="Previous"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)} // Passando a página anterior diretamente
        className="cursor-pointer"
      >
        <span aria-hidden="true">&laquo;</span>
      </CPaginationItem>
      {getPages().map((p) => (
        <CPaginationItem
          key={p}
          active={p === page}
          onClick={() => onPageChange(p)} // Passando o número da página clicada
          className="cursor-pointer"
        >
          {p}
        </CPaginationItem>
      ))}
      <CPaginationItem
        aria-label="Next"
        disabled={page === total_pages}
        onClick={() => onPageChange(page + 1)} // Passando a próxima página diretamente
        className="cursor-pointer"
      >
        <span aria-hidden="true">&raquo;</span>
      </CPaginationItem>
    </CPagination>
  )
}

// Definindo os propTypes
Pagination.propTypes = {
  total_items: PropTypes.number, // Total de itens (deve ser um número)
  page: PropTypes.number.isRequired, // Página atual (deve ser um número)
  page_size: PropTypes.number, // Tamanho da página (deve ser um número)
  total_pages: PropTypes.number.isRequired, // Total de páginas (deve ser um número)
  onPageChange: PropTypes.func.isRequired, // Função chamada ao mudar de página
}

export default Pagination
