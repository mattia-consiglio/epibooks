import React, { Component } from 'react'
import Container from 'react-bootstrap/Container'
import Alert from 'react-bootstrap/Alert'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Book from './Book'
import fantasyBooks from '../data/fantasy.json'
import historyBooks from '../data/history.json'
import horrorBooks from '../data/horror.json'
import romanceBooks from '../data/romance.json'
import scifiBooks from '../data/scifi.json'
import MyPagination from './MyPagination'

export class AllTheBooks extends Component {
	// constructor(props) {
	// 	super(props)

	// 	// console.log(this.setPageCount())
	// }
	state = {
		currentBooksList: fantasyBooks,
		currentPage: 1,
		booksPerPage: 12,
		pageCount: 1,
	}

	componentDidMount() {
		// this.setState({ pageCount: this.getPageCount() })
		this.setPageCount(this.getPageCount())
	}

	setPageCount = pageCount => {
		this.setState({
			pageCount,
		})
	}

	setCurrentPage = currentPage => {
		currentPage = Math.max(Math.min(currentPage, this.state.pageCount), 1)
		this.setState({
			currentPage,
		})
	}

	getPageCount(totalItems) {
		const totalBooks = totalItems || this.state.currentBooksList.length
		return Math.ceil(totalBooks / this.state.booksPerPage)
	}

	changeGenre = e => {
		const selectedGenre = e.target.value
		const newBooksList = []
		switch (selectedGenre) {
			case 'fantasy':
				newBooksList.push(...fantasyBooks)
				break
			case 'history':
				newBooksList.push(...historyBooks)
				break
			case 'horror':
				newBooksList.push(...horrorBooks)
				break
			case 'romance':
				newBooksList.push(...romanceBooks)
				break
			case 'scifi':
				newBooksList.push(...scifiBooks)
				break

			default:
				break
		}
		this.setState({
			currentBooksList: newBooksList,
			currentPage: 1,
			pageCount: this.getPageCount(newBooksList.length),
		})
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
				<Row className='g-3'>
					{this.state.currentBooksList
						.slice(
							this.state.currentPage * this.state.booksPerPage - this.state.booksPerPage,
							this.state.currentPage * this.state.booksPerPage
						)
						.map(book => {
							return (
								<Col key={book.asin} xs={12} md={6} lg={4} xl={3}>
									<Book book={book} />
								</Col>
							)
						})}
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
			</Container>
		)
	}
}

export default AllTheBooks
