import { render, screen, waitFor } from '@testing-library/react'
import { Reviews } from './Reviews'
import fantasyBooks from '../data/fantasy.json'

describe('Reviews', () => {
	test('renders loading state', async () => {
		render(<Reviews reviewBook={fantasyBooks[0]} />)

		expect(screen.getByTestId('loading')).toBeInTheDocument()
	})

	test('loads and displays reviews', async () => {
		// Simula una risposta di successo dalla fetch
		jest.spyOn(window, 'fetch').mockResolvedValueOnce(
			new Response(JSON.stringify([{ _id: '1', comment: 'Great book!', rate: 5 }]), {
				status: 200,
			})
		)

		// Renderizza il componente con un reviewBook di test
		render(<Reviews reviewBook={fantasyBooks[0]} />)

		// Verifica che il loading spinner sia mostrato
		expect(screen.getByTestId('loading')).toBeInTheDocument()

		// Attendi che il testo della recensione sia caricato
		await waitFor(() => {
			expect(screen.getByText(/Great book!/i)).toBeInTheDocument()
		})
	})

	test('renders error message on fetch failure', async () => {
		jest.spyOn(window, 'fetch').mockRejectedValueOnce(new Error('Failed to fetch'))

		render(<Reviews reviewBook={fantasyBooks[0]} />)

		expect(await screen.findByRole('alert')).toHaveTextContent(
			/There was an error loading the reviews/i
		)
	})
})
