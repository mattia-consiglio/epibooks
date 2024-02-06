import React from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

function MyFooter() {
	return (
		<Container>
			<Row>
				<Col className='text-center'>
					<p>&copy; Copyright {new Date().getFullYear()} Mattia Consiglio</p>
				</Col>
			</Row>
		</Container>
	)
}

export default MyFooter
