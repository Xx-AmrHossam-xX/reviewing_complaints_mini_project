//React
import { useState, useEffect } from 'react';
//Libraries
import Axios from './Axios';
import InfiniteCalendar from 'react-infinite-calendar';
import 'react-infinite-calendar/styles.css';
//Other Components
import Graph from './Graph';
//Css
import './App.css';

function App (){
	//Obtain Question two and four data
	const [ QuestionTwoChoices, SetQuestionTwoChoices ] = useState();
	const [ QuestionFourChoices, SetQuestionFourChoices ] = useState();
	//Get the value of Good,Neutral and Bad of Question Two
	const [ QuestTwoGood, SetQuestTwoGood ] = useState();
	const [ QuestTwoNeutral, SetQuestTwoNeutral ] = useState();
	const [ QuestTwoBad, SetQuestTwoBad ] = useState();
	//Get the value of Good,Neutral and Bad of Question Four
	const [ QuestFourGood, SetQuestFourGood ] = useState();
	const [ QuestFourNeutral, SetQuestFourNeutral ] = useState();
	const [ QuestFourBad, SetQuestFourBad ] = useState();
	// The Input Values of the calenders
	const [ FromDate, SetFromDate ] = useState(new Date());
	const [ ToDate, SetToDate ] = useState(new Date());
	//Determine if there is no reviews or not
	const [ NoReviews, SetNoReviews ] = useState(false);
	//Determine if there is something wrong with any API
	const [ ApiError, SetApiError ] = useState(false);
	const [ ApiErrorSecRequest, SetApiErrorSecRequest ] = useState(false);
	//All Choices of Question 2 and 4
	const [ QuestionTwoChoicesArray, SetQuestionTwoChoicesArray ] = useState();
	const [ QuestionFourChoicesArray, SetQuestionFourChoicesArray ] = useState();
	//Horizontal Points with reference to the width of the device
	const [ MaxHorizontalPoints, SetMaxHorizontalPoints ] = useState(
		window.innerWidth >= 992 ? 10 : window.innerWidth >= 768 ? 6 : 4
	);
	//The arrays which contain the ids of the questions
	const [ XAxisQuestionFourIDArray, SetXAxisQuestionFourIDArray ] = useState([]);
	const [ XAxisQuestionTwoIDArray, SetXAxisQuestionTwoIDArray ] = useState([]);
	// Average Values of each Question on each point of the Xaxis
	const [ XAxisQuestionFourAverageValues, SetXAxisQuestionFourAverageValues ] = useState([]);
	const [ XAxisQuestionTwoAverageValues, SetXAxisQuestionTwoAverageValues ] = useState([]);
	useEffect(() => {
		Axios.get('/questions')
			.then(res => {
				console.log(res.status, 'STATUS');
				if (res.status !== 200) {
					SetApiError(true);
				} else {
					SetApiError(false);
					SetQuestionTwoChoices(res.data.en.find(item => item.id === 2));
					SetQuestionFourChoices(res.data.en.find(item => item.id === 4));
				}
			})
			.catch(function (error){
				SetApiError(true);
			});
	}, []);
	useEffect(
		() => {
			if (QuestionTwoChoices) {
				QuestionTwoChoices.choices.map(item => {
					switch (item.text) {
						case 'Good':
							SetQuestTwoGood(item.id);
							break;
						case 'Neutral':
							SetQuestTwoNeutral(item.id);
							break;
						case 'Bad':
							SetQuestTwoBad(item.id);
							break;
						default:
							break;
					}
				});
			}
		},
		[ QuestionTwoChoices ]
	);
	useEffect(
		() => {
			if (QuestionFourChoices) {
				QuestionFourChoices.choices.map(item => {
					switch (item.text) {
						case 'Good':
							SetQuestFourGood(item.id);
							break;
						case 'Neutral':
							SetQuestFourNeutral(item.id);
							break;
						case 'Bad':
							SetQuestFourBad(item.id);
							break;
						default:
							break;
					}
				});
			}
		},
		[ QuestionFourChoices ]
	);
	const ChangeReviewPeriod = (Source, Value) => {
		let from = '';
		let to = '';
		if (Source === 'From') {
			from = Value;
			to = `${ToDate.getFullYear()}-${ToDate.getMonth() + 1}-${ToDate.getDate()}`;
		} else {
			to = Value;
			from = `${FromDate.getFullYear()}-${FromDate.getMonth() + 1}-${FromDate.getDate()}`;
		}
		if (!ApiError) {
			Axios.get(`/branches/1/reviews?date_from=${from}&date_to=${to}`)
				.then(res => {
					if (res.status !== 200) {
						SetApiErrorSecRequest(true);
					} else {
						SetApiErrorSecRequest(false);
						if (res.data.total_count === 0) {
							SetNoReviews(true);
							SetXAxisQuestionFourIDArray([]);
							SetXAxisQuestionTwoIDArray([]);
						} else {
							SetNoReviews(false);
							SetQuestionFourChoicesArray(
								res.data.results.map((result, key) => result.answers.find(item => item.question === 4))
							);
							SetQuestionTwoChoicesArray(
								res.data.results.map((result, key) => result.answers.find(item => item.question === 2))
							);
						}
					}
				})
				.catch(function (error){
					SetApiErrorSecRequest(true);
				});
		}
	};
	useEffect(
		() => {
			let MaxHorizontalPointsCounter = window.innerWidth >= 992 ? 10 : window.innerWidth >= 768 ? 6 : 4;
			if (QuestionFourChoicesArray) {
				while ((QuestionFourChoicesArray.length / MaxHorizontalPointsCounter) % 1 !== 0) {
					MaxHorizontalPointsCounter--;
				}
				SetMaxHorizontalPoints(MaxHorizontalPointsCounter);
			}
		},
		[ QuestionFourChoicesArray ]
	);
	useEffect(
		() => {
			if (MaxHorizontalPoints && QuestionFourChoicesArray && QuestionTwoChoicesArray) {
				SetXAxisQuestionFourIDArray([]);
				SetXAxisQuestionTwoIDArray([]);
				for (
					let i = 0;
					i < QuestionFourChoicesArray.length;
					i += QuestionFourChoicesArray.length / MaxHorizontalPoints
				) {
					let QuestionFourAddedPortion = QuestionFourChoicesArray.slice(
						i,
						i + QuestionFourChoicesArray.length / MaxHorizontalPoints
					);
					SetXAxisQuestionFourIDArray(prevArr => [ ...prevArr, QuestionFourAddedPortion ]);
					let QuestionTwoAddedPortion = QuestionTwoChoicesArray.slice(
						i,
						i + QuestionFourChoicesArray.length / MaxHorizontalPoints
					);
					SetXAxisQuestionTwoIDArray(prevArr => [ ...prevArr, QuestionTwoAddedPortion ]);
				}
			}
		},
		[ MaxHorizontalPoints, QuestionFourChoicesArray, QuestionTwoChoicesArray ]
	);
	useEffect(
		() => {
			if (XAxisQuestionTwoIDArray && XAxisQuestionFourIDArray) {
				SetXAxisQuestionTwoAverageValues([]);
				SetXAxisQuestionFourAverageValues([]);
				for (let i = 0; i < XAxisQuestionTwoIDArray.length; i++) {
					let Submission = 0;

					for (let j = 0; j < XAxisQuestionTwoIDArray[i].length; j++) {
						if (XAxisQuestionTwoIDArray[i][j].choice === QuestTwoGood) {
							Submission += 1;
						} else if (XAxisQuestionTwoIDArray[i][j].choice === QuestTwoBad) {
							Submission -= 1;
						}
					}
					SetXAxisQuestionTwoAverageValues(PrevArr => [ ...PrevArr, Submission ]);
				}
				for (let i = 0; i < XAxisQuestionFourIDArray.length; i++) {
					let Submission = 0;
					for (let j = 0; j < XAxisQuestionFourIDArray[i].length; j++) {
						if (XAxisQuestionFourIDArray[i][j].choice === QuestFourGood) {
							Submission += 1;
						} else if (XAxisQuestionFourIDArray[i][j].choice === QuestFourBad) {
							Submission -= 1;
						}
					}
					SetXAxisQuestionFourAverageValues(PrevArr => [ ...PrevArr, Submission ]);
				}
			}
		},
		[ XAxisQuestionTwoIDArray, XAxisQuestionFourIDArray ]
	);

	var today = new Date();

	return (
		<div className="TopContainer">
			<section className="MainContainer">
				<h3>From</h3>
				<InfiniteCalendar
					width={300}
					height={300}
					selected={FromDate}
					onSelect={function (date){
						SetFromDate(date);
						ChangeReviewPeriod('From', `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`);
					}}
					maxDate={ToDate}
					max={today}
				/>
			</section>

			<section className="MainContainer">
				<h3>To</h3>
				<InfiniteCalendar
					width={300}
					height={300}
					selected={ToDate}
					minDate={FromDate}
					onSelect={function (date){
						SetToDate(date);
						ChangeReviewPeriod('To', `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`);
					}}
					maxDate={today}
					max={today}
				/>
			</section>
			<Graph
				ApiError={ApiError}
				ApiErrorSecRequest={ApiErrorSecRequest}
				NoReviews={NoReviews}
				XAxisQuestionTwoAverageValues={XAxisQuestionTwoAverageValues}
				XAxisQuestionFourAverageValues={XAxisQuestionFourAverageValues}
			/>
		</div>
	);
}

export default App;
