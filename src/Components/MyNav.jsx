import React from 'react'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'

function MyNav() {
	return (
		<Navbar collapseOnSelect expand='lg' className='bg-body-tertiary'>
			<Container>
				<Navbar.Brand href='#home'>EpiBooks</Navbar.Brand>
				<Navbar.Toggle aria-controls='responsive-navbar-nav' />
				<Navbar.Collapse id='responsive-navbar-nav' className='justify-content-end'>
					<Nav>
						<Nav.Link href='#features'>Home</Nav.Link>
						<Nav.Link href='#pricing'>About</Nav.Link>
						<Nav.Link href='#pricing'>Browse</Nav.Link>
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	)
}

export default MyNav
