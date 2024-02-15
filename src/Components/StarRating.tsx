import React from "react";
import { useState } from "react";
import { IoStar, IoStarOutline } from "react-icons/io5";

interface StarRatingProps {
	rating: number;
	canChange: boolean;
	setRating?: (rating: number) => void;
	className?: string;
}

function StarRating({
	rating,
	canChange,
	setRating = () => {},
	className = "",
}: StarRatingProps) {
	const [tempRating, SetTempRating] = useState(rating);

	return (
		<div
			className={
				"rating" +
				(canChange ? " rating-can-change" : "") +
				(className ? " " + className : "")
			}
		>
			{[...Array(5)].map((_, i) => (
				<label
					key={i}
					className={
						"rating-label" + (i + 1 <= rating ? " rating-label-selected" : "")
					}
					onMouseEnter={() => {
						if (canChange) {
							SetTempRating(i + 1);
						}
					}}
					onMouseLeave={() => {
						if (canChange) {
							SetTempRating(rating);
						}
					}}
					onClick={(e) => {
						if (!canChange) return;
						e.preventDefault();
						setRating(i + 1);
						SetTempRating(i + 1);
					}}
				>
					<input
						type="radio"
						id={"star-" + (i + 1)}
						name="rating"
						value={i + 1}
						disabled={!canChange}
						onChange={(e) => {
							setRating(parseInt(e.target.value));
						}}
						checked={i + 1 === tempRating}
						className="rating-input"
					/>
					{i + 1 <= tempRating ? (
						<IoStar
							className="rating-star"
							title={i + 1 === 1 ? `${i + 1} star` : `${i + 1} stars`}
						/>
					) : (
						<IoStarOutline
							className="rating-star"
							title={i + 1 === 1 ? `${i + 1} star` : `${i + 1} stars`}
						/>
					)}
				</label>
			))}
		</div>
	);
}

export default StarRating;
