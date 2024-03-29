import React, { useState, useRef, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import {
	IoCartOutline,
	IoHeartOutline,
	IoHeart,
	IoStarOutline,
} from "react-icons/io5";
import Placeholder from "react-bootstrap/Placeholder";
import { BookInterfce } from "./types";

interface SingleBookProps {
	book: BookInterfce;
	selectedBooks: Set<string>;
	setSelectedBooks: (selectedBooks: Set<string>) => void;
	setReviews: (reviews: any) => void;
}

interface customStleProperties extends React.CSSProperties {
	"--img": string;
}

const SingleBook = ({
	setSelectedBooks,
	book,
	selectedBooks,
	setReviews,
}: SingleBookProps) => {
	const { img, title, price, asin, category } = book;
	const [selected, setSelected] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const imageRef = useRef();

	const updateSelected = (selectedParam) => {
		if (selectedParam) {
			selectedBooks.add(book.asin);
		} else {
			selectedBooks.delete(book.asin);
		}
		setSelectedBooks(selectedBooks);
		localStorage.setItem("selectedBooks", JSON.stringify([...selectedBooks]));
	};
	useEffect(() => {
		if (selectedBooks.size > 0 && selectedBooks.has(book.asin)) {
			setSelected(true);
		} else {
			setSelected(false);
		}
	}, [book.asin, selectedBooks]);

	const toggleSelected = () => {
		setSelected(!selected);
		updateSelected(!selected);
	};

	const isSelected = () => {
		return selected;
	};

	return (
		<Card
			className={
				"h-100 bg-body-secondary border-2" +
				(isSelected() ? " border-danger" : "")
			}
			role="card"
		>
			<div
				className={"img-card-wrapper" + (isLoading ? " loading" : "")}
				onClick={() => {
					toggleSelected();
				}}
				style={{ ["--img" as string]: "url('" + img + "')" }}
			>
				<Placeholder
					as="div"
					animation="wave"
					className="img-card-placeholder"
					style={{
						opacity: !isLoading ? 0 : 1,
						zIndex: !isLoading ? -1 : 10,
					}}
				>
					<Placeholder xs={12} />
				</Placeholder>
				<Card.Img
					variant="top"
					src={img}
					alt={title}
					className="card-img-fixed-height p-2"
					style={{ opacity: isLoading ? 0 : 1 }}
					onLoad={() => {
						setIsLoading(false);
					}}
					loading="lazy"
				/>
			</div>
			<Card.Body className="d-flex flex-column">
				<Card.Title>{title}</Card.Title>
				<div className="text-primary h4 flex-grow-1">€ {price}</div>
				<Card.Text>
					Category: {category.charAt(0).toUpperCase() + category.slice(1)}
				</Card.Text>
				<Card.Text>ASIN: {asin}</Card.Text>
				<div className="d-flex justify-content-between column-gap-3 mb-2">
					<Button variant="primary" className="w-100">
						<IoCartOutline /> Add to cart
					</Button>
					<Button
						variant={!isSelected() ? "outline-danger" : "danger"}
						onClick={() => toggleSelected()}
					>
						{isSelected() ? (
							<IoHeart title="Remove from wishlist" />
						) : (
							<IoHeartOutline title="Add to wishlist" />
						)}
					</Button>
				</div>
				<Button
					onClick={() => {
						setReviews(book);
					}}
					variant="warning"
					className="d-flex justify-content-center align-items-center"
				>
					<IoStarOutline className="me-2" />
					Reviews
				</Button>
			</Card.Body>
		</Card>
	);
};

export default SingleBook;
