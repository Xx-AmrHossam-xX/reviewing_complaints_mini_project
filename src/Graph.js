import React from 'react';
import styled from 'styled-components';

//STYLED COMPONENTS

const GraphTopContainer = styled.div`
	border: 5px solid black;
	width: 400px;
	height: 400px;
	position: absolute;
	margin-left: auto;
	margin-right: auto;
	left: 0;
	right: 0;
`;
const VerticalAxis = styled.ul`
	list-style: none;
	position: absolute;
	padding: 0;
	margin: 0px;
	left: -20px;
	height: 75%;
	bottom: 0px;
`;
const VerticalAxisValue = styled.li`height: 33%;`;
const HorizontalAxis = styled.div`
	position: absolute;
	bottom: -20px;
	left: 2%;
	right: 0px;
`;
const HorizontalAxisQuestionContainer = styled.div`
	position: absolute;
	left: 0px;
	right: 0px;
`;
const HorizontalAxisValues = styled.div`
	display: inline-block;
	width: 10%;
	position: relative;
	left: 14px;
`;
const HorizontalAxisComparedValues = styled.div`
	display: inline-block;
	width: 10%;
`;
const ErrorMsg = styled.h2`
	background-color: red;
	color: white;
	margin: 10%;
	text-align: center;
	padding: 15px;
`;

function Graph (props){
	const {
		NoReviews,
		XAxisQuestionTwoAverageValues,
		XAxisQuestionFourAverageValues,
		ApiError,
		ApiErrorSecRequest
	} = props;
	const BadQuestionHeight = 100;
	const NeutralQuestionHeight = 200;
	const GoodQuestionHeight = 300;
	const BetterQuestionHeight = 400;

	return (
		<section className="MainContainer Graph">
			<h3>Graph</h3>

			<GraphTopContainer>
				{ApiError || ApiErrorSecRequest ? (
					<ErrorMsg>
						Something Went Wrong , try to check your internet connection or restarting the webpage
					</ErrorMsg>
				) : NoReviews ? (
					<ErrorMsg>Sorry No Reviews</ErrorMsg>
				) : null}
				<VerticalAxis>
					<VerticalAxisValue>1</VerticalAxisValue>
					<VerticalAxisValue>0</VerticalAxisValue>
					<VerticalAxisValue>-1</VerticalAxisValue>
				</VerticalAxis>
				<HorizontalAxis>
					<HorizontalAxisQuestionContainer>
						{!ApiError && !ApiErrorSecRequest && !NoReviews && XAxisQuestionFourAverageValues ? (
							XAxisQuestionFourAverageValues.map((item, key) => (
								<HorizontalAxisValues key={key}>
									4
									<div
										style={{
											width: 10,
											background: 'green',
											position: 'absolute',
											bottom: 38,
											height:
												item === -1
													? BadQuestionHeight
													: item === 0
														? NeutralQuestionHeight
														: item === 1 ? GoodQuestionHeight : BetterQuestionHeight
										}}
									/>
								</HorizontalAxisValues>
							))
						) : null}
					</HorizontalAxisQuestionContainer>
					<HorizontalAxisQuestionContainer>
						{!ApiError && !ApiErrorSecRequest && !NoReviews && XAxisQuestionTwoAverageValues ? (
							XAxisQuestionTwoAverageValues.map((item, key) => (
								<HorizontalAxisComparedValues key={key}>
									2
									<div
										style={{
											width: 10,
											background: 'red',
											position: 'absolute',
											bottom: 38,
											height:
												item === -1
													? BadQuestionHeight
													: item === 0
														? NeutralQuestionHeight
														: item === 1 ? GoodQuestionHeight : BetterQuestionHeight
										}}
									/>
								</HorizontalAxisComparedValues>
							))
						) : null}
					</HorizontalAxisQuestionContainer>
				</HorizontalAxis>
			</GraphTopContainer>
		</section>
	);
}
export default Graph;
