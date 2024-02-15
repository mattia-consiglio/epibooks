import {
	fireEvent,
	render,
	screen,
	waitFor,
	within,
} from "@testing-library/react";
import { expect, test, describe } from "vitest";
import AllTheBooks from "../Components/AllTheBooks";
import SingleBook from "../Components/SingleBook";
import fantasyBooks from "../data/fantasy.json";

const firstLetterToUpperCase = (str) => {
	return str.charAt().toUpperCase() + str.slice(1);
};

describe("initial mounting", () => {
	test("renders welcome message", () => {
		render(<AllTheBooks />);
		const alertElement = screen.getByText(/Welcome on the EpiBooks website!/i);
		expect(alertElement).toBeInTheDocument();
		expect(alertElement.tagName).toBe("DIV");
		expect(alertElement).toHaveClass("alert alert-info");
	});

	test("renders the correct number of cards", () => {
		render(<AllTheBooks />);
		const cards = screen.getAllByRole("card");
		expect(cards).toHaveLength(12);
	});

	test("renders the comment section", () => {
		render(<AllTheBooks />);
		const reviewButtons = screen.getAllByText(/reviews/i);

		expect(reviewButtons).toHaveLength(12);
		reviewButtons.forEach((button) => {
			expect(button).toBeInTheDocument();
			expect(button.tagName).toBe("BUTTON");
			expect(button).toHaveClass("btn btn-warning");
		});

		fireEvent.click(reviewButtons[0]);

		const commentSectionTitle = screen.getByText(/Reviews for:/i);
		expect(commentSectionTitle).toBeInTheDocument();
		expect(commentSectionTitle.tagName).toBe("H5");

		const adNewReviewTitle = screen.getByText(/Add new review/i);
		expect(adNewReviewTitle).toBeInTheDocument();
		expect(adNewReviewTitle.tagName).toBe("H4");
	});
});

describe("filtering", () => {
	test("filters by genre", () => {
		render(<AllTheBooks />);
		const genreSelect = screen.getByRole("combobox");
		expect(genreSelect).toBeInTheDocument();

		const expectdOptions = [
			"All",
			"Fantasy",
			"History",
			"Horror",
			"Romance",
			"Sci-Fi",
		];

		const options = screen.getAllByRole("option");
		expect(options).toHaveLength(6);
		options.forEach(async (option, i) => {
			expect(option).toBeInTheDocument();
			expect(option.tagName).toBe("OPTION");
			expect(option).toHaveTextContent(expectdOptions[i]);

			fireEvent.change(genreSelect, { target: { value: expectdOptions[i] } });
			expect(genreSelect).toHaveTextContent(expectdOptions[i]);

			if (expectdOptions[i] === "All") {
				return;
			}

			await waitFor(() => {
				const cardsCategory = screen.getAllByText(/category:/i);
				expect(cardsCategory).toHaveLength(12);
				cardsCategory.forEach((card) => {
					const category = card.textContent.split(": ")[1].toLocaleLowerCase();
					expect(category.includes(expectdOptions[i].toLowerCase())).toBe(true);
				});
			});
		});
	});

	test("filters by search", async () => {
		render(<AllTheBooks />);
		const searchInput = screen.getByPlaceholderText(/Search for a book/i);
		expect(searchInput).toBeInTheDocument();
		expect(searchInput.value).toBe("");

		fireEvent.input(searchInput, { target: { value: "The Witcher" } });
		expect(searchInput.value).toBe("The Witcher");

		const cards = screen.getAllByRole("card");
		expect(cards).toHaveLength(3);

		fireEvent.change(searchInput, {
			target: { value: "abcdefghijklmnopqrstuvwxyz" },
		});
		expect(searchInput.value).toBe("abcdefghijklmnopqrstuvwxyz");

		const warningAlert = screen.getByText(/No books found for:/i);
		expect(warningAlert).toBeInTheDocument();
		expect(warningAlert.tagName).toBe("DIV");
		expect(warningAlert).toHaveClass("alert alert-warning");
		expect(warningAlert).toHaveTextContent(
			/No books found for: abcdefghijklmnopqrstuvwxyz/i,
		);
	});
});

describe("unit tests", () => {
	test("renders a book", () => {
		const book = fantasyBooks[0];
		let selectedBooks = new Set();
		const setSelectedBooks = (books) => {
			selectedBooks = new Set(books);
		};

		render(
			<SingleBook
				selectedBooks={selectedBooks}
				setSelectedBooks={setSelectedBooks}
				setReviews={() => {}}
				book={book}
			/>,
		);
		const card = screen.getByRole("card");
		expect(card).toBeInTheDocument();
		expect(card.tagName).toBe("DIV");
		expect(card).toHaveClass("card border-2 h-100");
		expect(card).not.toHaveClass("border-danger");

		const image = screen.getByRole("img");
		expect(image).toBeInTheDocument();
		expect(image.tagName).toBe("IMG");
		expect(image).toHaveAttribute("src", book.image);

		const title = screen.getByText(book.title);
		expect(title).toBeInTheDocument();

		const price = screen.getByText("€ " + book.price);
		expect(price).toBeInTheDocument();

		const category = screen.getByText(
			"Category: " + firstLetterToUpperCase(book.category),
		);
		expect(category).toBeInTheDocument();

		const asin = screen.getByText("ASIN: " + book.asin);
		expect(asin).toBeInTheDocument();

		const buttons = screen.getAllByRole("button");
		expect(buttons).toHaveLength(3);

		const addToCartButton = buttons[0];
		const whishlistButton = buttons[1];
		const reviewButton = buttons[2];

		expect(addToCartButton).toHaveTextContent(/add to cart/i);
		expect(addToCartButton.tagName).toBe("BUTTON");
		expect(addToCartButton).toHaveClass("btn btn-primary");
		expect(whishlistButton.tagName).toBe("BUTTON");
		expect(whishlistButton).toHaveClass("btn btn-outline-danger");

		const buttonWithin = within(whishlistButton);
		expect(buttonWithin.getByTitle(/add to wishlist/i)).toBeInTheDocument();

		expect(reviewButton).toHaveTextContent(/reviews/i);
		expect(reviewButton.tagName).toBe("BUTTON");
		expect(reviewButton).toHaveClass("btn btn-warning");

		// click on whislist button and expect the card to be selected
		fireEvent.click(whishlistButton);
		expect(card).toHaveClass("border-danger");
		expect(whishlistButton).toHaveClass("btn-danger");
		expect(whishlistButton).not.toHaveClass("btn-outline-danger");
		expect(
			buttonWithin.getByTitle(/remove from wishlist/i),
		).toBeInTheDocument();

		// click on whislist button and expect the card to be unselected
		fireEvent.click(whishlistButton);
		expect(card).not.toHaveClass("border-danger");
		expect(whishlistButton).toHaveClass("btn-outline-danger");
		expect(whishlistButton).not.toHaveClass("btn-danger");
		expect(buttonWithin.getByTitle(/add to wishlist/i)).toBeInTheDocument();

		// click on image and expect the card to be selected
		fireEvent.click(image);
		expect(card).toHaveClass("border-danger");
		expect(whishlistButton).toHaveClass("btn-danger");
		expect(whishlistButton).not.toHaveClass("btn-outline-danger");
		expect(
			buttonWithin.getByTitle(/remove from wishlist/i),
		).toBeInTheDocument();

		// click on image and expect the card to be unselected
		fireEvent.click(image);
		expect(card).not.toHaveClass("border-danger");
		expect(whishlistButton).toHaveClass("btn-outline-danger");
		expect(whishlistButton).not.toHaveClass("btn-danger");
		expect(buttonWithin.getByTitle(/add to wishlist/i)).toBeInTheDocument();
	});
});
