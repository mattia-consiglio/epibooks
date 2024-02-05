import React, { Component } from 'react'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import { IoCartOutline, IoHeartOutline, IoHeart, IoStarOutline } from 'react-icons/io5'
import Placeholder from 'react-bootstrap/Placeholder'

class SingleBook extends Component {
	state = {
		selected: false,
		isLoading: true,
	}

	constructor(props) {
		super(props)
		// Creazione della reference
		this.imageRef = React.createRef()
	}

	updateSelected(selected = this.state.selected) {
		if (selected) {
			this.props.selectedBooks.add(this.props.book.asin)
		} else {
			this.props.selectedBooks.delete(this.props.book.asin)
		}
		this.props.setSelectedBooks(this.props.selectedBooks)
		localStorage.setItem('selectedBooks', JSON.stringify([...this.props.selectedBooks]))
	}
	componentDidMount() {
		if (this.props.selectedBooks.has(this.props.book.asin)) {
			this.setState({ selected: true })
		}
	}

	toggleSelected = () => {
		this.setState(prevState => {
			const selected = !prevState.selected
			this.updateSelected(selected)
			return { selected }
		})
	}

	isSelected = () => {
		return this.state.selected
	}
	render() {
		const { img, title, price, asin, category } = this.props.book

		return (
			<Card
				className={'h-100 bg-body-secondary border-2' + (this.isSelected() ? ' border-danger' : '')}
			>
				<div
					className={'img-card-wrapper' + (this.state.isLoading ? ' loading' : '')}
					onClick={() => {
						this.toggleSelected()
					}}
					style={{ '--img': "url('" + img + "')" }}
				>
					<Placeholder
						as='div'
						animation='wave'
						className='img-card-placeholder'
						style={{
							opacity: !this.state.isLoading ? 0 : 1,
							zIndex: !this.state.isLoading ? -1 : 10,
						}}
					>
						<Placeholder xs={12} />
					</Placeholder>
					<Card.Img
						variant='top'
						src={img}
						alt={title}
						className='card-img-fixed-height p-2'
						ref={this.imageRef}
						style={{ opacity: this.state.isLoading ? 0 : 1 }}
						onLoad={() => {
							this.setState({ isLoading: false })
						}}
					/>
				</div>
				<Card.Body className='d-flex flex-column'>
					<Card.Title>{title}</Card.Title>
					<div className='text-primary h4 flex-grow-1'>€ {price}</div>
					<Card.Text>Category: {category.charAt().toUpperCase() + category.slice(1)}</Card.Text>
					<Card.Text>ASIN: {asin}</Card.Text>
					<div className='d-flex justify-content-between column-gap-3 mb-2'>
						<Button variant='primary' className='w-100'>
							<IoCartOutline /> Add to cart
						</Button>
						<Button
							variant={!this.isSelected() ? 'outline-danger' : 'danger'}
							onClick={() => this.toggleSelected()}
						>
							{this.isSelected() ? <IoHeart /> : <IoHeartOutline />}
						</Button>
					</div>
					<Button
						onClick={() => {
							this.props.setShowModal(true)
							this.props.setModalContent(this.props.book)
						}}
						variant='warning'
						className='d-flex justify-content-center align-items-center'
					>
						<IoStarOutline className='me-2' />
						Reviews
					</Button>
				</Card.Body>
			</Card>
		)
	}
}

export default SingleBook
