import 'bootstrap/dist/css/bootstrap.min.css'
import MyNav from './Components/MyNav'
import MyFooter from './Components/MyFooter'
import AllTheBooks from './Components/AllTheBooks'

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
		</>
	)
}

export default App
