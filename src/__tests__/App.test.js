import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { info } from 'console'
import App from '../App'

describe('initial mounting', () => {
	it('renders welcome message', () => {
		render(<App />)
		const alertElement = screen.getByText(/Welcome on the EpiBooks website!/i)
		expect(alertElement).toBeInTheDocument()
		expect(alertElement.tagName).toBe('DIV')
		expect(alertElement).toHaveClass('alert alert-info')
	})

	it('renders the correct number of cards', () => {
		render(<App />)
		const cards = screen.getAllByRole('card')
		expect(cards).toHaveLength(12)
	})

	it('renders the comment section', () => {
		render(<App />)
		const reviewButtons = screen.getAllByText(/reviews/i)

		expect(reviewButtons).toHaveLength(12)
		reviewButtons.forEach(button => {
			expect(button).toBeInTheDocument()
			expect(button.tagName).toBe('BUTTON')
			expect(button).toHaveClass('btn btn-warning')
		})

		fireEvent.click(reviewButtons[0])

		const commentSectionTitle = screen.getByText(/Reviews for:/i)
		expect(commentSectionTitle).toBeInTheDocument()
		expect(commentSectionTitle.tagName).toBe('H5')

		const adNewReviewTitle = screen.getByText(/Add new review/i)
		expect(adNewReviewTitle).toBeInTheDocument()
		expect(adNewReviewTitle.tagName).toBe('H4')
	})
})

describe('filtering', () => {
	it('filters by genre', () => {
		render(<App />)
		const genreSelect = screen.getByRole('combobox')
		expect(genreSelect).toBeInTheDocument()

		const expectdOptions = ['All', 'Fantasy', 'History', 'Horror', 'Romance', 'Sci-Fi']

		const options = screen.getAllByRole('option')
		expect(options).toHaveLength(6)
		options.forEach(async (option, i) => {
			expect(option).toBeInTheDocument()
			expect(option.tagName).toBe('OPTION')
			expect(option).toHaveTextContent(expectdOptions[i])

			fireEvent.change(genreSelect, { target: { value: expectdOptions[i] } })
			expect(genreSelect).toHaveTextContent(expectdOptions[i])

			if (expectdOptions[i] === 'All') {
				return
			}

			await waitFor(() => {
				const cardsCategory = screen.getAllByText(/category:/i)
				expect(cardsCategory).toHaveLength(12)
				cardsCategory.forEach(card => {
					const category = card.textContent.split(': ')[1].toLocaleLowerCase()
					expect(category.includes(expectdOptions[i].toLowerCase())).toBe(true)
				})
			})
		})
	})

	it('filters by search', async () => {
		render(<App />)
		const searchInput = screen.getByPlaceholderText(/Search for a book/i)
		expect(searchInput).toBeInTheDocument()
		expect(searchInput.value).toBe('')

		fireEvent.change(searchInput, { target: { value: 'The Witcher' } })
		expect(searchInput.value).toBe('The Witcher')
		// await waitFor(() => {
		// info('new value', searchInput.value)
		// })

		// const cards = await screen.findAllByRole('card')
		// expect(cards).toHaveLength(3)
	})
})
