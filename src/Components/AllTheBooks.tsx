import React, { useState, useEffect, useCallback } from "react";

import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import SingleBook from "./SingleBook";
import MyPagination from "./MyPagination";
import Reviews from "./Reviews";
import { IoSearch } from "react-icons/io5";
import { BookInterfce } from "./types";

import fantasyBooksImport from "../data/fantasy.json";
import historyBooksImport from "../data/history.json";
import horrorBooksImport from "../data/horror.json";
import romanceBooksImport from "../data/romance.json";
import scifiBooksImport from "../data/scifi.json";

const fantasyBooks: BookInterfce[] = fantasyBooksImport;
const historyBooks: BookInterfce[] = historyBooksImport;
const horrorBooks: BookInterfce[] = horrorBooksImport;
const romanceBooks: BookInterfce[] = romanceBooksImport;
const scifiBooks: BookInterfce[] = scifiBooksImport;

interface BookGenres {
	fantasy: BookInterfce[];
	history: BookInterfce[];
	horror: BookInterfce[];
	romance: BookInterfce[];
	scifi: BookInterfce[];
	all?: BookInterfce[];
}

const AllTheBooks = () => {
	const [bookGenres, setBookGenres] = useState<BookGenres>({
		fantasy: fantasyBooks,
		history: historyBooks,
		horror: horrorBooks,
		romance: romanceBooks,
		scifi: scifiBooks,
	});
	const [currentBooksList, setCurrentBooksList] = useState<BookInterfce[]>([]);
	const [filterdBooksList, setFilterdBooksList] = useState<BookInterfce[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [booksPerPage, setBooksPerPage] = useState(12);
	const [pageCount, setPageCount] = useState(1);
	const [search, setSearch] = useState("");
	const [selectedBooks, setSelectedBooks] = useState<Set<string>>(new Set());
	const [reviewBook, setReviewBook] = useState(null);

	const mergeBooks = useCallback(() => {
		const books: BookInterfce[] = [];
		for (let genre in bookGenres) {
			if (genre === "all") {
				continue;
			}
			const genreBooks: BookInterfce[] = bookGenres[genre];
			if (genreBooks.length > 0) {
				genreBooks.forEach((book) => {
					const index = books.length
						? books.findIndex((b) => b.asin === book.asin)
						: -1;
					if (index === -1) {
						books.push(book);
					} else {
						const categories = books[index].category.split(", ");
						const newCategory =
							book.category.charAt(0).toUpperCase() + book.category.slice(1);
						if (!categories.includes(newCategory)) {
							categories.push(newCategory);
							books[index].category = categories.join(", ");
						}
					}
				});
			}
		}
		return books;
	}, [bookGenres]);

	const updatePageCount = useCallback(() => {
		const totalBooks = filterdBooksList.length;
		const pageCount = Math.ceil(totalBooks / booksPerPage);
		setPageCount(pageCount);
	}, [filterdBooksList, booksPerPage]);

	const filterBooks = useCallback(() => {
		const funcSearch = search.toLowerCase().trim();
		const books = currentBooksList as BookInterfce[];
		let filteredBooks: BookInterfce[] = [];
		if (funcSearch !== "") {
			filteredBooks = books.filter((book) => {
				const bookTitle = book.title.toLowerCase().trim();
				const bookAsin = book.asin.toLowerCase().trim();

				return bookTitle.includes(funcSearch) || bookAsin.includes(funcSearch);
			});
		} else {
			filteredBooks = books;
		}
		setFilterdBooksList(filteredBooks);
		setCurrentPage(1);
	}, [search, currentBooksList]);

	const updateCurrentPage = (newPage) => {
		const currentPage = Math.max(Math.min(newPage, pageCount), 1);
		setCurrentPage(currentPage);
	};

	const changeGenre = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedGenre = e.target.value;

		setCurrentBooksList(bookGenres[selectedGenre] || []);
		setCurrentPage(1);
	};

	useEffect(() => {
		if ("all" in bookGenres) return;
		bookGenres.all = mergeBooks();
		setBookGenres(bookGenres);
		setCurrentBooksList(bookGenres.all);
		setFilterdBooksList(bookGenres.all);
		updatePageCount();

		const localStorageBooks = localStorage.getItem("selectedBooks");
		if (localStorageBooks) {
			JSON.parse(localStorageBooks).forEach((book) => {
				selectedBooks.add(book);
			});
			setSelectedBooks(selectedBooks);
		}
	}, [bookGenres, selectedBooks, mergeBooks, updatePageCount]);

	useEffect(() => {
		updatePageCount();
	}, [filterdBooksList, booksPerPage, updatePageCount]);

	useEffect(() => {
		filterBooks();
	}, [search, currentBooksList, booksPerPage, filterBooks]);

	const renderBooks = () => {
		const startIndex = currentPage * booksPerPage - booksPerPage;
		const endIndex = startIndex + booksPerPage;
		if (filterdBooksList.length === 0) {
			return (
				<Col>
					<Alert variant="warning">
						No books found for: <b>{search}</b>
					</Alert>
				</Col>
			);
		}
		return filterdBooksList.slice(startIndex, endIndex).map((book) => (
			<Col key={book.asin} xs={12} md={12} lg={6} xl={4}>
				<SingleBook
					book={book}
					selectedBooks={selectedBooks}
					setSelectedBooks={setSelectedBooks}
					setReviews={setReviewBook}
				/>
			</Col>
		));
	};
	const renderPagination = () => {
		return (
			<Row className="mt-4">
				<Col className="d-flex justify-content-center">
					<MyPagination
						pageCount={pageCount}
						currentPage={currentPage}
						updateCurrentPage={updateCurrentPage}
					/>
				</Col>
			</Row>
		);
	};

	return (
		<>
			<Container className="my-4">
				<Row>
					<Col xs={12}>
						<Alert variant="info">Welcome on the EpiBooks website!</Alert>
						<div className="d-flex column-gap-3 mb-4 justify-content-between align-items-center flex-wrap">
							<h1>Books</h1>
							<div className="d-flex align-items-center column-gap-3">
								<div className="d-flex align-items-center">
									<p className="mb-1 me-2">Genre:</p>
									<Form.Select
										aria-label="Select genre"
										onChange={(e) => changeGenre(e)}
										defaultValue="all"
									>
										<option value="all">All</option>
										<option value="fantasy">Fantasy</option>
										<option value="history">History</option>
										<option value="horror">Horror</option>
										<option value="romance">Romance</option>
										<option value="scifi">Sci-Fi</option>
									</Form.Select>
								</div>
								<div className="d-flex align-items-center">
									<p className="mb-1 me-2">Books per page:</p>
									<Form.Control
										type="number"
										min="4"
										max="100"
										value={booksPerPage}
										step={4}
										onChange={(e) => setBooksPerPage(parseInt(e.target.value))}
									/>
								</div>
							</div>
						</div>
					</Col>
				</Row>
				<Row>
					<Col className="search-bar">
						<IoSearch />
						<Form.Control
							type="search"
							placeholder="Search for a book"
							value={search}
							onChange={(e) => {
								setSearch(e.target.value);
							}}
						/>
					</Col>
				</Row>
				<Row>
					<Col xs={12} md={6} lg={8}>
						{renderPagination()}
						<Row className="g-3">{renderBooks()}</Row>
						{renderPagination()}
					</Col>
					<Col xs={12} md={6} lg={4} className="mt-4">
						<Reviews reviewBook={reviewBook} />
					</Col>
				</Row>
			</Container>
		</>
	);
};

export default AllTheBooks;
