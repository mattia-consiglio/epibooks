import 'bootstrap/dist/css/bootstrap.min.css'
import './css/App.scss'

// import React from 'react'

import MyNav from './Components/MyNav'
import MyFooter from './Components/MyFooter'
import AllTheBooks from './Components/AllTheBooks'

// import { Analytics } from '@vercel/analytics/react'

function App() {
	return (
		<>
			<header>
				<MyNav />
			</header>
			<main>
				<AllTheBooks />
			</main>
			<footer>
				<MyFooter />
			</footer>
			{/* <Analytics /> */}
		</>
	)
}

export default App
