import Spinner from 'react-bootstrap/Spinner'

function Loading() {
	return (
		<Spinner animation='border' role='status' data-testid='loading'>
			<span className='visually-hidden'>Loading...</span>
		</Spinner>
	)
}

export default Loading
