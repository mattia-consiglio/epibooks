import React from 'react'
import Pagination from 'react-bootstrap/Pagination'

function MyPagination({ currentPage, pageCount, setCurrentPage }) {
	return (
		<Pagination>
			<Pagination.First onClick={() => setCurrentPage(1)} />
			<Pagination.Prev onClick={() => setCurrentPage(currentPage - 1)} />
			{[...Array(pageCount)].map((page, i) => {
				return (
					<Pagination.Item
						key={i + 1}
						active={i + 1 === currentPage}
						onClick={() => setCurrentPage(i + 1)}
					>
						{i + 1}
					</Pagination.Item>
				)
			})}

			{/* <Pagination.Ellipsis /> */}

			{/* <Pagination.Ellipsis /> */}

			<Pagination.Next onClick={() => setCurrentPage(currentPage + 1)} />
			<Pagination.Last onClick={() => setCurrentPage(pageCount)} />
		</Pagination>
	)
}

export default MyPagination
