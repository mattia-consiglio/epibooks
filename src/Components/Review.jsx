import React from 'react'
import StarRating from './StarRating'
import { IoTrash } from 'react-icons/io5'
import Button from 'react-bootstrap/Button'

function Review({ review, api, getReviews }) {
	const { comment, rate, author } = review
	return (
		<div className='review-container'>
			<div className='review-body'>
				<StarRating rating={parseInt(rate)} canChange={false} />
				<div className='text-wrap w-100'>{author}</div>
				<div className='text-wrap w-100'>{comment}</div>
			</div>
			<Button
				variant='danger'
				onClick={() => {
					api({ method: 'DELETE', id: review._id, callback: () => getReviews() })
				}}
			>
				<IoTrash />
			</Button>
		</div>
	)
}

export default Review
