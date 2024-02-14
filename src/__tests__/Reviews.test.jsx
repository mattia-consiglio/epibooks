import { render, screen, waitFor } from '@testing-library/react'
import { Reviews } from '../Components/Reviews'
import fantasyBooks from '../data/fantasy.json'
import { expect, test, describe, vi, beforeEach } from 'vitest'

beforeEach(() => {
	vi.resetAllMocks()
})

describe('Reviews', () => {
	test('loads and displays reviews', async () => {
		// Simulate a succeded response from the fetch
		vi.spyOn(window, 'fetch').mockResolvedValueOnce(
			new Response(JSON.stringify([{ _id: '1', comment: 'Great book!', rate: 5 }]), {
				status: 200,
			})
		)

		// Render the component with a test reviewBook
		render(<Reviews reviewBook={fantasyBooks[0]} />)

		// Test if the loading spinner is shown
		expect(screen.getByTestId('loading')).toBeInTheDocument()

		// Wait for the text to be rendered
		await waitFor(() => {
			expect(screen.getByText(/Great book!/i)).toBeInTheDocument()
		})

		//test if the loading spinner is hidden
		expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
	})

	test('renders error message on empty reviews', async () => {
		// Simulate an empty response from the fetch
		vi.spyOn(window, 'fetch').mockResolvedValueOnce(
			new Response(JSON.stringify([]), {
				status: 200,
			})
		)

		render(<Reviews reviewBook={fantasyBooks[0]} />)
		//test if the loading spinner is shown
		expect(screen.getByTestId('loading')).toBeInTheDocument()
		//test if the error message is shown
		expect(await screen.findByRole('alert')).toHaveTextContent(/No reviews found/i)

		//test if the loading spinner is hidden
		expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
	})

	test('renders error message on fetch failure', async () => {
		vi.spyOn(window, 'fetch').mockRejectedValueOnce(new Error('Failed to fetch'))

		render(<Reviews reviewBook={fantasyBooks[0]} />)

		//test if the loading spinner is shown
		expect(screen.getByTestId('loading')).toBeInTheDocument()

		//test if the error message is shown
		expect(await screen.findByRole('alert')).toHaveTextContent(
			/There was an error loading the reviews/i
		)

		//test if the loading spinner is hidden
		expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
	})
})
