import React from 'react'
import Pagination from 'react-bootstrap/Pagination'

function MyPagination({ currentPage, pageCount, setCurrentPage }) {
	if (pageCount === 0) {
		return <></>
	}

	const maxPagesToShow = 7
	let startPage = Math.max(1, currentPage - 2)
	let endPage = Math.min(pageCount, currentPage + 2)

	if (currentPage <= 4) {
		endPage = Math.min(maxPagesToShow, pageCount)
	} else if (currentPage + 2 >= pageCount) {
		startPage = Math.max(pageCount - maxPagesToShow + 1, 1)
	}

	return (
		<Pagination>
			<Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
			<Pagination.Prev
				onClick={() => setCurrentPage(currentPage - 1)}
				disabled={currentPage === 1}
			/>

			{startPage > 1 && (
				<>
					<Pagination.Item onClick={() => setCurrentPage(1)}>1</Pagination.Item>
					{startPage > 2 && <Pagination.Ellipsis disabled />}
				</>
			)}

			{[...Array(endPage - startPage + 1)].map((_, i) => (
				<Pagination.Item
					key={startPage + i}
					active={startPage + i === currentPage}
					onClick={() => setCurrentPage(startPage + i)}
				>
					{startPage + i}
				</Pagination.Item>
			))}

			{endPage < pageCount && (
				<>
					{endPage < pageCount - 1 && <Pagination.Ellipsis disabled />}
					<Pagination.Item onClick={() => setCurrentPage(pageCount)}>{pageCount}</Pagination.Item>
				</>
			)}

			<Pagination.Next
				onClick={() => setCurrentPage(currentPage + 1)}
				disabled={currentPage === pageCount}
			/>
			<Pagination.Last
				onClick={() => setCurrentPage(pageCount)}
				disabled={currentPage === pageCount}
			/>
		</Pagination>
	)
}

export default MyPagination
