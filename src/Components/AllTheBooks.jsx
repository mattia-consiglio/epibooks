import React, { Component } from 'react'
import Container from 'react-bootstrap/Container'
import Alert from 'react-bootstrap/Alert'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Book from './Book'
import MyPagination from './MyPagination'

import fantasyBooks from '../data/fantasy.json'
import historyBooks from '../data/history.json'
import horrorBooks from '../data/horror.json'
import romanceBooks from '../data/romance.json'
import scifiBooks from '../data/scifi.json'

const bookGenres = {
	fantasy: fantasyBooks,
	history: historyBooks,
	horror: horrorBooks,
	romance: romanceBooks,
	scifi: scifiBooks,
}

export class AllTheBooks extends Component {
	state = {
		currentBooksList: fantasyBooks,
		currentPage: 1,
		booksPerPage: 12,
		pageCount: 1,
	}

	componentDidMount() {
		this.setPageCount()
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevState.currentBooksList !== this.state.currentBooksList) {
			this.setPageCount()
		}
	}

	setPageCount() {
		this.setState(prevState => {
			const totalBooks = this.state.currentBooksList.length
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
				currentBooksList: bookGenres[selectedGenre] || [],
				currentPage: 1,
			}
		})
	}

	renderBooks() {
		const { currentBooksList, currentPage, booksPerPage } = this.state
		const startIndex = currentPage * booksPerPage - booksPerPage
		const endIndex = startIndex + booksPerPage
		return currentBooksList.slice(startIndex, endIndex).map(book => (
			<Col key={book.asin} xs={12} md={6} lg={4} xl={3}>
				<Book book={book} />
			</Col>
		))
	}

	render() {
		return (
			<Container className='my-4'>
				<Row>
					<Col xs={12}>
						<Alert variant='info'>Welcome on the EpiBooks website!</Alert>
						<div className='d-flex column-gap-3 mb-4 justify-content-between align-items-center flex-wrap'>
							<h1>Books</h1>
							<div className='d-flex align-items-center'>
								<p className='mb-1 me-2'>Genre:</p>
								<Form.Select
									aria-label='Select genre'
									onChange={e => this.changeGenre(e)}
									defaultValue='fantasy'
								>
									<option value='fantasy'>Fantasy</option>
									<option value='history'>History</option>
									<option value='horror'>Horror</option>
									<option value='romance'>Romance</option>
									<option value='scifi'>Sci-Fi</option>
								</Form.Select>
							</div>
						</div>
					</Col>
				</Row>
				<Row className='mt-4'>
					<Col className='d-flex justify-content-center'>
						<MyPagination
							pageCount={this.state.pageCount}
							currentPage={this.state.currentPage}
							setCurrentPage={this.setCurrentPage}
						/>
					</Col>
				</Row>
				<Row className='g-3'>{this.renderBooks()}</Row>
				<Row className='mt-4'>
					<Col className='d-flex justify-content-center'>
						<MyPagination
							pageCount={this.state.pageCount}
							currentPage={this.state.currentPage}
							setCurrentPage={this.setCurrentPage}
						/>
					</Col>
				</Row>
			</Container>
		)
	}
}

export default AllTheBooks
