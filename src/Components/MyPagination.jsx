import Pagination from "react-bootstrap/Pagination";

import PropTypes from "prop-types";

function MyPagination({ currentPage, pageCount, updateCurrentPage }) {
	if (pageCount === 0) {
		return <></>;
	}

	const maxPagesToShow = 7;
	let startPage = Math.max(1, currentPage - 2);
	let endPage = Math.min(pageCount, currentPage + 2);

	if (currentPage <= 4) {
		endPage = Math.min(maxPagesToShow, pageCount);
	} else if (currentPage + 2 >= pageCount) {
		startPage = Math.max(pageCount - maxPagesToShow + 1, 1);
	}

	return (
		<Pagination>
			<Pagination.First
				onClick={() => updateCurrentPage(1)}
				disabled={currentPage === 1}
			/>
			<Pagination.Prev
				onClick={() => updateCurrentPage(currentPage - 1)}
				disabled={currentPage === 1}
			/>

			{startPage > 1 && (
				<>
					<Pagination.Item onClick={() => updateCurrentPage(1)}>
						1
					</Pagination.Item>
					{startPage > 2 && <Pagination.Ellipsis disabled />}
				</>
			)}

			{[...Array(endPage - startPage + 1)].map((_, i) => (
				<Pagination.Item
					key={startPage + i}
					active={startPage + i === currentPage}
					onClick={() => updateCurrentPage(startPage + i)}
				>
					{startPage + i}
				</Pagination.Item>
			))}

			{endPage < pageCount && (
				<>
					{endPage < pageCount - 1 && <Pagination.Ellipsis disabled />}
					<Pagination.Item onClick={() => updateCurrentPage(pageCount)}>
						{pageCount}
					</Pagination.Item>
				</>
			)}

			<Pagination.Next
				onClick={() => updateCurrentPage(currentPage + 1)}
				disabled={currentPage === pageCount}
			/>
			<Pagination.Last
				onClick={() => updateCurrentPage(pageCount)}
				disabled={currentPage === pageCount}
			/>
		</Pagination>
	);
}

MyPagination.propTypes = {
	currentPage: PropTypes.number.isRequired,
	pageCount: PropTypes.number.isRequired,
	updateCurrentPage: PropTypes.func.isRequired,
};

export default MyPagination;
