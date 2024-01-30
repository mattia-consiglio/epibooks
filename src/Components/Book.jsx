import React from 'react'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'

function Book(props) {
	const { img, title, price, asin, category } = props.book
	return (
		<Card className='h-100 bg-body-secondary'>
			<Card.Img variant='top' src={img} alt={title} />
			<Card.Body className='d-flex flex-column'>
				<Card.Title>{title}</Card.Title>
				<div className='text-primary h4 flex-grow-1'>{price}</div>
				<Card.Text>Category: {category.charAt().toUpperCase() + category.slice(1)}</Card.Text>
				<Card.Text>ASIN: {asin}</Card.Text>
				<Button variant='primary'>
					<i class='bi bi-cart'></i> Add to cart
				</Button>
			</Card.Body>
		</Card>
	)
}

export default Book
