import React, { Component } from 'react'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import { getMostRecurrentColor } from '../tools'
import { IoCartOutline, IoHeartOutline, IoHeart } from 'react-icons/io5'

class SingleBook extends Component {
	state = {
		bgColor: 'transparent',
		selected: false,
	}

	constructor(props) {
		super(props)
		// Creazione della reference
		this.imageRef = React.createRef()
	}

	setBgColor = color => {
		this.setState({
			bgColor: color,
		})
	}

	changeBgColor = () => {
		const img = this.imageRef.current
		// console.log(img)
		if (img !== null) {
			const mostRecurrentColor = getMostRecurrentColor(this.imageRef.current)
			this.setBgColor(mostRecurrentColor)
		}
	}

	toggleSelected = () => {
		this.setState({ selected: !this.state.selected })
	}
	render() {
		const { img, title, price, asin, category } = this.props.book
		return (
			<Card
				className={
					'h-100 bg-body-secondary border-2' + (this.state.selected ? ' border-danger' : '')
				}
			>
				<div
					className='img-card-wrapper'
					onClick={() => {
						this.toggleSelected()
					}}
					style={{ '--img': "url('" + img + "')" }}
				>
					<Card.Img
						variant='top'
						src={img}
						alt={title}
						className='card-img-fixed-height p-2'
						style={{ backgroundColor: this.props.bgColor }}
						ref={this.imageRef}
						// onLoad={this.changeBgColor()}
						crossOrigin='anonymous'
					/>
				</div>
				<Card.Body className='d-flex flex-column'>
					<Card.Title>{title}</Card.Title>
					<div className='text-primary h4 flex-grow-1'>€ {price}</div>
					<Card.Text>Category: {category.charAt().toUpperCase() + category.slice(1)}</Card.Text>
					<Card.Text>ASIN: {asin}</Card.Text>
					<div className='d-flex justify-content-between column-gap-3'>
						<Button variant='primary' className='w-100'>
							<IoCartOutline /> Add to cart
						</Button>
						<Button
							variant={!this.state.selected ? 'outline-danger' : 'danger'}
							onClick={() => this.toggleSelected()}
						>
							{this.state.selected ? <IoHeart /> : <IoHeartOutline />}
						</Button>
					</div>
				</Card.Body>
			</Card>
		)
	}
}

export default SingleBook
