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

export class AllTheBooks extends Component {
	state = {
		currentBooksList: fantasyBooks,
	}

	changeGenre = e => {
		const selectedGenre = e.target.value
		switch (selectedGenre) {
			case 'fantasy':
				this.setState({ currentBooksList: fantasyBooks })
				break
			case 'history':
				this.setState({ currentBooksList: historyBooks })
				break
			case 'horror':
				this.setState({ currentBooksList: horrorBooks })
				break
			case 'romance':
				this.setState({ currentBooksList: romanceBooks })
				break
			case 'scifi':
				this.setState({ currentBooksList: scifiBooks })
				break

			default:
				break
		}
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
					{this.state.currentBooksList.map(book => {
						return (
							<Col key={book.asin} xs={12} md={6} lg={4} xl={3}>
								<Book
									img={book.img}
									title={book.title}
									price={book.price}
									asin={book.asin}
									category={book.category}
								/>
							</Col>
						)
					})}
				</Row>
			</Container>
		)
	}
}

export default AllTheBooks
