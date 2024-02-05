import React, { Component } from 'react'
import Container from 'react-bootstrap/Container'
import Alert from 'react-bootstrap/Alert'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import SingleBook from './SingleBook'
import MyPagination from './MyPagination'
import Reviews from './Reviews'
import { IoSearch } from 'react-icons/io5'

import fantasyBooks from '../data/fantasy.json'
import historyBooks from '../data/history.json'
import horrorBooks from '../data/horror.json'
import romanceBooks from '../data/romance.json'
import scifiBooks from '../data/scifi.json'

class AllTheBooks extends Component {
	bookGenres = {
		// all: this.mergeBooks(),
		fantasy: fantasyBooks,
		history: historyBooks,
		horror: horrorBooks,
		romance: romanceBooks,
		scifi: scifiBooks,
	}

	mergeBooks() {
		const books = []
		for (let genre in this.bookGenres) {
			if (genre === 'all') {
				continue
			}
			const genreBooks = this.bookGenres[genre]
			if (genreBooks.length > 0) {
				genreBooks.forEach(book => {
					const index = books.length ? books.findIndex(b => b.asin === book.asin) : -1
					if (index === -1) {
						books.push(book)
					} else {
						const categories = books[index].category.split(', ')
						const newCategory = book.category.charAt().toUpperCase() + book.category.slice(1)
						if (!categories.includes(newCategory)) {
							categories.push(newCategory)
							books[index].category = categories.join(', ')
						}
					}
				})
			}
		}
		return books
	}

	state = {
		currentBooksList: [],
		filterdBooksList: [],
		currentPage: 1,
		booksPerPage: 12,
		pageCount: 1,
		search: '',
		selectedBooks: new Set(),
		modal: { show: false, content: null },
	}

	componentDidMount() {
		this.bookGenres.all = this.mergeBooks()
		this.setState(prevState => {
			return {
				currentBooksList: this.bookGenres.all,
				filterBooks: this.bookGenres.all,
			}
		})
		this.setPageCount()
		const localStorageBooks = localStorage.getItem('selectedBooks')
		if (localStorageBooks) {
			JSON.parse(localStorageBooks).forEach(book => {
				this.state.selectedBooks.add(book)
			})
			this.setState(prevState => {
				return { selectedBooks: this.state.selectedBooks }
			})
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if (
			prevState.filterdBooksList !== this.state.filterdBooksList ||
			prevState.booksPerPage !== this.state.booksPerPage
		) {
			this.setPageCount()
		}
		if (
			prevState.search !== this.state.search ||
			prevState.currentBooksList !== this.state.currentBooksList ||
			prevState.booksPerPage !== this.state.booksPerPage
		) {
			this.filterBooks()
		}
	}

	setPageCount() {
		this.setState(prevState => {
			const totalBooks = this.state.filterdBooksList.length
			const pageCount = Math.ceil(totalBooks / this.state.booksPerPage)

			return {
				pageCount,
			}
		})
	}

	setCurrentPage = newPage => {
		this.setState(prevState => {
			const { pageCount } = prevState
			const currentPage = Math.max(Math.min(newPage, pageCount), 1)
			return {
				currentPage,
			}
		})
	}

	changeGenre = e => {
		this.setState(prevState => {
			const selectedGenre = e.target.value
			return {
				currentBooksList: this.bookGenres[selectedGenre] || [],
				currentPage: 1,
			}
		})
	}

	filterBooks() {
		const search = this.state.search.toLowerCase().trim()
		const books = this.state.currentBooksList
		let filteredBooks = []
		if (search !== '') {
			filteredBooks = books.filter(book => {
				const bookTitle = book.title.toLowerCase().trim()
				const bookAsin = book.asin.toLowerCase().trim()

				return bookTitle.includes(search) || bookAsin.includes(search)
			})
		} else {
			filteredBooks = books
		}
		this.setState(prevState => {
			return {
				filterdBooksList: filteredBooks,
				currentPage: 1,
			}
		})
	}

	setShowModal(show) {
		this.setState(prevState => {
			return {
				modal: {
					...prevState.modal,
					show,
				},
			}
		})
	}

	setModalContent(content) {
		this.setState(prevState => {
			return {
				modal: {
					...prevState.modal,
					content,
				},
			}
		})
	}

	constructor(props) {
		super(props)
		this.setShowModal = this.setShowModal.bind(this)
		this.setModalContent = this.setModalContent.bind(this)
	}

	renderBooks() {
		const { filterdBooksList, currentPage, booksPerPage } = this.state
		const startIndex = currentPage * booksPerPage - booksPerPage
		const endIndex = startIndex + booksPerPage
		if (filterdBooksList.length === 0) {
			return (
				<Col>
					<Alert variant='warning'>
						No books found for: <b>{this.state.search}</b>
					</Alert>
				</Col>
			)
		}
		return filterdBooksList.slice(startIndex, endIndex).map(book => (
			<Col key={book.asin} xs={12} md={12} lg={6} xl={4}>
				<SingleBook
					book={book}
					selectedBooks={this.state.selectedBooks}
					setSelectedBooks={this.setSelectedBooks}
					setShowModal={this.setShowModal}
					setModalContent={this.setModalContent}
				/>
			</Col>
		))
	}
	renderPagination() {
		return (
			<Row className='mt-4'>
				<Col className='d-flex justify-content-center'>
					<MyPagination
						pageCount={this.state.pageCount}
						currentPage={this.state.currentPage}
						setCurrentPage={this.setCurrentPage}
					/>
				</Col>
			</Row>
		)
	}

	setSelectedBooks = selectedBooks => {
		this.setState({
			selectedBooks,
		})
	}

	render() {
		return (
			<>
				<Container className='my-4'>
					<Row>
						<Col xs={12}>
							<Alert variant='info'>Welcome on the EpiBooks website!</Alert>
							<div className='d-flex column-gap-3 mb-4 justify-content-between align-items-center flex-wrap'>
								<h1>Books</h1>
								<div className='d-flex align-items-center column-gap-3'>
									<div className='d-flex align-items-center'>
										<p className='mb-1 me-2'>Genre:</p>
										<Form.Select
											aria-label='Select genre'
											onChange={e => this.changeGenre(e)}
											defaultValue='all'
										>
											<option value='all'>All</option>
											<option value='fantasy'>Fantasy</option>
											<option value='history'>History</option>
											<option value='horror'>Horror</option>
											<option value='romance'>Romance</option>
											<option value='scifi'>Sci-Fi</option>
										</Form.Select>
									</div>
									<div className='d-flex align-items-center'>
										<p className='mb-1 me-2'>Books per page:</p>
										<Form.Control
											type='number'
											min='4'
											max='100'
											value={this.state.booksPerPage}
											step={4}
											onChange={e => this.setState(prevState => ({ booksPerPage: e.target.value }))}
										/>
									</div>
								</div>
							</div>
						</Col>
					</Row>
					<Row>
						<Col className='search-bar'>
							<IoSearch />
							<Form.Control
								type='search'
								placeholder='Search for a book'
								value={this.state.search}
								onInput={e => {
									this.setState(prevState => {
										return { search: e.target.value }
									})
								}}
							/>
						</Col>
					</Row>
					{this.renderPagination()}
					<Row>
						<Col xs={12} md={6} lg={8}>
							<Row className='g-3'>{this.renderBooks()}</Row>
						</Col>
						<Col xs={12} md={6} lg={4}>
							<Reviews
								setShowModal={this.setShowModal}
								show={this.state.modal.show}
								content={this.state.modal.content}
							/>
						</Col>
					</Row>
					{this.renderPagination()}
				</Container>
			</>
		)
	}
}

export default AllTheBooks
