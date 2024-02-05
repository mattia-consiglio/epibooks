import React, { Component } from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import StarRating from './StarRating'
import Form from 'react-bootstrap/Form'
import Review from './Review'
import Loading from './Loading'
import Alert from 'react-bootstrap/Alert'

export class Reviews extends Component {
	handleClose = () => {
		this.props.setShowModal(false)
	}

	initializeState = {
		reviews: [],
		isLoading: true,
		isError: false,
		rating: 0,
		comment: '',
	}

	state = {
		reviews: [],
		isLoading: true,
		isError: false,
		rating: 0,
		comment: '',
	}

	constructor(props) {
		super(props)
		this.state = this.initializeState
		this.api = this.api.bind(this)
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.content !== null) {
			if (prevProps.content === null || this.props.content.asin !== prevProps.content.asin) {
				this.setState({ isLoading: true, isError: false, comment: '', rating: 0 })
				this.getReviews()
			}
		}
	}

	api({ method, id, callback, body }) {
		this.setState({ isLoading: true, isError: false })
		const options = {
			method: method,
			headers: {
				'Authorization':
					'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWJiOWVhZTViMjYxNTAwMTk4YTY5NDYiLCJpYXQiOjE3MDY3OTQ2NzEsImV4cCI6MTcwODAwNDI3MX0.g8wax-pYMp0IeigF7WBbGbErMj1p0aDu79cS1PGe4UM',
			},
		}
		if (method === 'POST') {
			options.body = JSON.stringify(body)
			options.headers['Content-Type'] = 'application/json'
		}
		return fetch('https://striveschool-api.herokuapp.com/api/comments/' + id, options)
			.then(res => {
				if (res.ok) {
					return res.json()
				} else {
					throw new Error('Something went wrong')
				}
			})
			.then(data => {
				this.setState({ isLoading: false })
				return callback(data)
			})
			.catch(err => {
				this.setState({ isLoading: false, isError: true })
			})
	}

	getReviews = () => {
		this.api({
			method: 'GET',
			id: this.props.content.asin,
			callback: data => this.setState({ reviews: data }),
		})
	}

	setRating = rating => {
		this.setState(prevState => {
			return { rating }
		})
	}

	render() {
		return (
			<>
				{!this.props.content ? (
					''
				) : (
					<>
						<h5 className='mb-3'>
							Reviews for: <b>{this.props.content.title}</b>
						</h5>
						<div>
							{this.state.isLoading === true && <Loading />}
							{this.state.isError === true && (
								<Alert variant='danger'>There was an error loading the reviews</Alert>
							)}
							{this.state.reviews.length === 0 && !this.state.isLoading && (
								<Alert variant='info'>No reviews found. Be the first to leave one!</Alert>
							)}
							{this.state.reviews.map(review => {
								return (
									<Review
										review={review}
										key={review._id}
										api={this.api}
										getReviews={this.getReviews}
									/>
								)
							})}
						</div>
						<hr />
						<h4>Add new review</h4>
						<StarRating
							rating={this.state.rating}
							canChange={true}
							setRating={this.setRating}
							className='mb-3'
						/>
						<FloatingLabel controlId='floatingTextarea' label='Comments' className='mb-3'>
							<Form.Control
								as='textarea'
								placeholder='Leave a comment here'
								rows={5}
								value={this.state.comment}
								onChange={e => this.setState({ comment: e.target.value })}
							/>
						</FloatingLabel>
						<Button
							variant='primary'
							onClick={() => {
								this.api({
									method: 'POST',
									id: '',
									body: {
										comment: this.state.comment,
										rate: this.state.rating,
										elementId: this.props.content.asin,
									},
									callback: () => {
										this.setState({ comment: '', rating: 0 })
										this.getReviews()
									},
								})
							}}
							disabled={this.state.comment.length === 0 || this.state.rating === 0}
						>
							Add rewiew
						</Button>
					</>
				)}
			</>
		)
	}
}

export default Reviews
