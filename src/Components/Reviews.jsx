import React, { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import StarRating from './StarRating'
import Form from 'react-bootstrap/Form'
import Review from './Review'
import Loading from './Loading'
import Alert from 'react-bootstrap/Alert'

export const Reviews = ({ reviewBook }) => {
	const [reviews, setReviews] = useState([])
	const [isLoading, setIsLoading] = useState(true)
	const [isError, setIsError] = useState(false)
	const [rating, setRating] = useState(0)
	const [comment, setComment] = useState('')
	const [update, setUpdate] = useState(false)

	const api = async ({ method, id, callback, body }) => {
		setIsLoading(true)
		setIsError(false)
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
				setIsLoading(false)
				return callback(data)
			})
			.catch(err => {
				setIsLoading(false)
				setIsError(true)
			})
	}

	useEffect(() => {
		const getReviews = async () => {
			// console.log('getReviews')
			await api({
				method: 'GET',
				id: reviewBook.asin,
				callback: data => {
					console.log('data', data)
					setReviews(data)
				},
			})
		}

		if (reviewBook !== null) {
			setIsLoading(true)
			setIsError(false)
			setComment('')
			setRating(0)
			getReviews()
		}
	}, [reviewBook, update])

	return (
		<>
			{!reviewBook ? (
				''
			) : (
				<>
					<h5 className='mb-3'>
						Reviews for: <b>{reviewBook.title}</b>
					</h5>
					<div>
						{isLoading === true && <Loading />}
						{isError === true && (
							<Alert variant='danger'>There was an error loading the reviews</Alert>
						)}
						{reviews.length === 0 && !isLoading && !isError && (
							<Alert variant='info'>No reviews found. Be the first to leave one!</Alert>
						)}
						{reviews.map(review => {
							return (
								<Review
									review={review}
									key={review._id}
									api={api}
									setUpdate={setUpdate}
									update={update}
								/>
							)
						})}
					</div>
					<hr />
					<h4>Add new review</h4>
					<StarRating rating={rating} canChange={true} setRating={setRating} className='mb-3' />
					<FloatingLabel controlId='floatingTextarea' label='Comments' className='mb-3'>
						<Form.Control
							as='textarea'
							placeholder='Leave a comment here'
							rows={5}
							value={comment}
							onChange={e => setComment(e.target.value)}
						/>
					</FloatingLabel>
					<Button
						variant='primary'
						onClick={() => {
							api({
								method: 'POST',
								id: '',
								body: {
									comment: comment,
									rate: rating,
									elementId: reviewBook.asin,
								},
								callback: () => {
									setComment('')
									setRating(0)
									setUpdate(!update)
								},
							})
						}}
						disabled={comment.length === 0 || rating === 0}
					>
						Add rewiew
					</Button>
				</>
			)}
		</>
	)
}

export default Reviews
